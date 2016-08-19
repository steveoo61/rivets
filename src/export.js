import rivets from './rivets'
import View from './view'
import adapter from './adapter'
import binders from './binders'

// Returns the public interface.

rivets.binders = binders
rivets.adapters['.'] = adapter

// Binds some data to a template / element. Returns a Rivets.View instance.
rivets.bind = (el, models = {}, options = {}) => {
  let view = new View(el, models, options)
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
