DROP TABLE IF EXISTS userinfo CASCADE;
DROP TABLE IF EXISTS scores;

CREATE TABLE userinfo (
	username VARCHAR(20) PRIMARY KEY,
	name VARCHAR(30) NOT NULL,
	email VARCHAR(30) NOT NULL,
	password1 VARCHAR(100) NOT NULL
);

CREATE TABLE scores(
	username VARCHAR(20) REFERENCES userinfo,
	score INTEGER NOT NULL
);