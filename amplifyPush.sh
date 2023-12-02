#!/bin/bash

# Install dependencies
npm install

# Build assets
npm run build 

# Output build logs
npm run build | tee build.log

# Deploy assets
amplify push

# Output deployment logs 
amplify push | tee deploy.log
