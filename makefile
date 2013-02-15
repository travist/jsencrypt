# Create the list of files
jsbn =    jsbn/jsbn.js\
          jsbn/jsbn2.js\
          jsbn/prng4.js\
          jsbn/rng.js\
          jsbn/rsa.js\
          jsbn/rsa2.js\
          jsbn/base64.js

.DEFAULT_GOAL := all

all: js

# Perform a jsLint on all the files.
jslint: ${jsbn}
	gjslint $^

# Create an aggregated js file and a compressed js file.
js: ${jsbn}
	@echo "Generating aggregated jsbn.js file"
	@cat > bin/jsbn.js $^
	@echo "Generating compressed jsbn.min.js file"
	curl -s \
	  -d compilation_level=SIMPLE_OPTIMIZATIONS \
	  -d output_format=text \
	  -d output_info=compiled_code \
	  --data-urlencode "js_code@bin/jsbn.js" \
	  http://closure-compiler.appspot.com/compile \
	  > bin/jsbn.min.js