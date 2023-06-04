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


DROP TABLE IF EXISTS familyRecipes;
CREATE TABLE familyRecipes (
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
  creator VARCHAR (30) NOT NULL,
  whenToPrepare LONGTEXT NOT NULL,
  PRIMARY KEY (id)
);