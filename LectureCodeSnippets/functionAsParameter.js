function a()
{
 console.log("foo")
}

function b(f)
{
 f()
}

b(a) // b runs function a (a, not a())
b(() => console.log("bar")) // b runs anonymous arrow


function cb()
{
 console.log("cb was called back")
}

setTimeout(cb, 5000) // cb, not cb(