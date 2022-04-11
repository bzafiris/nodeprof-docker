var obj = require("./module.js");

console.log(obj)
var p = 1;

function foo(obj) {
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

foo(obj);
var t = new T();    

for (var i = 0; i < 2; i++) {
    t.r(obj);
    t.f(obj);  
    t.f = bar;
}