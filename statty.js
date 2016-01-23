exports.counter = counter;
exports.median = median;
exports.mode = mode;

/* rand is the same for each of the distributions
 *
 * Object.prototype.rand = function(n){
    n = typeof n !== 'undefined' ? n : 1;
        if (n>1){
            var arr = [];
            for (var i=0;i<n;i++){
                arr.push(this.quantile(Math.random()));
            }
            return arr;
        }
        return this.quantile(Math.random());
}; */

exports.normal = function( _mean, _variance ) {

    var mean = typeof _mean !== 'undefined' ? _mean : 0;
    var variance = typeof _variance !== 'undefined' ? _variance : 1;

    var  get_variance = function(data,mean){

        var variance = 0;
        for (var j=0;j<data.length;j++){
            variance += Math.pow(mean-data[j],2);
        }
        return variance/(data.length-1);

    }

    var pdf = function(x) {
        var a = 1/(variance*Math.sqrt(2*Math.PI));
        return a*Math.pow(Math.E,-Math.pow((x-mean),2)/(2*Math.pow(variance,2)));
    };
    var cdf = function(x){
        return (1+erf_series((x-this.mean)/(variance*Math.sqrt(2)),25))/2;
    };

    var quantile = function(s){
        if (s>1 || s<0){
            return Number.NaN;
        }
        if (s == 1/2){
            return mean;
        }
        return mean+variance*Math.sqrt(2)*inverse_erf(2*s - 1);
    };

    var rand = function(iters){
        iters = typeof iters !== 'undefined' ? iters : 1;
        if (iters>1){
            var arr = [];
            for (var i=0;i<iters;i++){
                arr.push(quantile(Math.random()));
            }
            return arr;
        }
        return quantile(Math.random());
    };

    var ret = {
        mean: mean,
        variance: variance,
        pdf: pdf,
        cdf: cdf,
        quantile: quantile,
        rand: rand
    }

    return ret
}


exports.normal.fit = function(data){
    var mean = get_mean(data);
    var variance = get_variance(data,mean);
    return exports.normal(mean,variance);
};

function get_variance(data,mean){
    var variance = 0;
    for (var j=0;j<data.length;j++){
        variance += Math.pow(mean-data[j],2);
    }
    return variance/(data.length-1);

}

function get_mean(data){
    var total = 0;
    for (var i=0;i<data.length;i++){
        total += data[i];
    }
    return  total/data.length;
}



exports.uniform = function(a,b){
    var a = typeof a !== 'undefined' ? a : 0;
    var b = typeof b !== 'undefined' ? b : 1;
    var mean = (a + b)/2;
    var variance = Math.pow(b - a,2)/12;

    var pdf = function(x){
        if (x>a && x<b){
            return 1/(b-a);
        }
        return 0;
    };

    var cdf = function(x){
        if (x<a){
            return 0;
        }
        if (x<b){
            return (x-a)/(b-a);
        }
        if (x>=b){
            return 1;
        }
    };

    var quantile = function(x){
        return x*(b-a)+a;
    };

    rand = function(n){
        n = typeof n !== 'undefined' ? n : 1;
        if (n>1){
            var arr = [];
            for (var i=0;i<n;i++){
                arr.push(a + (b - a)*Math.random());
            }
            return arr;
        }
        return a + (b - a)*Math.random();
    };

    var ret = {
        mean: mean,
        variance: variance,
        a: a,
        b: b,
        pdf: pdf,
        cdf: cdf,
        quantile: quantile,
        rand: rand
    }
    return ret
}

exports.uniform.fit = function(data){
    var midrange = (max(data)+min(data))/2;
    var range = max(data)-min(data);
    var a = midrange - (range/2);
    var b = midrange + (range/2);
    return exports.uniform(a,b);
};

exports.laplace = function(mean, b){
    var mean = typeof mean !== 'undefined' ? mean : 0;
    var b = typeof b !== 'undefined' ? b : 1;
    var variance = 2*Math.pow(b,2);

    var pdf = function(x){
        return Math.exp(-Math.abs(x-mean)/b)/(2*b);
    };

    var cdf = function(x){
        if (x<mean){
            return Math.exp((x-mean)/b)/2;
        }
        if (x>=mean){
            return 1 - Math.exp((mean-x)/b)/2;
        }
    };
    var quantile = function(x){
        if (x>0 && x<=1/2){
            return mean + b*Math.log(2*x*b);
        }
        if (x>=1/2 && x<1){
            return mean - b*Math.log(2*(1-x));
        }
    };

    var rand = function(iters){
        iters = typeof iters !== 'undefined' ? iters : 1;
        if (iters>1){
            var arr = [];
            for (var i=0;i<iters;i++){
                arr.push(quantile(Math.random()));
            }
            return arr;
        }
        return quantile(Math.random());
    };

    var ret = {
        mean: mean,
        variance: variance,
        pdf: pdf,
        cdf: cdf,
        quantile: quantile,
        rand: rand
    }

    return ret
}

exports.laplace.fit = function(data){
    var mean = median(data);
    var b = 0;
    for (var i=0;i<data.length;i++){
        b += Math.abs(data[i]-mean);
    }
    b = b/data.length;
    return exports.laplace(mean, b);
};

exports.bernoulli = function(p){
    var p = typeof p !== 'undefined' ? p : 0;
    if (0 > p || p > 1){
        return 'error, p outside acceptable range';
    }

    var mean = p;
    var variance = p*(1-p);

    var pmf = function(x){
        if (x===0){
            return 1-mean;
        }
        if (x==1){
            return mean;
        }
        else{
            return Number.NaN;
        }
    };

    var cdf = function(k){
        if (k<0)
            return 0;
        if (0 <= k && k < 1)
            return 1-mean;
        if (k>1)
            return 1;

    };

    var quantile = function(p){
        if (p<0)
            return Number.NaN;
        if (p < 1-mean)
            return 0;
        if (p > 1-mean && p <1)
            return 1;
    };

    var rand = function(n){
        n = typeof n !== 'undefined' ? n : 1;
        if (n>1){
            var arr = [];
            for (var i=0;i<n;i++){
                arr.push(quantile(Math.random()));
            }
            return arr;
        }
        return quantile(Math.random());
    };

    var ret = {
        mean: mean,
        variance: variance,
        pmf: pmf,
        cdf: cdf,
        quantile: quantile,
        rand: rand
    }

    return ret
}

exports.bernoulli.fit = function(data){
    return exports.bernoulli(avg(data));
};



exports.binomial = function(n,p){
    var n = n;
    var p = p;
    var mean = p*n;
    var variance = n*p*(1-p);

    var pmf = function(k){
        return factorial(n)*Math.pow(p,k)*Math.pow(1-p,n-k)/(factorial(k)*factorial(n-k));
    };

    var cdf = function(k){
        var total =0;
        for (var i=0;i<=k;i++){
            total += pmf(i);
        }
        return total;
    };

    var quantile = function(p){
        for(var i=0;i<=n;i++){
            if (cdf(i)>=p){
                return i;
            }
        }
    };

    var rand = function(n){
        n = typeof n !== 'undefined' ? n : 1;
        if (n>1){
            var arr = [];
            for (var i=0;i<n;i++){
                arr.push(quantile(Math.random()));
            }
            return arr;
        }
        return quantile(Math.random());
    };

    var ret = {
        mean: mean,
        variance: variance,
        pmf: pmf,
        cdf: cdf,
        quantile: quantile,
        rand: rand
    }

    return ret
}

exports.poisson = function(l){
    var l = typeof l !== 'undefined' ? l : 1;
    var mean = l;
    var variance = l;

    var pmf = function(k){
        return Math.pow(mean,k)*Math.exp(-mean)/factorial(k);
    };

    var cdf = function(k){
        var total = 0;
        for (var i=0;i<=k;i++){
            total+=pmf(i);
        }
        return total;
    };

    var quantile = function(p){
        var total = 0;
        for(var i=0;;i++){
            total += pmf(i);
            if (total>=p){
                return i;
            }
        }
    };

    var rand = function(n){
        n = typeof n !== 'undefined' ? n : 1;
        if (n>1){
            var arr = [];
            for (var i=0;i<n;i++){
                arr.push(quantile(Math.random()));
            }
            return arr;
        }
        return quantile(Math.random());
    };

    var ret = {
        mean: mean,
        variance: variance,
        pmf: pmf,
        cdf: cdf,
        quantile: quantile,
        rand: rand
    }

    return ret
}

exports.poisson.fit = function(data){
    return exports.poisson(avg(data));
}

exports.exponential = function(l){
    l = l;
    mean = Math.pow(l,-1);
    variance = Math.pow(l,-2);

    var pdf = function(x){
        return l*Math.exp(-l*x);
    };

    var cdf = function(x){
        return 1-Math.exp(-l*x);
    };

    var quantile = function(p){
        return -Math.log(1-p)/l;
    }

    var rand = function(n){
        n = typeof n !== 'undefined' ? n : 1;
        if (n>1){
            var arr = [];
            for (var i=0;i<n;i++){
                arr.push(quantile(Math.random()));
            }
            return arr;
        }
        return quantile(Math.random());
    };

    var ret = {
        mean: mean,
        variance: variance,
        pdf: pdf,
        cdf: cdf,
        quantile: quantile,
        rand: rand
    }

    return ret
}

exports.exponential.fit = function(data){
    var l = 1/avg(data);
    return exports.exponential(l);
}

exports.pareto = function(x,a){
    x = x;
    a = a;
    if (a<=1){
      mean = Number.POSITIVE_INFINITY;
    }

    else {
        if (a>1){
          mean = a*x/(a-1);
        }
    };

    if (a<=2){
      variance = Number.POSITIVE_INFINITY;
    }

    else {
        if (a>2){
          variance = Math.pow(x,2)*a/(Math.pow(a-1,2)*(a-2));
        }
    };

    var pdf = function(z){
        return a*Math.pow(x,a)/Math.pow(z,a+1);
    };

    var cdf = function(z){
        return 1 - Math.pow(x/z,a);
    };

    var quantile = function(p){
       return 1/Math.pow(1-p,1/a);
    };

    var rand = function(n){
        n = typeof n !== 'undefined' ? n : 1;
        if (n>1){
            var arr = [];
            for (var i=0;i<n;i++){
                arr.push(quantile(Math.random()));
            }
            return arr;
        }
        return quantile(Math.random());
    };

    var ret = {
        mean: mean,
        variance: variance,
        pdf: pdf,
        cdf: cdf,
        quantile: quantile,
        rand: rand
    }

    return ret

}

exports.pareto.fit = function(data){
  var x = min(data);
  var terms = data.map(function(e){
    return Math.log(e) - Math.log(x);
  });

  var a = data.length/sum(terms)
  return exports.pareto(x,a)
}

exports.geometric = function(p){
    var mean = 1/p;
    var variance = (1-p)/Math.pow(p,2);

    var pmf = function(k){
        return Math.pow(1-p,k-1)*p;
    };

    var cdf = function(k){
        return 1-Math.pow(1-p,k);
    };

    var quantile = function(r){
        return Math.ceil(Math.log(1-r)/Math.log(1-p));
    };

    var rand = function(n){
        n = typeof n !== 'undefined' ? n : 1;
        if (n>1){
            var arr = [];
            for (var i=0;i<n;i++){
                arr.push(quantile(Math.random()));
            }
            return arr;
        }
        return quantile(Math.random());
    };

    var ret = {
        mean: mean,
        variance: variance,
        pmf: pmf,
        cdf: cdf,
        quantile: quantile,
        rand: rand
    }

    return ret

}

exports.geometric.fit = function(data){
    return exports.geometric(1/avg(data));
}

// common functions for statty.js

function counter(item){
   var keys = {};
   for (var i=0; i<item.length;i++){
       if (isNaN(keys[item[i]])){
           keys[item[i]] = 1;
       }
       else {
           keys[item[i]] = keys[item[i]] + 1;
       }
   }
   //returns whole global environment, not intended
       return keys;
   }

function erf_series(x,n){
   var total = 0;
   for (var k=0;k<n;k++){
       total += erf_term(x,k);
   }
   return total;
}

function erf_term(x,k){
   return 2*Math.pow(-1,k)*Math.pow(x,1+2*k)/((1+2*k)*factorial(k)*Math.sqrt(Math.PI));
}

function inverse_erf(x){
   var a = 8*(Math.PI - 3)/(3*Math.PI*(4-Math.PI));
   var term1 = Math.pow((2/(Math.PI*a)) + Math.log(1-Math.pow(x,2))/2,2) - Math.log(1-Math.pow(x,2))/a;
   var term2 = (2/(Math.PI*a)) + Math.log(1-Math.pow(x,2))/2;
   return (Math.abs(x)/x)*Math.sqrt(Math.sqrt(term1)-term2);
}


function median(values) {

    values.sort( function(a,b) {return a - b;} );

    var half = Math.floor(values.length/2);

    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}

function mode(obj){
    var count = counter(obj)
    return Object.keys(count).reduce(function(a, b){ return count[a] >= count[b] ? a : b });
}

function sum(data){
    var total = 0;
    for (var i=0;i<data.length;i++){
        total += data[i];
    }
    return total;
}

function avg(data){
    return sum(data)/data.length;
}

function max(data){
    return Math.max.apply(null, data);
}

function min(data){
    return Math.min.apply(null, data);
}


//this attemps to cache the factorial function (refactor?)
var f = [];
function factorial (n) {
    if (n === 0 || n == 1)
        return 1;
    if (f[n] > 0)
        return f[n];
    f[n] = factorial(n-1) * n;
    return f[n] ;
}
