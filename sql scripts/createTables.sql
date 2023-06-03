Drop Table IF EXISTS users;
CREATE TABLE users (
    user_id INT NOT NULL AUTO_INCREMENT,
	username VARCHAR 50,
    firstname VARCHAR 50,
    lastname VARCHAR 50,
	country VARCHAR 50,
	password VARCHAR 50,
	email VARCHAR 50,
    PRIMARY KEY user_id);

DROP TABLE IF EXISTS FavoriteRecipes;

CREATE TABLE FavoriteRecipes (
    user_id int NOT NULL,
    recipe_id VARCHAR(100),
    PRIMARY KEY (user_id, recipe_id),
    INDEX user_id_idx (user_id ASC),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

DROP TABLE IF EXISTS lastSeen;
CREATE TABLE lastSeen(
    user_id int NOT NULL,
    recipeID_1 VARCHAR(100),
    recipeID_2 VARCHAR(100),
    recipeID_3 VARCHAR(100),
    CONSTRAINT user_id
        FOREIGN KEY (user_id)
        REFERENCES users (user_id));

DROP TABLE IF EXISTS usersRecipes;

CREATE TABLE usersRecipes (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR (100) NOT NULL,
  image LONGTEXT NOT NULL,
  readyInMinutes INT NOT NULL,
  popularity INT NOT NULL,
  vegan BOOLEAN NOT NULL,
  vegetarian BOOLEAN NOT NULL,
  glutenFree BOOLEAN NOT NULL,
  instructions LONGTEXT NOT NULL,
  ingredients NVARCHAR(4000) NOT NULL,
  servings INT NOT NULL,
  PRIMARY KEY (id)
);



-- -- Active: 1685360582227@@127.0.0.1@3306@grammy

-- -- users table
-- DROP TABLE IF EXISTS `grammy`.`users`;

-- CREATE TABLE `grammy`.`users` (
--     user_id INT NOT NULL AUTO_INCREMENT,
--     username VARCHAR(50),
--     firstname VARCHAR(50),
--     lastname VARCHAR(50),
--     country VARCHAR(50),
--     password VARCHAR(100),
--     email VARCHAR(50),
--     PRIMARY KEY (user_id)
-- );

-- -- favoriterecipes table
-- DROP TABLE IF EXISTS `grammy`.`FavoriteRecipes`;

-- CREATE TABLE `grammy`.`FavoriteRecipes` (
--     user_id INT NOT NULL,
--     recipeID VARCHAR(100),
--     PRIMARY KEY (user_id, recipeID),
--     FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
-- );


-- -- lastSeen table
-- DROP TABLE IF EXISTS `grammy`.`lastSeen`;

-- CREATE TABLE `grammy`.`lastSeen`(
--     user_id INT NOT NULL,
--     recipeID_1 VARCHAR(100),
--     recipeID_2 VARCHAR(100),
--     recipeID_3 VARCHAR(100),
--     CONSTRAINT user_id
--         FOREIGN KEY (user_id)
--         REFERENCES users (user_id)
--         ON DELETE CASCADE
-- );

-- -- recipes table
-- DROP TABLE IF EXISTS `grammy`.`recipes`;

-- CREATE TABLE `grammy`.`recipes` (
--     id INT PRIMARY KEY,
--     user_id INT,
--     title VARCHAR(255),
--     readyInMinutes INT,
--     image VARCHAR(255),
--     popularity INT,
--     vegan BOOLEAN,
--     vegetarian BOOLEAN,
--     glutenFree BOOLEAN,
--     servings INT,
--     instructions TEXT,
--     FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
-- );



-- -- ingredients table
-- DROP TABLE IF EXISTS `grammy`.`ingredients`;

-- CREATE TABLE `grammy`.`ingredients` (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     recipe_id INT,
--     name VARCHAR(255),
--     amount FLOAT,
--     unit VARCHAR(50),
--     FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
-- );


-- -- saved_recipes table
-- DROP TABLE IF EXISTS `grammy`.`saved_recipes`;

-- CREATE TABLE `grammy`.`saved_recipes` (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT,
--     recipe_id INT,
--     FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
--     FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
-- );


