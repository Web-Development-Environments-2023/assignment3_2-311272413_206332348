const { getRecipeDetails } = require("./recipes_utils");

const DButils = require("./DButils");
const binarySet = {"true" : 1, "false" : 0};
const binaryGet = {1 : true, 0 : false};

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}

/**
 * maybe better to save list of recipes when user is getting online,
 * and update it while connected, update the list when signs out??
 * 
 * table is structred like - user_id, recipeID_1, recipeID_2, recipeID_3
 * recipeID_1 will be the first watched, then move 1 to 2 and then to 3
 * for last watched effect.
 * @param {*} user_id - of online user watching recipes
 * @param {*} recipe_id - recipe watched by the user
 * @returns 
 */
async function markRecipeAsWatched(user_id, recipeID_1,recipeID_2,recipeID_3){
    const userWatchedRecipes = await DButils.execQuery(`select * from lastwatched where user_id = ${user_id}`);
    if (userWatchedRecipes.length === 0){
        await DButils.execQuery(`insert into lastwatched (user_id, recipeID_1, recipeID_2, recipeID_3)
         values (${user_id}, ${recipeID_1}, ${recipeID_2}, ${recipeID_3});`);
        return;
    }

await DButils.execQuery(`
    UPDATE lastwatched
    SET recipeID_1 = ${recipeID_1},
        recipeID_2 = ${recipeID_2},
        recipeID_3 = ${recipeID_3}
    WHERE user_id = ${user_id};
`);
};

/**
 * @param {*} user_id 
 * @returns list of 3 latest watched recipes of user_id
 */
async function getLastWatchedRecipes(user_id){
    const watched = await DButils.execQuery(`select * from lastwatched where user_id=${user_id}`);
    if(watched[0] == undefined){
        return watched[0];
    }
    const recipeIds = Object.values(watched[0]).slice(1);

    const recipeDetailsPromises = recipeIds.map((recipeID) => getRecipeDetails(recipeID));
    return await Promise.all(recipeDetailsPromises);
};


async function getUserRecipes(user_id) {
    const user_recipes = await DButils.execQuery(`select * from usersRecipes where user_id='${user_id}'`)
    let recipes =[]
    user_recipes.map((userRecipe) => recipes.push(createUserRecipe(userRecipe)))
    return recipes;
}

// async function saveNewUserRecipe(recipeDetails, user_id) {
//     const {title, readyInMinutes, image, popularity, vegan, vegetarian, glutenFree, fullRecipe} = recipeDetails

//     const servings = fullRecipe.servings;
//     const instructions = fullRecipe.instructions;
//     const ingredients = JSON.stringify(fullRecipe.ingredients);
//     const veganBit = binarySet[vegan];
//     const vegetarianBit = binarySet[vegetarian];
//     const glutenFreeBit = binarySet[glutenFree];
//     await DButils.execQuery(`INSERT INTO usersRecipes (user_id, title, image, readyInMinutes, popularity, vegan, vegetarian, glutenFree, instructions, ingredients, servings) VALUES ('${parseInt(user_id)}', '${title}', '${image}', '${readyInMinutes}', '${popularity}', '${parseInt(veganBit)}', '${parseInt(vegetarianBit)}', '${parseInt(glutenFreeBit)}', '${instructions}', '${ingredients}', '${servings}')`)
// }

async function saveNewUserRecipe(recipeInfo, user_id) {
    const {
      title,
      readyInMinutes,
      image,
      popularity,
      vegan,
      vegetarian,
      glutenFree,
      fullRecipe
    } = recipeInfo;
  
    const servings = fullRecipe.servings;
    const instructions = fullRecipe.instructions;
    const ingredients = JSON.stringify(fullRecipe.ingredients);
    const veganBit = binarySet[vegan];
    const vegetarianBit = binarySet[vegetarian];
    const glutenFreeBit = binarySet[glutenFree];
  
    await DButils.execQuery(`INSERT INTO usersRecipes (user_id, title, image, readyInMinutes, popularity, vegan, vegetarian, glutenFree, instructions, ingredients, servings) VALUES ('${parseInt(user_id)}', '${title}', '${image}', '${readyInMinutes}', '${popularity}', '${parseInt(veganBit)}', '${parseInt(vegetarianBit)}', '${parseInt(glutenFreeBit)}', '${instructions}', '${ingredients}', '${servings}')`)
  }
  

async function getUserRecipes(user_id) {
    const user_recipes = await DButils.execQuery(`select * from usersRecipes where user_id='${user_id}'`)
    let recipes =[]
    user_recipes.map((userRecipe) => recipes.push(createUserRecipe(userRecipe)))
    return recipes;
}

function createUserRecipe(userRecipe) {
    const {
      id,
      user_id,
      title,
      readyInMinutes,
      image,
      popularity,
      glutenFree,
      vegetarian,
      vegan,
      servings,
      instructions,
      ingredients
    } = userRecipe;
  
    const recipe = {
      id,
      user_id,
      title,
      readyInMinutes,
      image,
      popularity,
      glutenFree: binaryGet[glutenFree],
      vegetarian: binaryGet[vegetarian],
      vegan: binaryGet[vegan],
      FullRecipe: {
        servings,
        instructions,
        ingredients: JSON.parse(ingredients)
      }
    };
  
    return recipe;
  }
  

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markRecipeAsWatched = markRecipeAsWatched;
exports.getLastWatchedRecipes = getLastWatchedRecipes;
exports.getUserRecipes = getUserRecipes;
exports.saveNewUserRecipe = saveNewUserRecipe;
exports.getUserRecipes = getUserRecipes;