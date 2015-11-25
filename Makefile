# Run top-level tasks the old-fashioned way
# This is for easing development, and documentation,
# and not an official supported build step.

default: test

clone:
	test -d core-develop || git clone -b develop https://github.com/kbase/data_api.git core-develop

build: clone
	PATH=./node_modules/.bin:$${PATH} grunt build

test: build runtest

runtest: init karma shutdown report

karma: FORCE
	@printf "+- Run tests\n"
	PATH=./node_modules/.bin:$${PATH} karma start test/karma.conf.js >karma.out 2>&1

init: FORCE
	@printf "+- Init: Run proxy\n"
	CORSPROXY_PORT=8000 ./node_modules/corsproxy/bin/corsproxy > corsproxy.out 2>&1 &
	@printf "+- Init: Start services\n"
	data_api_start_service.py --config data_api-test.cfg --kbase_url test --service taxon > taxon_service.out 2>&1 &

shutdown: FORCE
	@printf "+- Shutdown\n"
	ps auxw | grep "[d]ata_api_start_service" | cut -c17-23 | xargs kill
	ps auxw | grep "[c]orsproxy" | cut -c17-23 | xargs kill

report:
	@printf "%s\n" '---'
	@printf "status: "
	@printf "%s\n" `grep -Ec 'TOTAL: \d+ FAILED' karma.out`
	@printf "logs:\n"
	@printf "    testing: karma.out\n"
	@printf "    service: taxon_service.out\n"
	@printf "    proxy: corsproxy.out\n"

FORCE:
