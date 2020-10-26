(() => {
    const secretKey = "secretflag".split("").map(v => v.charCodeAt(0))
    const modifier = secretKey.slice(0,8)
    const result = secretKey

    const chemicalX = n => n**2^n

    for (let i in secretKey) {
        result[i] += chemicalX(modifier[i % modifier.length])
    }
    
    console.log(result)
})()