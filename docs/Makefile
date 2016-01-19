#
# Build JavaScript documentation from Thrift specs,
# using restructured text as the output.
#
# Author: Dan Gunter <dkgunter@lbl.gov>

DOCS_DIR=`pwd`
ROOT_DIR=..
TOOLS_DIR=${ROOT_DIR}/tools
BUILD=${TOOLS_DIR}/build_rst_docs
THRIFT=thrift
CORE_DIR=${ROOT_DIR}/core-develop
SPEC_DIR=${CORE_DIR}/thrift/specs
COREDOC_DIR=${CORE_DIR}/docs

RST_FILES := taxon.rst assembly.rst genome_annotation.rst

default: build

build: copy $(RST_FILES) push

copy:
	cp ${SPEC_DIR}/taxonomy/taxon/taxon.thrift .
	cp ${SPEC_DIR}/sequence/assembly/assembly.thrift .
	cp ${SPEC_DIR}/annotation/genome_annotation/genome_annotation.thrift .

push:
	@mkdir -p ${COREDOC_DIR}/js
	@for f in ${RST_FILES}; do \
		 cp $$f ${COREDOC_DIR}/js; \
		 printf "cp $$f ${COREDOC_DIR}/js/$$f\n"; \
	done
	cp index.rst ${COREDOC_DIR}/javascript.rst

%.json : %.thrift
	thrift -gen json -out . $<

%.rst : %.json
	${BUILD} $< $@
