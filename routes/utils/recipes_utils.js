const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";

/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */

/**
 * @param {*} recipe_id 
 * @returns information json from spoonacular api
 * id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree
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

async function addRecipe(recipe) {
    const {
      id,
      title,
      readyInMinutes,
      image,
      popularity,
      vegan,
      vegetarian,
      glutenFree,
      servings,
      instructions,
      ingredients,
    } = recipe;
  
    // Save the recipe in the database
    await DButils.execQuery(
      `INSERT INTO recipes (id, user_id, title, readyInMinutes, image, popularity, vegan, vegetarian, glutenFree, servings, instructions) 
      VALUES (${id}, ${user_id}, '${title}', ${readyInMinutes}, '${image}', ${popularity}, ${vegan}, ${vegetarian}, ${glutenFree}, ${servings}, '${instructions}')`
    );
  
    // Save the recipe's ingredients in the ingredients table
    for (const ingredient of ingredients) {
      await DButils.execQuery(
        `INSERT INTO ingredients (recipe_id, name, amount, unit) 
        VALUES (${id}, '${ingredient.name}', ${ingredient.amount}, '${ingredient.unit}')`
      );
    }
  }

  exports.getRecipeDetails = getRecipeDetails;
  exports.getRandomRecipes = getRandomRecipes;
  exports.getRecipeFullDetails = getRecipeFullDetails;