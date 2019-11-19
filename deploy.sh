#!/bin/bash
cd ~/kunigame
git pull
yarn install
yarn build
cd ~/kunigame/output
docker stop rungame
docker rm rungame
docker rmi kuni
docker build -t kuni .
docker run -d -p 3000:3000 --name rungame kuni