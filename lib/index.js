'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PotatoFloss = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fakeRequestIdleCallback = require('./fakeRequestIdleCallback');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var schedule = void 0;
var cancelSchedule = void 0;

var rIC = window.requestIdleCallback || window.webkitRequestIdleCallback || window.mozRequestIdleCallback || window.oRequestIdleCallback || window.msRequestIdleCallback;

var cIC = window.cancelIdleCallback || window.webkitCancelIdleCallback || window.mozCancelIdleCallback || window.oCancelIdleCallback || window.msCancelIdleCallback;

if (typeof rIC === 'function' && typeof cIC === 'function') {
  schedule = rIC.bind(window);
  cancelSchedule = cIC.bind(window);
} else {
  schedule = _fakeRequestIdleCallback.fakeRequestIdleCallback;
  cancelSchedule = _fakeRequestIdleCallback.fakeCancelIdleCallback;
}

var PotatoFloss = exports.PotatoFloss = function () {
  function PotatoFloss(generatorFunction, callback) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, PotatoFloss);

    this._idleCallback = function (deadline) {
      var piece = _this.generator.next();
      while (deadline.timeRemaining() > 1 && !piece.done) {
        piece = _this.generator.next();
      }

      if (piece.done) {
        _this._resolve(piece.value);
        return;
      }
      _this.callback.call(null, piece.value);
      _this._requireNextPiece();
    };

    this.generator = generatorFunction();
    this.callback = callback;
    this._pieceId = null;

    if (options.forceFake) {
      this._schedule = _fakeRequestIdleCallback.fakeRequestIdleCallback;
      this._cancelSchedule = _fakeRequestIdleCallback.fakeCancelIdleCallback;
    } else {
      this._schedule = schedule;
      this._cancelSchedule = cancelSchedule;
    }
  }

  _createClass(PotatoFloss, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2._resolve = resolve;
        _this2._reject = reject;
        _this2._requireNextPiece();
      });
    }
  }, {
    key: 'cancel',
    value: function cancel(e) {
      this._cancelSchedule(this._pieceId);
      this._reject(e);
    }
  }, {
    key: '_requireNextPiece',
    value: function _requireNextPiece() {
      this._pieceId = this._schedule(this._idleCallback);
    }
  }]);

  return PotatoFloss;
}();