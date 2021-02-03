import icons from 'url:../../img/icons.svg' 

export default class View {
    _data
  render(data, render = true) {
      if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError() //if no data found, return and render error, !data -> undefined, null, 2nd check if its array but empty  

      this._data = data  //so I can use _data all over this object
      const markup = this._generateMarkup()

      if(!render) return markup

      this._clear()
      this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  update(data) {
    this._data = data  
    const newMarkup = this._generateMarkup()

    const newDOM = document.createRange().createContextualFragment(newMarkup) //converts the string in new DOM object - virtual in memory
    const newElements = Array.from(newDOM.querySelectorAll('*')) //virtual DOM, node list => array
    const curElements = Array.from(this._parentElement.querySelectorAll('*')) //current DOM
   
    // comparing the 2 DOMS 
    newElements.forEach((newEl, i) => {
        const curEl = curElements[i]  //looping through 2 arrays - i from newElements checking in curElements
        

        //updates changed TEXT
        if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {  //isEqualNode == compares 2 nodes, element node has text child node - thats what we want
            //nodeValue of text node is text content, many other node types give null
            curEl.textContent = newEl.textContent
        }

        //updates changed ATTRIBUTES
        if(!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value)) //.attributes
    })
  }

  _clear() {
      this._parentElement.innerHTML = ''
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
    `
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderError(message = this._errorMessage) { //message or default msg otherwise
    const markup = `
    <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderMessage(message = this._message) { //message or default msg otherwise
    const markup = `
    <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }
}

