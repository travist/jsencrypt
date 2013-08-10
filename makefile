# Create the list of files
files =   jsbn/jsbn.js\
          jsbn/jsbn2.js\
          jsbn/prng4.js\
          jsbn/rng.js\
          jsbn/rsa.js\
          jsbn/rsa2.js\
          jsbn/base64.js\
	  jsrsasign/asn1-1.0.js\
	  asn1js/hex.js\
	  asn1js/hex.js\
          asn1js/base64.js\
	  asn1js/asn1.js\
          src/jsencrypt.js

.DEFAULT_GOAL := all

all: js

# Perform a jsLint on all the files.
jslint: ${files}
	gjslint $^

# Create an aggregated js file and a compressed js file.
js: ${files}
	@echo "Generating aggregated jsencrypt.js file"
	@echo "var JSEncryptExports = {};" > bin/jsencrypt.js
	@echo "(function(exports) {" >> bin/jsencrypt.js
	@cat $^ >> bin/jsencrypt.js
	@echo "\nexports.JSEncrypt = JSEncrypt;" >> bin/jsencrypt.js
	@echo "})(JSEncryptExports);" >> bin/jsencrypt.js
	@echo "var JSEncrypt = JSEncryptExports.JSEncrypt;" >> bin/jsencrypt.js
	@echo "Generating compressed jsencrypt.min.js file"
	curl -s \
	  -d compilation_level=SIMPLE_OPTIMIZATIONS \
	  -d output_format=text \
	  -d output_info=compiled_code \
	  --data-urlencode "js_code@bin/jsencrypt.js" \
	  http://closure-compiler.appspot.com/compile \
	  > bin/jsencrypt.min.js