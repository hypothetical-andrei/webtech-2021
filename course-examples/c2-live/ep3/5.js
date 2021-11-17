class ParentType {
    constructor (a) {
        this.a = a
    }

    doParent () {
        console.log('doing parent stuff with a = ' + this.a)
    }
}

class ChildType extends ParentType {
    constructor (a, b) {
        super(a)
        this.b = b
    }

    doChild () {
        console.log('doing child stuff with a = ' + this.a + ' and b = ' + this.b)
    }
}

const c0 = new ChildType(1, 10)
c0.doChild()
c0.doParent()

c0.someprop = 'something'

console.log(c0.someprop)

ChildType.prototype.doNewChildStuff = function () {
    console.log('doing new child stuff')
}

c0.doNewChildStuff()

ParentType.prototype.doNewParentStuff = function () {
    console.log('doing new parent stuff')
}

c0.doNewParentStuff()

// console.log(c0.doChild.length)
// let f0 = c0.doChild
// f0.call(c0)

// let f1 = f0.bind(c0)
// f1()