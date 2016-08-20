import rivets from './rivets'
import View from './view'
import {OPTIONS, EXTENSIONS} from './constants'
import adapter from './adapter'
import binders from './binders'

// Returns the public interface.

rivets.binders = binders
rivets.adapters['.'] = adapter

// Binds some data to a template / element. Returns a Rivets.View instance.
rivets.bind = (el, models, options) => {
  let viewOptions = {}
  models = models || {}
  options = options || {}

  EXTENSIONS.forEach(extensionType => {
    viewOptions[extensionType] = Object.create(null)

    if (options[extensionType]) {
      Object.keys(options[extensionType]).forEach(key => {
        viewOptions[extensionType][key] = options[extensionType][key]
      })
    }

    Object.keys(rivets[extensionType]).forEach(key => {
      if (!viewOptions[extensionType][key]) {
        viewOptions[extensionType][key] = rivets[extensionType][key]
      }
    })
  })

  OPTIONS.forEach(option => {
    let value = options[option]
    viewOptions[option] = value != null ? value : rivets[option]
  })

  viewOptions.starBinders = Object.keys(viewOptions.binders).filter(function (key) {
    return key.indexOf('*') > 0
  })

  let view = new View(el, models, viewOptions)
  view.bind()
  return view
}

// Initializes a new instance of a component on the specified element and
// returns a Rivets.View instance.
rivets.init = (component, el, data = {}) => {
  if (!el) {
    el = document.createElement('div')
  }

  let component = rivets.components[component]
  el.innerHTML = component.template.call(rivets, el)
  let scope = component.initialize.call(rivets, el, data)

  let view = new View(el, scope)
  view.bind()
  return view
}

export default rivets
