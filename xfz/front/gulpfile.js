var gulp = require("gulp");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var cssnano = require("gulp-cssnano");

var uglify = require("gulp-uglify");
var concat = require("gulp-concat");

const connect = require('gulp-connect')


var path = {
    'html': './templates/**/',
    'css': './src/css/**/',
    'js': './src/js/',
    'images': './src/images/',
    'css_dist': './dist/css/',
    'js_dist': './dist/js/',
    'images_dist': './dist/images/'
};

// 处理html文件的任务
gulp.task("html",function () {
    gulp.src(path.html + '*.html')
        .pipe(gulp.dest('dist/'))
        .pipe(connect.reload())
});

// 定义一个css的任务
gulp.task("css",function () {
    // gulp.src(path.css + '*.scss')
    gulp.src([path.css + '*.css', path.css + '*.scss'])
        .pipe(sass().on("error",sass.logError))
        .pipe(cssnano())
        .pipe(rename({"suffix":".min"}))
        .pipe(gulp.dest(path.css_dist))
        .pipe(connect.reload())
});

// 定义处理js文件的任务
gulp.task("js",function () {
    gulp.src(path.js + '*.js')
        .pipe(uglify())
        .pipe(rename({"suffix":".min"}))
        .pipe(gulp.dest(path.js_dist))
        .pipe(connect.reload())
});

// 定义处理图片文件的任务
gulp.task('images',function () {
    gulp.src(path.images + '*.*')
        // .pipe(cache(imagemin())) // 没有压缩，直接放到指定目录中
        .pipe(gulp.dest(path.images_dist))
        .pipe(connect.reload())
});

// 定义监听文件修改的任务
gulp.task("watch",function () {
    gulp.watch(path.html + '*.html',['html']);
    // gulp.watch(path.css + '*.scss',['css']);
    // gulp.watch(path.css + '*.css',['css']); // ok

    gulp.watch([path.css + '*.css', path.css + '*.scss'],['css']);

    gulp.watch(path.js + '*.js',['js']);
    gulp.watch(path.images + '*.*',['images']);
});

// 初始化server的任务
gulp.task("server", function(){
    connect.server({
        root: './', // 设置根目录
        port: 8888, // 设置端口
        livereload: true, // 实时刷新功能
    })
})


// 创建一个默认的任务
gulp.task("default", ['server','watch']);