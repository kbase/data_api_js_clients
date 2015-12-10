// Run tests
define([
    'kb_data_genome_annotation' // Genome_annotation API
    ],
    function (GenomeAnnotation, Session, config) {

    'use strict';

    var sayit = function(){ }

    var base_url = 'http://localhost:8000/localhost'
    var service_suffix = {
        object: ':9100',
        genome_annotation:':9103'}


    // Expected values for GenomeAnnotation
    var test_ref = '1013/92/2'
    var test_data = { }

    // GenomeAnnotation API tests
    describe('GenomeAnnotation API', function () {
        var url = base_url + service_suffix.genome_annotation
        console.log('Contacting GenomeAnnotation API at: "' + url + '"')

        // Standard constructor
        var api_obj = GenomeAnnotation({ ref: test_ref, url: url, token: '', timeout:6000})

        // Utility methods
        // ===============

        // Check a numeric value up to 6 digits of precision

        function _check_scalar(v1, v2) {
            if (typeof(v1) == 'number') {
                expect(v1).toBeCloseTo(v2, 6)
            }
            else if (Array.isArray(v1)) {
                // sort arrays (in-place) before comparing them
                v1.sort(); v2.sort()
                expect(v1).toEqual(v2)
            }
            else {
                expect(v1).toEqual(v2)
            }            
        }

        // Check a result

        function _check(name, test_value, result) {
            //console.info("checking GenomeAnnotation method: " + name)
            it(name, function(done) {
                result
                    .then(function(value) {
                        if (Array.isArray(test_value)) {
                            // sort arrays (in-place) before comparing them
                            test_value.sort(); value.sort()
                            expect(test_value).toEqual(value)
                        }
                        else if (typeof(test_value) == 'object') {
                            Object.keys(test_value).map(function(k) {
                                _check_scalar(test_value[k], value[k])
                            })
                        }
                        else {
                            //console.info('simple scalar check. v1=', test_value, 'v2=', value)
                            _check_scalar(test_value, value)
                        }
                        done(); return null
                    }) 
                    .catch(function(err) {
                        console.error(err)
                        done.fail('Error in ' + name)
                        return null
                    })
            }, 10000)
        }

        // Tests
        // =====

        // Run the checks for all zero-argument methods.
        // Each element in the array is a pair of names:
        //   [function-name, test_data-property-name]

        // []
        //     .map(function(kvp) { 
        //         var meth = kvp[0], attr = kvp[1]
        //         var test_value = test_data[attr]
        //         console.info('Test ' + meth)
        //         _check(meth, test_value, api_obj[meth]()) 
        //     })

        // Run the checks for methods taking 1 argument
        // (1) Empty list
        // get_contig_lengths
        // it('get_contig_lengths for []', function(done) {
        //     function x() { api_obj.get_contig_lengths([]) }
        //     expect(x).toThrow()
        //     done(); return null
        // }, 10000)
        // get_contig_gc_content
        // Check constructor variants

        // Check constructor variants

        sayit = function(m) {
            console.info('Test GenomeAnnotation API constructor ' + m)
        }

        sayit('without config')
        it('constructor without config', function (done) {
             var ctor = function() { GenomeAnnotation() }
             expect(ctor).toThrow()
             done()
             return null
         }, 1000)

        sayit('with empty config')
        it('constructor with empty config', function (done) {
             var ctor = function() { GenomeAnnotation({}) }
             expect(ctor).toThrow()
             done()
             return null
         }, 1000)

        sayit('with config missing ref')
        it('constructor config missing ref', function (done) {
            var ctor = function() { 
                GenomeAnnotation({url: url, token: '', timeout:6000}) 
            }
            expect(ctor).toThrow()
            done()
            return null
         }, 1000)

        sayit('config missing url')
        it('constructor config missing url', function (done) {
            var ctor = function() { 
                GenomeAnnotation({ref: test_ref, token: '', timeout:6000}) 
            }
            expect(ctor).toThrow()
            done()
            return null
         }, 1000)

        sayit('config null token')
        it('constructor config null token', function (done) {
            var ctor = function() { 
                GenomeAnnotation({ref: test_ref, url: url, token: null, timeout:6000}) 
            }
            expect(ctor).not.toThrow()
            done()
            return null
         }, 1000)

        sayit('config bad token')
        it('constructor config bad token', function (done) {
            var ctor = function() { 
                GenomeAnnotation({ref: test_ref, url: url, token: "hello, world", timeout:6000}) 
            }
            expect(ctor).toThrow()
            done()
            return null
         }, 1000)

        sayit('no timeout')
        it('constructor config no timeout', function (done) {
            var ctor = function() { 
                GenomeAnnotation({ref: test_ref, url: url, token: ''}) 
            }
            expect(ctor).not.toThrow()
            done()
            return null
         }, 1000)

        sayit('bad url')
        it('client bad url', function (done) {
            var runner = function() { 
                var c = GenomeAnnotation({ref: test_ref, url: 'http://localhost:99', 
                       token: ''}) 
                    .client()
                console.info("Bad URL Client: ", c)
            }
            expect(runner).toThrow()
            done()
            return null
         }, 1000)

    })
})

