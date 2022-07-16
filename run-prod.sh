#!/bin/sh
export NODE_ENV=production
#export REMIX_BASEPATH=budget-app
export PORT=3002

npm run build

remix-serve build/
#pm2 start dist/main.js --name="pi-home-server" --watch
