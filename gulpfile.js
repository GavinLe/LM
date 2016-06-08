
var gulp = require('gulp');
var electron = require('gulp-electron');
var pkg = require('./package.json');
var del = require('del');
var uglify = require('gulp-uglify');
var debug = require('gulp-debug');
var replace = require('gulp-replace');
var obfuscate = require('gulp-obfuscate');
var rename = require('gulp-rename');
var zip = require('gulp-zip');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;

var env = 'TEST';
if (gulp.env.env && (gulp.env.env == 'prod' || gulp.env.env == 'prod'.toUpperCase())) {
    env = 'PROD';
}
else if (gulp.env.env && (gulp.env.env == 'test' || gulp.env.env == 'test'.toUpperCase())) {
    env = 'TEST';
}
else if (gulp.env.env && (gulp.env.env == 'dev' || gulp.env.env == 'dev'.toUpperCase())) {
    env = 'DEV';
}
else{
    console.log('unknown arg env, should be use gulp --env prod (test, dev), set to prod default.');
}

// build target dir
const BUILD_TARGET = './build/'+ pkg.name + '/';

console.log('build with env = ', env);

// error..
gulp.task('clean-main',['copy-js'], function() {
    del.sync([BUILD_TARGET+'src/main/main.js']);
});

gulp.task('copy-main', ['clean-main'], function(){
    gulp.src('gulp_config/'+ env + '/main.js', {"base": "."})
        .pipe(rename({
            dirname: "src/main"
        }))
        //.pipe(uglify())
        .pipe(gulp.dest(BUILD_TARGET));
});


gulp.task('copy-js', function () {
    return gulp.src(['src/renderer/js/**/*.js', 'src/main/**/*.js'], { "base" : "." })
        //.pipe(uglify())  // 压缩
        // .pipe(obfuscate()) // 混淆
        .pipe(gulp.dest(BUILD_TARGET));
});
gulp.task('copy-all', function () {
    return gulp.src(['resources/*','src/main/**/*','src/renderer/css/**/*', 'src/renderer/icon/**/*', 'src/renderer/libs/**/*', 'src/renderer/tpl/**/*', 'package.json'], { "base" : "." })
        .pipe(gulp.dest(BUILD_TARGET));
});

gulp.task('clean', function() {
    del.sync(['build/'+ pkg.name +'/**']);
    del.sync(['build/release/v' + pkg.version + '/**']);
});

gulp.task('copy', ['clean', 'copy-js', 'copy-all','copy-main'], function () {
});

gulp.task('npm-dep', ['copy'], function () {
    exec(`cd build/${pkg.name} && npm install  --production && cd ../../`,
        function (err, stdout, stderr) {
        });
});

gulp.task('build', function() {

    gulp.src("")
    .pipe(electron({
        src: './build/' + pkg.name,
        packageJson: pkg,
        release: './build/release/v' + pkg.version,
        cache: './build/cache',
        version: 'v'+pkg.electronVersion,
        packaging: false,
        //asar: true,
        // token: undefined,
        platforms: ['win32-ia32','win32-x64'],
        platformResources: {
            darwin: {
                CFBundleDisplayName: pkg.displayName,
                CFBundleIdentifier: pkg.name + pkg.version,
                CFBundleName: pkg.name,
                CFBundleVersion: pkg.version,
                // icon: 'gulp-electron.ico'
            },
            win: {
                "version-string": pkg.version,
                "file-version": pkg.version,
                "product-version": pkg.version,
                // "icon": 'gulp-electron.ico'
            }
        }
    }))
    .pipe(gulp.dest(""));
});


gulp.task('default', ['npm-dep'], function(){
    console.log("copy success");
});

gulp.task('package-upload', ['npm-dep'], function(){});
