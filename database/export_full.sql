-- MySQL dump 10.13  Distrib 8.0.36, for macos14 (x86_64)
--
-- Host: localhost    Database: careerbridge_db
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int DEFAULT NULL,
  `internship_id` int DEFAULT NULL,
  `status` enum('Pending','Accepted','Rejected') DEFAULT 'Pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_id` (`student_id`,`internship_id`),
  KEY `internship_id` (`internship_id`),
  CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`internship_id`) REFERENCES `internships` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES (1,1,3,'Rejected'),(2,1,1,'Accepted'),(3,1,4,'Accepted'),(5,3,1,'Rejected'),(6,3,3,'Accepted'),(7,3,4,'Accepted'),(8,2,1,'Rejected'),(9,2,2,'Accepted'),(10,2,3,'Rejected');
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (1,'Google','google@mail.com','$2b$10$U7eUUcjPDGk4NKgWk.LqEuvC6zZNFi5VDHxs48VgV1Zk8QOQ1hUHa','We build tools that help billions of people find, connect, and create online — from Search and Maps to AI and Android.'),(2,'Apple','apple@mail.com','$2b$10$eEU04YKYelyLWYnntkRAJ.o2LKc3gFtjih274AwbXei0xnUu5XlPa','We design hardware, software, and services that shape the future - from iPhone and Mac to iOS and creative tools.');
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `internships`
--

DROP TABLE IF EXISTS `internships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `internships` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `requirements` text,
  `location` varchar(255) DEFAULT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `posted_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `internships_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `internships`
--

LOCK TABLES `internships` WRITE;
/*!40000 ALTER TABLE `internships` DISABLE KEYS */;
INSERT INTO `internships` VALUES (1,1,'Full-Stack Developer Intern','Join our team to build and improve web-based tools used by millions. You’ll work across the stack — from responsive frontends to scalable backend services.','Solid knowledge of JavaScript, HTML/CSS, Experience with backend languages (Node.js, Python, or similar), Basic understanding of databases (SQL or NoSQL)','Dubai','3–6 months (flexible start)','2025-06-22 22:46:03'),(2,1,'Front-End Developer Intern','Help us design and develop user-friendly web interfaces used by millions. You\'ll work with modern frameworks to build fast and accessible UIs.','Familiar with frameworks like React or Angular, Basic understanding of responsive and accessible design, Strong skills in HTML, CSS, and JavaScript','California','5-10 months (flexible start)','2025-06-22 22:47:27'),(3,2,'iOS Developer Intern','Join our mobile team to help build sleek, intuitive apps for iPhone and iPad. You’ll contribute to real-world products used by millions.','Basic knowledge of Swift or Objective-C, Familiarity with Xcode and iOS development tools','Miami','1 year','2025-06-22 22:49:37'),(4,2,'Web Developer Intern','Work on Apple’s web platforms to craft smooth, responsive websites that reflect our design philosophy.','Proficiency in HTML, CSS, and JavaScript','Remote','3–6 months','2025-06-22 22:50:16');
/*!40000 ALTER TABLE `internships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `university` varchar(100) DEFAULT NULL,
  `skills` text,
  `resume` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'Nikita Veliev','nv790@uowd.com','$2b$10$HTqQFdV326RVf1Xme51HHO8TwdX9NUCYq.KUcZKdqig6dcV5XgJjS',' University Of Wollongong in Dubai (UOWD)','FullStack development, Node.js, JS, HTML, CSS','1750616847863-482624058.docx'),(2,'Ivan Odnovol','io010@uowd.com','$2b$10$UtOsWf5bE2s6yipG2HX0D.o/QFU2OqGXH350GXY6o2h5eVv0FXxeW','University Of Wollongong in Dubai (UOWD)','FrontEnd development, CSS, HTML, JS','1750616909545-418973707.docx'),(3,'Feliks Gumennyy','fg@uowd.com','$2b$10$a92zwBrb/Rmg7DJWPd8mxeKgahJkj0PSoyJojSk0f26JF.m5lx3Wy','University Of Wollongong in Dubai (UOWD)','FrontEnd development, HTML, JS, Management skills','1750617423583-88190678.docx');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-22 23:03:54
