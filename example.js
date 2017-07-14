const {
  call, comment, func, generateScad, GeneratorScad, genImportSrc, 
  square, circle, scircle, polygon, 
  cube, sphere, cylinder, polyhedron, 
  union, difference, intersection, 
  translate, scale, rotate, mirror, 
  multmatrix, minkowski, hull, 
  linear_extrude, rotate_extrude, color, text, 
} = require('scad-builder');


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


let genParam = {
    header: "// header : scad-builder test ",
    footer: "// footer",
    include: [
        './util.scad',
    ],
    model: model
};

let scadStr = generateScad(genParam);

console.log(scadStr);