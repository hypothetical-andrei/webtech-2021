function Person (name, age) {
    this.name = name
    this.age = age
}

Person.prototype.printMe = function() {
    console.log(this.name + ' ' + this.age)
}

const p1 = new Person('jim', 22)
const p2 = new Person('jane', 25)

p1.printMe()
p2.printMe()

console.log(p1.__proto__)

console.log(p1)