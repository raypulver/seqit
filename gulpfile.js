var gulp = require('gulp'), uglify = require('gulp-uglify'), rename = require('gulp-rename');
gulp.task('default', [], function () {
  gulp.src('./seqit.js').pipe(uglify()).pipe(rename('seqit.min.js')).pipe(gulp.dest('./'));
});
