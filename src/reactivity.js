export class Reactivity {
  constructor (options) {
    const { render } = options
    /**
     * {
     *   render: h => h(App)
     * }
     */
    this.velement = render()
  }

  mount(domElement) {
    domElement.appendChild(this.velement.template.node)
  }
}