module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-jshint');
 	var taskConfig = {
		jshint: {
       			src: ['src/js/*.js'],
       			gruntfile: ['Gruntfile.js'],
			options: {
			}
		}
	};
   	grunt.initConfig(taskConfig);	
};
