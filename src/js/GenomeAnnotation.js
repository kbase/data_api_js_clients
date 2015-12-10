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

    // These don't have representations. Loading them causes the Thrift module
    // to be enhanced with additional properties (typically just a single
    //  property, the new capability added.)
    'thrift_transport_xhr',
    'thrift_protocol_binary'
], function (Promise, genome_annotation, Thrift) {
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
        var objectReference,
            dataAPIUrl,
            authToken,
            timeout;

        // XXX: This code is duplicated for each Data API, violating DRY.
        // XXX: It should be refactored into a separate function used by each.

        // Construction argument contract enforcement, throw useful exceptions
        if (!config) {
            throw {
                type: 'ArgumentError',
                name: 'ConfigurationObjectMissing',
                message: 'Configuration object missing',
                suggestion: 'This is an API usage error; the GenomeAnnotation factory object is required to have a single configuration object as an argument.'
            }
        }
        objectReference = config.ref;
        if (!objectReference) {
            throw {
                type: 'ArgumentError',
                name: 'ObjectReferenceMissing',
                message: 'Object reference "ref" missing',
                suggestion: 'The object reference is provided as in the "ref" argument to the config property'
            }
        }
        dataAPIUrl = config.url;
        if (!dataAPIUrl) {
            throw {
                type: 'ArgumentError',
                name: 'UrlMissing',
                message: 'Cannot find a url for the data api',
                suggestion: 'The url is provided as in the "url" argument property'
            }
        }
        authToken = config.token;
        if (authToken === '' || authToken === null) {
        }
        else if (!authToken.match(/un=.*\|tokenid=.*/)) {
            throw {
                type: 'ArgumentError',
                name: 'AuthTokenMissing',
                message: 'Invalid Authorization found; Authorization token ' +
                         'must match pattern "un=<name>|tokenid=<token>..."',
                suggestion: 'Authorization is provided in the "token"' +
                            'argument property'
            }
        }
        timeout = config.timeout;
        if (!timeout) {
            timeout = 30000;
        }

        /**
         * Creates and returns an instance of the GenomeAnnotation Thrift client. Note that
         * this is
         *
         * @returns {Taxon_L22.assembly.thrift_serviceClient}
         * @private
         * @ignore
         */
         // XXX: Duplicated for each Data API, should be pulled up and re-used.
        function client() {
             try {
                var transport = new Thrift.TXHRTransport(dataAPIUrl, {timeout: timeout}),
                    protocol = new Thrift.TBinaryProtocol(transport),
                    thriftClient = new assembly.thrift_serviceClient(protocol);
                return thriftClient;
            } catch (ex) {
                // Rethrow exceptions in our format:
                if (ex.type && ex.name) {
                    throw ex;
                } else {
                    throw {
                        type: 'ThriftError',
                        message: 'An error was encountered creating the thrift client objects',
                        suggestion: 'This could be a configuration or runtime error. Please consult the console for the error object',
                        errorObject: ex
                    };
                }
            }
        }

        // Mapping for public methods

        var _exports = {}

        // Zero-argument methods

        var _flist = ['taxon', 'assembly', 'feature_types', 'proteins']

        _flist.forEach(function(name) { 
                // Set exported function to a function curried for 'name'
                // that calls a function of the same name on the client
                // with no arguments, and returns a Promise.
                var fname = 'get_' + name;
                _exports[fname] = function() {
                    return Promise.resolve(client()[fname](authToken,
                        objectReference, true)) 
                } 
        })

        // Methods taking a list of string identifiers as its only argument

        _flist = ['feature_type_descriptions', 'feature_type_counts', 'feature_ids',
                  'features', 'feature_locations', 'feature_publications', 'feature_dna',
                  'feature_functions', 'feature_aliases', 'cds_by_gene', 'cds_by_mrna',
                  'gene_by_cds', 'gene_by_mrna', 'mrna_by_cds', 'mrna_by_gene']

        _flist.forEach(function(name) {
                // Set exported function to a function curried for 'name'
                // that calls a function of the same name on the client
                // with one argument (a list of identifiers), and returns a Promise.
                var fname = 'get_' + name
                _exports[fname] = function(items) {
                    if (items.length === 0) {                        
                        throw {
                            type: 'ArgumentError',
                            name: 'Empty' + (name.search('_type_') > 0 ? 'Type': 'Identifier') + 'List',
                            message: 'Input list for ' + fname + ' cannot be empty',
                            suggestion: 'You must have at least one item in the list.'
                        }
                    }
                    return Promise.resolve(client()[fname](authToken,
                        objectReference, items, true))
                }
        })

        // 'feature_ids' takes 2 extra arguments, a list of fileters and a group type

        _exports.get_feature_ids = function(filters, group_type) {
            return Promise.resolve(client()[fname](authToken,
                objectReference, filters, group_type, true))            
        }

        // Return public methods

        return Object.freeze(_exports)

    };

    return GenomeAnnotation;
});
