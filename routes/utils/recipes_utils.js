const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";

/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    console.log(recipe_info);
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

  exports.getRecipeDetails = getRecipeDetails;
  exports.getRandomRecipes = getRandomRecipes;
  exports.getRecipeFullDetails = getRecipeFullDetails;