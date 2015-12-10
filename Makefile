# Run top-level tasks (build, test) the old-fashioned way
# This is for easing development, and documentation,
# and not an official supported build step.

default: targets

targets: FORCE
	@printf "............................\n"
	@printf "JavaScript Data API Makefile\n"
	@printf "............................\n"
	@printf "NOTE: This Makefile is a developer convenience, mainly for running local tests.\n"
	@printf "JavaScript build and packaging do NOT depend on it. They use Bower and\n"
	@printf "Node Package Manager (npm), as described in the README. Also, TravisCI tests\n"
	@printf "use .travis.yml and do not depend on this file.\n"
	@printf "\n"
	@printf "Primary target:\n"
	@printf "  test          Build and run tests\n"
	@printf "Sub-targets:\n"
	@printf "  build         Run the 'grunt build' command after setting PATH\n"
	@printf "  rebuild       Run 'grunt build' just for the Thrift libs\n"
	@printf "  retest        Update Thrift libs and run tests, without a full build\n"
	@printf "  runtest       Run tests without rebuilding anything. This is much faster.\n"
	@printf "  shutdown      Kill all running services\n"

clone:
	test -d core-develop || git clone -b develop https://github.com/kbase/data_api.git core-develop

build: clone
	PATH=./node_modules/.bin:$${PATH} grunt build

rebuild:
	PATH=./node_modules/.bin:$${PATH} grunt build-thrift-libs

test: build runtest

retest: rebuild runtest

runtest: init karma shutdown report

runtestc: init karmac shutdown

karma: FORCE
	@printf "+- Run tests with Karma, output in karma.out\n"
	PATH=./node_modules/.bin:$${PATH} karma start test/karma.conf.js >karma.out 2>&1

karmac: FORCE
	@printf "+- Run tests with Karma, output to console\n"
	PATH=./node_modules/.bin:$${PATH} karma start test/karma.conf.js

init: FORCE
	@printf "+- Init: Run proxy\n"
	CORSPROXY_PORT=8000 ./node_modules/corsproxy/bin/corsproxy > corsproxy.out 2>&1 &
	@printf "+- Init: Start services\n"
	for s in taxon assembly genome_annotation ; do \
		printf "  +-- Start $$s service\n"; \
		( data_api_start_service.py --config data_api-test.cfg --kbase_url localhost --service $$s > $$s.out 2>&1 & ) ;\
	done

shutdown: FORCE
	@printf "+- Shutdown\n"
	ps auxw | grep "[d]ata_api_start_service" | cut -c17-23 | xargs kill
	ps auxw | grep "[c]orsproxy" | cut -c17-23 | xargs kill
	@ sleep 2

report:
	@printf "%s\n" '---'
	@printf "status: "
	@test `grep -Ec 'TOTAL: \d+ FAILED' karma.out` -eq 0 && printf "SUCCESS\n" || printf "FAILED\n"
	@printf "logs:\n"
	@printf "    testing: karma.out\n"
	@printf "    service: taxon_service.out\n"
	@printf "    proxy: corsproxy.out\n"

FORCE:
