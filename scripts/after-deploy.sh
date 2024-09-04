#!/bin/bash
REPOSITORY=/home/ubuntu/build

cd $REPOSITORY

sudo rm -rf node_modules
sudo npm install
sudo pm2 kill

sudo pm2 start src/app.js
sudo pm2 save