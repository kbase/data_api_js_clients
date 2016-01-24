// Application
define(['jquery', 'underscore', 'bluebird',
        'kb_data_taxon', 'kb_data_assembly','kb_data_genome_annotation'],
    function ($, _, Promise,
              Taxon, Assembly, GenomeAnnotation) {
        
        // This URL assumes a CORS proxy from the npm 'corsproxy' module running like this:
        // $ CORSPROXY_PORT=8000 ./node_modules/corsproxy/bin/corsproxy
        var base_url = 'http://localhost:8000/localhost';
        
        // Ports for the services. Assumes they are started like this:
        // $ for s in taxon assembly genome_annotation ; do \
	    //    data_api_start_service.py --config deployment.cfg --kbase_url ci --service $s; \
        //   done
        var api_url_suffix = {
            taxon: ':9101',
            assembly: ':9102',
            annotation: ':9103'
        };

        //XXX: Hardcoded token
        var auth_token='un=dangunter|tokenid=f3fa9942-9a13-11e5-ad16-22000aef184d|expiry=1480720619|client_id=dangunter|token_type=Bearer|SigningSubject=https://nexus.api.globusonline.org/goauth/keys/ae1e4708-9530-11e5-b10e-22000ab4b42b|sig=b259d86ca0262b5bb25529c946236e45a10c4f6b8db4c49a3dd3443b8ed3458e0e58606437a08cb005e51fbcc2d8fd34e9d2f8981a067ec523abb510e1de4c5157b0bc0bb35fb69fcb5f8b47a1fd77ab7a62162dc99bdaa1a78d7db063b818dfacf76d11e0bec28aa6f35a4f064cdf1a608cd1a64bdb4c9efe962cccc3f5ad68';

        /**
         * List of genomes to measure performance on.
         *
         * @type {*[]}
         */
        var big_genomes = [
            {
                name: 'Hordeum vulgare',
                id: 'kb|g.140105',
                ref: '4258/919/1',
                bases: 4706057868
            },
            {
                name: 'Malus domestica',
                id: 'kb|g.166816',
                ref: '4258/1537/1',
                bases: 881278625
            }
        ];

        /**
         * Timer class
         *
         * @constructor
         */
        var Timer = function() {
            this.t0 = -1;
            this.t1 = -1;
        };
        Timer.prototype.start = function(what) {
            this.t0 = new Date();
            console.debug('START: ', what);
        };
        Timer.prototype.stop = function() {
            this.t1 = new Date();
            console.debug('STOP');
            return (this.t1.getTime() - this.t0.getTime());
        };

        /**
         * Reporter class
         *
         * @param name What is being reported
         * @constructor
         */
        var Reporter = function(name) {
            this.name = name;
            this.executions = [];
        };
        Reporter.prototype.add = function(method, params, dur) {
            var value = {method: method, parameters: params, duration: dur};
            this.executions.push(value);
            console.debug(value);
        };

        /**
         * Entry point.
         */
        function main() {
            console.log("Gentlemen, start your engines!");

            var url = base_url + api_url_suffix.annotation;
            var rpt = new Reporter('Genome Annotation');
            // Loop over methods and genomes.
            // Recursion is used to serialize the genomes and methods,
            // without locking up the browser.
            var run_next_genome = function(genomes) {
                if (genomes.length == 0) { return true; }
                var g = genomes.pop();
                console.debug('Genome:', g);
                var obj = GenomeAnnotation({ref: g.ref, url: url, token: auth_token, timeout: 1000000});
                var run_next_method = function(genomes, methods) {
                    // if done with methods, run next genome
                    if (methods.length == 0) {
                        return run_next_genome(genomes);
                    }
                    // start the timer
                    var t = new Timer();
                    var m = methods.pop();
                    t.start(m + ' ' + g.ref);
                    // Call the method
                    obj[m]().then(function () {
                        // stop the timer
                        var elapsed = t.stop();
                        // report the timing
                        rpt.add(m, g, elapsed);
                        return run_next_method(genomes, methods);
                    });
                };
                return run_next_method(genomes, ['get_feature_ids']);
            };
            run_next_genome(big_genomes);
        }

        main();
    }
);

