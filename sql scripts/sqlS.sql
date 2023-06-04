SELECT * from grammy_schema.users;

SELECT * from favoriterecipes;
select recipe_id from FavoriteRecipes where user_id=1;
insert into lastSeen (user_id, recipeID_1) values (1, 666554);

INSERT INTO familyRecipes (
  user_id,
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
) VALUES (
  1,
  'Lemon Garlic Roasted Chicken',
  'https://assets.bonappetit.com/photos/62f5674caf9bae430097be0f/1:1/w_1920,c_limit/0810-no-fail-roast-chicken-v2.jpg',
  60,
  4,
  0,
  0,
  1,
  '1. Preheat the oven to 375°F (190°C). \n2. In a small bowl, mix together minced garlic, lemon juice, olive oil, salt, and pepper. \n3. Rub the mixture all over the chicken, including under the skin. \n4. Place the chicken in a roasting pan and roast in the preheated oven for about 1 hour or until the internal temperature reaches 165°F (74°C). \n5. Remove from the oven and let it rest for a few minutes before serving. \n6. Enjoy your flavorful roasted chicken!',
  '1 whole chicken (about 4 pounds), 4 cloves of garlic (minced), juice of 2 lemons, 2 tablespoons olive oil, salt, pepper',
  4,
  'Emily',
  'Sunday Dinner'
);

INSERT INTO familyRecipes (
  user_id,
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
) VALUES (
  1,
  'Fresh Caprese Salad',
  'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2019/07/Caprese-Salad-2-2.jpg',
  15,
  3,
  1,
  1,
  1,
  '1. Slice the tomatoes and mozzarella cheese into 1/4-inch thick slices. \n2. Arrange the tomato and mozzarella slices on a platter, alternating them. \n3. Sprinkle fresh basil leaves over the tomato and mozzarella slices. \n4. Drizzle with olive oil and balsamic glaze. \n5. Season with salt and pepper to taste. \n6. Serve immediately and enjoy the refreshing flavors of Caprese salad!',
  '2 large tomatoes, 8 ounces fresh mozzarella cheese, fresh basil leaves, olive oil, balsamic glaze, salt, pepper',
  2,
  'Sarah',
  'Summer Lunch'
);
INSERT INTO familyRecipes (
  user_id,
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
) VALUES (
  1,
  'Delicious Pasta Carbonara',
  'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/recipe-image-legacy-id-1001491_11-2e0fa5c.jpg?quality=90&webp=true&resize=440,400',
  30,
  5,
  0,
  1,
  0,
  '1. Cook pasta according to package instructions. \n2. In a separate pan, fry bacon until crispy. \n3. In a bowl, whisk together eggs, grated cheese, and black pepper. \n4. Drain the cooked pasta and add it to the pan with the bacon. \n5. Pour the egg and cheese mixture over the pasta, stirring quickly to coat the pasta evenly. \n6. Serve hot and enjoy!',
  '200g spaghetti, 100g bacon, 2 eggs, 50g grated Parmesan cheese, black pepper',
  2,
  'John',
  'Weeknight Dinner'
);