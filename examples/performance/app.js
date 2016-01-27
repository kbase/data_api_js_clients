// Application
define(['jquery', 'underscore', 'bluebird', 'bootstrap',
        'kb_data_taxon', 'kb_data_assembly','kb_data_genome_annotation'],
    function ($, _, Promise, Bootstrap,
              Taxon, Assembly, GenomeAnnotation) {

        var log = console; // quiet subsequent WebStorm warnings about 'console' and AMD

        var base_urls = {
            // This URL assumes a CORS proxy from the npm 'corsproxy' module running like this:
            // $ CORSPROXY_PORT=8000 ./node_modules/corsproxy/bin/corsproxy
            'localhost': 'http://localhost:8000/localhost',

            'ci': 'https://ci.kbase.us/services/data/',
            'next': 'https://next.kbase.us/services/data/'
        };
        var base_url = 'http://localhost:8000/localhost';
        
        // Ports for the services. Assumes they are started like this:
        // $ for s in taxon assembly genome_annotation ; do \
	    //    data_api_start_service.py --config deployment.cfg --kbase_url ci --service $s; \
        //   done
        var local_api_url_suffix = {
            taxon: ':9101',
            assembly: ':9102',
            annotation: ':9103'
        };
        // CI and Next services
        var remote_api_url_suffix = {
            taxon: 'taxon',
            assembly: 'assembly',
            annotation: 'annotation'
        };

        /**
         * List of genomes on which to measure performance/
         *
         * Note that these will be run in reverse order.
         *
         * @type {*[]}
         */
        var genomes = {
            big: [
                {
                  name: 'New: Desulfovibrio alaskensis DSM 1610901',
                    id: 'kb|g.207109',
                    ref: '1837/215/3',
                    bases: 3550684
                }
                //{
                //    name: 'Hordeum vulgare',
                //    id: 'kb|g.140105',
                //    ref: '4258/919/1',
                //    bases: 4706057868
                //}
                //{
                //    name: 'Malus domestica',
                //    id: 'kb|g.166816',
                //    ref: '4258/1537/1',
                //    bases: 881278625
                //}
            ],
            small: [{
                    name: 'Old: Acetobacter aceti',
                    id: 'kb|g.26675',
                    ref: '4258/21328/1',
                    bases: 5123
                }
            ]
        };

        /**
         * Methods to run.
         * TODO: UI will change selected_methods.
         *
         * @type {*[]}
         */
        var all_methods = [
            ['get_feature_ids', []],
            ['get_features', 1000],
            ['get_features', 10000],
            ['get_mrna_by_cds', true],
            ['get_mrna_utrs', 1000]
        ];
        all_methods.reverse();
        var selected_methods = all_methods;

        /**
         * Once all the feature IDs for a given genome are
         * retrieved, store the list here, with the key
         * being the genome's numeric reference x/y/z (as a string).
         *
         * @type {{}}
         */
        var all_feature_ids = {};

        /**
         * Once all mRNA IDs for a given genome are
         * retrieved, store the list here, with the key
         * being the genome's numeric reference x/y/z (as a string).
         *
         * @type {{}}
         */
        var all_mrna_ids = {};

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
            log.debug('START: ', what);
        };
        Timer.prototype.stop = function() {
            this.t1 = new Date();
            log.debug('STOP');
            return (this.t1.getTime() - this.t0.getTime());
        };

        /**
         * Reporter class
         *
         * @param element What is being reported
         * @constructor
         */
        var Reporter = function(element) {
            this.elt = $(element);
            this.perf_result_id = 'perf-result';
            this.executions = [];
            this.elt.append($('<table>').attr('id', this.perf_result_id)
                .addClass('table')
                .append($('<tr>')
                    .append($('<th>').text('Method'))
                    .append($('<th>').text('Parameters'))
                    .append($('<th>').text('Time (s)'))));
        };
        Reporter.prototype.start_genome = function(genome) {
            var desc = genome.name + ' (' + genome.id + ':' + genome.ref;
            desc = desc + '),  ' + genome.bases + ' bases';
            var elt = $('#' + this.perf_result_id);
            elt
                .append($('<tr>')
                    .addClass('info')
                .append($('<td colspan="3">')
                    .text(desc)));
            elt
                .append($('<tr>')
                    .addClass('warning')
                    .append($('<td colspan="3">')
                        .text('Working...')));
        };
        Reporter.prototype.working = function(method, params) {
            $('#' + this.perf_result_id + ' tr:last-child').replaceWith(
                $('<tr>')
                    .addClass('warning')
                    .append($('<td colspan="3">')
                        .text('Calling ' + method +
                            '(' + this.param_string(params) + ')...')));
        };
        Reporter.prototype.done = function(method, params, dur) {
            var value = {method: method, parameters: params, duration: dur};
            this.executions.push(value);
            log.debug(value);
            var table_id = '#' + this.perf_result_id;
            $(table_id + ' tr:last-child').replaceWith(
                $('<tr>')
                    .append($('<td>').text(method))
                    .append($('<td>').text(this.param_string(params)))
                    .append($('<td>').text('' + (dur / 1000.0))));
            // Start new row
            $(table_id).append($('<tr>'));
        };
        Reporter.prototype.param_string = function(params) {
            var p = '';
            if (params !== undefined) {
                try {
                    p = params.join(',');
                }
                catch (e) {
                    p = '' + params;
                    //log.warn("Couldn't join parameters:", params);
                }
                if (p.length > 80) {
                    p = p.slice(0, 77) + '...';
                }
            }
            return p;
        };

        /**
         * Entry point.
         */
        function main(auth_token) {
            log.info("Gentlemen, start your engines!");

            var url;
            var base_url = base_urls[location];
            var is_local = (location == 'localhost');

            // Run Genome Annotation perf. tests
            if (is_local) {
                url = base_url + local_api_url_suffix.annotation;
            }
            else {
                url = base_url + remote_api_url_suffix.annotation;
            }
            log.debug('Genome Annotation service URL: ' + url);
            var options = {url: url, token: auth_token, timeout: 1000000};
            var genome_list = genomes[object_size];
            run_next_genome(genome_list, options);
        }

        /**
         * Loop over a list of methods for the current
         * genome. If we are done, invoke callback.
         *
         * @param obj GenomeAnnotation object
         * @param methods List of method names
         * @param g Genome
         * @param cb Callback when no more methods
         */
        function run_next_method(obj, methods, g, cb) {
            // For debugging:cb(); return;
            // If done with methods, run next genome
            if (methods.length == 0) {
                cb();
                return;
            }
            // Start the timer
            var t = new Timer();
            var meth_args = methods.pop();
            log.debug('Method + args = ', meth_args);
            var m = meth_args[0], args = meth_args[1];
            t.start(m + ' ' + g.ref);
            // Call the method
            reporter.working(m, args);
            var params = args; // un-transformed args
            var skip = false;
            // For get_features(), replace a numeric argument with
            // that number of feature IDs (retrieved previously).
            if (m == 'get_features' && typeof(args) == 'number') {
                // interpret negative values as 'last N'
                args = (args > 0) ?
                    [_.first(all_feature_ids[g.ref], args)]:
                    [_.last(all_feature_ids[g.ref], -args)];
                params = [args];
            }
            else if (m == 'get_mrna_by_cds') {
                params = args = [all_feature_ids[g.ref]];
                if (params[0].length == 0) {
                    console.info('get_mrna_by_cds: No IDs to fetch');
                    all_mrna_ids[g.ref] = [];
                    skip = true;
                }
            }
            else if (m == 'get_mrna_utrs' && typeof(args) == 'number') {
                params = args = [_.first(all_mrna_ids[g.ref], args)];
                if (params.length[0] == 0) {
                    console.info('get_mrna_utrs: No mRNA ids to fetch');
                    skip = true;
                }
            }
            if (skip) {
                // Stop the timer
                var elapsed = t.stop();
                // Report the timing
                reporter.done(m, ['SKIPPED'], elapsed);
                run_next_method(obj, methods, g, cb);
                return null;
            }
            else {
                log.debug('Calling ' + m + ' with ' + args.length + ' arguments');
                obj[m].apply(null, args).then(function (value) {
                    // If result is all feature IDs, extract 'id' for later.
                    if (m == 'get_feature_ids' && args.length == 0) {
                        all_feature_ids[g.ref] = value['by_type']['CDS'];
                        log.debug('Storing ' + all_feature_ids[g.ref].length +
                            ' features in all_feature_ids[' + g.ref + ']');
                    }
                    else if (m == 'get_mrna_by_cds') {
                        all_mrna_ids[g.ref] = _.values(value);
                        console.debug('save ' + all_mrna_ids[g.ref].length + ' mRNA ids for genome ' + g.ref);
                    }
                    // Stop the timer
                    var elapsed = t.stop();
                    // Report the timing
                    reporter.done(m, params, elapsed);
                    run_next_method(obj, methods, g, cb);
                    return null;
                });
            }
        }

        /**
         * Loop over methods and genomes.
         * Tail-recursion is used to serialize loops through genomes
         * and methods, without locking up the browser.
         */
        function run_next_genome(gnm, options) {
            if (gnm.length == 0) { return null; }
            var g = gnm.pop();
            log.debug('Genome:', g);
            reporter.start_genome(g);
            options['ref'] = g.ref;
            var obj = GenomeAnnotation(options);
            run_next_method(obj, selected_methods, g, function() {
                return run_next_genome(gnm, options);
            });
        }

        // Global reporter
        var reporter = new Reporter('#results');

        // Handlers for settings
        var location, object_size;
        var $loc = $('#service-location');
        _.each(['ci', 'next', 'localhost'], function(loc) {
            $loc.append($('<button>').addClass('btn').addClass('btn-default')
                .attr({'id': 'svc-' + loc})
                .text(loc));
            $('#svc-' + loc).click(function (e) {
                log.info('Setting location to: ' + loc);
                location = loc;
                $('#service-location button').removeClass('btn-success');
                $(this).addClass('btn-success');
            });
        });
        $('#svc-localhost').click();

        var $osz = $('#object-size');
        _.each(_.keys(genomes), function(sz) {
            $osz.append($('<button>').addClass('btn').addClass('btn-default')
                .attr({'id': 'osz-' + sz})
                .text(sz));
            $('#osz-' + sz).click(function (e) {
                log.info('Setting object size to: ' + sz);
                object_size = sz;
                $('#object-size button').removeClass('btn-success');
                $(this).addClass('btn-success');
            });
        });
        $('#osz-small').click();

        // kinda sucks that I need to hardcode this
        var auth_token = 'un=dangunter|tokenid=f3fa9942-9a13-11e5-ad16-22000aef184d|expiry=1480720619|client_id=dangunter|token_type=Bearer|SigningSubject=https://nexus.api.globusonline.org/goauth/keys/ae1e4708-9530-11e5-b10e-22000ab4b42b|sig=b259d86ca0262b5bb25529c946236e45a10c4f6b8db4c49a3dd3443b8ed3458e0e58606437a08cb005e51fbcc2d8fd34e9d2f8981a067ec523abb510e1de4c5157b0bc0bb35fb69fcb5f8b47a1fd77ab7a62162dc99bdaa1a78d7db063b818dfacf76d11e0bec28aa6f35a4f064cdf1a608cd1a64bdb4c9efe962cccc3f5ad68';

        // TODO: Make this more modern requirejs-compliant (?)
        window.startApplication =  function() { main(auth_token); }
    }
);

