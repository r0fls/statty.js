//TODO
// remove 'rand' methods from all functions (prototype is reusable)
// add more distributions
//    Discrete
//       - 
//    Continious.
//       - beta
// enforce proper ranges for functions

exports.normal = normal;
exports.uniform = uniform;
exports.laplace = laplace;
exports.bernoulli= bernoulli;
exports.binomial = binomial;
exports.poisson = poisson;
exports.exponential = exponential;
exports.pareto = pareto;
exports.geometric = geometric;


Object.prototype.rand = function(n){
    n = typeof n !== 'undefined' ? n : 1;
        if (n>1){
            var arr = [];
            for (var i=0;i<n;i++){
                arr.push(this.quantile(Math.random()));
            }
            return arr;
        }
        return this.quantile(Math.random());
};


function normal(mean,variance) {

    mean = typeof mean !== 'undefined' ? mean : 0;
    variance = typeof variance !== 'undefined' ? variance : 1;
    this.mean = mean;
    this.var = variance;

    this.pdf = function(x) {
        var a = 1/(this.var*Math.sqrt(2*Math.PI));
        return a*Math.pow(Math.E,-Math.pow((x-this.mean),2)/(2*Math.pow(this.var,2)));
    };
    this.cdf = function(x){
        return (1+erf_series((x-this.mean)/(this.var*Math.sqrt(2)),25))/2;
    };

    this.quantile = function(s){
        if (s>1 || s<0){
            return Number.NaN;
        }
        if (s == 1/2){
            return this.mean;
        }
        return this.mean+this.var*Math.sqrt(2)*inverse_erf(2*s - 1);
    };

    this.rand = function(iters){
        iters = typeof iters !== 'undefined' ? iters : 1;
        if (iters>1){
            var arr = [];
            for (var i=0;i<iters;i++){
                arr.push(this.quantile(Math.random()));
            }
            return arr;
        }
        return this.quantile(Math.random());
    };

    return this;
}

normal.fit = function(data){
    var mean = get_mean(data);
    var variance = get_variance(data,mean);
    return normal(mean,variance);
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

var f = [];
function factorial (n) {
    if (n === 0 || n == 1)
        return 1;
    if (f[n] > 0)
        return f[n];
    f[n] = factorial(n-1) * n;
    return f[n] ;
}

function inverse_erf(x){
    var a = 8*(Math.PI - 3)/(3*Math.PI*(4-Math.PI));
    var term1 = Math.pow((2/(Math.PI*a)) + Math.log(1-Math.pow(x,2))/2,2) - Math.log(1-Math.pow(x,2))/a;
    var term2 = (2/(Math.PI*a)) + Math.log(1-Math.pow(x,2))/2;
    return (Math.abs(x)/x)*Math.sqrt(Math.sqrt(term1)-term2);
}

function uniform(a,b){
    a = typeof a !== 'undefined' ? a : 0;
    b = typeof b !== 'undefined' ? b : 1;
    this.a = a;
    this.b = b;
    this.mean = (this.a + this.b)/2;
    this.variance = Math.pow(this.b - this.a,2)/12;

    this.pdf = function(x){
        if (x>a && x<b){
            return 1/(this.b-this.a);
        }
        return 0;
    };

    this.cdf = function(x){
        if (x<this.a){
            return 0;
        }
        if (x<this.b){
            return (x-this.a)/(this.b-this.a);
        }
        if (x>=this.b){
            return 1;
        }
    };

    this.quantile = function(x){
        return x*(this.b-this.a)+this.a;
    };

    this.rand = function(n){
        n = typeof n !== 'undefined' ? n : 1;
        if (n>1){
            var arr = [];
            for (var i=0;i<n;i++){
                arr.push(this.a + (this.b - this.a)*Math.random());
            }
            return arr;
        }
        return this.a + (this.b - this.a)*Math.random();
    };
    return this;
}

uniform.fit = function(data){
    var midrange = (max(data)+min(data))/2;
    var range = max(data)-min(data);
    var a = midrange - (range/2);
    var b = midrange + (range/2);
    return uniform(a,b);
};
function max(data){
    return Math.max.apply(null, data);
}

function min(data){
    return Math.min.apply(null, data);
}

function laplace(mean, b){
    mean = typeof mean !== 'undefined' ? mean : 0;
    b = typeof b !== 'undefined' ? b : 1;
    this.mean = mean;
    this.b = b;
    this.variance = 2*Math.pow(b,2);

    this.pdf = function(x){
        return Math.exp(-Math.abs(x-this.mean)/b)/(2*b);
    };

    this.cdf = function(x){
        if (x<this.mean){
            return Math.exp((x-this.mean)/this.b)/2;
        }
        if (x>=this.mean){
            return 1 - Math.exp((this.mean-x)/this.b)/2;
        }
    };
    this.quantile = function(x){
        if (x>0 && x<1/2){
            return this.mean + this.b*Math.log(2*x*b);
        }
        if (x>1/2 && x<1){
            return this.mean - this.b*Math.log(2*(1-x));
        }
    };

    this.rand = function(iters){
        iters = typeof iters !== 'undefined' ? iters : 1;
        if (iters>1){
            var arr = [];
            for (var i=0;i<iters;i++){
                arr.push(this.quantile(Math.random()));
            }
            return arr;
        }
        return this.quantile(Math.random());
    };

    return this;
}

laplace.fit = function(data){
    var mean = median(data);
    var b = 0;
    for (var i=0;i<data.length;i++){
        b += Math.abs(data[i]-mean);
    }
    b = b/data.length;
    return laplace(mean, b);
};


function median(values) {

    values.sort( function(a,b) {return a - b;} );

    var half = Math.floor(values.length/2);

    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}

function bernoulli(p){
    p = typeof p !== 'undefined' ? p : 0;
    if (0 > p || p > 1){
        return 'error, p outside acceptable range';
    }

    this.mean = p;
    this.variance = p*(1-p);

    this.pmf = function(x){
        if (x===0){
            return 1-this.mean;
        }
        if (x==1){
            return this.mean;
        }
        else{
            return Number.NaN;
        }
    };

    this.cdf = function(k){
        if (k<0)
            return 0;
        if (0 <= k && k < 1)
            return 1-this.mean;
        if (k>1)
            return 1;

    };

    this.quantile = function(p){
        if (p<0)
            return Number.NaN;
        if (p < 1-this.mean)
            return 0;
        if (p > 1-this.mean && p <1)
            return 1;
    };
    this.rand = function(n){
        n = typeof n !== 'undefined' ? n : 1;
        if (n>1){
            var arr = [];
            for (var i=0;i<n;i++){
                arr.push(this.quantile(Math.random()));
            }
            return arr;
        }
        return this.quantile(Math.random());
    };
    return this;
}

bernoulli.fit = function(data){
    return bernoulli(avg(data));
};


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

function binomial(n,p){
    this.n = n;
    this.p = p;
    this.mean = p*n;
    this.variance = n*p*(1-p);

    this.pmf = function(k){
        return factorial(this.n)*Math.pow(this.p,k)*Math.pow(1-this.p,n-k)/(factorial(k)*factorial(this.n-k));
    };

    this.cdf = function(k){
        var total =0;
        for (var i=0;i<=k;i++){
            total += this.pmf(i);
        }
        return total;
    };

    this.quantile = function(p){
        for(var i=0;i<=this.n;i++){
            if (this.cdf(i)>=p){
                return i;
            }
        }
    };

    this.rand = function(n){
        n = typeof n !== 'undefined' ? n : 1;
        if (n>1){
            var arr = [];
            for (var i=0;i<n;i++){
                arr.push(this.quantile(Math.random()));
            }
            return arr;
        }
        return this.quantile(Math.random());
    };

    return this;

}

function poisson(l){
    l = typeof l !== 'undefined' ? l : 1;
    this.mean = l;
    this.variance = l;

    this.pmf = function(k){
        return Math.pow(this.mean,k)*Math.exp(-this.mean)/factorial(k);
    };

    this.cdf = function(k){
        var total = 0;
        for (var i=0;i<=k;i++){
            total+=this.pmf(i);
        }
        return total;
    };

    this.quantile = function(p){
        var total = 0;
        for(var i=0;;i++){
            total += this.pmf(i);
            if (total>=p){
                return i;
            }
        }
    };

    this.rand = function(n){
        n = typeof n !== 'undefined' ? n : 1;
        if (n>1){
            var arr = [];
            for (var i=0;i<n;i++){
                arr.push(this.quantile(Math.random()));
            }
            return arr;
        }
        return this.quantile(Math.random());
    };

    return this;
}

poisson.fit = function(data){
    return poisson(avg(data));
}

function exponential(l){
    this.l = l;
    this.mean = Math.pow(l,-1);
    this.variance = Math.pow(l,-2);

    this.pdf = function(x){
        return this.l*Math.exp(-this.l*x);
    };

    this.cdf = function(x){
        return 1-Math.exp(-this.l*x);
    };

    this.quantile = function(p){
        return -Math.log(1-p)/this.l;
    }

    this.rand = function(n){
        n = typeof n !== 'undefined' ? n : 1;
        if (n>1){
            var arr = [];
            for (var i=0;i<n;i++){
                arr.push(this.quantile(Math.random()));
            }
            return arr;
        }
        return this.quantile(Math.random());
    };

    return this;
}

exponential.fit = function(data){
    var l = 1/avg(data);
    return exponential(l);
}

function pareto(x,a){
    this.x = x;
    this.a = a;
    if (a<=1){
      this.mean = Number.POSITIVE_INFINITY;
    }

    else {
        if (a>1){
          this.mean = a*x/(a-1);
        }
    };

    if (a<=2){
      this.variance = Number.POSITIVE_INFINITY;
    }

    else {
        if (a>2){
          this.variance = Math.pow(x,2)*a/(Math.pow(a-1,2)*(a-2));
        }
    };

    this.pdf = function(z){
        return a*Math.pow(this.x,a)/Math.pow(z,a+1);
    };

    this.cdf = function(z){
        return 1 - Math.pow(this.x/z,a);
    };

    this.quantile = function(p){
       return 1/Math.pow(1-p,1/a);
    };

    this.rand = function(n){
        n = typeof n !== 'undefined' ? n : 1;
        if (n>1){
            var arr = [];
            for (var i=0;i<n;i++){
                arr.push(this.quantile(Math.random()));
            }
            return arr;
        }
        return this.quantile(Math.random());
    };

    return this;

}

pareto.fit = function(data){
  var x = min(data);
  var terms = data.map(function(e){
    return Math.log(e) - Math.log(x);
  });

  var a = data.length/sum(terms)
  return pareto(x,a)
}

function geometric(p){
    this.mean = 1/p;
    this.variance = (1-p)/Math.pow(p,2);
    this.p = p;

    this.pmf = function(k){
        return Math.pow(1-this.p,k);
    };

    this.cdf = function(k){
        return 1-Math.pow(1-this.p,k);
    };

    this.quantile = function(r){
        return Math.ceil(Math.log(1-r)/Math.log(1-this.p));
    };

    return this;

}

geometric.fit = function(data){
    return geometric(1/avg(data));
}
