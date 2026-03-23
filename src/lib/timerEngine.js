// Timer engine — drives brew, mine, and smithy completions.
// Imported by useTimers hook.

let callbacks = []
let intervalId = null

export function registerTimerCallback(cb) {
  callbacks.push(cb)
  return () => {
    callbacks = callbacks.filter(c => c !== cb)
  }
}

export function startTimerEngine() {
  if (intervalId !== null) return
  intervalId = setInterval(() => {
    const now = Date.now()
    callbacks.forEach(cb => cb(now))
  }, 1000)
}

export function stopTimerEngine() {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
}
