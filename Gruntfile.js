    /*global require, module */
/*jslint white: true */
var path = require('path');
var fs = require('fs');
module.exports = function (grunt) {
    'use strict';

    // The runtime directory holds a build and dist directory and other files
    // required to actually run the build client and server.
    var runtimeDir = 'runtime';


    // Mapping of API names to the directory paths where the generate Thrift files
    // will be found
    var api_names = [
        { path: 'taxonomy/taxon', name: 'taxon' },
        { path: 'sequence/assembly', name: 'assembly' },
        { path: 'annotation/genome_annotation', name: 'genome_annotation' }
    ]

    // The build directory is the destination for the KBase source, messaged
    // external dependencies, and other files needed to run the client and server
    // components. The build directory can be used directly in development mode,
    // since it contains normal, un-minified javascript.
    var buildDir = runtimeDir + '/build';

    var distDir = 'bower';

    var testDir = runtimeDir + '/test';

    // Make a path under the 'buildDir'
    function makeBuildPath(subdir) {
        if (subdir) {
            return path.normalize(buildDir + '/' + subdir);
        }
        return path.normalize(buildDir);
    }

    function makeDistPath(subdir) {
        if (subdir) {
            return path.normalize(distDir + '/' + subdir);
        }
        return path.normalize(distDir);
    }

    function makeRuntimePath(subdir) {
        if (subdir) {
            return path.normalize(runtimeDir + '/' + subdir);
        }
        return path.normalize(runtimeDir);
    }

    // Load grunt npm tasks..
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-markdown');
    // these 2 are for local debugging
    grunt.loadNpmTasks('grunt-connect');
    grunt.loadNpmTasks('grunt-open');

    /*
     *
     * notes on "fixers"
     * - add js lint config to decrease noise of harmless lint violations
     * - wrap in define
     * - set strict mode
     * - determine the name of the "subject" and return it as the module object
     * - modest code repair to assist in reducing lint noise (and of course improve code reliability)
     */

     // Fix a Thrift-generated JS stub for the "types" (file will end in "_types.js")
    function fixThriftTypes(content) {
        var namespaceRe = /^if \(typeof ([^\s\+]+)/m,
            namespace = content.match(namespaceRe)[1],
            lintDecls = '/*global define */\n/*jslint white:true */',
            requireJsStart = 'define(["thrift"], function (Thrift) {\n"use strict";',
            requireJsEnd = 'return ' + namespace + ';\n});',
            fixDeclRe = /if \(typeof ([^\s]+) === 'undefined'\) {\n[\s]*([^\s]+) = {};\n}/,
            repairedContent = content
            .replace(fixDeclRe, 'var $1 = {};\n')
            .replace(/([^=!])==([^=])/g, '$1===$2')
            .replace(/!=([^=])/g, '!==$1');

        return [lintDecls, requireJsStart, repairedContent, requireJsEnd].join('\n');
    }

    // Fix a Thrift-generated JS stub thrift_service.js
    function fixThriftService(content) {
        var // Add header for Lint
            lintDecls = '/*global define */\n/*jslint white:true */',
            // Get second delimted token in file as the "namespace" 
            namespaceRe = /^([^\/\s\.]+)/m,
            namespace = content.match(namespaceRe)[1],
            // Create new 'require' header and footer with the found namespace
            requireJsStart = 'define(["thrift", "' + namespace + '_types"], function (Thrift, ' + namespace + ') {\n"use strict";',
            requireJsEnd = 'return ' + namespace + ';\n});',
            // Repair equality
            repairedContent = content
            .replace(/([^=!])==([^=])/g, '$1===$2')
            .replace(/!=([^=])/g, '!==$1');

        // Return lint header + require header + content + require footer
        return [lintDecls, requireJsStart, repairedContent, requireJsEnd].join('\n');
    }
    function fixThriftLib(content) {
        var lintDecls = '/*global define */\n/*jslint white:true */',
            namespaceRe = /^var (.+?) = /m,
            namespace = content.match(namespaceRe)[1],
            requireJsStart = 'define(["jquery"], function (jQuery) {\n"use strict";',
            requireJsEnd = 'return ' + namespace + ';\n});',
            repairedContent = content
            .replace(/([^=!])==([^=])/g, '$1===$2')
            .replace(/!=([^=])/g, '!==$1');

        return [lintDecls, requireJsStart, repairedContent, requireJsEnd].join('\n');
    }
    function fixThriftBinaryLib(content) {
        var lintDecls = '/*global define */\n/*jslint white:true */',
            // namespaceRe = /^var (.+?) = /m,
            // namespace = content.match(namespaceRe)[1],
            namespace = 'Thrift',
            requireJsStart = 'define(["thrift"], function (' + namespace + ') {\n"use strict";',
            requireJsEnd = 'return ' + namespace + ';\n});',
            repairedContent = content
            .replace(/([^=!])==([^=])/g, '$1===$2')
            .replace(/!=([^=])/g, '!==$1');

        return [lintDecls, requireJsStart, repairedContent, requireJsEnd].join('\n');
    }

    // Bower magic.
    /*
     * This section sets up a mapping for bower packages.
     * Believe it or not this is shorter and easier to maintain
     * than plain grunt-contrib-copy.
     * NB: please keep this list in alpha order by dir and then name.
     *
     */
    var bowerFiles = [
        {
            name: 'bluebird',
            cwd: 'js/browser',
            src: ['bluebird.js']
        },
        {
            name: 'jquery',
            cwd: 'dist',
            src: ['jquery.js']
        },
        {
            name: 'underscore'
        },
        {
            name: 'bootstrap',
            cwd: 'dist',
            src: '**/*',
        },
         {
            name: 'font-awesome',
            src: ['css/font-awesome.css', 'fonts/*']
        },
        {
            name: 'kbase-common-js',
            cwd: 'src/js',
            src: ['**/*']
        },
        {
            dir: 'requirejs',
            name: 'require'
        },
        {
            name: 'yaml',
            dir: 'require-yaml'
        },
        {
            name: 'js-yaml',
            cwd: 'dist'
        },
        {
            name: 'text',
            dir: 'requirejs-text'
        },
        {
            name: 'require-css',
            src: 'css.js'
        },
        {
            dir: 'kbase-data-thrift-js',
            cwd: 'src',
            src: ['**/*']
        }
    ],
        bowerCopy = bowerFiles.map(function (cfg) {
            // path is like dir/path/name
            var path = [];
            // dir either dir or name is the first level directory.
            // path.unshift(cfg.dir || cfg.name);

            // If there is a path (subdir) we add that too.
            if (cfg.path) {
                path.unshift(cfg.path);
            }

            // Until we get a path which we use as a prefix to the src.
            var pathString = path
                .filter(function (el) {
                    if (el === null || el === undefined || el === '') {
                        return false;
                    }
                    return true;
                })
                .join('/');

            var srcs = (function () {
                if (cfg.src === undefined) {
                    return [cfg.name + '.js'];
                } else {
                    if (typeof cfg.src === 'string') {
                        return [cfg.src];
                    } else {
                        return cfg.src;
                    }
                }
            }());

            var sources = srcs.map(function (s) {
                return [pathString, s]
                    .filter(function (el) {
                        if (el === null || el === undefined || el === '') {
                            return false;
                        }
                        return true;
                    })
                    .join('/');
            });

            var cwd = cfg.cwd;
            if (cwd && cwd.charAt(0) === '/') {
            } else {
                cwd = 'bower_components/' + (cfg.dir || cfg.name) + (cwd ? '/' + cwd : '');
            }
            return {
                nonull: true,
                expand: true,
                cwd: cwd,
                src: sources,
                dest: makeBuildPath('bower_components') + '/' + (cfg.dir || cfg.name)
            };
        });


    // Project configuration.
    grunt.initConfig({
        // This is the path to the root of the Data API core
        // directory, which contains the Thrift specs and other cool things.
        corepath: 'core-develop',

        pkg: grunt.file.readJSON('package.json'),
        // Uses grunt-contrib-copy plugin (https://github.com/gruntjs/grunt-contrib-copy)
        copy: {
            bower: {
                files: bowerCopy
            },
            'bower-package': {
                files: [
                    {
                        cwd: 'runtime/build/js',
                        src: '**/*',
                        dest: makeDistPath(),
                        expand: true
                    }
                ]
            },
            runtime: {
                files: [
                    {
                        // copy the sample test config into the runtime semi-permanent config.
                        cwd: 'src/config',
                        src: 'test.yml',
                        dest: makeRuntimePath('config'),
                        expand: true,
                        filter: function (sourceFilePath) {
                            var path = require('path'),
                                dest = path.join(makeRuntimePath('config/test.yml'));
                            if (grunt.file.exists(dest)) {
                                return false;
                            }
                            return true;
                        }
                    }
                ]
            },
            build: {
                files: [
                    {
                        cwd: 'src/js',
                        src: '**/*',
                        dest: makeBuildPath('js'),
                        expand: true
                    },
                    // Files for "eyeball" browser testing and development
                    {
                        cwd: 'src/htdocs',
                        src: '**/*',
                        dest: makeBuildPath('htdocs'),
                        expand: true
                    },
                    // Copy the runtime test config into the main client config.
                    // runtime/config/test.yml is first copied and then hand-maintained
                    // the copy task will not overwrite it
                    {
                        src: makeRuntimePath('config/test.yml'),
                        dest: makeBuildPath('config/config.yml')
                    }
                ]
            },
            thriftTypes: {
                files: api_names.map(function(value) {
                    grunt.log.writeln('Fix ' + value.name + '_types.js')
                    return  {
                        cwd: 'temp/' + value.name,
                        src: value.name + '_types.js',
                        dest: makeBuildPath('js/thrift/' + value.name),
                        expand: true
                    }
                }),
                options: {
                    process: function (content) {
                        return fixThriftTypes(content);
                    }
                }
            },
            thriftService: {
                files: api_names.map(function(value) {
                    grunt.log.writeln('Fix ' + value.name + '/thrift_service.js')
                    return {
                        cwd: 'temp/' + value.name,
                        src: 'thrift_service.js',
                        dest: makeBuildPath('js/thrift/' + value.name),
                        expand: true
                    }
                }),
                options: {
                    process: function (content) {
                        return fixThriftService(content);
                    }
                }
            },
            thriftLib: {
                files: [
                    {
                        cwd: 'bower_components/thrift/lib/js/src',
                        src: 'thrift.js',
                        dest: makeBuildPath('js/thrift'),
                        expand: true
                    }
                ],
                options: {
                    process: function (content) {
                        return fixThriftLib(content);
                    }
                }
            },
            thriftBinaryLib: {
                files: [
                    {
                        cwd: 'bower_components/kbase-data-thrift-js/src/js/lib',
                        src: 'thrift-protocol-binary.js',
                        dest: makeBuildPath('js/thrift'),
                        expand: true
                    }
                ],
                options: {
                    process: function (content) {
                        return fixThriftBinaryLib(content);
                    }
                }
            }
        },
        clean: {
            build: {
                src: [makeBuildPath(), makeDistPath()],
                // We force, because our build directory may be up a level
                // in the runtime directory.
                options: {
                    force: true
                }
            },
            temp: {
                src: 'temp'
            }
        },
        shell: {
            compileThrift: {
                // Loop through api_names array and make commands to generate Thrift JS stubs.
                // Get input files from "<api_names.path>/<api_names.name>".
                // Put output in directories under "<temp>/<api_names.name>".
                command: api_names.map(function(value) {
                    var target = 'temp/' + value.name
                    var cmd = 'mkdir -p ' + target + '; thrift -gen js:jquery -out ' + target +
                              ' <%= corepath %>/thrift/specs/' + value.path  + 
                              '/' + value.name + '.thrift'
                    grunt.log.writeln('Compile Thrift command: ' + cmd + '"')
                    return cmd
                }).join(';'), // join all the commands into one big command
                options: {
                    stderr: false
                }
            },
           bowerUpdate: {
              command: [
                 'bower', 'update'
              ].join(' '),
              options: {
                 cwd: '..'
              }
           }
        },
        mkdir: {
            temp: {
                options: {
                    create: ['temp']
                }
            }
        },
        bower: {
            install: {
                options: {
                   base: '..',
                    copy: false
                }
            }
        },
        jsdoc: {
            build: {
                src: ['src/js/*.js', 'src/docs/types.js'],
                dest: 'src/htdocs/jsdocs'
            }
        },
        markdown: {
            build: {
                files: [
                    {
                        cwd: 'src/docs',
                        src: '*.md',
                        dest: 'src/htdocs/docs',
                        ext: '.html',
                        expand: true
                    }
                ],
                options: {
                    markdownOptions: {
                        gfm: true,
                        tables: true
                    }
                }
            }
        },
        open: {
           dev: {
               path: 'http://localhost:8000/htdocs/'
           }
        },

        connect: {
           server: {
               port: 8000,
               base: 'runtime/build',
               keepalive: false,
               onCreateServer: function (server, connect, options) {
                   console.log('created...');
               }
           }
        },


    });

    grunt.registerTask('build', [
        'shell:bowerUpdate',
        'jsdoc:build',
        'markdown:build',
        'copy:runtime',
        'copy:bower',
        'copy:build',
        'build-thrift-libs',
        'copy:bower-package'
    ]);

    // Do a build w/o Thrift for TravisCI
    grunt.registerTask('build-travis', [
        'shell:bowerUpdate',
        'jsdoc:build',
        'markdown:build',
        'copy:runtime',
        'copy:bower',
        'copy:build',
        'copy:bower-package'
    ]);

    grunt.registerTask('build-thrift-libs', [
        'clean:temp',
        'mkdir:temp',
        'shell:compileThrift',
        'copy:thriftTypes',
        'copy:thriftService'

            //'copy:thriftLib',
            //'copy:thriftBinaryLib'
    ]);


    // Starts a little server and runs the app in a page.
    // Should be run after 'grunt build'.
   grunt.registerTask('preview', [
       'open:dev',
       'connect'
   ]);

   grunt.registerTask('testloop', ['shell:testloop'])
};
