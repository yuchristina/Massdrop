DROP DATABASE IF EXISTS jobs;

CREATE DATABASE jobs;

USE jobs;

CREATE TABLE jobs (
  id int NOT NULL AUTO_INCREMENT,
  url varchar(255) NOT NULL,
  html longtext,
  PRIMARY KEY (ID)
);