import View from './View.js'
import previewView from './previewView.js'
import icons from 'url:../../img/icons.svg' 

class ResultsView extends View {
    _parentElement = document.querySelector('.results')
    _errorMessage = 'No recipes found for your query! Please try again.'
    _message = ''

    _generateMarkup() {
        return this._data.map(result => previewView.render(result, false)).join('') //its an array - we need to loop through and add markup
    }
}

export default new ResultsView()