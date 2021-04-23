console.log(Sum(1,2,3)) // 6+undefined = NaN
console.log(Sum(1,2,3,4,5)) // 10


let array2 = [5, 6, 7, 8]

function sumFlexible ()
{
 let input = Array.from(arguments)
 return input.reduce((a, b) => a + b, 0)
}

    // is equivalent to

function sumFlexible2(...args)
{
 return args.reduce((a, b) => a + b, 0)
}


sumFlexible(1, 2) // console.log(sumFlexible(1, 2))
sumFlexible(1, 2, 3) // console.log(sumFlexible(1, 2, 3))
sumFlexible(...array2) // console.log(sumFlexible(...array2))

console.log(sumFlexible2(1, 2, 3, 4, 5, 6, 7)) // 28
