const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes/complexSearch?";
const recipes_utils = require("./recipes_utils");

async function getSearchResult(searchParams) {
    let query = updateQuery(searchParams)
    const response = await axios.get(`${query}`, {
        params: searchParams
    });
    return response.data.results;
}

function updateQuery(searchParams){
    let query = api_domain;
    if(searchParams.query) {
        query += `query=${searchParams.query}&`;
    }
    if(searchParams.cuisine) {
        query += `cuisine=${searchParams.cuisine}&`;
    }
    if(searchParams.diet) {
        query += `diet=${searchParams.diet}&`;
    }
    if(searchParams.intolerances) {
        query += `intolerances=${searchParams.intolerances}&`;
    }
    if(searchParams.number) {
        query += `number=${searchParams.number}&`;
    }

    query += "addRecipeInformation=true&instructionsRequired=true&fillIngredients=true";
    return query
}

async function searchRecipes(searchParams) {
    let searchResult = await getSearchResult(searchParams);
    
    let recipes_id_array = [];
    searchResult.map((recipe) => recipes_id_array.push(recipe.id)); //extracting the recipe ids into array
    
    const recipeDetailsPromises = recipes_id_array.map((recipeID) => recipes_utils.getRecipeDetails(recipeID));
    return await Promise.all(recipeDetailsPromises);
}

exports.searchRecipes = searchRecipes;
