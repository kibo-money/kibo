# !/usr/bin/env bash

# [[ -d "./kibo" ]] && sudo rm -r ./kibo
# git clone https://github.com/kibo-money/kibo.git

docker build -t kibo-parser -f ../Dockerfile.parser .
docker build -t kibo-server -f ../Dockerfile.server .
