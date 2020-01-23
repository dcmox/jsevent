/*** Inspired by https://nodejs.org/api/events.html ***/ 

class EventEmitter {
	_events = {}
	_once = {}
	_listeners = []
    _activeListener = {}

	once(fn, cb) {
		if (fn === 'newListener') {
			this._listeners.push(cb)
		} else {
			this._once[fn] = cb
		}
    }

    on(fn, cb) {
        let hasListener = false

		this._listeners.forEach((listener) => {
			if (listener.toString().indexOf(cb.toString()) !== -1) {
				if (!this._activeListener[fn]) {
					this._activeListener[fn] = []
				}
				this._activeListener[fn].push(cb)
				hasListener = true
			}
        })
        
		if (!hasListener) { this._events[fn] = cb }
    }

	emit(fn, ...args) {
		this._listeners.forEach((listener, index) => {
			if (listener.toString().indexOf(fn.toString()) !== -1) { 
				listener(fn)
				delete this._listeners[index]
			}
        })
        
		if (this._activeListener[fn]) {
			let listener 
			while ((listener = this._activeListener[fn].pop())) listener(...args)
        }
        
		if (this._events[fn]) {
			return this._events[fn](...args)
		} else if (this._once[fn]) {
			let cb = this._once[fn]
			delete this._once[fn]
			return cb(...args)
		} 
		return
	}
}