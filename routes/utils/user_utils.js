const { getRecipeDetails } = require("./recipes_utils");

const DButils = require("./DButils");
const binarySet = {"true" : 1, "false" : 0};
const binaryGet = {1 : true, 0 : false};

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into favoriterecipes values ('${user_id}',${recipe_id})`);
};

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
};

/**
 * maybe better to save list of recipes when user is getting online,
 * and update it while connected, update the list when signs out??
 * 
 * table is structred like - user_id, recipeID_1, recipeID_2, recipeID_3
 * recipeID_1 will be the first seen, then move 1 to 2 and then to 3
 * for last seen effect.
 * @param {*} user_id - of online user watching recipes
 * @param {*} recipe_id - recipe seen by the user
 * @returns 
 */
async function markRecipeAsSeen(user_id, recipeID_1,recipeID_2,recipeID_3){
    const userSeenRecipes = await DButils.execQuery(`select * from lastSeen where user_id = ${user_id}`);
    if (userSeenRecipes.length === 0){
        await DButils.execQuery(`insert into lastSeen (user_id, recipeID_1, recipeID_2, recipeID_3)
         values (${user_id}, ${recipeID_1}, ${recipeID_2}, ${recipeID_3});`);
        return;
    }

await DButils.execQuery(`
    UPDATE lastSeen
    SET recipeID_1 = ${recipeID_1},
        recipeID_2 = ${recipeID_2},
        recipeID_3 = ${recipeID_3}
    WHERE user_id = ${user_id};
`);
};

/**
 * @param {*} user_id 
 * @returns list of 3 latest seen recipes of user_id
 */
async function getLastSeenRecipes(user_id){
    const seen = await DButils.execQuery(`select * from lastSeen where user_id=${user_id}`);
    if(seen[0] == undefined){
        return seen[0];
    }
    const recipeIds = Object.values(seen[0]).slice(1);

    const recipeDetailsPromises = []
    // const recipeDetailsPromises = recipeIds.map((recipeID) => getRecipeDetails(recipeID));
    if (recipeIds[0] !== null) {
        recipeDetailsPromises.push(getRecipeDetails(recipeIds[0]));
    }
    if (recipeIds[1] !== null) {
        recipeDetailsPromises.push(getRecipeDetails(recipeIds[1]));
    }    
    if (recipeIds[2] !== null) {
        recipeDetailsPromises.push(getRecipeDetails(recipeIds[2]));
    }

    return await Promise.all(recipeDetailsPromises);
};

async function getUserRecipes(user_id) {
    const user_recipes = await DButils.execQuery(`select * from usersRecipes where user_id='${user_id}'`)
    let recipes =[]
    user_recipes.map((userRecipe) => recipes.push(createUserRecipe(userRecipe)))
    return recipes;
}

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
  
    const servings = fullRecipe.additionalProp1.servings;
    const instructions = fullRecipe.additionalProp1.instructions;
    const ingredients = JSON.stringify(fullRecipe.additionalProp1.ingredients);
    const veganBit = binarySet[vegan];
    const vegetarianBit = binarySet[vegetarian];
    const glutenFreeBit = binarySet[glutenFree];
  
    await DButils.execQuery(`INSERT INTO usersRecipes (user_id, title, image, readyInMinutes, popularity, vegan, vegetarian, glutenFree, instructions, ingredients, servings) VALUES ('${parseInt(user_id)}', '${title}', '${image}', '${readyInMinutes}', '${popularity}', '${parseInt(veganBit)}', '${parseInt(vegetarianBit)}', '${parseInt(glutenFreeBit)}', '${instructions}', '${ingredients}', '${servings}')`)
};

async function getUserRecipes(user_id) {
    const user_recipes = await DButils.execQuery(`select * from usersRecipes where user_id='${user_id}'`)
    let recipes =[]
    user_recipes.map((userRecipe) => recipes.push(createUserRecipe(userRecipe)))
    return recipes;
};

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
};

async function getUserFamilyRecipes(user_id) {
    const personal_recipes_from_db = await getFamilyRecipes(user_id);
    result = Promise.all(personal_recipes_from_db);
    return result;
};

async function getFamilyRecipes(user_id) {
    let arr = await DButils.execQuery(
      `SELECT * FROM familyRecipes where user_id='${user_id}' `
    );
    return arr;
};

async function saveNewFamilyRecipe(recipeInfo, user_id) {
    const {
      title,
      image,
      readyInMinutes,
      popularity,
      vegan,
      vegetarian,
      glutenFree,
      instructions,
      ingredients,
      servings,
      creator,
      whenToPrepare
    } = recipeInfo;
  
    await DButils.execQuery(`INSERT INTO familyRecipes (user_id, title, image, readyInMinutes, popularity, vegan, vegetarian, glutenFree, instructions, ingredients, servings, creator, whenToPrepare) VALUES (${user_id}, '${title}', '${image}', ${readyInMinutes}, ${popularity}, ${vegan}, ${vegetarian}, ${glutenFree}, '${instructions}', '${ingredients}', ${servings}, '${creator}', '${whenToPrepare}')`);
};
  

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markRecipeAsSeen = markRecipeAsSeen;
exports.getLastSeenRecipes = getLastSeenRecipes;
exports.getUserRecipes = getUserRecipes;
exports.saveNewUserRecipe = saveNewUserRecipe;
exports.getUserRecipes = getUserRecipes;
exports.getUserFamilyRecipes = getUserFamilyRecipes;
exports.saveNewFamilyRecipe = saveNewFamilyRecipe;