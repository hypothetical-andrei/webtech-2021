function ParentType (a) {
    this.a = a
    this.doParent = function () {
        console.log('doing parent stuff with a = ' + a)
    }
}

function ChildType (b) {
    this.b = b
    this.doChild = function () {
        console.log('doing child stuff with b  = ' + b)
    }
}

ChildType.prototype = new ParentType(5)

let c0 = new ChildType(5)

c0.doChild()
c0.doParent()
