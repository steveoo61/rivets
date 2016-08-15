import {OPTIONS, EXTENSIONS} from './constants'

const rivets = {
  // Global binders.
  binders: {},

  // Global components.
  components: {},

  // Global formatters.
  formatters: {},

  // Global sightglass adapters.
  adapters: {},

  // Default attribute prefix.
  _prefix: 'rv',

  get prefix () {
    return this._prefix
  },

  set prefix (value) {
    this._prefix = value
    this._bindingRE = new RegExp(`^${value}-`)
  },

  // Default template delimiters.
  templateDelimiters: ['{', '}'],

  // Default sightglass root interface.
  rootInterface: '.',

  // Preload data by default.
  preloadData: true,

  // Default event handler.
  handler: function(context, ev, binding) {
    this.call(context, ev, binding.view.models)
  },

  // Sets the attribute on the element. If no binder above is matched it will fall
  // back to using this binder.
  fallbackBinder: function(el, value) {
    if (value != null) {
      el.setAttribute(this.type, value)
    } else {
      el.removeAttribute(this.type)
    }
  },

  // Merges an object literal into the corresponding global options.
  configure: function(options = {}) {
    Object.keys(options).forEach(option => {
      let value = options[option]

      if (EXTENSIONS.indexOf(option) > -1) {
        Object.keys(value).forEach(key => {
          this[option][key] = value[key]
        })
      } else {
        this[option] = value
      }
    })
  }
}

rivets.prefix = 'rv';

export default rivets
