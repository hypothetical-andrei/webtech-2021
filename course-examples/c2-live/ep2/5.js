class ParentType {
    constructor(a) {
        this.a = a
    }
    doParent () {
        console.log('doing parent stuff with a ' + this.a)
    }
}

class ChildType extends ParentType {
    constructor (a, b) {
        super(a)
        this.b = b
    }
    doChild () {
        console.log('doing child stuff with a and b ' + this.a + ' ' + this.b)
    }
}

const c0 = new ChildType(1,2)
c0.doChild()

c0.doParent()

ChildType.prototype.doNewStuff = function () {
    console.log('doing new stuff')
}

c0.doNewStuff()

let f = c0.doParent

f.call(c0)

let f1 = f.bind(c0)

f1()