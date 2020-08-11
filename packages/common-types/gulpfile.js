var gulp = require('gulp');
var ts = require('gulp-typescript');

function defaultTask(cb){
	cb();
}

function build(cb){
	var tsProject = ts.createProject('tsconfig.json');
	var tsResult = gulp.src(["src/**/*.tsx","src/**/*.ts","!src/**/*test.tsx","!src/**/*test.ts"]).pipe(tsProject());
	tsResult.js.pipe(gulp.dest('./dist'));
	tsResult.dts.pipe(gulp.dest('./dist'));
	
	gulp.src('src/styles/*.css').pipe(gulp.dest('dist/styles/'));
	cb();
}

exports.build = build;
//exports.default = defaultTask

