class SearchView { //this class doesnt render anything, only its the query and event
    _parentEl = document.querySelector('.search')

    getQuery() {
       const query = this._parentEl.querySelector('.search__field').value
        this._clearInput()
        return query
    }

    _clearInput() {
        this._parentEl.querySelector('.search__field').value = ''
    }

    addHandlerSearch(handler) {  //publisher, controlSearchResults func in controller.js is the subscriber
        this._parentEl.addEventListener('submit', function(e) {
            e.preventDefault()
            handler()
        })
    }
}

export default new SearchView()