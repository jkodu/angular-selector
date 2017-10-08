module.exports = function (grunt) {

    // Load plugins
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        autoprefixer: {
            options: {
                browsers: ['last 2 versions']
            },
            your_target: {
                'src/angular-selector.css': 'src/angular-selector.css'
            },
        },
        sass: {
            default: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'src/angular-selector.css': 'src/angular-selector.scss',
                }
            }
        },
        ts: {
            default: {
                src: [
                    "src/angular-selector.ts",
                    "!node_modules/**"
                ]
            }
        },
        bumpup: {
            options: {
                updateProps: {
                    pkg: 'package.json'
                }
            },
            file: 'package.json'
        },
        copy: {
            main: {
                files: {
                    'dist/angular-selector.js': ['src/angular-selector.js'],
                    'dist/angular-selector.css': ['src/angular-selector.css']
                }
            }
        },
        uglify: {
            main: {
                files: {
                    'dist/angular-selector.min.js': ['dist/angular-selector.js']
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            main: {
                files: {
                    'dist/angular-selector.min.css': ['dist/angular-selector.css']
                }
            }
        },
        header: {
            main: {
                options: {
                    text: '/*! angular-selector - v<%= pkg.version %> - https://github.com/indrimuska/angular-selector - (c) 2015 Indri Muska - MIT */'
                },
                files: {
                    'dist/angular-selector.js': 'dist/angular-selector.js',
                    'dist/angular-selector.css': 'dist/angular-selector.css',
                    'dist/angular-selector.min.js': 'dist/angular-selector.min.js',
                    'dist/angular-selector.min.css': 'dist/angular-selector.min.css'
                }
            }
        }
    });

    // Default tasks.
    grunt.registerTask('default', [
        'sass', 'autoprefixer',
        'ts',
        'copy',
        // 'uglify', 
        'cssmin',
        // 'header', 
        // 'sync-json'
    ]);
    grunt.registerTask('update-patch', ['bumpup:patch', 'default']);

};
