/**
 * @module Assembly
 * @author Erik Pearson
 * @version 0.1.0
 * @param {AssemblyLibrary} assembly
 * @param {TriftLibrary} Thrift
 * @param {BluebirdPromise} Promise
 * @returns {Assembly_L12.factory}
 */
/*global define*/
/*jslint white: true, browser: true*/
define([
    'bluebird',
    'assembly_service',
    'thrift',
    'kb_data_shared',

    // These don't have representations. Loading them causes the Thrift module
    // to be enhanced with additional properties (typically just a single
    //  property, the new capability added.)
    'thrift_transport_xhr',
    'thrift_protocol_binary'
], function (Promise, assembly, Thrift, KbShared) {
    'use strict';

    /**
     * Represents an interface to the Assembly data service.
     * @alias module:Assembly
     * @constructs Assembly
     * @param {object} config
     * @param {ObjectReference} config.ref The object reference for the object to be accessed.
     * @param {string} config.url The url for the Assembly Service endpoint.
     * @param {string} config.token The KBase authorization token to be used to access the service.
     * @throws ArgumentError Possible reasons, found in the `.name` attribute, are:
     *   ConfigurationObjectMissing, ObjectReferenceMissing, UrlMissing, and AuthTokenMissing
     * @returns {Assembly} A Assembly api object
     */
    var Assembly = function (config) {
        KbShared.validate_config(config);
    
        var objectReference = config.ref,
            dataAPIUrl = config.url,
            authToken = config.token,
            timeout = config.timeout;

        if (!timeout) {
            timeout = 30000;
        }

        function client() {
            return KbShared.connect(Thrift, assembly, dataAPIUrl, timeout);
        }

        // Mapping for public methods

        var exports = {};

        var flist = [
            'assembly_id', 'genome_annotations', 'external_source_info',
            'stats', 'number_contigs', 'gc_content', 'dna_size', 'contig_ids'];
        flist.forEach(function(name) { 
            // Set exported function to a function curried for 'name'
            // that calls a function of the same name on the client
            // with no arguments, and returns a Promise.
            var fname = 'get_' + name;
                exports[fname] = function() {
                    return Promise.resolve(client()[fname](authToken,
                        objectReference, true)); 
                } 
        })

        // Contig methods where first arg. is contig list

        flist = ['contig_lengths', 'contig_gc_content', 'contigs'];
        flist.forEach(function(name) {
            // Set exported function to a function curried for 'name'
            // that calls a function of the same name on the client
            // with one argument (a list of contigs), and returns a Promise.
            var fname = 'get_' + name;
            exports[fname] = function(contigs) {
                if (contigs.length == 0) {
                    throw {
                        type: 'ArgumentError',
                        name: 'EmptyContigList',
                        message: 'List of contigs for ' + fname + ' cannot be empty',
                        suggestion: 'You must have at least one contig in the list.'
                    }
                }
                return Promise.resolve(client()[fname](authToken,
                    objectReference, contigs, true));
            }
        });

        // Return public methods

        return Object.freeze(exports);

    };

    return Assembly;
});
