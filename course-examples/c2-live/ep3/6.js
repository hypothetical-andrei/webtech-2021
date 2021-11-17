const sampleString = 'i am a string'

String.prototype.initial = function () {
    return this[0]
}

console.log(sampleString.initial())