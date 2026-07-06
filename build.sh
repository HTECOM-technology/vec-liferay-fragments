#!/bin/bash
set -e

echo ">>> yarn build..."
yarn build
echo "\n\n"

echo ">>> node sync-to-liferay.js..."
node sync-to-liferay.js
echo "\n\n"

echo ">>> npm run compress..."
cd liferay-build
npm run compress
cd ..
echo "\n\n"

echo ">>> Copy liferay-fragments.zip to root..."
cp liferay-build/build/liferay-fragments.zip ./
echo "\n\n"

echo "Build complete! File: liferay-fragments.zip"
