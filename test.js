console.log(Processing.random());
console.log(new Processing().random());
console.log(new Processing().PVector.random2D(new Processing));
console.log(Processing.prototype.PVector.random3D() + "");
console.log(new Processing);
console.log(new Processing().NOCURSOR);
console.log(Processing.PROJECT);
var arr = new Processing().PVector.random3D().get([4, 3, 6, 6]);
arr[13] = 7;
console.info(arr);
function q() {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i - 0] = arguments[_i];
    }
    var t = new Processing().PVector.random3D().get(arguments);
    console.info(t);
}
q('tdfgfdgfd', 'tdfgfdgfd', 'tdfgfdgfd', 'tdfgfdgfd');
pjs.classes.PVector.random2D();
Processing.PVector.random3D();
Processing.sq(6);
var pa = new Processing;
pa.random = function () { return 10; };
pa.sq = function (n) { return n * n * n; };
console.log(new pa.PVector(pa.PI, pa.TAU).fromAngle(90));
var prop = 'PVector';
pa[prop] = Processing.PVector;
