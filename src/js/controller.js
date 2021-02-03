import * as model from './model.js'  //import all exported in model.js
import {MODAL_CLOSE_SEC} from './config.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView.js'
import paginationView from './views/paginationView.js'
import bookmarksView from './views/bookmarksView.js'
import addRecipeView from './views/addRecipeView.js'

import 'core-js/stable'  //polyfills everything else for Es6 standards
import 'regenerator-runtime/runtime' //polyfills async await 
import { async } from 'regenerator-runtime' 

// if(module.hot) {   //parcel code, not js. - hot module reloading, stops - like bankist we dont need to login again
//   module.hot.accept()
// }


// https://forkify-api.herokuapp.com/v2     //=> Jonas's API

///////////////////////////////////////

const controlRecipes = async function() {
  try {
    //getting URL and removing # at the beginning
    const id = window.location.hash.slice(1)

    if(!id) return //if we remove # from URL or doesnt exist

    //load spinner
    recipeView.renderSpinner()

    //1. update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage())
    
    //2.updating bookmarks view
    bookmarksView.update(model.state.bookmarks)  //update highlight in bookmark menu on active bookmark
    
    //3. LOADING RECIPE ***
    //its async func, 1async calling 1async
    await model.loadRecipe(id)
    
    //4. RENDERING RECIPE ***
    recipeView.render(model.state.recipe)
    // const recipeView = new recipeView(model.state.recipe)  //instead of render method above this works too
    
    

  } catch (err) {
    recipeView.renderError()
  }
}


const controlSearchResults = async function () { //async calls async from model.js
  try {
    resultsView.renderSpinner()

    //1. Get search query
    const query = searchView.getQuery()
    if(!query) return

    //2. Load search results
    await model.loadSearchResults(query)

    //3. Render results
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultsPage())

    //4. render pagination buttons
    paginationView.render(model.state.search)

  } catch (err) {
    console.log(err);
  }
}

const controlPagination = function(goToPage) {
  //1. render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage))

  //2. render NEW pagination buttons
  paginationView.render(model.state.search)
}

const controlServings = function(newServings) {
  //update the recipe servings (in the state)
  model.updateServings(newServings)

  //update the recipe view
  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)  //ONLY UPDATES PARTS OF WEBSITE WHAT NEEDED
}

const controlAddBookmark = function() {
  //1. add/remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)//if not in bookmarked => bookmark
  else model.deleteBookmark(model.state.recipe.id) //delete if in bookmarked

  //2.update recipe view
  recipeView.update(model.state.recipe)

  //3.render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks) //we have to load bookmarks on load event in bookmarksView, there was error with loading recipes, and init()
}

const controlAddRecipe = async function(newRecipe) { //async so we can catch the error from model.js - upload recipe
 try {
  //show loading spinner
  addRecipeView.renderSpinner()

  //upload the new recipe data
  await model.uploadRecipe(newRecipe)
  console.log(model.state.recipe);

  //render recipe
  recipeView.render(model.state.recipe)  //new recipe appears on the page

  //success message
  addRecipeView.renderMessage()

  //render bookmark view - so it appears after uploading in bookmark menu
  bookmarksView.render(model.state.bookmarks) //insert new element => render, not update

  //change ID in the URL
  window.history.pushState(null, '', `#${model.state.recipe.id}`) //change URL without reloading, state-title-url parameters

  //close form window //
  setTimeout(() => {  //we give it time to show success message window first
    addRecipeView.toggleWindow
  }, MODAL_CLOSE_SEC * 1000);

 } catch (err) {
   console.error('This is an error', err);
   addRecipeView.renderError(err.message)

 }
  
}

const init =  function() {
bookmarksView.addHandlerRender(controlBookmarks)

recipeView.addHandlerRender(controlRecipes) //publisher subscriber pattern => we passing a function into recipeView.js what we want to execute as soon as the event happens 

recipeView.addHandlerUpdateServings(controlServings) //ps

recipeView.addHandlerAddBookmark(controlAddBookmark) //ps

searchView.addHandlerSearch(controlSearchResults)// publisher subscriber pattern

paginationView.addHandlerClick(controlPagination) //publisher subscriber

addRecipeView._addHandlerUpload(controlAddRecipe) //ps

}

init()

