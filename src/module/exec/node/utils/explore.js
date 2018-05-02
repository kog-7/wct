'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Explore = function () {
  function Explore() {
    _classCallCheck(this, Explore);

    this.parseFunction = null;
    this.root = null;
    this.callback = this.error = function () {};
  }

  _createClass(Explore, [{
    key: 'parse',
    value: function parse(f) {
      //f是一个promise函数
      this.parseFunction = f;
      return this;
    }
  }, {
    key: 'setCallback',
    value: function setCallback(f) {
      this.callback = f;
      return this;
    }
  }, {
    key: 'setError',
    value: function setError(f) {
      this.error = f;
      return this;
    }
  }, {
    key: 'trace',
    value: function trace(inputObj, lastInputObj) {
      var ts = this;
      return function () {
        var complete = true;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = inputObj.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var val = _step.value;

            if (val.status !== 'done') {
              complete = false;
              break;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (complete === false) {
          return false;
        }
        inputObj.status = 'done';

        if (lastInputObj === null) {
          //如果没有则微顶部内容
          ts.callback();
        } else {
          lastInputObj.trace();
        }
      };
    }
  }, {
    key: 'run',
    value: function run(opt) {
      //开始输入一串内容
      var _opt$lastInputObj = opt.lastInputObj,
          lastInputObj = _opt$lastInputObj === undefined ? null : _opt$lastInputObj,
          input = opt.input;
      var parseFunction = this.parseFunction,
          root = this.root;

      var ts = this;
      var inputObj = {
        status: 'pending',
        value: input,
        children: []
      };
      inputObj.trace = ts.trace(inputObj, lastInputObj);
      if (root === null) {
        this.root = inputObj;
      } else {
        lastInputObj.children.push(inputObj); //如果不是根元素
      }
      var lastVal = lastInputObj === null ? null : lastInputObj.value;
      //解析
      parseFunction(input, lastVal).then(function (outputs) {
        //解析返回多个内容
        if (Array.isArray(outputs)) {
          //只要有output,并且output是数组就继续
          var lg = outputs.length;
          if (lg === 0) {
            //如果没有子元素了
            inputObj.trace();
          } else {
            outputs.forEach(function (output, ind) {
              ts.run({
                input: output,
                lastInputObj: inputObj
              });
            });
          }
        } else {
          inputObj.trace(); //也会直接回溯
        }
      }).catch(function (err) {
        ts.error(err);
      });
      return this;
    }
  }]);

  return Explore;
}();

module.exports=Explore;
