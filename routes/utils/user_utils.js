const { getRecipeDetails } = require("./recipes_utils");

const DButils = require("./DButils");

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
 * 
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

async function addUserRecipe(recipeDetails, user_id) {
    const {
    title,
    readyInMinutes,
    image,
    popularity,
    vegan,
    vegetarian,
    glutenFree,
    FullRecipe
    // servings,
    // instructions,
    // ingredients
    } = recipeDetails
    // const ingredients = JSON.stringify(ingredientsRec) 
    const servings = FullRecipe.servings;
    const instructions = FullRecipe.instructions;
    const ingredients = JSON.stringify(FullRecipe.ingredients);
    const veganBit = vegan==='true' ? 1 : 0;
    const vegetarianBit = vegetarian==='true' ? 1 : 0;
    const glutenFreeBit = glutenFree==='true' ? 1 : 0;
    //Add new recipe to DB
    await DButils.execQuery(`INSERT INTO usersRecipes (user_id, title, image, readyInMinutes, popularity, vegan, vegetarian, glutenFree, instructions, ingredients, servings) VALUES ('${user_id}', '${title}', '${image}', '${readyInMinutes}', '${popularity}', '${veganBit}', '${vegetarianBit}', '${glutenFreeBit}', '${instructions}', '${ingredients}', '${servings}')`)
}

async function getUserRecipes(user_id) {
    const user_recipes = await DButils.execQuery(`select * from usersRecipes where user_id='${user_id}'`)
    let recipes =[]
    user_recipes.map((userRecipe) => recipes.push(createUserRecipe(userRecipe)))
    return recipes;
}

function createUserRecipe(userRecipe) {
    bool = {1:true, 0:false};
    let recipe = {};
    recipe.id = userRecipe.id;
    recipe.user_id = userRecipe.user_id;
    recipe.title = userRecipe.title;
    recipe.readyInMinutes = userRecipe.readyInMinutes;
    recipe.image = userRecipe.image;
    recipe.popularity = userRecipe.popularity;
    recipe.glutenFree = bool[userRecipe.glutenFree];
    recipe.vegetarian = bool[userRecipe.glutenFree];;
    recipe.vegan = bool[userRecipe.glutenFree];;
    let servings = bool[userRecipe.glutenFree];;
    let instructions = userRecipe.instructions;
    let ingredients =JSON.parse(userRecipe.ingredients); 
    let FullRecipe = {
        servings: servings,
        instructions: instructions,
        ingredients: ingredients
    }
    recipe.FullRecipe = FullRecipe;
    return recipe;
}

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markRecipeAsWatched = markRecipeAsWatched;
exports.getLastWatchedRecipes = getLastWatchedRecipes;
exports.getUserRecipes = getUserRecipes;
exports.addUserRecipe = addUserRecipe;