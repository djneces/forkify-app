import { async } from 'regenerator-runtime'
import {API_URL, RES_PER_PAGE, KEY} from './config.js'
// import {getJSON, sendJSON } from './helpers.js'
import { AJAX } from './helpers.js'

//BUSINESS LOGIC

export const state = {  //export, state contains all the app data 
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
}

const createRecipeObject = function(data) {
    const {recipe} = data.data //from API data.data.recipe =>destr
    return { //reformat the data, in JS we dont use _
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && {key: recipe.key}) //if recipe.key doesnt exists => shortcircuits, if recipe.key exists  => it gives us {key: recipe.key} and spread operator makes it key: recipe.key (so it fits within the object format) 
    }
}

export const loadRecipe = async function (id) { //export

    try {
        const data = await AJAX (`${API_URL}${id}?key=${KEY}`) //await

        state.recipe = createRecipeObject(data)//format data

        if(state.bookmarks.some(bookmark => bookmark.id  === id))  //if any loaded recipe is in bookmarks array, set as bookmarked, so it appears on site when reloaded
        state.recipe.bookmarked = true
        else state.recipe.bookmarked = false


    } catch (err) {
        console.error(`${err} - This is an error`);
        throw err //error thrown from helpers.js here, from here we need to rethrow to controller.js, there we can show the error via recipeView.renderError() (controller is connected to recipeView)
    }
}

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query  //saving query

        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`)  //& KEY ->docs, we have param
        console.log(data);

        //saving results
       state.search.results = data.data.recipes.map(rec => {  //return new array with new objects => we store in the state

            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url, 
                ...(rec.key && {key: rec.key}),    
            }
        })
        state.search.page = 1 //reset back to page 1
    } catch (err) {
        console.error(`${err} - This is an error`);
        throw err 
    }
}

export const getSearchResultsPage = function(page = state.search.page) { //results per page 10, depends what page is requested
        state.search.page = page  //saving into the state

        const start = (page - 1) * state.search.resultsPerPage // (page 1, 10 results per page) - 1 * 10 = 0
        const end =  page * state.search.resultsPerPage  // 1 * 10 = 10
        return state.search.results.slice(start, end)
}


export const updateServings = function(newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings
        //new Qt = oldQt * newServings / oldServings 
    })

    state.recipe.servings = newServings
}

const persistBookmarks = function() { //no need to export it, we call it here 
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const addBookmark = function(recipe) {
    //add bookmark
    state.bookmarks.push(recipe)

    //mark current recipe as bookmark
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true

    persistBookmarks()
}

export const deleteBookmark = function(id) {
    //delete bookmark
    const index = state.bookmarks.findIndex(el => el.id === id) //index will be returned
    state.bookmarks.splice(index, 1)

    //mark current recipe as NOT bookmarked
    if(id === state.recipe.id) state.recipe.bookmarked = false

    persistBookmarks()
}

//just for development
const clearBookmarks = function() {
    localStorage.clear('bookmarks')
}
// clearBookmarks()


const init = function () {
    const storage = localStorage.getItem('bookmarks')
    if(storage) state.bookmarks = JSON.parse(storage)
}

init()

export const uploadRecipe = async function(newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe).filter(entry => entry[0]
            .startsWith('ingredient') && entry[1] !== '' )  //[0] is title - we want only ingredient, [1] is value - we want only existent
            .map(ing => {
                const ingArr = ing[1].split(',').map(el => el.trim())  //string => split converts into arrays('a,b,c' => ['a','b','c']), map removes white space
                console.log(ingArr);
                if(ingArr.length !== 3) throw new Error ('Wrong ingredient format! Please use the correct format') //we all the time need quantity, unit description
                
                const [quantity, unit, description] = ingArr
                return { quantity: quantity ? +quantity : null, unit, description} //convert quantity into number 
            })
    
        // console.log(Object.entries(newRecipe)); //converts object back to ARRAY
        // console.log(Object.fromEntries(Object.entries(newRecipe))); //converts array back to OBJECT

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        }
       
        const data = await AJAX (`${API_URL}?key=${KEY}`, recipe) //url and data
        state.recipe = createRecipeObject(data) //creates recipe in the state
        addBookmark(state.recipe) //bookmarks newly added recipe

    } catch (err) {
        throw(err)
    }
    
  
    
}




