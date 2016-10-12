var gulp = require("gulp");
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');

var distDir = "dist";
var jsPath = 'src/**/*.js';
var cssPath = 'src/**/*.css';

gulp.task('lint', function() {
	return gulp.src(jsPath)
			.pipe(jshint())
			.pipe(jshint.reporter('default'));
});

gulp.task("copy", function () {
	return gulp.src([jsPath, cssPath]).pipe(gulp.dest(distDir));
});

gulp.task('compressJS', function() {
	return gulp.src(jsPath)
			.pipe(uglify())
			.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest(distDir))
});

gulp.task('cleanCSS', function() {
	return gulp.src(cssPath)
			.pipe(cleanCSS({compatibility: 'ie8'}))
			.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest(distDir))
});

gulp.task("minify", function () {
	gulp.start("compressJS", "cleanCSS");
});

gulp.task('default', function() {
	gulp.start('lint', 'copy', 'minify');
});
