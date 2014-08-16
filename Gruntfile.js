module.exports = function(grunt) {

  var files = [
    'lib/jsbn/jsbn.js',
    'lib/jsbn/jsbn2.js',
    'lib/jsbn/prng4.js',
    'lib/jsbn/rng.js',
    'lib/jsbn/rsa.js',
    'lib/jsbn/rsa2.js',
    'lib/jsbn/rsa-async.js',
    'lib/jsbn/base64.js',
    'lib/jsrsasign/asn1-1.0.js',
    'lib/asn1js/hex.js',
    'lib/asn1js/base64.js',
    'lib/asn1js/asn1.js',
    'src/jsencrypt.js'
  ];

  var lintFiles = [
    'src/jsencrypt.js'
  ];

  var licenses = [
    'src/LICENSE.txt',
    'lib/jsrsasign/LICENSE.txt',
    'lib/jsbn/LICENSE.txt',
    'lib/asn1js/LICENSE.txt'
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
