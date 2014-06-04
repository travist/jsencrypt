// This file will be copied in the jsencrypt source in order to be loaded through a BLOB url
// For example on how to load worker from a BLOB look at: http://www.html5rocks.com/en/tutorials/workers/basics/
(function() {
  'use strict';

  var sourceFile = '@@source_file@@';
  importScripts(sourceFile);

  addEventListener('message', function(e) {
    var options = {};
    options.default_key_size = e.size;
    options.default_public_exponent = e.exp;
    var jse = new JSEncrypt(options);
    var privateKey = jse.getPrivateKey();
    self.postMessage({key: privateKey});
  }, false);
  
})();
