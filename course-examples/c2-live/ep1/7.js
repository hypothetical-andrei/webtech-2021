class Person {
    constructor (name, age) {
        this.name = name
        this.age = age
    }
    printMe() {
        console.log(`${this.name} is ${this.age} old`)
    }
}

const p0 = new Person('jim', 22)

p0.someprop = 'some content'

const f0 = p0.printMe

console.log(f0)

f0.call(p0)

console.log(p0)
