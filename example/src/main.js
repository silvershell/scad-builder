const {
  call, comment, func, generateScad, GeneratorScad, genImportSrc, 
  square, circle, scircle, polygon, 
  cube, sphere, cylinder, polyhedron, 
  union, difference, intersection, 
  translate, scale, rotate, mirror, 
  multmatrix, minkowski, hull, 
  linear_extrude, rotate_extrude, color, text, 
} = require('scad-builder-core');


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
