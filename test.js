const express = require('express');
const app = express();
let {PythonShell} = require("python-shell");


var fruits = ["78161701", "76450406", "76450444", "76450137", "76450890"];
var startDate = "20221001";
var endDate = "20221030"
 
// Iterates over array elements
for(var i = 0; i < fruits.length; i++){    
    var payLoad = fruits[i] + "," + startDate + "," + endDate
    console.log(payLoad); // Print array element
}

// .forEach(function(line, index, arr) {
//     if (index === arr.length - 1 && line === "") { return; }
//     console.log(index + " " + line);
//   });
//   console.log("end");