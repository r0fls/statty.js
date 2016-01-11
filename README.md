# statty.js
Statistics for javascript

Intended for `node.js`. 
###Installation
`npm install statty.js`

Or clone the repo and put it in your project. 

###Examples

    var stats = require('statty.js')
    console.log(stats.normal(5,1).rand())
    
So far the only distributions are the `normal`,`uniform`, `laplace` and `bernoulli`. The normal is initialized with `mean` and `variance`, and the uniform is initialized with endpoint parameters `a` and `b`. Laplace is initialized with mean and scale parameter, and bernoulli is initialized with its mean. They then have the following methods:
    
    var stats = require('statty.js')
    norm = stats.normal(5,1)            \\ normal with mean 5, variance 1
    unif = stats.uniform(10,20)         \\ uniform from range 10 to 20
    lapl = stats.laplace(10,4)          \\ laplace with mean 10, scale 4 
    bern = stats.bernoulli(.7)          \\ bernoulli with mean .7
    console.log(norm.pdf(1))            \\ probability density function
    console.log(bern.pmf(1))            \\ discrete distributions have pmf
    console.log(norm.cdf(4))            \\ cumulative density function
    console.log(norm.quantile(.9))      \\ quantile
    console.log(bern.rand())            \\ generates a random bernoulli trial
    \\or
    norm = stats.normal.fit([1,2,3,4])  \\ returns model fitted to data
    console.log(norm.mean)              \\ mean attribute (calculated for uniform)
    console.log(norm.variance)          \\ variance attribute (calculated for uniform)
    console.log(norm.rand(10))          \\ generates array of 10 random numbers
