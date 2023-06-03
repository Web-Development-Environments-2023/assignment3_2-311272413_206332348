SELECT * from grammy_schema.users;

SELECT * from favoriterecipes;
select recipe_id from FavoriteRecipes where user_id=1;
insert into lastwatched (user_id, recipeID_1) values (1, 666554);

-- UPDATE lastwatched
--     SET recipeID_3 = recipeID_2,
--         recipeID_2 = recipeID_1,
--         recipeID_1 = 4444
--     WHERE user_id = 1;
