const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";

/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */

/**
 * @param {*} recipe_id 
 * @returns call spoonacular api
 */
async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

/**
 * 
 * @param {*} recipe_id 
 * @returns information json from spoonacular api
 * id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree
 */
async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);

    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
    }
}

/**
 * @param {*} number - of recipes to return
 * @returns json with number of random recipes out of the spoonacular api
 */
async function getRandomRecipes(number) {
    const response = await axios.get(`${api_domain}/random`, {
        params: {
            number: number,
            apiKey: process.env.spooncular_apiKey
        }
    });
  
    const recipes = response.data.recipes.map(recipe => {
        let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
    });
  
    return recipes;
  }

/**
 * @param {*} recipe_id 
 * @returns the information abour recipe_id
 * id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, servings, instructions
 * and a list of all ingidient with their name, amount and unit meseaured
 */
  async function getRecipeFullDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let ingredients = [];
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, servings, instructions } = recipe_info.data;
    recipe_info.data.extendedIngredients.map((ingredient) =>{
        let recipeIngridient = {'name':ingredient.name, 'amount': ingredient.amount, 'unit': ingredient.unit}
        ingredients.push(recipeIngridient)
    })
    
    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        servings: servings,
        instructions: instructions,
        ingredients: ingredients
    }
}

  /**
   * no need in authentication because getting here, meaning user is logged in and authenticated in user.js
   * @param {*} recipes_array - favorites from users db
   * @returns array with recipes information
   */
  async function getRecipesPreview(recipes_array){
    let recipes_details = []
    recipes_array.map((id) => {recipes_details.push(getRecipeDetails(id));
    });
  let info_res = await Promise.all(recipes_details);
  return info_res;
}

  exports.getRecipeDetails = getRecipeDetails;
  exports.getRandomRecipes = getRandomRecipes;
  exports.getRecipeFullDetails = getRecipeFullDetails;
  exports.getRecipesPreview = getRecipesPreview;