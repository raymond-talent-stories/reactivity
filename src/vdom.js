import { Template } from './template.js'

export class VDom {
  data = null
  props = null
  computed = {}
  methods = {}
  _render = null

  proxyData = new WeakMap()

  constructor(config) {
    const { data, props, computed, methods, template, render, mounted } = config
    this.data = data
    this.props = props
    this.computed = computed
    this.methods = methods
    this._render = render
    if (template) {
      this.template = new Template(template)
    }
    if (mounted) {
      mounted.call(this)
    }
    this.watchData(data)
    this.render()
  }

  watchData(data) {
    if (data === null) {
      return
    }
    const dataProxy = new DataProxy(data, () => {
      this.render()
    })
    dataProxy.proxy()
  }

  render() {
    this.template.updateWith(this.data)
  }
}

class DataProxy {
  keyMap = {}
  constructor (data, callback) {
    this.data = data
    this.callback = callback
  }
  proxy() {
    for (let key in this.data) {
      this.keyMap[key] = this.data[key]
      const val = this.keyMap[key]

      switch (typeof val) {
        case 'string':
        case 'number':
        case 'boolean':
        case 'symbol':
        case 'undefined':
        case 'function':
          Object.defineProperty(this.data, key, {
            get: () => {
              return this.keyMap[key]
            },
            set: (value) => {
              this.keyMap[key] = value
              this.callback()
            }
          })
          break
        case 'object':
          const dataProxy = new DataProxy(val, this.callback)
          dataProxy.proxy()
      }
    }
  }
}