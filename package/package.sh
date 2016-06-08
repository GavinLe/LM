#!/bin/bash
echo "========= build dev env, enter number 1 =========";
echo "========= build test env, enter number 2 =========";
echo "========= build prod env, enter number 3 =========";
echo "========= build dev upload source , enter number 4 =========";
echo "========= build test upload source , enter number 5 =========";
echo "========= build prod upload source , enter number 6 =========";
echo " please enter number 1-6 to build: "
read name
if [ $name == "1" ]; then
    echo "exec npm install  && gulp --env dev && npm run upload && npm run zip"
    # 下载依赖
    npm install  && gulp --env dev && gulp build --env dev && npm run upload && npm run zip
elif [ $name == "2" ]; then
    echo "exec npm install  && gulp --env test && npm run upload && npm run zip"
    npm install  && gulp --env test && gulp build --env test && npm run upload && npm run zip
elif [ $name == "3" ]; then
    echo "exec npm install  && gulp --env prod && npm run upload && npm run zip"
    npm install  && gulp --env prod && gulp build --env prod  && npm run upload && npm run zip
elif [ $name == "4" ]; then
    sh package/package_upload.sh dev
elif [ $name == "5" ]; then
    sh package/package_upload.sh test
elif [ $name == "6" ]; then
    sh package/package_upload.sh prod
else
    echo "invalid input parameters, please rerun the."
fi
exit
