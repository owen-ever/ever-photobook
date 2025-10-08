#!/bin/bash

# 프로젝트 초기화
nvm use
bun i
git config --local commit.template .gitcommitmsg
