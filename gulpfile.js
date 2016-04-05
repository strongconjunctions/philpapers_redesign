var gulp               = require('gulp'),
        sass           = require('gulp-sass'),
        browserSync    = require('browser-sync'),
        clean          = require('gulp-clean'),
        cssmin         = require('gulp-minify-css'),
        concat         = require('gulp-concat'),
        plumber        = require('gulp-plumber'),
        imagemin       = require('gulp-imagemin'),
        uglify         = require('gulp-uglify'),
        //jshint         = require('gulp-jshint'),
        sourcemaps     = require('gulp-sourcemaps'),
        jshintStylish  = require('jshint-stylish'),
        autoprefix     = require('gulp-autoprefixer');



// ERROR LOG
function errorLog(error) {
    console.error.bind(error);
    this.emit('end');
}


// JS TASKS
gulp.task('scripts', function(){
    gulp.src('./src/js/**/*.js')
        .pipe(sourcemaps.init()) // process the original sources
        .pipe(concat('scripts.js')) // the name of the file in which all of your scripts will be concatenated
        .pipe(uglify())
        .on('error', errorLog)
        .pipe(sourcemaps.write()) // add the map to modified source
        .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.reload({ stream: true }));
});


// JSHINT
//gulp.task('jshint', function(){
    //return gulp.src('./src/js/**/*.js')
    //    .pipe(jshint())
  //      .pipe(jshint.reporter('jshint-stylish'));
//});


// SASS TO CSS BUILD TASK
gulp.task('sass', function () {
gulp.src('./src/sass/index.sass')
    .pipe(sourcemaps.init()) // process the original sources
    .pipe(sass({indentedSyntax: true}))
    .on('error', errorLog)
    .pipe(plumber())
    .pipe(autoprefix('last 10 versions'))
    .pipe(cssmin())
    .pipe(gulp.dest('./build/css'))
    .pipe(sourcemaps.write()) // add the map to modified source
    .pipe(browserSync.reload({ stream: true }));
});



// IMAGE MINIFICATION TASK
gulp.task('imagemin', function(){
    return gulp.src('./src/img/**/*')
      .pipe(imagemin())
      .pipe(gulp.dest('./build/img'));
});



// HTML BUILD TASK
gulp.task('copyIndex', function() {
 gulp.src('./src/index.html')
     .pipe(gulp.dest('./build'))
     .pipe(browserSync.reload({ stream: true }));
});



// BROWSER SYNC TASK
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: './build'
        }
    });
});



// WATCH TASK
gulp.task('watch', function() {
    gulp.watch('./src/index.html', ['copyIndex']);
    gulp.watch('./src/js/**/*.js', ['scripts']);
 //   gulp.watch('./src/js/**/*.js', ['jshint']);
    gulp.watch('./src/sass/**/*.{sass,scss}', ['sass']);
});



// CLEAN TASK
gulp.task('clean', function() {
    return gulp.src('./build', {read: false}) // the 'read: false' simply tells your clean task not to read the files' contents in order to delete them faster
        .pipe(clean());
});


// DEFAULT TASK
gulp.task('default', ['copyIndex', 'sass', 'scripts', 'imagemin', 'browserSync', 'watch']);