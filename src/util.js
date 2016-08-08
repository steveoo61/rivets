
export function bindEvent(el, event, handler) {
  el.addEventListener(event, handler, false)
}

export function unbindEvent(el, event, handler) {
  el.removeEventListener(event, handler, false)
}

export function getInputValue(el) {
  let results = []
  if (el.type === 'checkbox') {
    return el.checked
  } else if (el.type === 'select-multiple') {

    el.options.forEach(option => {
      if (option.selected) {
        results.push(option.value)
      }
    })

    return results
  } else {
    return el.value
  }
}
