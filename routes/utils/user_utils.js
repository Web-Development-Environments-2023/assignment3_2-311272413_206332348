const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}

// table is structred like - user_id, recipeID_1, recipeID_2, recipeID_3
// recipeID_1 will be the first watched, then move 1 to 2 and then to 3
// for last watched effect.
async function markRecipeAsWatched(user_id, recipe_id){
    const recipes = await DButils.execQuery(`select * from lastwatched where user_id = ${user_id}`);
    if (recipes.length === 0){
        await DButils.execQuery(`insert into lastwatched (user_id, recipeID_1) values (${user_id}, ${recipe_id});`);
        return;
    }

await DButils.execQuery(`
    UPDATE lastwatched
    SET recipeID_3 = recipeID_2,
        recipeID_2 = recipeID_1,
        recipeID_1 = ${recipe_id}
    WHERE user_id = ${user_id};
`);

};

async function getWatchedRecipes(user_id){
    console.log("getWa");
    const watched = await DButils.execQuery(`select * from lastwatched where user_id=${user_id}`);
    return watched[0];
};


exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markRecipeAsWatched = markRecipeAsWatched;
exports.getWatchedRecipes = getWatchedRecipes;

