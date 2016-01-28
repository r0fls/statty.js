# statty.js
Statistics for javascript

Intended for `node.js`. Available through [npm](https://www.npmjs.com/package/statty.js).
###Installation
`npm install statty.js`

Or clone the repo and put it in your project. 

###Setup

    var stats = require('statty.js')
    console.log(stats.normal(5,1).rand())
    
So far the only distributions are the `normal`, `uniform`, `laplace`, `poisson`, `pareto`, `exponential`, `geometric`, `bernoulli`, and `binomial`. In general, each distribution is initalized with the parameters listed on Wikipedia, in the order listed there. When using the `fit` method, which is available for all distributions expcept the `binomial`, parameters are calculated using the Maximum Likelihood Estimator for the distribution.

#####Examples
    
    var stats = require('statty.js')
    norm = stats.normal(5,1)            \\ normal with mean 5, variance 1
    unif = stats.uniform(10,20)         \\ uniform from range 10 to 20
    pare = stats.pareto(1,6/5)          \\ pareto with scale 1 and shape 1.2 
    lapl = stats.laplace(10,4)          \\ laplace with mean 10, scale 4 
    geom = stats.geometric(.5)          \\ geometric with sucess .5
    pois = stats.poisson(10)            \\ poisson with mean 10 
    expo = stats.exponential(1/10)      \\ exponential with mean 10 
    bern = stats.bernoulli(.7)          \\ bernoulli with mean .7
    bino = stats.binomial(10,.7)        \\ binomial with 10 trials, probability .7
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

###Read the Docs
For more information, see the full [documentation](http://stattyjs.readthedocs.org/en/latest/#).
