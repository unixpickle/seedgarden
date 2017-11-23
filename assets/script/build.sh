#!/bin/bash

if [ ! -d node_modules ]; then
	npm install
fi

rm -f joined.js
for file in root.js
do
  cat src/$file >>joined.js
done
node ./node_modules/babel-cli/bin/babel.js joined.js --plugins \
	transform-react-jsx --out-file script.js && rm joined.js
