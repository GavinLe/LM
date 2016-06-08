#!/usr/bin/env bash
echo "env ========"$1
if [ $1 == "test" ]; then
    echo "exec gulp package-upload --env test && npm run upload"
    gulp package-upload && npm run upload
elif [ $1 == "dev" ]; then
    echo "exec gulp package-upload --env dev && npm run upload"
    gulp package-upload --env dev && npm run upload
elif [ $1 == "prod" ]; then
    echo "exec gulp package-upload --env prod && npm run upload"
    gulp package-upload --env prod  && npm run upload
else
    echo "not args, exec default commond: gulp package-upload && npm run upload"
    gulp package-upload && npm run upload
fi
