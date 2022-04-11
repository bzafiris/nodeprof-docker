#!/bin/bash

docker build -t nodeprof:latest .
docker run --name nodeprof -v $(pwd)/sample:/data -d -i  nodeprof:latest bash
