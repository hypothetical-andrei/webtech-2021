const o = {
    name: 'jim',
    age: 22,
    printMe: function() {
        console.log(this.name + ' ' + this.age)
    }
}

o.printMe()
