---
layout: default
title: Demo
nav_order: 3
permalink: /demo/
aliases:
  - /demo.html
---

# Online RSA Key Generator
{: .fs-9 }

Interactive RSA encryption demo running entirely in your browser.
{: .fs-6 .fw-300 }

---

## Key Generation

<div class="mb-4">
  <label for="key-size" class="d-block mb-2 fw-500">Key Size:</label>
  <select id="key-size" class="mb-3" style="padding: 4px 8px; border: 1px solid #d0d7de; border-radius: 6px;">
    <option value="512">512 bit</option>
    <option value="1024" selected>1024 bit</option>
    <option value="2048">2048 bit</option>
    <option value="4096">4096 bit</option>
  </select>
  <br>
  <button id="generate" type="button" class="btn btn-primary mr-3">Generate New Keys</button>
</div>

<div class="mb-4">
  <input type="checkbox" id="async-ck" class="mr-2">
  <label for="async-ck">Asynchronous generation</label>
</div>

<div class="mb-4">
  <small id="time-report" class="text-grey-dk-100 fs-2"></small>
</div>

<div class="d-md-flex flex-wrap">
  <div class="flex-1 mr-md-4 mb-4" style="min-width: 300px;">
    <label for="privkey" class="d-block mb-2 fw-500">Private Key</label>
    <textarea id="privkey" rows="15" style="width: 100%; padding: 8px; border: 1px solid #d0d7de; border-radius: 6px; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 12px; background-color: #f6f8fa;"></textarea>
  </div>
  <div class="flex-1 mb-4" style="min-width: 300px;">
    <label for="pubkey" class="d-block mb-2 fw-500">Public Key</label>
    <textarea id="pubkey" rows="15" readonly style="width: 100%; padding: 8px; border: 1px solid #d0d7de; border-radius: 6px; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 12px; background-color: #f6f8fa;"></textarea>
  </div>
</div>

---

## Encryption Test

<div class="d-md-flex flex-wrap v-align-top">
  <div class="flex-1 mr-md-4 mb-4" style="min-width: 200px;">
    <label for="input" class="d-block mb-2 fw-500">Text to encrypt:</label>
    <textarea id="input" name="input" rows="4" style="width: 100%; padding: 8px; border: 1px solid #d0d7de; border-radius: 6px; font-family: system-ui;">This is a test!</textarea>
  </div>
  <div class="flex-0 mr-md-4 mb-4 text-center">
    <button id="execute" type="button" class="btn btn-green">Encrypt / Decrypt</button>
  </div>
  <div class="flex-1 mb-4" style="min-width: 200px;">
    <label for="crypted" class="d-block mb-2 fw-500">Encrypted:</label>
    <textarea id="crypted" name="crypted" rows="4" style="width: 100%; padding: 8px; border: 1px solid #d0d7de; border-radius: 6px; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 12px; background-color: #f6f8fa;"></textarea>
  </div>
</div>

<script type="text/javascript" src="{{ site.baseurl }}/bin/jsencrypt.min.js"></script>
{% raw %}
<script type="text/javascript">
  document.addEventListener('DOMContentLoaded', function() {
    function $(id) {
      return document.getElementById(id);
    }
    $('execute').addEventListener('click', function() {
      var crypt = new JSEncrypt();
      crypt.setPrivateKey($('privkey').value);
      var pubkey = $('pubkey').value;
      if (!pubkey) {
        $('pubkey').value = crypt.getPublicKey();
      }
      var input = $('input').value;
      var crypted = $('crypted').value;
      if (input) {
        $('crypted').value = crypt.encrypt(input);
        $('input').value = '';
      }
      else if (crypted) {
        var decrypted = crypt.decrypt(crypted);
        if (!decrypted)
          decrypted = 'This is a test!';
        $('input').value = decrypted;
        $('crypted').value = '';
      }
    });
    var generateKeys = function () {
      var keySize = parseInt($('key-size').value);
      var crypt = new JSEncrypt({default_key_size: keySize});
      var asyncCheckbox = $('async-ck');
      var async = asyncCheckbox.checked;
      var dt = new Date();
      var time = -(dt.getTime());
      if (async) {
        $('time-report').textContent = '.';
        var load = setInterval(function () {
          var text = $('time-report').textContent;
          $('time-report').textContent = text + '.';
        }, 500);
        crypt.getKey(function () {
          clearInterval(load);
          dt = new Date();
          time += (dt.getTime());
          $('time-report').textContent = 'Generated in ' + time + ' ms';
          $('privkey').value = crypt.getPrivateKey();
          $('pubkey').value = crypt.getPublicKey();
        });
        return;
      }
      crypt.getKey();
      dt = new Date();
      time += (dt.getTime());
      $('time-report').textContent = 'Generated in ' + time + ' ms';
      $('privkey').value = crypt.getPrivateKey();
      $('pubkey').value = crypt.getPublicKey();
    };
    $('generate').addEventListener('click', generateKeys);
    generateKeys();
  });
</script>
{% endraw %}
