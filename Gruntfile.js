module.exports = function(grunt) {

  var files = [
    'lib/jsbn/jsbn.js',
    'lib/jsbn/jsbn2.js',
    'lib/jsbn/prng4.js',
    'lib/jsbn/rng.js',
    'lib/jsbn/rsa.js',
    'lib/jsbn/rsa2.js',
    'lib/jsbn/ec.js',
    'lib/jsbn/sec.js',
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
  var prefix = 'var JSEncryptExports = {};' + '\n';
  prefix += '(function(exports) {' + '\n';

  var suffix = 'exports.JSEncrypt = JSEncrypt;' + '\n';
  suffix += '})(JSEncryptExports);' + '\n';
  suffix += 'var JSEncrypt = JSEncryptExports.JSEncrypt;' + '\n';


  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js'].concat(lintFiles)
    },
    concat: {
      license: {
        options: {
          separator: '\n\n\n',
          process: function(src, filepath) {
            var output = 'File: ' + filepath;
            output += '\n';
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
          footer: suffix,
          process: function(src, filepath) {
            console.log(filepath);
            return src;
          }
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
      },
      worker: {
        options: {
          banner:'',
          footer:''
        },
        files: {
          '.tmp/jsencrypt-worker.min.js': 'src/jsencrypt-worker.js'
        }
      }
    },
    watch: {
      scripts: {
        files: ['src/**/*.js', 'lib/**/*.js'],
        tasks: ['jshint', 'concat', 'uglify', 'uglify:worker', 'replace', 'clean', 'test'],
        options: {
          spawn: false,
        },
      },
    },
    jekyll: {
      build: {
        options: {
          config: '_config.yml,_config.build.yml'
        }
      }
    },
    update_submodules: {
      init: {
        options: {
          params: '--init --recursive --rebase'
        }
      },
      update: {
        options: {
          params: '--recursive --rebase'
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    replace: {
      default: {
        src: ['bin/jsencrypt.js', 'bin/jsencrypt.min.js'],
        overwrite: true,                 // overwrite matched source files
        replacements: [{
          from: '@@jsencrypt_worker_source@@',
          to: function(matched) {
            return (grunt.file.read('.tmp/jsencrypt-worker.min.js')+'').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
          }
        }]
      }
    },
    clean: ['.tmp']
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('init', ['update_submodules:init', 'update_submodules:update']);
  grunt.registerTask('test', ['karma:unit']);

  var defaultTasks = ['init', 'jshint', 'concat', 'uglify', 'uglify:worker', 'replace', 'clean', 'test'];
  var serveTasks = defaultTasks.slice(0);
  defaultTasks.push('jekyll');
  serveTasks.push('watch');

  grunt.registerTask('default', defaultTasks);
  grunt.registerTask('serve', serveTasks);
};
