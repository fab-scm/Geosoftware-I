let array1 = [1,2,3,4]
let array2 = [5,6,7,8]
let combined1 = array1.concat(array2)
let combined2 = [...array1, ...array2]

console.log(combined1)
console.log(combined2)

function sum(num1, num2, num3, num4)
{
    return num1 + num2 + num3 + num4
}

console.log(sum(...array1))
console.log(sum(1,2,3)) // 6 + undefined = NaN