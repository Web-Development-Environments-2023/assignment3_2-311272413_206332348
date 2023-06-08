var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const search_util = require("./utils/search_utils");

router.get("/", (req, res) => res.send("im here"));

/**
 * This path returns details of 3 different recipes
 * usage: http://localhost:3000/recipes/random
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
 * usage: http://localhost:3000/recipes/watchRecipe/648852
 */
router.get('/showRecipe/:recipe_id', async (req,res,next)=>{
  try{
    const recipeId = req.params.recipe_id;
    const recipeInfo = await recipes_utils.getRecipeFullDetails(parseInt(recipeId));
    res.status(200).send(recipeInfo);
  } catch(error){
    next(error);
  }
});

/**
 * possible values
 * values
 * intolerances = Dairy, ,Egg, Gluten, Grain, Peanut, Seafood, Sesame, Shellfish, Soy ,Sulfite ,Tree Nut, Wheat
 * cusine = African, Asian, American, British, Cajun, Caribbean, Chinese, Eastern European, European, French
         German, Greek, Indian, Irish, Italian ,Japanese ,Jewish ,Korean , Latin American, Mediterranean, Mexican
         Middle Eastern, Nordic, Southern, Spanish, Thai, Vietnamese
 * diet = Gluten Free, Ketogenic, Vegetarian, Lacto-Vegetarian, Ovo-Vegetarian, Vegan, Pescetarian, Paleo, Primal, Low FODMAP, Whole30
 * usage: http://localhost:3000/recipes/search/query/burger?amount=5&intolerances=Sesame&cusine=German&diet=Gluten Free
 * in frontend - client - there will be only 3 options -> 5(default), 10, 15
 * now every number is allowd but from client side only 3 legal options.
 */
router.get("/search/query/:searchQuery", async (req, res, next) => {
  const searchQuery = req.params.searchQuery;
  // set search params
  let searchParams = {};
  searchParams.query = searchQuery;

  let {number, intolerances, cuisine ,diet} = req.query;
  
  if(intolerances)
    searchParams.intolerances = intolerances;
  if(cuisine)
    searchParams.cuisine = cuisine;

  searchParams.number = parseInt(number);
  if (number === undefined) {
    searchParams.number = 5;
  }

  if(diet)
    searchParams.diet = diet;

  searchParams.apiKey = process.env.spooncular_apiKey;
  
  try {
    // const user_id = req.session.user_id;
    const recipes = await search_util.searchRecipes(searchParams)
    if (recipes.length == 0){
      res.status(404).send("No Recipes found");
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


/**
 * This path returns a full details of a recipe by its id
 * usage: localhost:3000/recipes/getRecipe/657917
 */
router.get("/getRecipe/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


module.exports = router;