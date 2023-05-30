var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const search_util = require("./utils/search_utils");
const recipes = require("./auth");

router.get("/", (req, res) => res.send("im here"));

/**
 * This path returns details of 3 different recipes
 * https://api.spoonacular.com/recipes/random
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
 * http://localhost:3000/recipes/watchRecipe
 * {
 *    "recipe_id":648852
 * }
 */
router.get('/showRecipe', async (req,res,next)=>{
  try{
    const recipeId = req.body.recipe_id;
    const recipeInfo = await recipes_utils.getRecipeFullDetails(recipeId);
    insertRecipe(recipeId);
    res.status(200).send(recipeInfo);
  } catch(error){
    next(error);
  }
});


//values
//intolerance = Dairy, ,Egg, Gluten, Grain, Peanut, Seafood, Sesame, Shellfish, Soy ,Sulfite ,Tree Nut, Wheat
//cusine = African, Asian, American, British, Cajun, Caribbean, Chinese, Eastern European, European, French
//         German, Greek, Indian, Irish, Italian ,Japanese ,Jewish ,Korean , Latin American, Mediterranean, Mexican
//         Middle Eastern, Nordic, Southern, Spanish, Thai, Vietnamese
// diet = Gluten Free, Ketogenic, Vegetarian, Lacto-Vegetarian, Ovo-Vegetarian, Vegan, Pescetarian, Paleo, Primal, Low FODMAP, Whole30
//"/search/query/:searchQuery = query(RecipeName or FoodName) /amount/:num ? Cusine='' & diet=''.'' & intolerance='' "

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
    const user_id = req.session.user_id;
    const recipes = await search_util.searchRecipes(user_id, searchParams)
    req.session.lastSearch = searchParams
    res.send(recipes)
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a full details of a recipe by its id
 * localhost:3000/recipes/657917
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


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
    
    res.status(200).send("The Recipe was successfully saved");
  } catch (error) {
    next(error);
  }
});

module.exports = router;