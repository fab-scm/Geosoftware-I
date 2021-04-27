let array2 = [5, 6, 7, 8]
let array1 = [1, 2, 3, 4]

function sumFlexible ()
{
 let input = Array.from(arguments)
 return input.reduce((a, b) => a + b, 0)
}

console.table(array2.reduce((a,b,i,c) => a + b + i + c[i], 0))
let array = Array.from([1,2,3,4,5], x => x*x)
console.table(array)
console.log(sumFlexible(1, 2))
console.log(sumFlexible(1, 2, 3))
console.log(sumFlexible(...array2))