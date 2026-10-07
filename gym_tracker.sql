-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: gym_tracker
-- ------------------------------------------------------
-- Server version	8.0.46-0ubuntu0.22.04.4

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `exercises`
--

DROP TABLE IF EXISTS `exercises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercises` (
  `id` int NOT NULL AUTO_INCREMENT,
  `workout_day_id` int NOT NULL,
  `exercise_name` varchar(100) NOT NULL,
  `workout_time` time NOT NULL,
  PRIMARY KEY (`id`),
  KEY `workout_day_id` (`workout_day_id`),
  CONSTRAINT `exercises_ibfk_1` FOREIGN KEY (`workout_day_id`) REFERENCES `workout_days` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercises`
--

LOCK TABLES `exercises` WRITE;
/*!40000 ALTER TABLE `exercises` DISABLE KEYS */;
/*!40000 ALTER TABLE `exercises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sets`
--

DROP TABLE IF EXISTS `sets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `exercise_id` int NOT NULL,
  `set_number` int NOT NULL,
  `reps` int NOT NULL,
  `weight` decimal(6,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `exercise_id` (`exercise_id`),
  CONSTRAINT `sets_ibfk_1` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sets`
--

LOCK TABLES `sets` WRITE;
/*!40000 ALTER TABLE `sets` DISABLE KEYS */;
/*!40000 ALTER TABLE `sets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workout_days`
--

DROP TABLE IF EXISTS `workout_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workout_days` (
  `id` int NOT NULL AUTO_INCREMENT,
  `workout_date` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `workout_date` (`workout_date`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workout_days`
--

LOCK TABLES `workout_days` WRITE;
/*!40000 ALTER TABLE `workout_days` DISABLE KEYS */;
INSERT INTO `workout_days` VALUES (1,'2026-10-06');
/*!40000 ALTER TABLE `workout_days` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workout_exercises`
--

DROP TABLE IF EXISTS `workout_exercises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workout_exercises` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `workout_date` date NOT NULL,
  `exercise` varchar(150) NOT NULL,
  `workout_time` time NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_workout_exercises_date` (`workout_date`),
  CONSTRAINT `fk_workout_exercises_day` FOREIGN KEY (`workout_date`) REFERENCES `workout_days` (`workout_date`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workout_exercises`
--

LOCK TABLES `workout_exercises` WRITE;
/*!40000 ALTER TABLE `workout_exercises` DISABLE KEYS */;
INSERT INTO `workout_exercises` VALUES (1,'2026-10-06','hello','21:49:48'),(2,'2026-10-06','1','21:52:19');
/*!40000 ALTER TABLE `workout_exercises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workout_sets`
--

DROP TABLE IF EXISTS `workout_sets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workout_sets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `exercise_id` bigint unsigned NOT NULL,
  `set_number` smallint unsigned NOT NULL,
  `reps` decimal(8,2) NOT NULL,
  `weight` decimal(8,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_workout_set_number` (`exercise_id`,`set_number`),
  CONSTRAINT `fk_workout_sets_exercise` FOREIGN KEY (`exercise_id`) REFERENCES `workout_exercises` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workout_sets`
--

LOCK TABLES `workout_sets` WRITE;
/*!40000 ALTER TABLE `workout_sets` DISABLE KEYS */;
INSERT INTO `workout_sets` VALUES (1,1,1,1.00,1.00),(2,1,2,1.00,11.00),(3,1,3,1.00,1.00),(4,2,1,3.00,1.00);
/*!40000 ALTER TABLE `workout_sets` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-07 17:22:27
