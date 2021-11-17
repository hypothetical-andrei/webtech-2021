class Person {
    constructor (name, age) {
        this.name = name
        this.age = age
    }
    printMe () {
        console.log(`${this.name} is ${this.age} old`)
    }
}

let p0 = new Person('jim', 22)
p0.printMe()

console.log(p0)

let p1 = new Person('jane', 25)
p1.printMe()

