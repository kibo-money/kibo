#!/usr/bin/env bash

# if [ "$(uname)" == "Darwin" ]; then
#     if [ mdutil -s / | grep "disabled" ]; then
#         sudo mdutil -a -i on
#     fi
# fi

bitcoin-cli -datadir=/Users/k/Developer/bitcoin stop
