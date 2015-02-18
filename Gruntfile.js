module.exports = function (grunt) {
	var taskConfig = {
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				curly:  true,
				immed:  true,
				newcap: true,
				noarg:  true,
				sub:    true,
				boss:   true,
				eqnull: true,
				node:   true,
				undef:  true,
				browser: true,	// to allow document
				devel: true, 	// to allow alert
				globals: {
					_:       false,
					jQuery:  false,
					angular: false,
					moment:  false,
					console: false,
					$:       false,
					io:      false,
					ChatClient: true // global variable for the angular module
				}
			},
			src: ['src/js/app.js', 'src/js/**/*.js'],
			gruntfile: ['Gruntfile.js']
		},
		concat: {
			options: {
				separator: '\n'
			},
			dist: {
				src: ['src/js/app.js', 'src/js/**/*.js'],
				dest: 'src/dest/app.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'public/js/app.js': ['src/dest/app.js']
				}
			}
		}
	};

	grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.initConfig(taskConfig);
};
