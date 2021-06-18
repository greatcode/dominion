#!/bin/bash

mkdir -p build
mkdir -p .tmp

# Remove only the files that have been deleted
$(cd build && find . -not -path *\/.gitkeep > ../.tmp/blueprint-build)
$(cd src && find . > ../.tmp/blueprint-src)
diff .tmp/blueprint-build .tmp/blueprint-src | egrep "^< .*" | awk '{ b="./build/"$2; print b }' | xargs rm 2>/dev/null

# Rebuild the files that remain
rsync --recursive --progress -a --exclude '*.js' src/ build/
./remove-types.sh
