module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    eslint: {
      target: ['src/**/*.js'],
    },

    run: {
      jest: {
        exec: 'npm test',
      },
    },
  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-run');

  grunt.registerTask('lint', ['eslint']);

  grunt.registerTask('test', ['run:jest']);

  grunt.registerTask('default', ['eslint', 'run:jest']);
};
