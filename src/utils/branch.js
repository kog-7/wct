"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BranchClass = function () {
  function BranchClass() {
    _classCallCheck(this, BranchClass);

    this.lastInstance = this.nowInstance = null;
    this.error = this.callback = function () {}; //错误回调函数
    this.step = null; //step表示当前运行的函数
  }

  _createClass(BranchClass, [{
    key: "setError",
    value: function setError(f) {
      if (typeof f === "function") {
        this.error = f;
      }
      return this;
    }
  }, {
    key: "setCallback",
    value: function setCallback(f) {
      if (typeof f === "function") {
        this.callback = f;
      }
      return this;
    }
  }, {
    key: "wrap",
    value: function wrap(f, props) {
      //状态有pending，process,done
      var error = this.error,
          callback = this.callback;

      var ts = this;
      return function () {
        var lastInstance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        var funcOb = {
          run: function run() {
            var nextInstace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            // if(lastInstance!==null){lastInstance.status='done';}//得到上一次状态的情况，并且更改,this表示lastsend
            ts.step = f; //当前正在运行的函数
            return f.call.apply(f, [this].concat(_toConsumableArray(props))).then(function (lastSend) {
              //.callthis表示对上一次run.call的f集成
              if (nextInstace == null) {
                //如果没有下一步，执行callback
                ts.lastInstance = ts.nowInstance = ts.error = ts.callback = ts.step = null;
                return callback(lastSend);
              }
              // nextInstace.status='process';
              return nextInstace.run.call(lastSend); //上一次传过来的东西会作为this在原来的函数中
            }).catch(function (err) {
              ts.lastInstance = ts.nowInstance = ts.error = ts.callback = ts.step = null;
              return error(err);
              // error(...err);
            });
          },

          status: 'pending'
        };
        if (lastInstance !== null) {
          var run = lastInstance.run;
          lastInstance.run = function (lastSend) {
            run.call(lastSend, funcOb);
          };
        }
        return funcOb;
      };
    }
  }, {
    key: "get",
    value: function get(f) {
      var nowInstance = this.nowInstance,
          lastInstance = this.lastInstance;

      for (var _len = arguments.length, props = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        props[_key - 1] = arguments[_key];
      }

      var newInstance = this.wrap(f, props)(lastInstance);
      if (nowInstance === null) {
        this.nowInstance = newInstance;
      }
      this.lastInstance = newInstance;
      return this;
    }
  }, {
    key: "run",
    value: function run() {
      this.nowInstance.run();
      return this;
    }
  }]);

  return BranchClass;
}();

function Branch() {
  return new BranchClass();
}

module.exports=Branch;
