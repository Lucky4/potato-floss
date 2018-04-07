class Deadline {
  constructor(expireTime = 50) {
    this._startAt = new Date();
    this._expireTime = expireTime;
    this.didTimeout = true;
  }

  timeRemaining() {
    const passedTime = new Date() - this._startAt;
    if (passedTime > this._expireTime) {
      return 0;
    }
    return this._expireTime - passedTime;
  }
}

const fRICMap = {};

export function fakeRequestIdleCallback(callback) {
  const id = setTimeout(() => {
    callback.call(null, new Deadline());
    delete fRICMap[id];
  }, 0);
  fRICMap[id] = true;
  return id;
}

export function fakeCancelIdleCallback(id) {
  clearTimeout(id);
  delete fRICMap[id];
}
