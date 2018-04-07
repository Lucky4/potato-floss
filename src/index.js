import {
  fakeCancelIdleCallback,
  fakeRequestIdleCallback,
} from './fakeRequestIdleCallback';

let schedule;
let cancelSchedule;

const rIC = window.requestIdleCallback ||
    window.webkitRequestIdleCallback ||
    window.mozRequestIdleCallback ||
    window.oRequestIdleCallback ||
    window.msRequestIdleCallback;

const cIC = window.cancelIdleCallback ||
  window.webkitCancelIdleCallback ||
  window.mozCancelIdleCallback ||
  window.oCancelIdleCallback ||
  window.msCancelIdleCallback;

if (typeof rIC === 'function' &&
  typeof cIC === 'function') {
  schedule = rIC.bind(window);
  cancelSchedule = cIC.bind(window);
} else {
  schedule = fakeRequestIdleCallback;
  cancelSchedule = fakeCancelIdleCallback;
}

export class PotatoFloss {
  constructor(generatorFunction, callback, options = {}) {
    this.generator = generatorFunction();
    this.callback = callback;
    this._pieceId = null;

    if (options.forceFake) {
      this._schedule = fakeRequestIdleCallback;
      this._cancelSchedule = fakeCancelIdleCallback;
    } else {
      this._schedule = schedule;
      this._cancelSchedule = cancelSchedule;
    }
  }

  start() {
    return new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
      this._requireNextPiece();
    });
  }

  cancel(e) {
    this._cancelSchedule(this._pieceId);
    this._reject(e);
  }

  _requireNextPiece() {
    this._pieceId = this._schedule(this._idleCallback);
  }

  _idleCallback = (deadline) => {
    let piece = this.generator.next();
    while (deadline.timeRemaining() > 1 && !piece.done) {
      piece = this.generator.next();
    }

    if (piece.done) {
      this._resolve(piece.value);
      return;
    }
    this.callback.call(null, piece.value);
    this._requireNextPiece();
  };
}
