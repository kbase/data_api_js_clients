// Run tests
define([
    'kb_data_taxon' // Taxon API
    ],
    function (Taxon, Session, config) {

    'use strict';

    var base_url = 'http://localhost:8000/localhost'
    var service_suffix = {
        object: ':9100',
        taxon: ':9101'}

    // Expected values for Taxon
    var taxon_ref = '993/674615/1'
    var taxon_data = {'GenBank_hidden_flag': 1,
                         'aliases': ['Melampsora laricis-populina 98AG31'],
                         'division_id': 4,
                         'domain': 'Eukaryota',
                         'genetic_code': 1,
                         'inherited_GC_flag': 1,
                         'inherited_MGC_flag': 1,
                         'inherited_div_flag': 1,
                         'kingdom': 'Fungi',
                         'mitochondrial_genetic_code': 4,
                         'parent_taxon_ref': '993/637363/2',
                         'rank': 'no rank',
                         'scientific_lineage': 'cellular organisms; Eukaryota; Opisthokonta; Fungi; Dikarya; Basidiomycota; Pucciniomycotina; Pucciniomycetes; Pucciniales; Melampsoraceae; Melampsora; Melampsora larici-populina',
                         'scientific_name': 'Melampsora larici-populina 98AG31',
                         'taxonomy_id': 747676
    }
    var taxon_lineage = taxon_data.scientific_lineage.split(';')
        .map(function (x) { return x.trim(' ') })

    // Taxon API tests
    describe('Taxon API', function () {
        var url = base_url + service_suffix.taxon
        console.log('Contacting Taxon API at: "' + url + '"')

        // Standard constructor
        var taxon = Taxon({ ref: taxon_ref, url: url, token: '', timeout:6000})
        
        // Note: These are in the same order as methods in Taxon.js

        it('get_parent', function(done) {
            taxon.get_parent()
                .then(function(value) {
                    expect(value).toBe(taxon_data.parent_taxon_ref)
                    done(); return null
                }) 
                .catch(function(err) {
                    console.error(err)
                    done.fail('Error fetching parent taxon ref')
                    return null
                })
        }, 10000)

        it('get_children, with no children', function(done) {
            taxon.get_children()
                .then(function(value) {
                    expect(value).toEqual([])
                    done(); return null
                }) 
                .catch(function(err) {
                    console.error(err)
                    done.fail('Error fetching children taxon refs')
                    return null
                })
        }, 10000)

        it('get_genome_annotations, with none found', function(done) {
            taxon.get_genome_annotations()
                .then(function(value) {
                    expect(value).toEqual([])
                    done(); return null
                }) 
                .catch(function(err) {
                    console.error(err)
                    done.fail('Error fetching children taxon refs')
                    return null
                })
        }, 10000)

        it('get_scientific_lineage', function (done) {
            taxon.get_scientific_lineage()
                .then(function(lineage) {
                    //console.log('Got lineage: ' + lineage)
                    for (var i=0; i < taxon_lineage.length; i++) {
                        expect(lineage[i]).toBe(taxon_lineage[i])
                    }
                    done()
                    return null // not returning promise
                })
                .catch(function (err) {
                    console.error(err)
                    done.fail('Error fetching scientific lineage')
                    return null // not returning promise
                })
        }, 10000)
        
        it('get_scientific_name', function (done) {
            taxon.get_scientific_name()
                .then(function(name) {
                    expect(name).toBe(taxon_data.scientific_name)
                    done()
                    return null // not returning promise
                 })
                .catch(function (err) {
                    console.error(err)
                    done.fail('Error fetching scientific name')
                    return null // not returning promise
                })
         }, 10000)

        it('get_taxonomic_id', function (done) {
            taxon.get_taxonomic_id()
                .then(function(name) {
                    expect(name).toBe(taxon_data.taxonomy_id)
                    done()
                    return null // not returning promise
                 })
                .catch(function (err) {
                    console.error(err)
                    done.fail('Error fetching taxonomic ID')
                    return null // not returning promise
                })
         }, 10000)

        it('get_kingdom', function (done) {
            taxon.get_kingdom()
                .then(function(name) {
                    expect(name).toBe(taxon_data.kingdom)
                    done()
                    return null // not returning promise
                 })
                .catch(function (err) {
                    console.error(err)
                    done.fail('Error fetching kingdom')
                    return null // not returning promise
                })
         }, 10000)

        it('get_domain', function (done) {
            taxon.get_domain()
                .then(function(name) {
                    expect(name).toBe(taxon_data.domain)
                    done()
                    return null // not returning promise
                 })
                .catch(function (err) {
                    console.error(err)
                    done.fail('Error fetching domain')
                    return null // not returning promise
                })
         }, 10000)

        it('get_genetic_code', function (done) {
            taxon.get_genetic_code()
                .then(function(name) {
                    expect(name).toBe(taxon_data.genetic_code)
                    done()
                    return null // not returning promise
                 })
                .catch(function (err) {
                    console.error(err)
                    done.fail('Error fetching genetic code')
                    return null // not returning promise
                })
         }, 10000)

        it('get_aliases', function (done) {
            taxon.get_aliases()
                .then(function(name) {
                    expect(name).toEqual(taxon_data.aliases)
                    done()
                    return null // not returning promise
                 })
                .catch(function (err) {
                    console.error(err)
                    done.fail('Error fetching aliases')
                    return null // not returning promise
                })
         }, 10000)

        // Constructor variants

        it('constructor without config', function (done) {
             var ctor = function() { Taxon() }
             expect(ctor).toThrow()
             done()
             return null
         }, 1000)

        it('constructor with empty config', function (done) {
             var ctor = function() { Taxon({}) }
             expect(ctor).toThrow()
             done()
             return null
         }, 1000)

        it('constructor config missing ref', function (done) {
            var ctor = function() { 
                Taxon({url: url, token: '', timeout:6000}) 
            }
            expect(ctor).toThrow()
            done()
            return null
         }, 1000)

        it('constructor config missing url', function (done) {
            var ctor = function() { 
                Taxon({ref: taxon_ref, token: '', timeout:6000}) 
            }
            expect(ctor).toThrow()
            done()
            return null
         }, 1000)

        it('constructor config null token', function (done) {
            var ctor = function() { 
                Taxon({ref: taxon_ref, url: url, token: null, timeout:6000}) 
            }
            expect(ctor).not.toThrow()
            done()
            return null
         }, 1000)

        it('constructor config bad token', function (done) {
            var ctor = function() { 
                Taxon({ref: taxon_ref, url: url, token: "hello, world", timeout:6000}) 
            }
            expect(ctor).toThrow()
            done()
            return null
         }, 1000)

        it('constructor config no timeout', function (done) {
            var ctor = function() { 
                Taxon({ref: taxon_ref, url: url, token: ''}) 
            }
            expect(ctor).not.toThrow()
            done()
            return null
         }, 1000)

        it('client bad url', function (done) {
            var runner = function() { 
                var c = Taxon({ref: taxon_ref, url: 'http://localhost:99', 
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

