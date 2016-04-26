
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
else 
    console.log('unknown arg p, should be prod/test/dev, set to prod default.');

console.log('build with env = ', env);

// error....
gulp.task('copy-npm', function () {
    return gulp.src(['node_modules/**/*', '!node_modules/electron-prebuilt/**/*'])
        // .pipe(debug())
        .pipe(gulp.dest('./build/src/node_modules/'));
});

gulp.task('copy-main', function() {
   gulp.src('main.js', {"base": "."})
       .pipe(replace(/global.ENV[ =]*\S*;/gi, "global.ENV = '" + env + "';"))
       .pipe(gulp.dest('./build/src/'))
});

gulp.task('copy-js', function () {
    return gulp.src(['public/js/**/*.js', 'public/utils/**/*.js', 'main/**/*.js'], { "base" : "." })
        .pipe(uglify())
        .pipe(gulp.dest('./build/src/'));
});

gulp.task('copy-all', function () {
    return gulp.src(['public/css/**/*', 'public/icon/**/*', 'public/libs/**/*', 'public/tpl/**/*', 'env/**/*.json', 'data/dump', 'package.json'], { "base" : "." })
        .pipe(gulp.dest('./build/src/'));
});

gulp.task('clean', function() {
    del.sync(['build/src/**']);
    del.sync(['build/release/' + packageJson.version + '/**']);
});

gulp.task('copy', ['clean', 'copy-main', 'copy-js', 'copy-all', 'copy-npm'], function () {
});

gulp.task('build', ['copy'], function() {

    gulp.src("")
    .pipe(electron({
        src: './build/src',
        packageJson: packageJson,
        release: './build/release/' + packageJson.version,
        cache: './build/cache',
        version: 'v0.37.5',
        packaging: true,
        // token: undefined,
        platforms: ['win32-ia32', 'darwin-x64'],
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