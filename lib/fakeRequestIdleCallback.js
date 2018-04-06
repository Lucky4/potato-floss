"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.fakeRequestIdleCallback = fakeRequestIdleCallback;
exports.fakeCancelIdleCallback = fakeCancelIdleCallback;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Deadline = function () {
  function Deadline() {
    var expireTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 50;

    _classCallCheck(this, Deadline);

    this._startAt = new Date();
    this._expireTime = expireTime;
    this.didTimeout = true;
  }

  _createClass(Deadline, [{
    key: "timeRemaining",
    value: function timeRemaining() {
      var passedTime = new Date() - this._startAt;
      if (passedTime > this._expireTime) {
        return 0;
      }
      return this._expireTime - passedTime;
    }
  }]);

  return Deadline;
}();

var fRICMap = {};

function fakeRequestIdleCallback(callback, options) {
  var id = setTimeout(function () {
    callback.call(null, new Deadline());
    delete fRICMap[id];
  }, 0);
  fRICMap[id] = true;
  return id;
}

function fakeCancelIdleCallback(id) {
  clearTimeout(id);
  delete fRICMap[id];
}