#!/bin/bash
#
# This processes all js files in `src/`
# It removes the flow types and only copies it over if it has changed

for file in $(find src -name "*.js" | cut -f 2- -d '/')
do
  (cd build && mkdir -p $(dirname $file))
  contents=$(./node_modules/.bin/flow-remove-types ./src/$file)

  # Only overwrite the target if it has changed (to cut down on Nodemon restart noise)
  DIFF=$(diff <(echo "$contents") ./build/$file 2>&1)
  if [ "$DIFF" != "" ]
  then
    echo Updating ./build/$file
    echo "$contents" > ./build/$file
  fi
done
