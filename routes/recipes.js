var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));

/**
 * This path returns details of 3 different recipes
 * https://api.spoonacular.com/recipes/random?number=3
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

router.get('/watchRecipe', async (req,res,next)=>{
  const recipeInfo = await recipes_utils.getRecipeFullDetails(req.params.recipeId);
  
});

module.exports = router;