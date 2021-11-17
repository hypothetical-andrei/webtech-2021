let o = {
    a: 1,
    b: 'somestring'
}

console.log(o)

function f() {
   console.log("i'm a little function") 
}

f()

let f1 = f

f1()

o.doStuff = f1

o.doStuff()