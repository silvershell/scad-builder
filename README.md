# scad-builder-proj

Tools for scad-builder project.

## Installation

```bash
npm install scad-builder-proj
```

## Project Example

Project files as follows:

- src
  - main.js
- scad
  - util.scad
- build.yml
- gulpfile.js
- package.json


gulpfile.js :

```javascript

const scadBuilderProj = require('scad-builder-proj');

scadBuilderProj.gulpSetup();

```

build.yml :

```javascript

defaults:
  header: "// header : scad-builder test"
  footer: "// footer"
  include: 
  - ./lib/util.scad
models:

- dest: sample1
  module: main
  func: sample1

- dest: sample2
  module: main
  func: sample2

```


.gitignore :

```javascript

.DS_Store
node_modules/
build/

```


scad/util.scad : 

```scad

module SSThread(
  h=10,     // length
  d=3,      // diameter
  p=0.5,    // pitch
  a=60     // angle
){
  cylinder(h=h, d=d);
}

```


src/main.js :

```javascript

const {
  call, comment, func, generateScad, GeneratorScad, genImportSrc, 
  square, circle, scircle, polygon, 
  cube, sphere, cylinder, polyhedron, 
  union, difference, intersection, 
  translate, scale, rotate, mirror, 
  multmatrix, minkowski, hull, 
  linear_extrude, rotate_extrude, color, text, 
} = require('scad-builder');


function sample1(){
    let p = {
        d: 11.5 + 0.8,
        h: 5 + 0.4,
        l: 10,
    }

    let ds = p.d*Math.sin(60*Math.PI/180);

    let model =
    union([
        cylinder({d:p.d, h:p.h, fn:6}),
        translate([0,-ds/2,0], [
            cube([p.l, ds, p.h])
        ]),
    ])

    return model;
}


function sample2(){
    return cylinder({d:4, h:20, fn:6});
}


module.exports = {
    sample1,
    sample2,
};


```

### Build

```bash

gulp build

```

or


```bash

gulp watch

```

### Result

Output files as follows:

- build
  - sample1.scad
  - sample2.scad
  - util.scad

sample1.scad:

```scad

// header : scad-builder test

include <./lib/util.scad>

union(){
  cylinder(d=12.3,h=5.4,$fn=6);
  translate([0,-5.326056233274298,0]){
    cube([10,10.652112466548596,5.4]);
  }
}

// footer

```

sample2.scad:

```scad

// header : scad-builder test

include <./lib/util.scad>

cylinder(d=4,h=20,$fn=6);

// footer

```

### scad/util.scad

```scad

module SSThread(
  h=10,     // length
  d=3,      // diameter
  p=0.5,    // pitch
  a=60     // angle
){
  cylinder(h=h, d=d);
}

```


## Copyrights

Some copyrights apply. Copyright (c) 2017 Mitsuaki Fujii (silvershell100@gmail.com), under the MIT license. 


## License

The MIT License (MIT) (unless specified otherwise)
