let x = 5, y = 10

let anonymousFunction = function(a,b)
{
    return a + b
}

let arrowAnonymousFunction = (a, b) => a + b

console.log(anonymousFunction(x, y))
console.log(arrowAnonymousFunction(x,y))