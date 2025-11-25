CREATE DATABASE  IF NOT EXISTS `altiusv3` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `altiusv3`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: altiusv3
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` json DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text,
  `is_active` bit(1) DEFAULT NULL,
  `max_score` int DEFAULT NULL,
  `time_limit_minutes` int DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `institution_id` bigint NOT NULL,
  `school_grade_id` bigint DEFAULT NULL,
  `teacher_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhsrw5fnlxxkm05k5ponlpef8u` (`institution_id`),
  KEY `FK3p76nnylf6kpbpd7324yb6agu` (`school_grade_id`),
  KEY `FK5bwx79011nfibyuvatb391nx8` (`teacher_id`),
  CONSTRAINT `FK3p76nnylf6kpbpd7324yb6agu` FOREIGN KEY (`school_grade_id`) REFERENCES `school_grades` (`id`),
  CONSTRAINT `FK5bwx79011nfibyuvatb391nx8` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKhsrw5fnlxxkm05k5ponlpef8u` FOREIGN KEY (`institution_id`) REFERENCES `institutions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `activity_results`
--

DROP TABLE IF EXISTS `activity_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_results` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `answers` json DEFAULT NULL,
  `is_completed` bit(1) DEFAULT NULL,
  `max_score` int DEFAULT NULL,
  `score` int NOT NULL,
  `submitted_at` datetime(6) DEFAULT NULL,
  `time_spent_minutes` int DEFAULT NULL,
  `activity_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1bssm4g8yej4b2b62bukni02u` (`activity_id`),
  KEY `FKc76uuuorvr5hsn88sw2mtu8ct` (`user_id`),
  CONSTRAINT `FK1bssm4g8yej4b2b62bukni02u` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`),
  CONSTRAINT `FKc76uuuorvr5hsn88sw2mtu8ct` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `assignments`
--

DROP TABLE IF EXISTS `assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `due_date` datetime(6) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `subject_id` bigint DEFAULT NULL,
  `teacher_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmd9krpotkeiujbef6ren2yvq5` (`subject_id`),
  KEY `FK67msc7a52b0l2pttoq5bhm6bk` (`teacher_id`),
  CONSTRAINT `FK67msc7a52b0l2pttoq5bhm6bk` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKmd9krpotkeiujbef6ren2yvq5` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comments` varchar(500) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `attendance_date` date NOT NULL,
  `status` enum('PRESENT','ABSENT','LATE','EXCUSED') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `student_id` bigint NOT NULL,
  `teacher_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK80qpvlsg0xpmw80bnk64avvou` (`student_id`),
  KEY `FK20vdyuqiwk2wg563vmy4rlsne` (`teacher_id`),
  CONSTRAINT `FK20vdyuqiwk2wg563vmy4rlsne` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK80qpvlsg0xpmw80bnk64avvou` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `grades`
--

DROP TABLE IF EXISTS `grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grades` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `feedback` text,
  `graded_at` datetime(6) DEFAULT NULL,
  `max_score` decimal(5,2) DEFAULT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `assignment_id` bigint DEFAULT NULL,
  `student_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK287de6bfabv9mj8r4flun01jd` (`assignment_id`),
  KEY `FK2udi8qqpoqmopyp47iy76jeq6` (`student_id`),
  CONSTRAINT `FK287de6bfabv9mj8r4flun01jd` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`),
  CONSTRAINT `FK2udi8qqpoqmopyp47iy76jeq6` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `institutions`
--

DROP TABLE IF EXISTS `institutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `institutions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(500) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `nit` varchar(20) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_j54oje5npca2j5lh44h0mdhwj` (`nit`)
) ENGINE=InnoDB AUTO_INCREMENT=300 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `school_grades`
--

DROP TABLE IF EXISTS `school_grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `school_grades` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `grade_level` int NOT NULL,
  `grade_name` varchar(255) NOT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_id4rjoppbry9rjutx547tldln` (`grade_name`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `color` varchar(7) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `institution_id` bigint DEFAULT NULL,
  `school_grade_id` bigint DEFAULT NULL,
  `teacher_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6wgfsjnqkja6xpygt50r2bsvq` (`institution_id`),
  KEY `FKc3g0739l58qig8vev4f4mi6sw` (`school_grade_id`),
  KEY `FKcnygk731a62dy54p5n967pag8` (`teacher_id`),
  CONSTRAINT `FK6wgfsjnqkja6xpygt50r2bsvq` FOREIGN KEY (`institution_id`) REFERENCES `institutions` (`id`),
  CONSTRAINT `FKc3g0739l58qig8vev4f4mi6sw` FOREIGN KEY (`school_grade_id`) REFERENCES `school_grades` (`id`),
  CONSTRAINT `FKcnygk731a62dy54p5n967pag8` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4339 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `submissions`
--

DROP TABLE IF EXISTS `submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` text,
  `created_at` datetime(6) DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `submitted_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `assignment_id` bigint DEFAULT NULL,
  `student_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKrirbb44savy2g7nws0hoxs949` (`assignment_id`),
  KEY `FK3p6y8mnhpwusdgqrdl4hcl72m` (`student_id`),
  CONSTRAINT `FK3p6y8mnhpwusdgqrdl4hcl72m` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKrirbb44savy2g7nws0hoxs949` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `system_metrics`
--

DROP TABLE IF EXISTS `system_metrics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_metrics` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active_connections` bigint DEFAULT NULL,
  `available_processors` int DEFAULT NULL,
  `cpu_usage` int DEFAULT NULL,
  `disk_total_gb` bigint DEFAULT NULL,
  `disk_usage_percent` int DEFAULT NULL,
  `disk_used_gb` bigint DEFAULT NULL,
  `memory_max_mb` bigint DEFAULT NULL,
  `memory_usage_percent` int DEFAULT NULL,
  `memory_used_mb` bigint DEFAULT NULL,
  `network_traffic_mbps` int DEFAULT NULL,
  `requests_per_minute` int DEFAULT NULL,
  `response_time_ms` int DEFAULT NULL,
  `system_status` varchar(255) DEFAULT NULL,
  `timestamp` datetime(6) NOT NULL,
  `uptime_hours` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `task_submissions`
--

DROP TABLE IF EXISTS `task_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_submissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `answers` json DEFAULT NULL,
  `attached_files` json DEFAULT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `feedback` text,
  `grade` double DEFAULT NULL,
  `graded_at` datetime(6) DEFAULT NULL,
  `score_obtained` int DEFAULT NULL,
  `status` enum('SUBMITTED','GRADED','RETURNED') NOT NULL,
  `submission_text` text,
  `submitted_at` datetime(6) NOT NULL,
  `student_id` bigint NOT NULL,
  `task_id` bigint NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `score` double DEFAULT NULL,
  `submission_file_url` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `graded_by` bigint DEFAULT NULL,
  `submission_files` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKb3br1wnf2r8q4jocodplocsl7` (`task_id`,`student_id`),
  KEY `FKd4br6l7rs20js908ngv4d0isk` (`student_id`),
  KEY `FK7a1hfixjm2lh41oqottuwrgxr` (`graded_by`),
  CONSTRAINT `FK79vk3jngud7t5uaxy97o074nw` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK7a1hfixjm2lh41oqottuwrgxr` FOREIGN KEY (`graded_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FKd4br6l7rs20js908ngv4d0isk` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3816 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `task_templates`
--

DROP TABLE IF EXISTS `task_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_templates` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `attachments` json DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` text,
  `due_date` date DEFAULT NULL,
  `grades` json DEFAULT NULL,
  `max_grade` double DEFAULT NULL,
  `subject_id` bigint NOT NULL,
  `teacher_id` bigint NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` enum('TRADITIONAL','INTERACTIVE') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7i2ia7q1404e390l1v218eftr` (`subject_id`),
  CONSTRAINT `FK7i2ia7q1404e390l1v218eftr` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `activity_config` json DEFAULT NULL,
  `allowed_formats` json DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` text,
  `due_date` date DEFAULT NULL,
  `feedback` text,
  `grade` varchar(255) DEFAULT NULL,
  `graded_at` datetime(6) DEFAULT NULL,
  `max_files` int DEFAULT NULL,
  `max_grade` double DEFAULT NULL,
  `max_score` int DEFAULT NULL,
  `max_size_mb` int DEFAULT NULL,
  `priority` enum('LOW','MEDIUM','HIGH') NOT NULL,
  `score` double DEFAULT NULL,
  `status` enum('PENDING','IN_PROGRESS','SUBMITTED','GRADED','OVERDUE') NOT NULL,
  `submission_file_url` varchar(255) DEFAULT NULL,
  `submission_text` text,
  `submitted_at` datetime(6) DEFAULT NULL,
  `task_type` enum('MULTIMEDIA','INTERACTIVE') NOT NULL,
  `title` varchar(200) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `student_id` bigint DEFAULT NULL,
  `subject_id` bigint DEFAULT NULL,
  `task_template_id` bigint DEFAULT NULL,
  `teacher_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3xmln0j67dwvui3fttis4r2mt` (`student_id`),
  KEY `FKr57noxytq33ig25g3e7utiofw` (`subject_id`),
  KEY `FK7lqvblbex5gpf65s9pup0xb01` (`task_template_id`),
  KEY `FK9nhg3mbgqotsl4kid2d2wus57` (`teacher_id`),
  CONSTRAINT `FK3xmln0j67dwvui3fttis4r2mt` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK7lqvblbex5gpf65s9pup0xb01` FOREIGN KEY (`task_template_id`) REFERENCES `task_templates` (`id`),
  CONSTRAINT `FK9nhg3mbgqotsl4kid2d2wus57` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKr57noxytq33ig25g3e7utiofw` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=180 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teacher_grades`
--

DROP TABLE IF EXISTS `teacher_grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_grades` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `academic_year` varchar(10) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `grade_level` int NOT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `section` varchar(1) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `institution_id` bigint DEFAULT NULL,
  `teacher_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK5ownaa0hxj9ypv37np5jwiv67` (`teacher_id`,`grade_level`,`section`),
  KEY `FK3n4gijqhnn86jg9bvhw9kd5wk` (`institution_id`),
  CONSTRAINT `FK3n4gijqhnn86jg9bvhw9kd5wk` FOREIGN KEY (`institution_id`) REFERENCES `institutions` (`id`),
  CONSTRAINT `FKhbtu9h7q6jhccai4i1dxoeh11` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=300 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teacher_subjects`
--

DROP TABLE IF EXISTS `teacher_subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_subjects` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `grade` varchar(20) NOT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `period` varchar(10) DEFAULT NULL,
  `subject_id` bigint NOT NULL,
  `teacher_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKdweqkwxroox2u7pbmksehx04i` (`subject_id`),
  CONSTRAINT `FKdweqkwxroox2u7pbmksehx04i` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_institution_roles`
--

DROP TABLE IF EXISTS `user_institution_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_institution_roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `role` varchar(50) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `institution_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK8panurwrsq3g6mlp24ujg4xxy` (`user_id`,`institution_id`,`role`),
  KEY `FKbhyovnl2klr9jcrsr1optitpn` (`institution_id`),
  CONSTRAINT `FK357siigjtopcbl9fygy28dcd3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKbhyovnl2klr9jcrsr1optitpn` FOREIGN KEY (`institution_id`) REFERENCES `institutions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `avatar_url` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `email_verified` bit(1) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `last_login_at` datetime(6) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('SUPER_ADMIN','ADMIN','SECRETARY','COORDINATOR','TEACHER','STUDENT','PARENT') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `institution_id` bigint DEFAULT NULL,
  `school_grade_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  KEY `FK2qqjpih9isqcs22710v8lef9w` (`institution_id`),
  KEY `FKik27v37f0oh6nn1rtct58xasa` (`school_grade_id`),
  CONSTRAINT `FK2qqjpih9isqcs22710v8lef9w` FOREIGN KEY (`institution_id`) REFERENCES `institutions` (`id`),
  CONSTRAINT `FKik27v37f0oh6nn1rtct58xasa` FOREIGN KEY (`school_grade_id`) REFERENCES `school_grades` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15371 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-24 19:01:26
