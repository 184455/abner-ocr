#!/bin/bash

set -e # 如果报错了就不再往下执行

OPERATION=abner-ocr
ENV=dev

SOURCE_DIR=$(cd "$(dirname $0)";cd ../;pwd)
START_TIME=`date +%s`

echo "-----------------------------------"
echo "OPERATION: $OPERATION"
echo "ENV: $ENV"
echo "build start..."

cd $SOURCE_DIR

# git checkout .
git pull
yarn
yarn build

# 打包完成以后，把新代码复制到 nginx 静态代理地址

# 移动
rm -rf /www/ocr/*
cp -rf ./build/* /www/ocr/

END_TIME=`date +%s`
SUM_TIME=$(($END_TIME - $START_TIME))
echo "build successful. Total times: $SUM_TIME seconds."
echo "-----------------------------------"
