
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        watch: {
            scripts: {
                files: ['javascript/src/*.js'],
                tasks: ['default'],
                options: {
                    spawn: false
                }
            }
        },
        // Import package manifest
        pkg: grunt.file.readJSON("package.json"),
        // Banner definitions
        meta: {
            banner: "/*\n" +
                    " *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
                    " *  <%= pkg.description %>\n" +
                    " *  <%= pkg.homepage %>\n" +
                    " *\n" +
                    " *  Made by <%= pkg.author.name %>\n" +
                    " *    Email <%= pkg.author.email %>\n" +
                    " *  Under <%= pkg.licenses[0].type %> License\n" +
                    " */\n"
        },
        // Concat definitions
        concat: {
            dist: {
                files: {
                    'javascript/dist/silverstripe-status-message.js': ['javascript/src/silverstripe-status-message.js']
                }
            },
            options: {
                banner: "<%= meta.banner %>"
            }
        },
        // Lint definitions
        jshint: {
            src: [
                "javascript/src/silverstripe-status-message.js"
            ],
            options: {
                jshintrc: ".jshintrc"
            }
        },
        // Minify definitions
        uglify: {
            my_target: {
                files: {
                    'javascript/dist/silverstripe-status-message.min.js': ['javascript/dist/silverstripe-status-message.js']
                }
            },
            options: {
                banner: "<%= meta.banner %>"
            }
        }

    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("default", ["jshint", "concat", "uglify"]);

};
