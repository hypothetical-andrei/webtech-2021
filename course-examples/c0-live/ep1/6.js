let o = {
    a: 1,
    b: 'a string'
}

console.log(o)

function f() {
    console.log('i am a function')
}

f()

let f1 = f

f1()

o.doStuff = f1

o.doStuff()