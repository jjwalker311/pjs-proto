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
function q() { var t = new Processing().PVector.random3D().get(new Float32Array(10)), h = t; }
