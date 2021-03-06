'use strict'

let gulp = require('gulp'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	sourceMaps = require('gulp-sourcemaps'),
	sass = require('gulp-sass'),
	plumber = require('gulp-plumber'),
	cleanCss = require('gulp-clean-css'),
	Server = require('karma').Server,
	eslint = require('gulp-eslint')


let scripts = [
	'frontend/src/app.js',
	'frontend/src/app.config.js',
	'frontend/src/app.route.js',
	'frontend/src/**/*.js'
]
gulp.task('transpile', ['lint'], () => {
	return gulp.src(scripts)
             .pipe(plumber())
             .pipe(sourceMaps.init())
             .pipe(babel({ presets: ['latest'] }))
             .pipe(concat('scripts.js'))
             .pipe(sourceMaps.write('./maps'))
             .pipe(gulp.dest('./frontend/build'))
})

gulp.task('sass', () => {
	return gulp.src('frontend/styles/styles.scss')
             .pipe(plumber())
             .pipe(sourceMaps.init())
             .pipe(sass({ includePaths: require('node-bourbon').includePaths}))
             .pipe(cleanCss())
             .pipe(sourceMaps.write('./maps'))
             .pipe(gulp.dest('./frontend/build/'))
})

gulp.task('watch', () => {
	gulp.watch('frontend/src/**/*.js', ['transpile'])
	gulp.watch(['frontend/styles/**/*.scss', 'frontend/src/**/*.scss'], ['sass'])
})

gulp.task('unit-test', (done) => {
	new Server({
		configFile: __dirname + '/karma.conf.js'
	}, () => {
		done()
	}).start()
})

gulp.task('lint', () => {
	return gulp.src(['./*.js', 'frontend/**/*.js', '!frontend/build/**/*.js', 'test/**/*.js', '!test/coverage/**/*.js'])
             .pipe(eslint())
             .pipe(eslint.format())
             .pipe(eslint.failAfterError())
})

gulp.task('default', ['sass', 'transpile', 'watch'])
gulp.task('build', ['sass', 'transpile'])
