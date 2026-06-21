#!/usr/bin/env bash
# Render Build Script — installs deps & builds the React client

set -o errexit

# Install root dependencies (Express server)
npm install

# Install client dependencies (including devDependencies like vite) and build
cd client
npm install --include=dev
npm run build
