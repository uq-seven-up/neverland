const gulp = require('gulp');
const {series} = require('gulp');
const ts = require('gulp-typescript');
const jestcli = require('jest-cli');

function defaultTask(cb){
        cb();
}

function make(cb){
        var tsProject = ts.createProject('tsconfig.json');
        var tsResult = gulp.src(["src/**/*.tsx","src/**/*.ts","!src/**/*test.tsx","!src/**/*test.ts"]).pipe(tsProject());
        tsResult.js.pipe(gulp.dest('./dist'));
        tsResult.dts.pipe(gulp.dest('./dist'));
        cb();
}

function test(cb){
        jestcli.runCLI({config:{rootDir:'test/unit/'}},'.',(done) => {
                done();
        });
        cb();
}


exports.make = make;
exports.test = test;
exports.build = series(make,test);
