import rivets from './rivets'
import {OPTIONS, EXTENSIONS} from './constants'
import {Binding, ComponentBinding} from './bindings'
import {parseTemplate} from './parsers'

const textBinder = {
  routine: (node, value) => {
    node.data = (value != null) ? value : ''
  }
}

const parseNode = (view, node) => {
  let block = false

  if (node.nodeType === 3) {
    let tokens = parseTemplate(node.data, view.templateDelimiters)

    if (tokens) {
      for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i]
        let text = document.createTextNode(token.value)
        node.parentNode.insertBefore(text, node)

        if (token.type === 1) {
          view.buildBinding(text, null, token.value, textBinder, null)
        }
      }

      node.parentNode.removeChild(node)
    }
    block = true
  } else if (node.nodeType === 1) {
    block = view.traverse(node)
  }

  if (!block) {
    for (let i = 0; i < node.childNodes.length; i++) {
      parseNode(view, node.childNodes[i]);
    }
  }
}

// A collection of bindings built from a set of parent nodes.
export default class View {
  // The DOM elements and the model objects for binding are passed into the
  // constructor along with any local options that should be used throughout the
  // context of the view and it's bindings.
  constructor(els, models, options = {}) {
    if (els.jquery || els instanceof Array) {
      this.els = els
    } else {
      this.els = [els]
    }

    this.models = models

    EXTENSIONS.forEach(extensionType => {
      this[extensionType] = {}

      if (options[extensionType]) {
        Object.keys(options[extensionType]).forEach(key => {
          this[extensionType][key] = options[extensionType][key]
        })
      }

      Object.keys(rivets[extensionType]).forEach(key => {
        if (!this[extensionType][key]) {
          this[extensionType][key] = rivets[extensionType][key]
        }
      })
    })

    OPTIONS.forEach(option => {
      this[option] = (options[option] != null) ? options[option] : rivets[option]
    })

    this.build()
  }

  options() {
    let options = {}

    EXTENSIONS.concat(OPTIONS).forEach(option => {
      options[option] = this[option]
    })

    return options
  }


  buildBinding(node, type, declaration, binder, arg) {
    let pipes = declaration.match(/((?:'[^']*')*(?:(?:[^\|']*(?:'[^']*')+[^\|']*)+|[^\|]+))|^$/g).map(pipe => {
      return pipe.trim()
    })

    let context = pipes.shift().split('<').map(ctx => {
      return ctx.trim()
    })

    let keypath = context.shift()
    let dependencies = context.shift()
    let options = {formatters: pipes}

    if (dependencies) {
      options.dependencies = dependencies.split(/\s+/)
    }

    this.bindings.push(new Binding(this, node, type, keypath, binder, arg, options))
  }

  // Parses the DOM tree and builds `Binding` instances for every matched
  // binding declaration.
  build() {
    this.bindings = []

    let elements = this.els, i, len;
    for (i = 0, len = elements.length; i < len; i++) {
      parseNode(this, elements[i])
    }

    this.bindings.sort((a, b) => {
      let aPriority = a.binder ? (a.binder.priority || 0) : 0
      let bPriority = b.binder ? (b.binder.priority || 0) : 0
      return bPriority - aPriority
    })
  }

  traverse(node) {
    let bindingPrefix = rivets._fullPrefix
    let block = node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE'
    let attributes = node.attributes
    let bindInfos = []
    var type, binder, identifier, arg


    for (let i = 0, len = attributes.length; i < len; i++) {
      let attribute = attributes[i]
      if (attribute.name.indexOf(bindingPrefix) === 0) {
        type = attribute.name.slice(bindingPrefix.length)
        binder = this.binders[type]
        arg = undefined

        if (!binder) {
          for (identifier in this.binders) {
            let starIndex = identifier.indexOf('*')
            if (starIndex > -1) {
              if (type.slice(0, starIndex) === identifier.slice(0, -1)) {
                binder = this.binders[identifier]
                arg = type.slice(starIndex)
                break
              }
            }
          }
        }

        if (!binder) {
          binder = rivets.fallbackBinder
        }

        if (binder.block) {
          this.buildBinding(node, type, attribute.value, binder, arg)
          return true;
        }

        bindInfos.push({attr: attribute, binder: binder, type: type, arg: arg})
      }
    }

    for (let i = 0; i < bindInfos.length; i++) {
      let bindInfo = bindInfos[i]
      this.buildBinding(node, bindInfo.type, bindInfo.attr.value, bindInfo.binder, bindInfo.arg)
    }

    if (!block) {
      let type = node.nodeName.toLowerCase()

      if (this.components[type] && !node._bound) {
        this.bindings.push(new ComponentBinding(this, node, type))
        block = true
      }
    }

    return block
  }

  // Binds all of the current bindings for this view.
  bind() {
    this.bindings.forEach(binding => {
      binding.bind()
    })
  }

  // Unbinds all of the current bindings for this view.
  unbind() {
    this.bindings.forEach(binding => {
      binding.unbind()
    })
  }

  // Syncs up the view with the model by running the routines on all bindings.
  sync() {
    this.bindings.forEach(binding => {
      binding.sync()
    })
  }

  // Publishes the input values from the view back to the model (reverse sync).
  publish() {
    this.bindings.forEach(binding => {
      if (binding.binder && binding.binder.publishes) {
        binding.publish()
      }
    })
  }

  // Updates the view's models along with any affected bindings.
  update(models = {}) {
    Object.keys(models).forEach(key => {
      this.models[key] = models[key]
    })

    this.bindings.forEach(binding => {
      if (binding.update) {
        binding.update(models)
      }
    })
  }
}
