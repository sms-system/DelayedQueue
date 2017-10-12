const MAX_INT32 = 2147483647
const _processQueueItem = Symbol()
const _private = new WeakMap()

function setLongTimeout (callback, timeout) {
  if (timeout > MAX_INT32) {
    timerId = setTimeout(function () {
      setLongTimeout(callback, timeout - MAX_INT32)
    }, MAX_INT32)
  } else {
    timerId = setTimeout(callback, timeout)
  }
}

module.exports = class DelayedQueue {

  constructor (interval, job = _ => {}) {
    this.interval = interval
    this.job = job

    _private.set(this, {
      queue: [],
      isWaitState: false
    })
  }

  [_processQueueItem] (item) {
    const _this = _private.get(this)
    this.job(item.data)
    const nextItem = _this.queue.shift()
    if (!nextItem) {
      return _this.isWaitState = false
    }
    const time = Date.now()
    if (time >= nextItem.time) {
      return this[_processQueueItem](nextItem)
    }
    setLongTimeout(() => {
      this[_processQueueItem](nextItem)
    }, nextItem.time - time)
  }

  add (data) {
    const _this = _private.get(this)
    const time = Date.now() + this.interval
    const item = { data, time }
    if (_this.isWaitState) {
      return _this.queue.push(item)
    }
    _this.isWaitState = true
    setLongTimeout(() => {
      this[_processQueueItem](item)
    }, this.interval)
  }
}