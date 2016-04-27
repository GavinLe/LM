## 项目结构说明
 |-- fe.cli  
 |---- resources 项目所需的资源  
 |---- script 打包上传的脚步(暂时没用到)  
 |---- src      
 |------ main  事件处理 (electron main 事件监听和处理)  
 |------ renderder 交互 (electron renderer 页面显示)   
 |---- test  
 |-- gulpfile.js gulp 文件 对项目的压缩、打包。  
 |-- package.json 主程序入口   

 程序运行时临时文件、以及退出时保存的token会存放的地址根据运行环境所决定。 如下:  
  OS X: /Users/XXXX/Library/Application Support/Electron   
  Window: C:\Users\XXXX\AppData\Roaming\Electron


## 客户端 - 基于 electron
- cd cli/cli/
- 运行 npm run dev 启动开发环境
- 运行 npm run test 启动测试环境
- 运行 npm run prod 启动生产环境


## main - electron 主进程所跑的东西
- account 是用户模块
- window.js 创建渲染窗口
- token.js 检查 token 状态
- strong.js 本地数据持久化
- events.js 事件处理

## main.js - electron 启动文件
package.js - 包含各种所需模块以及项目的配置信息(名称、版本、许可证等)。 包含可配置项 name 名称 应用描述 description 版本号

## 客户端打包 - 未开始


## gulp 使用方法
npm install gulp -g 全局安装gulp

npm install 安装gulp依赖库,配置在package.json中

gulp copy
删除临时文件并拷贝源码到 build/sougang 目录下

gulp build -p=prod (test/dev)
electron打包,会先调用copy,文件在build/release下, 第一次会下载electron包,比较慢
