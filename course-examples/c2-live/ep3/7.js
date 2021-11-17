const o = {
    name: 'jim',
    age: 22,
    printMe: function() {
        const f = () => {
            console.log(this.name + ' ' + this.age)
        }
        f()
    }
}

o.printMe()

