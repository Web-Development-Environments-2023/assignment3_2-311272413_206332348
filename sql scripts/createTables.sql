Drop Table IF EXISTS users;
CREATE TABLE users (
    user_id INT NOT NULL AUTO_INCREMENT,
	username VARCHAR(50),
    firstname VARCHAR(50),
    lastname VARCHAR(50),
	country VARCHAR(50),
	password VARCHAR(100),
	email VARCHAR(50),
    PRIMARY KEY (user_id));

DROP TABLE IF EXISTS FavoriteRecipes;

CREATE TABLE FavoriteRecipes (
    user_id int NOT NULL,
    recipeID VARCHAR(100),
    PRIMARY KEY (user_id, recipeID),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

DROP TABLE IF EXISTS lastWatched;
CREATE TABLE lastWatched(
    user_id int NOT NULL,
    recipeID_1 VARCHAR(100),
    recipeID_2 VARCHAR(100),
    recipeID_3 VARCHAR(100),
    CONSTRAINT user_id
        FOREIGN KEY (user_id)
        REFERENCES users (user_id));