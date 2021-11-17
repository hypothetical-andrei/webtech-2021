const o = {
    name: 'jim',
    age: 22,
    printMe: function () {
        console.log(`${this.name} is ${this.age} old`)
    }
}

o.printMe()