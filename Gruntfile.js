module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	var taskConfig = {
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			src: ['src/js/*.js'],
			gruntfile: ['Gruntfile.js'],
			options: {
			}
		},
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: ['src/js/*.js'],
				dest: 'src/js/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'src/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		}
	};
	grunt.initConfig(taskConfig);
};
