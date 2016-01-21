/**
 * Shared code for KBase Data API clients.
 */
/*global define*/
/*jslint white: true, browser: true*/
define([], function () {
    'use strict';

    
    /**
     * Validate a service configuration.
     */
    function validate_config (config) {            
        // Construction argument contract enforcement, throw useful exceptions
        if (!config) {
            throw {
                type: 'ArgumentError',
                name: 'ConfigurationObjectMissing',
                message: 'Configuration object missing',
                suggestion: 'This is an API usage error; the taxon factory object is required to have a single configuration object as an argument.'
            };
        }
        if (!config.ref) {
            throw {
                type: 'ArgumentError',
                name: 'ObjectReferenceMissing',
                message: 'Object reference "ref" missing',
                suggestion: 'The object reference is provided as in the "ref" argument to the config property'
            };
        }
        if (!config.url) {
            throw {
                type: 'ArgumentError',
                name: 'UrlMissing',
                message: 'Cannot find a url for the data api',
                suggestion: 'The url is provided as in the "url" argument property'
            };

        }
        
        if (config.token == '' || config.token == null) {
        }
        else if (!config.token.match(/un=.*\|tokenid=.*/)) {
            throw {
                type: 'ArgumentError',
                name: 'AuthTokenMissing',
                message: 'Invalid Authorization found; Authorization token ' +
                         'must match pattern "un=<name>|tokenid=<token>..."',
                suggestion: 'Authorization is provided in the "token"' +
                            'argument property'
            };
        }            
    }
        
    /**
     * Connect to Thrift binary transport and
     * initialize client for given service class.
     */
    function connect(Thrift, service, url, timeout) {
        try {
            var transport = new Thrift.TXHRTransport(url, {timeout: timeout}),
                protocol = new Thrift.TBinaryProtocol(transport),
                thriftClient = new service.thrift_serviceClient(protocol);
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
    
    return {
        validate_config: validate_config,
        connect: connect
    }
});
