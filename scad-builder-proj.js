"use strict";

const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

const fsex = require('fs-extra');
const _ = require('lodash');
const yaml = require('js-yaml');

// const gulp = require('gulp');
const gulp = require('gulp-help')(require('gulp'));
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const shell = require('gulp-shell');
const reload = require('require-reload')(require);

const scadbuilder = require('scad-builder');

// #scad-builder:begin
const {
    call, generateScad, GeneratorScad, 
    square, circle, scircle, polygon, cube, sphere, cylinder, polyhedron, 
    union, difference, intersection, translate, scale, rotate, mirror, 
    multmatrix, minkowski, hull, linear_extrude, rotate_extrude, 
    color, text,
} = require('scad-builder');
// #scad-builder:end


// ---------------

const outputDirPath = 'build'
const srcPath = './src'
const buildJsPath = './build.js'
const buildYmlPath = './build.yml'
const scadDirPath = './scad'
const outputStlDirPath = path.join(outputDirPath, 'stl');

// ---------------

function writeScadFile(filepath, model){
    let scad = generateScad(model);
    fs.writeFileSync(filepath, scad, 'utf8');
}


function loadBuildFile(){
    let buildInfo;

    if( fs.existsSync(buildJsPath) ){
        buildInfo = reload(buildJsPath).buildInfo();

    }else if( fs.existsSync(buildYmlPath) ){
        let ymlStr = fs.readFileSync('./build.yml');
        buildInfo = yaml.safeLoad(ymlStr);
        
    }else{
        throw 'build file not found. build.yml or build.js must be exists.'
    }
    
    for( let m of buildInfo.models ){
        if( !m.model ){
            let module = reload( path.resolve('./'+ path.join(srcPath, m.module)) );
            m.model = module[ m.func ];
        }
    }

    return buildInfo
}


function list(){
    let l = loadBuildFile();

    _.each(l, (v,i) => {
        console.log(v.path);
    })
}

function mergeArrayAdd(dst,src){
  _.merge(dst, src, function(a, b) {
    if (_.isArray(a)) {
      return _.cloneDeep(a).concat(b);
    }
  });
  return dst
}


function buildFromBuildInfo(buildInfo)
{
    fsex.mkdirsSync(outputDirPath);
    fsex.copySync(scadDirPath, outputDirPath);
    
    let defaults = buildInfo.defaults ? buildInfo.defaults : {};

    _.each(buildInfo.models, (v,i) => {
        
        let buildEnt = _.cloneDeep(defaults);
        mergeArrayAdd(buildEnt, v);
        
        // console.log(JSON.stringify(buildEnt,null,'  '));

        writeScadFile(
            path.join(outputDirPath, buildEnt.dest) + '.scad',
            buildEnt
        );
    });
}


function buildStlFromBuildInfo(buildInfo){
    fsex.mkdirsSync(outputStlDirPath);

    let defaults = buildInfo.defaults ? buildInfo.defaults : {};
        
    _.each(buildInfo.models, (v,i) => {
        
        let buildEnt = _.cloneDeep(defaults);
        mergeArrayAdd(buildEnt, v);
        
        let scadFile = path.join(outputDirPath, buildEnt.dest) + '.scad';
        let stlFile = path.join(outputStlDirPath, buildEnt.dest) + '.stl';

        child_process.spawnSync('openscad', ['-o', stlFile, scadFile]);
    });
}


function build(){
    // console.log('build()');
    let buildInfo = loadBuildFile();
    buildFromBuildInfo(buildInfo);
    return buildInfo
}


function buildStl(){
    let buildInfo = build();
    buildStlFromBuildInfo(buildInfo);
}


function clean(){
    fsex.removeSync(outputDirPath);
}


function genShFromPackageJson(_path){
  let jsonStr = fs.readFileSync(_path)
  let json = JSON.parse(jsonStr)

  let dependencies = [];
  if( json.dependencies ){
    dependencies = Object.keys(json.dependencies);
    dependencies.sort();
  }

  let devDependencies = [];
  if( json.devDependencies ){
    devDependencies = Object.keys(json.devDependencies);
    devDependencies.sort();
  }

  let s = "#!/bin/bash\n\n";

  s += 'npm install --save';
  _.each( dependencies, (v) => {
    s += " " + v;
  });
  s += "\n";

  s += 'npm install --save-dev';
  _.each( devDependencies, (v) => {
    s += " " + v;
  });
  s += "\n";

  console.log(s);
}


function genImportSrc(){
    scadbuilder.genImportSrc();
}


function gulpWatch(){
    return watch( path.join(srcPath, '**/*'), function () {
        console.log('watch:build');
        
        let res = child_process.spawnSync('gulp', ['build'], {
            encoding: 'utf8',
        });
        
        if( res.stderr ){
            console.log( res.stderr );
        }
    });
}

// ---------------

function gulpSetup()
{
    gulp.task('build', 'Build scad files.', function () {
        build();
    });

    gulp.task('buildStl', 'Build scad and stl files.', function () {
        buildStl();
    });
    
    gulp.task('clean', 'Clean output files to build.', function () {
        clean();
    });

    gulp.task('list', 'Print build buildInfo list.', function () {
        list();
    });

    gulp.task('genShFromPackageJson', 'Generate bash script to reinstall dependent package.', function () {
        genShFromPackageJson('./package.json');
    });

    gulp.task('genImportSrc', 'Generate import JS code for jscad source.', function () {
        genImportSrc();
    });

    gulp.task('watch', 'Watch src directory.', ['build'], function () {

        //   // for web viewer
        //   gulp.src('.')
        //     .pipe(webserver({
        //       livereload: true,
        //       directoryListing: true
        //     }));

        return gulpWatch();
    });

    gulp.task('default', ['watch']);
}


module.exports = {
    writeScadFile,
    build,
    clean,
    list,
    genShFromPackageJson,
    gulpSetup,
    watch: gulpWatch,
};
