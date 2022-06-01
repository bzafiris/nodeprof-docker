
var obj = require("./module.js");
var mathjs = require('mathjs');

var m = mathjs.evaluate('12 / (2.3 + 0.7)');
var m2 = mathjs.evaluate('12.7 cm to inch');

let l = mathjs.log(10000, 10);

console.log('log ' + l);

(function(f){
    return f(1, 2);
})((a, b) => a + b);


console.log(obj)
var p = 1;
let sum = (a, b) => a + b;

let foo = function(obj) {
    p = obj.a + obj.b;
    return p;
}
function bar(b) {
    return b;
}
function baz(c) {
    this.f(c);
}
function T() {
    this.f = foo;
    this.r = baz;
}

obj.f();
foo(obj);
Math.round(3.14)
let sum2 = sum;
let x = sum(1, 2)
let y = sum2(2, 3)
var t = new T();    

for (var i = 0; i < 2; i++) {
    t.r(obj);
    t.f(obj);  
    t.f = bar;
}