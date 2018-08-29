-- MySQL dump 10.16  Distrib 10.1.23-MariaDB, for debian-linux-gnueabihf (armv7l)
--
-- Host: localhost    Database: recipes
-- ------------------------------------------------------
-- Server version	10.1.23-MariaDB-9+deb9u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Ingredient`
--

DROP TABLE IF EXISTS `Ingredient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Ingredient` (
  `IngredientID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  PRIMARY KEY (`IngredientID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Meal`
--

DROP TABLE IF EXISTS `Meal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Meal` (
  `MealID` int(11) NOT NULL AUTO_INCREMENT,
  `Difficulty` int(11) NOT NULL,
  `Steps` text NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Type` int(11) NOT NULL,
  PRIMARY KEY (`MealID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MealIngredient`
--

DROP TABLE IF EXISTS `MealIngredient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MealIngredient` (
  `MealIngredientID` int(11) NOT NULL AUTO_INCREMENT,
  `Amount` varchar(54) NOT NULL,
  `MealID` int(11) NOT NULL,
  `IngredientID` int(11) NOT NULL,
  PRIMARY KEY (`MealIngredientID`),
  KEY `MealID` (`MealID`),
  KEY `IngredientID` (`IngredientID`),
  CONSTRAINT `MealIngredient_ibfk_1` FOREIGN KEY (`MealID`) REFERENCES `Meal` (`MealID`),
  CONSTRAINT `MealIngredient_ibfk_2` FOREIGN KEY (`IngredientID`) REFERENCES `Ingredient` (`IngredientID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-08-29 11:21:50
