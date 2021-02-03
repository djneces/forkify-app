import View from './View.js'
import icons from 'url:../../img/icons.svg' 

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination')

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--inline') //looking for parent btn element, within the button there is svg and span too
           
            if(!btn) return  //stop so we dont get error if we click outside the btn

            const goToPage = +btn.dataset.goto  //was a string => convert to number

            handler(goToPage) //execute handler !
        })

    }

    _generateMarkup() {  //this._data from View.js is accessible here
        const curPage = this._data.page //current page
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage)

        //page 1, there are other page
        if(curPage === 1 && numPages > 1) {
            //next page
            return `
                <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
                </button>
            `
        }
        //last page
        if(curPage === numPages && numPages > 1) {
            //prev page
            return  `
                <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
                 </button>
            `
        }
        //other page
        if(curPage < numPages) {
            return `
                ${/*we need to connect HTML with JS through data attribute  */''}
                <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
                 </button>
                 <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                 <span>Page ${curPage + 1}</span>
                 <svg class="search__icon">
                 <use href="${icons}#icon-arrow-right"></use>
                 </svg>
                 </button>
            `
        }
        //page 1, there are NO other page
        return '' //nowhere to go
    }

}

export default new PaginationView()