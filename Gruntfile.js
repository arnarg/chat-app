module.exports = function (grunt) {
	var taskConfig = {
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			src: ['src/js/**/*.js'],
			gruntfile: ['Gruntfile.js'],
			options: {
			}
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
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.initConfig(taskConfig);
};
