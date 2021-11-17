class Person {
    constructor (name, age) {
        this.name = name
        this.age = age
    }

    printMe () {
        console.log(this.name + ' ' + this.age)
    }
}

const p1 = new Person('jim', 22)
const p2 = new Person('jane', 25)

console.log(p1)

p1.printMe()
p2.printMe()