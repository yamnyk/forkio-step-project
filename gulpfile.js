let gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    pump = require('pump'),
    uglify = require('gulp-uglify-es').default,
    clean = require('gulp-clean'),
    imgMin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require("gulp-rename");

gulp.task('copy-html',()=>{
    return gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./dist/'));
});

//JS TASKS
gulp.task('clean-js', ()=> {
    return gulp.src('./dist/js/script.min.js', {read: false})
        .pipe(clean());
});

gulp.task('concat-js', ['clean-js'],()=>{
    return gulp.src('./src/js/**/*.js')
        .pipe(concat('script.js'))
        .pipe(gulp.dest('./dist/js/'))
});

gulp.task('minify-js', ['concat-js'], (cb) => {
    pump([
            gulp.src('./dist/js/script.js'),
            clean(),
            uglify(),
            rename(function (path) { // function of rename extname for .css
                path.extname = ".min.js";
            }),
            gulp.dest('./dist/js/')
        ],
        cb
    );
});

// gulp.task('copy-js', ['minify-js'],()=>{
//     return gulp.src('./dist/js/**/script.js')
//         .pipe(gulp.dest('./dist/js/'));
// });

//CSS TASKS
gulp.task('clean-css', ()=> {
    return gulp.src('./src/css/', {read: false})
        .pipe(clean());
});

gulp.task('sass',['clean-css'], ()=> {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css/'));
});

gulp.task('autoprefix', ['sass'], ()=> {
    return gulp.src('./src/css/**/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./src/css/'))
});

gulp.task('concat-css', ['autoprefix'], ()=>{
    return gulp.src('./src/css/**/*.css')
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./src/css/'));
});

gulp.task('minify-css', ['concat-css'], ()=>{
    return gulp.src('./src/css/style.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./src/css/'));
});

gulp.task('copy-css', ['minify-css'], () => {
    return gulp.src('./src/css/style.css')
        .pipe(rename(function (path) { // function of rename extname for .css
            path.extname = ".min.css";
        }))
        .pipe(gulp.dest('./dist/css/'))
});

//SERVER
gulp.task('serve', ['copy-html', 'copy-css', /*'copy-js'*/'minify-js', 'minify-img'], () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });

    gulp.watch('./src/**/*.html',['copy-html']).on('change',browserSync.reload);
    gulp.watch('./src/scss/**/*.scss',['copy-css']).on('change',browserSync.reload);
    gulp.watch('./src/js/**/*.js', ['minify-js']).on('change',browserSync.reload);
});

//CLEAN DIST
gulp.task('clean-dist', () => {
    return gulp.src('./dist/', {read:false})
        .pipe(clean());
});

gulp.task('dev',['clean-dist'], ()=>{
    gulp.start('serve');
});

gulp.task('build',['clean-dist'], ()=>{
    gulp.start('copy-html');
    gulp.start('copy-css');
    gulp.start('copy-js');
    gulp.start('minify-img');
});

//IMAGES
gulp.task('minify-img', () => {
    return gulp.src('src/img/**/*')
        .pipe(imgMin())
        .pipe(gulp.dest('dist/img'))
});

//PLUGINS
gulp.task('copy-plugins',() => {
    gulp.src('./src/plugins/**/*')
        .pipe(gulp.dest('./dist/plugins/'));
});