# statty.js
Statistics for javascript

Intended for `node.js`. Install with `npm install statty.js` or clone the repo and put it in your project. Example usage:

    var stats = require('statty.js')
    console.log(stats.normal(5,1).rand())
    
So far the only distributions are the `normal`,`uniform` and `laplace`. The normal is initialized with `mean` and `variance`, and the uniform is initialized with endpoint parameters `a` and `b`. They then have the following methods:
    
    var stats = require('statty.js')
    norm = stats.normal(5,1)               \\ normal with mean 5, variance 1
    unif = stats.uniform(10,20)            \\ uniform from range 10 to 20
    lapl = stats.laplace(10,4)             \\ laplace with mean 10, scale 4 
    console.log(norm.pdf(1))               \\ probability density function
    console.log(norm.cdf(4))               \\ cumulative density function
    console.log(norm.quantile(.9))         \\ quantile
    console.log(norm.rand())               \\ generates a random number
    \\or
    norm = stats.normal.fit([1,2,3,4,5])   \\ returns model fitted to data
    console.log(norm.mean)                 \\ mean attribute (calculated for uniform)
    console.log(norm.variance)             \\ variance attribute (calculated for uniform)
    console.log(norm.rand(10))             \\ generates array of 10 random numbers
