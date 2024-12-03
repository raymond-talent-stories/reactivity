export class Template {
  constructor (str) {
    this.data = str
    this.node = document.createElement('div')
  }

  updateWith(vdom) {
    this.node.innerHTML = Handlebars.compile(this.data)(vdom)
  }
}