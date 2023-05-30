const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes/complexSearch";
const recipes_utils = require("./recipes_utils");

async function getSearchResult(searchParams) {
    const response = await axios.get(`${api_domain}`, {
        params: searchParams
    });
    return response.data.results;
}

async function searchRecipes(searchParams) {
    let searchResult = await getSearchResult(searchParams);
    
    let recipes_id_array = [];
    searchResult.map((recipe) => recipes_id_array.push(recipe.id)); //extracting the recipe ids into array
    
    const recipeDetailsPromises = recipes_id_array.map((recipeID) => recipes_utils.getRecipeDetails(recipeID));
    return await Promise.all(recipeDetailsPromises);
}

exports.searchRecipes = searchRecipes;
