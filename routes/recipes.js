var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const search_util = require("./utils/search_utils");
const recipes = require("./auth");

router.get("/", (req, res) => res.send("im here"));

/**
 * This path returns details of 3 different recipes
 * https://api.spoonacular.com/recipes/random
 * ----checked----
 */
router.get("/random", async (req, res, next) => {
  try {
    const recipes = await recipes_utils.getRandomRecipes(3);
    res.send(recipes);
  } catch (error) {
    next(error);
  }
});

/**
 * this path recives the recipe_id sent as a parameter all needed parameters
 * http://localhost:3000/recipes/watchRecipe/648852
 * ----checked----
 */
router.get('/showRecipe/:recipe_id', async (req,res,next)=>{
  try{
    const recipeId = req.params.recipe_id;
    const recipeInfo = await recipes_utils.getRecipeFullDetails(recipeId);
    res.status(200).send(recipeInfo);
  } catch(error){
    next(error);
  }
});

/*
values
intolerance = Dairy, ,Egg, Gluten, Grain, Peanut, Seafood, Sesame, Shellfish, Soy ,Sulfite ,Tree Nut, Wheat
cusine = African, Asian, American, British, Cajun, Caribbean, Chinese, Eastern European, European, French
         German, Greek, Indian, Irish, Italian ,Japanese ,Jewish ,Korean , Latin American, Mediterranean, Mexican
         Middle Eastern, Nordic, Southern, Spanish, Thai, Vietnamese
diet = Gluten Free, Ketogenic, Vegetarian, Lacto-Vegetarian, Ovo-Vegetarian, Vegan, Pescetarian, Paleo, Primal, Low FODMAP, Whole30
"/search/query/:searchQuery = query(RecipeName or FoodName) /amount/:num ? Cusine='' & diet=''.'' & intolerance='' "
*/

//http://localhost:3000/recipes/search/query/burger/amount/5?intolerance=Sesame&cusine=German&diet=Gluten Free
router.get("/search/query/:searchQuery", async (req, res, next) => {
  const searchQuery = req.params.searchQuery;
  // set search params
  let searchParams = {};
  searchParams.query = searchQuery;

  let {number, intolerance, Cuisine ,diet} = req.query;
  searchParams.intolerance = intolerance;
  searchParams.Cuisine = Cuisine;
  
  searchParams.number = 5;
  if (number !== undefined) {
    searchParams.number = number;
  }

  searchParams.diet = diet;
  searchParams.instructionsRequired = true;
  searchParams.addRecipeInformation = true;
  searchParams.fillIngredients = true;

  searchParams.apiKey = process.env.spooncular_apiKey;
  
  try {
    // const user_id = req.session.user_id;
    const recipes = await search_util.searchRecipes(searchParams)
    if (recipes.length == 0){
      res.sendStatus(404);
    }
    else{
      res.status(200).send(recipes);
      req.session.lastSearch = searchParams
    }
    //save last search to cookie
  } catch (error) {
    next(error);
  }
});

router.get("/history", async(req, res, next) =>{
  
})

/**
 * This path returns a full details of a recipe by its id
 * localhost:3000/recipes/657917
 * ----checked----
 */
router.get("/getRecipe/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


/**
 * This path saves this user recipe in the user recipe list of the logged-in user
 */
router.post('/myrecipes', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipeDetails = req.body;
    await user_utils.addUserRecipe(recipeDetails, user_id);
    res.status(200).send("The Recipe successfully to user's recipes");
  } catch (error) {
    next(error);
  }
})

router.get('/myrecipes', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    recipes = await user_utils.getUserRecipes(user_id);
    if (recipes.length == 0){
      res.sendStatus(404)
    }
    else{
      res.status(200).send(recipes);
    }
  } catch (error) {
    next(error);
  }
})


/**
 * add new recipe as a logged user
 */
router.post('/addRecipe', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe = req.body.recipe;
    recipe.user_id = user_id;
    
    // Call the saveRecipe function to save the recipe in the database
    await recipe_utils.addRecipe(recipe);
    
    res.status(200).send("Recipe successfully saved");
  } catch (error) {
    next(error);
  }
});

module.exports = router;