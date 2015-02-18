module.exports = function (grunt) {
	var taskConfig = {
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
				dest: 'public/js/app.js'
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
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.initConfig(taskConfig);
};
