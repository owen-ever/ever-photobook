#!/bin/bash

nvm use

bun i

bun run build

docker-compose build --no-cache