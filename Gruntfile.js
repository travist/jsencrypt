module.exports = function(grunt) {

  var files = [
    'jsbn/jsbn.js',
    'jsbn/jsbn2.js',
    'jsbn/prng4.js',
    'jsbn/rng.js',
    'jsbn/rsa.js',
    'jsbn/rsa2.js',
    'jsbn/rsa-async.js',
    'jsbn/base64.js',
    'jsrsasign/asn1-1.0.js',
    'asn1js/hex.js',
    'asn1js/base64.js',
    'asn1js/asn1.js',
    'src/jsencrypt.js'
  ];

  var lintFiles = [
    'src/jsencrypt.js'
  ];

  var licenses = [
    'src/LICENSE.txt',
    'jsrsasign/LICENSE.txt',
    'jsbn/LICENSE.txt',
    'asn1js/LICENSE.txt'
  ];

  // The code to wrap the generated files with.
  var prefix = 'var JSEncryptExports = {};' + "\n";
  prefix += '(function(exports) {' + "\n";

  var suffix = 'exports.JSEncrypt = JSEncrypt;' + "\n";
  suffix += '})(JSEncryptExports);' + "\n";
  suffix += 'var JSEncrypt = JSEncryptExports.JSEncrypt;' + "\n";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js'].concat(lintFiles)
    },
    concat: {
      license: {
        options: {
          separator: "\n\n\n",
          process: function(src, filepath) {
            var output = 'File: ' + filepath;
            output += "\n";
            output += src;
            return output;
          }
        },
        files: {
          'LICENSE.txt': licenses
        }
      },
      js: {
        options: {
          banner: prefix,
          separator: '',
          footer: suffix
        },
        files: {
          'bin/jsencrypt.js': files
        }
      }
    },
    uglify: {
      options: {
        banner: prefix,
        footer: suffix
      },
      build: {
        files: {
          'bin/jsencrypt.min.js': files
        }
      }
    },
    jekyll: {
      build: {
        options: {
          config: '_config.yml,_config.build.yml'
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jekyll');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'jekyll']);
};
