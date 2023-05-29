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
async function getWatchedRecipes(user_id){
    const watched = await DButils.execQuery(`select * from lastwatched where user_id=${user_id}`);
    const recipeIds = Object.values(watched[0]).slice(1);

    const recipeDetailsPromises = recipeIds.map((recipeID) => getRecipeDetails(recipeID));
    return await Promise.all(recipeDetailsPromises);
};


exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markRecipeAsWatched = markRecipeAsWatched;
exports.getWatchedRecipes = getWatchedRecipes;

