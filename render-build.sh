#!/usr/bin/env bash
# Render Build Script — installs deps & builds the React client

set -o errexit

# Install root dependencies (Express server)
npm install

# Install client dependencies and build
cd client
npm install
npm run build
