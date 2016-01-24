requirejs.config({
    baseUrl: '..',

    paths: {
        jquery: 'bower_components/jquery/jquery',
        underscore: 'bower_components/underscore/underscore',
        bluebird: 'bower_components/bluebird/bluebird',
        bootstrap: 'bower_components/bootstrap/js/bootstrap',
        bootstrap_css: 'bower_components/bootstrap/css/bootstrap',
        'font-awesome': 'bower_components/font-awesome/css/font-awesome',
        thrift: 'bower_components/thrift-binary-protocol/js/lib/thrift-core',
        thrift_transport_xhr: 'bower_components/thrift-binary-protocol/js/lib/thrift-transport-xhr',
        thrift_protocol_binary: 'bower_components/thrift-binary-protocol/js/lib/thrift-protocol-binary',
        text: 'bower_components/requirejs-text/text',
        yaml: 'bower_components/require-yaml/yaml',
        'js-yaml': 'bower_components/js-yaml/js-yaml',
        css: 'bower_components/require-css/css',
        // NB the taxon thrift libraries are generated, wrapped, and installed
        // by grunt tasks.
        taxon_types: 'js/thrift/taxon/taxon_types',
        taxon_service: 'js/thrift/taxon/thrift_service',
        assembly_types: 'js/thrift/assembly/assembly_types',
        assembly_service: 'js/thrift/assembly/thrift_service',
        genome_annotation_types: 'js/thrift/genome_annotation/genome_annotation_types',
        genome_annotation_service: 'js/thrift/genome_annotation/thrift_service',
        // Data APIs
        kb_data_taxon: 'js/Taxon',
        kb_data_assembly: 'js/Assembly',
        kb_data_genome_annotation: 'js/GenomeAnnotation',
        kb_data_shared: 'js/KbShared',
        // KBase common
        kb_common_html: 'bower_components/kbase-common-js/html',
        kb_common_cookie: 'bower_components/kbase-common-js/cookie',
        kb_common_logger: 'bower_components/kbase-common-js/logger',
        kb_common_session: 'bower_components/kbase-common-js/session'
        // App
        //kb_app: 'performance/app'
    },

    shim: {
        'underscore': {
            exports: '_'
        }
    },
    map: {
        '*': {
            'css': 'css',
            'promise': 'bluebird'
        }
    },

    // ask Require.js to load these files
    deps: ['app.js']
});
