var gulp   = require('gulp'),
	uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-minify-css');

gulp.task('default', function() {

	gulp.src('src/wa-mediabox.js')
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/'));

	gulp.src('src/wa-mediabox.css')
		.pipe(rename({suffix: '.min'}))
		.pipe(minifyCss())
		.pipe(gulp.dest('dist/'));

});
