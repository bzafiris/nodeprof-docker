module.exports = {
    a: 1,
    b: 2,
    f: function(){
        console.log(this.a + this.b);
        return this.a + this.b;
    }
}

