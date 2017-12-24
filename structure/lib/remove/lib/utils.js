var collect = (function() {
    var isFun = function(f) {
            return (typeof f) === "function";
        },
        toArray = function() {
            return Array.prototype.slice.call(arguments[0], 0);
        };
    var col = function() {
        if (!(this instanceof col)) {
            return new col();
        }
        this._functions = [], this._results = [], this._step = 0, this.length = 0;
        this._callback = null;
    };
    col.prototype = {
        _collectFun: function() {
            var that = this;
            if (!that._change) {
                return that._change = function() {
                    var arr = toArray(arguments),
                        results = that._results;
                    results.push(arr);
                    var step = that._step += 1,
                        length = that.length;
                    if (step >= that.length) {
                        that._callback.call(null, results);
                    }
                };
            } else {
                return that._change;
            }
        },
        _middleFun: function(f) {
            var that = this;
            var colFun = this._collectFun();
            return function() {
                var arr = toArray(arguments);
                f.apply(colFun, arr);
            }
        },
        get: function(f) {
            this._functions.push(this._middleFun(f));
            return this;
        },
        go: function(args) {
            var funs = this._functions;
            this.length = funs.length;

            funs.forEach(function(fun, ind) {
                var arg = null;
                if (args && typeof args[ind] === "object") {
                    arg = args[ind];
                }

                fun.apply(null, arg);
            });
            return this;
        },
        setCallback: function(f) {
            this._callback = f;
            return this;
        }
    }
    return col;
})()


//请求其他服务器






module.exports = {
    collect: collect
};
