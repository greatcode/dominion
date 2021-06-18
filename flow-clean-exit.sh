#!/bin/bash

# This is so `nodemon` will continue to work when flow encounters an error
# Otherwise, `flow` changes the process exit code, and `nodemon` crashes
clear
trap './node_modules/.bin/flow && npm run build' EXIT
