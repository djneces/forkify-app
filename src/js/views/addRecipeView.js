import View from './View.js'
import icons from 'url:../../img/icons.svg' 

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload')
    _message = 'Recipe was successfully uploaded'

    _window = document.querySelector('.add-recipe-window')
    _overlay = document.querySelector('.overlay')
    _btnOpen = document.querySelector('.nav__btn--add-recipe')
    _btnClose = document.querySelector('.btn--close-modal')

    constructor() {
        super()
        this._addHandlerShowWindow() //is only used inside this class
        this._addHandlerHideWindow() //so it work we need to call it here
    }

    toggleWindow() {  //exported from addHandlerShowWindow, to get the correct this, helper
        this._overlay.classList.toggle('hidden')
        this._window.classList.toggle('hidden')
       
    }

    _addHandlerShowWindow() {  //we dont need controller for this func, it opens only window
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)) //bind to the correct object, not the btnOpen
    }

    _addHandlerHideWindow() {  
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this)) //close btn
        this._overlay.addEventListener('click', this.toggleWindow.bind(this)) //close windows on click on overlay too
    }

    _addHandlerUpload(handler) { //we call it from controller.js, no need to be loaded in constructor here
        this._parentElement.addEventListener('submit', function(e) {
            e.preventDefault()
            const dataArr = [...new FormData(this)] //this = form, array with all the values in the form, IMPORTANT
            const data = Object.fromEntries(dataArr) //converts into Object from entries
       
            handler(data) 
        })
    }
   
    _generateMarkup() {  

    }

}

export default new AddRecipeView()