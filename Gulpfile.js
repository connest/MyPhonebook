var gulp = require('gulp'), // Сообственно Gulp JS
    myth = require('gulp-myth'), // Плагин для Myth - http://www.myth.io/
    csso = require('gulp-csso'), // Минификация CSS
    uglify = require('gulp-uglify'), // Минификация JS
    browserify = require('gulp-browserify'), //  JS бля браузеров
    babel = require('gulp-babel'), // ES6 JS
    del = require('del')


gulp.task('clear', async function() {
    return del(['./build'])
});

gulp.task('directories', async function() {
    return gulp.src('*.js', {read: false})
        .pipe(gulp.dest('./build/'))
        .pipe(gulp.dest('./build/static'))
        .pipe(gulp.dest('./build/static/scripts'))
        .pipe(gulp.dest('./build/static/images'))
        .pipe(gulp.dest('./build/static/css'))
});

// gulp.task('build:html', async function() {
//     return gulp.src('./src/**/*.html')
//         .pipe(gulp.dest('./build/'))
// });

gulp.task('build:css', async function() {
    return gulp.src('./src/**/*.css')
        .pipe(myth())
        .pipe(csso())
        .pipe(gulp.dest('./build/'))
});
gulp.task('build:js:browser', async function() {
    return gulp.src('./src/clientsidescripts/**/*.js')
        .pipe(browserify())
        .pipe(babel({
            presets: ["@babel/preset-env"]
        }))
        .pipe(uglify().on('error', function(e){
            console.log(e);
        }))
        .pipe(gulp.dest('./build/static/scripts'))
});
gulp.task('build:js:server', async function() {
    return gulp.src(['./src/**/*.js', '!./src/clientsidescripts/**/*.js'])
        .pipe(gulp.dest('./build/'))
});
gulp.task('build:static', async function() {
    return gulp.src(['./src/**/*.*', '!./src/**/*.{js,css}'])
        .pipe(gulp.dest('./build/'))
});

gulp.task('build',
    gulp.series(
        'directories',
        gulp.parallel(
            'build:css',
            'build:js:browser',
            'build:js:server',
            'build:static'
        )
    )
);


gulp.task('watch', function () {
    gulp.series('build')

    gulp.watch(
        './src/**/*.js',
        {ignored: './src/clientsidescripts/**/*.js'},
        gulp.series('build:js:server')
    );
    gulp.watch(
        './src/clientsidescripts/*.js',
        gulp.series('build:js:browser')
    );
    gulp.watch(
        './src/**/*.css',
        gulp.series('build:css')
    );
    gulp.watch(
        './src/**/*.*',
        {ignored: './src/**/*.{js,css}'},
        gulp.series('build:static')
    );
})