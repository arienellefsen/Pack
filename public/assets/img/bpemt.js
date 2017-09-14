var double = function (n) {
    return n * 2;
};
var triple = function (n) {
    return n * 3;
};
var b = a.map(double);
// map an array a to a new array b using the function double
// b = [2, 4, 6, 8, 10];
var c = a.map(triple);
// c = [3, 6, 9, 12, 15];

var d = a.map(sqroot);
// d = [1, 6, 9, 12, 15];

function map(arr, x ){
var a = [1, 2, 3, 4, 5];
this.arr;
var result=[];
    
    for(var i=0; i< arr.lenght; i++){
        
       result = arr[i] x;
       result.push(x(arr[i]));
       result.push(arr[i] * multiply);
      
    }
    
           return result;
}
map();
a.map(x);


b = map(a, double);

// Wrapper should appear over top of the contents and make it opaque
// Dialog should be cnetered in the screen
<style>

.modal-wrapper{
width:100%
height:100%;
background-color:#999;
opacity(0.7);
z-index: 10;
position: absolute;
}
.modal-dialog{
margin: 0px auto;
width:50%
height:80%;
background-color:#ccc;
z-index: 1;
}

</style>
<body>
Some content here...
<div class="modal-wrapper">
    <div class="modal-dialog">
        Some dialog content here...
    </div>
</div>
</body>