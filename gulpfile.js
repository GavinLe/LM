
var gulp = require('gulp');
var electron = require('gulp-electron');
var packageJson = require('./package.json');
var del = require('del');
var uglify = require('gulp-uglify');
var debug = require('gulp-debug');
var replace = require('gulp-replace');
var argv = require('yargs').argv;

var env = 'PROD';
if (argv.p == 'prod') {
    env = 'PROD';
}
else if (argv.p == 'test') {
    env = 'TEST';
}
else if (argv.p == 'dev') {
    env = 'DEV';
}
else{
    console.log('unknown arg p, should be prod/test/dev, set to prod default.');
}
// build target dir
const BUILD_TARGET = './build/'+ packageJson.name + '/';

console.log('build with env = ', env);

// error....
gulp.task('copy-npm', function () {
    return gulp.src(['node_modules/**/*', '!node_modules/electron-prebuilt/**/*'])
        // .pipe(debug())
        .pipe(gulp.dest(BUILD_TARGET + 'node_modules/'));
});

gulp.task('copy-js', function () {
    return gulp.src(['src/renderer/js/**/*.js', 'src/main/**/*.js'], { "base" : "." })
        .pipe(uglify())
        .pipe(gulp.dest(BUILD_TARGET));
});

gulp.task('copy-all', function () {
    return gulp.src(['resource/**/*','src/main/**/*','src/renderer/css/**/*', 'src/renderer/icon/**/*', 'src/renderer/libs/**/*', 'src/renderer/tpl/**/*', 'package.json'], { "base" : "." })
        .pipe(gulp.dest(BUILD_TARGET));
});

gulp.task('clean', function() {
    del.sync(['build/'+ packageJson.name +'/**']);
    del.sync(['build/release/v' + packageJson.version + '/**']);
});

gulp.task('copy', ['clean', 'copy-js', 'copy-all', 'copy-npm'], function () {
});

gulp.task('build', ['copy'], function() {

    gulp.src("")
    .pipe(electron({
        src: './build/' + packageJson.name,
        packageJson: packageJson,
        release: './build/release/v' + packageJson.version,
        cache: './build/cache',
        version: 'v0.37.5',
        packaging: true,
        // token: undefined,
        platforms: ['win32-ia32','win32-x64', 'darwin-x64'],
        platformResources: {
            darwin: {
                CFBundleDisplayName: packageJson.name,
                CFBundleIdentifier: packageJson.name,
                CFBundleName: packageJson.name,
                CFBundleVersion: packageJson.version,
                // icon: 'gulp-electron.ico'
            },
            win: {
                "version-string": packageJson.version,
                "file-version": packageJson.version,
                "product-version": packageJson.version,
                // "icon": 'gulp-electron.ico'
            }
        }
    }))
    .pipe(gulp.dest(""));
});

gulp.task('default', ['build'] , function () {});
