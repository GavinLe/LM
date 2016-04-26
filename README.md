
## 客户端 - 基于 electron
- cd cli/cli/
- 运行 npm run dev 启动开发环境
- 运行 npm run test 启动测试环境
- 运行 npm run prod 启动生产环境

## env - 环境
- common.js 是公共的配置.
- dev.js是开发环境的配置.
- prod.js 是生产配置.
- test.js是测试环境配置.

## main - electron 主进程所跑的东西
- account 是用户模块
- window.js 创建渲染窗口
- token.js 检查 token 状态
- strong.js 本地数据持久化
- events.js 事件处理

## public - electron 子进程所跑的东西(也就是看到页面效果)
就是常规的web开发的目录结构

## main.js - electron 启动文件
package.js - 包含各种所需模块以及项目的配置信息(名称、版本、许可证等)。 包含可配置项 name 名称 应用描述 description 版本号

## 客户端打包 - 未开始


## gulp 使用方法
npm install 安装gulp依赖库,配置在package.json中

gulp copy
删除临时文件并拷贝源码到 build/src目录下

gulp build -p=prod (test/dev)
electron打包,会先调用copy,文件在build/release下, 第一次会下载electron包,比较慢
