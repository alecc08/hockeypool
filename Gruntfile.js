module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    clean: ["./dist"],
    copy: {
            main: {
                files:[
                    {   expand: true,
                        src: 'app/*.js',
                        dest: 'build/app/',
                        flatten: true,
                        filter: 'isFile'
                    },
                    {   expand: true,
                        src: 'css/*.css',
                        dest: 'build/css/',
                        flatten: true,
                        filter: 'isFile'
                    },
                    {   expand: true,
                        src: 'images/*',
                        dest: 'build/images/',
                        flatten: true,
                        filter: 'isFile'
                    },
                    {   expand: true,
                        src: 'model/*.js',
                        dest: 'build/model/',
                        flatten: true,
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        src: './index.html',
                        dest: 'build/',
                        flatten: true,
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        src: './node_modules',
                        dest: 'build/node_modules/',
                        flatten: true,
                        filter: 'isFile'
                    }
                ]

            }
        }
  });
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');


}
