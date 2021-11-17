function sampleFunction(...args) {
    return args.reduce((a, e) => a + e, 0)
}

function memoize(f) {
    const cache = {}
    return function (...args) {
        const key = JSON.stringify(args)
        if (key in cache) {
            console.log('CACHED ' + key)
            return cache[key]
        } else {
            const result = f(...args)
            cache[key] = result
            return result
        }
    }
}

console.log(sampleFunction(1,2,3))
console.log(sampleFunction(1,2,3))