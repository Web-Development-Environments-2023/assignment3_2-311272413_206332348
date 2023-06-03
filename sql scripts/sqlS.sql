SELECT * from grammy_schema.users;

SELECT * from favoriterecipes;
select recipe_id from FavoriteRecipes where user_id=1;
insert into lastSeen (user_id, recipeID_1) values (1, 666554);

-- UPDATE lastSeen
--     SET recipeID_3 = recipeID_2,
--         recipeID_2 = recipeID_1,
--         recipeID_1 = 4444
--     WHERE user_id = 1;

-- INSERT INTO usersRecipes (user_id, title, image, readyInMinutes, popularity, vegan, vegetarian, glutenFree, instructions, ingredients, servings) VALUES (1, 'chees', '"https://sugarspunrun.com/wp-content/uploads/2019/01/', 90, 120, 1, 1, 1, 'mix', 'cream', 6);
-- INSERT INTO usersRecipes (user_id, title, image, readyInMinutes, popularity, vegan, vegetarian, glutenFree, instructions, ingredients, servings) VALUES ('1', 'Cheesecake', 'https://sugarspunrun.com/wp-content/uploads/2019/01/Best-Cheesecake-Recipe-2-1-of-1-4.jpg', '90', '120', '0', '1', '0', 'mix it all up and enjoy', '[{"name":"cream chees","amount":910,"unit":"g"},{"name":"sugar","amount":200,"unit":"g"},{"name":"vanilla extract","amount":1.5,"unit":"teaspoons"},{"name":"eggs","amount":4,"unit":"large"}]', '6')

DROP TABLE IF EXISTS usersRecipes;
