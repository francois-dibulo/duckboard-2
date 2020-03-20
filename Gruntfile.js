module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ''
      },
      dist_app: {
        src: [
          'js/libs/**/*.js',
          'js/ng_app.js',
          'js/app/routes.js',
          'js/shared/**/*.js',
          'js/app/**/*.js'
        ],
        dest: 'build/js/app_<%= pkg.version %>.js'
      },
      css_app: {
        src: [
          'styles/shared.css',
          'styles/ng.animate.css',
          'styles/app.css'
        ],
        dest: 'build/styles/app.css'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.header %> \n VERSION <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        files: [
          {
            src: 'build/js/app_<%= pkg.version %>.js',
            dest: 'build/js/app_<%= pkg.version %>.min.js'
          }
        ]
      }
    },
    cssmin : {
      target : {
        src : ["build/styles/app.css"],
        dest : "build/styles/app.min.css"
      }
    },
    watch: {
      scripts: {
        files: ['js/**/*.js', 'styles/**/*.css'],
        tasks: ['concat', 'uglify'],
        options: {
          spawn: false
        }
      }
    },
    ngtemplates:  {
      ngApp: {
        src: 'views/**/*.html',
        dest: 'build/js/templates.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.registerTask('default', ['concat', 'ngtemplates', 'uglify', 'cssmin', 'watch']);
};
