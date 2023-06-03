var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

//----------------checked----------------


/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});

router.get("/", (req, res) => res.send("im here"));

/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipe_id;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

/**
 * this path sends the 3 last seen recipes by user_id 
 */
router.post('/lastSeenRecipes', async (req, res, next) =>{
  try{
    const user_id = req.session.user_id;
    const {
      recipeID_1,
      recipeID_2,
      recipeID_3,
    } = req.body;

    await user_utils.markRecipeAsSeen(user_id,recipeID_1,recipeID_2,recipeID_3);
    res.status(200).send("The Recipe successfully saved as seen");
    } catch(error){
    next(error);
  }
});

/**
 * this path return last 3 seen recipes of user_id
 */
router.get('/lastSeenRecipes', async (req, res, next) => {
  try{
    console.log(req.session.user_id);
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getLastSeenRecipes(user_id);
    res.status(200).send(recipes_id);
  } catch(error){
    next(error); 
  }
});

/*
 * Add new recipe as a logged user
 */
router.post('/addNewUserRecipe', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe = req.body;
    
    // Call the saveRecipe function to save the recipe in the database
    await user_utils.saveNewUserRecipe(recipe, user_id);
    
    res.status(200).send("The Recipe was successfully saved to the user's recipes");
  } catch (error) {
    next(error);
  }
});

router.get('/getUserRecipes', async (req, res, next) => {
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
});

module.exports = router;
