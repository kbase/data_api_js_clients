/**
 * @module GenomeAnnotation
 * @author Dan Gunter, Erik Pearson
 * @version 0.1.0
 * @param {ThriftLibrary} Thrift
 * @param {BluebirdPromise} Promise
 * @returns {GenomeAnnotation_L12.factory}
 */
/*global define*/
/*jslint white: true, browser: true*/
define([
    'bluebird',
    'genome_annotation_service',
    'thrift',
    'kb_data_shared',

    // These don't have representations. Loading them causes the Thrift module
    // to be enhanced with additional properties (typically just a single
    //  property, the new capability added.)
    'thrift_transport_xhr',
    'thrift_protocol_binary'
], function (Promise, genome_annotation, Thrift, KbShared) {
    'use strict';

    /**
     * Represents an interface to the GenomeAnnotation data service.
     * @alias module:GenomeAnnotation
     * @constructs GenomeAnnotation
     * @param {object} config
     * @param {ObjectReference} config.ref The object reference for the object to be accessed.
     * @param {string} config.url The url for the GenomeAnnotation Service endpoint.
     * @param {string} config.token The KBase authorization token to be used to access the service.
     * @returns {GenomeAnnotation} A GenomeAnnotation api object
     */
    var GenomeAnnotation = function (config) {
        KbShared.validate_config(config);
    
        var objectReference = config.ref,
            dataAPIUrl = config.url,
            authToken = config.token,
            timeout = config.timeout;

        if (!timeout) {
            timeout = 30000;
        }

        function client() {
            return KbShared.connect(Thrift, genome_annotation, dataAPIUrl, timeout);
        }

        // Mapping for public methods

        var exports = {};

        // Zero-argument methods

        var flist = ['taxon', 'assembly', 'feature_types', 'proteins'];

        flist.forEach(function(name) { 
            // Set exported function to a function curried for 'name'
            // that calls a function of the same name on the client
            // with no arguments, and returns a Promise.
            var fname = 'get_' + name;
            exports[fname] = function() {
                return Promise.resolve(client()[fname](authToken,
                    objectReference, true)) ;
            } 
        });

        // Methods taking a list of string identifiers as its only argument

        flist = [
            'feature_type_descriptions', 'feature_type_counts',
            'features', 'feature_locations', 'feature_publications', 'feature_dna',
            'feature_functions', 'feature_aliases', 'cds_by_gene', 'cds_by_mrna',
            'gene_by_cds', 'gene_by_mrna', 'mrna_by_cds', 'mrna_by_gene',
            'mrna_exons', 'mrna_utrs'];

        flist.forEach(function(name) {
            // Set exported function to a function curried for 'name'
            // that calls a function of the same name on the client
            // with one argument (a list of identifiers), and returns a Promise.
            var fname = 'get_' + name;
            exports[fname] = function(items) {
                if (items === undefined || items === null) {
                    throw {
                        type: 'ArgumentError',
                        name: 'Empty' + (name.search('_type_') > 0 ? 'Type': 'Identifier') + 'List',
                        message: 'Input list for ' + fname + ' cannot be undefined or null',
                        suggestion: 'You must have at least one item in the list.'
                    }
                }
                if (items.length === 0) {
                    throw {
                        type: 'ArgumentError',
                        name: 'Empty' + (name.search('_type_') > 0 ? 'Type': 'Identifier') + 'List',
                        message: 'Input list for ' + fname + ' cannot be empty',
                        suggestion: 'You must have at least one item in the list.'
                    }
                }
                return Promise.resolve(client()[fname](authToken,
                    objectReference, items, true));
            }
        });

        // 'feature_ids' takes 2 extra arguments, a list of filters and a group type

        var fname = 'get_feature_ids';
        exports[fname] = function(filters, group_type) {
            return Promise.resolve(client()[fname](authToken,
                objectReference, filters, group_type, true))            
        };

        // Return public methods

        return Object.freeze(exports)

    };

    return GenomeAnnotation;
});
