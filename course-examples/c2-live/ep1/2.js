function Person (name, age) {
    this.name = name
    this.age = age
    this.printMe = function() {
        console.log(`${this.name} is ${this.age} old`)
    }
}

const p1 = new Person('jim', 22)
p1.printMe()

const p2 = new Person('jane', 25)
p2.printMe()

console.log(p1.__proto__)