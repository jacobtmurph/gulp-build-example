const gulp = require('gulp');
const concat = require('gulp-concat');
const del = require('del');
const maps = require('gulp-sourcemaps');
const minifycss = require('gulp-uglifycss');
const minifyjs = require("gulp-uglify");
const optimizeImages = require('gulp-imagemin')
const rename = require('gulp-rename');
const sass = require("gulp-sass");
const staticServer = require('static-server');

gulp.task("scripts", () => {
    gulp.src(['js/**/*.js'])
    .pipe(maps.init())
    .pipe(concat('all.min.js'))
    .pipe(minifyjs())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task("styles", () => {
    gulp.src(['sass/global.scss'])
    .pipe(maps.init())
    .pipe(sass())
    .pipe(rename('all.min.css'))
    .pipe(minifycss())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('dist/styles'));
});

gulp.task("images", () => {
    gulp.src(['images/*'])
    .pipe(optimizeImages({progressive: true}))
    .pipe(gulp.dest('dist/content'));
});

gulp.task("clean", () => {
    del(['dist/*']);
});

gulp.task("build", ['clean'], () => {
    return gulp.start("scripts", "styles", "images");
});

gulp.task("default", ["build"], () => {
    const server = new staticServer({
        rootPath: '.',
        port: 3000
    });

    server.start(() => console.log('Server listening to', server.port));

    gulp.watch("sass/**/*.scss", ["styles"]);
});