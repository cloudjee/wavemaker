-- MySQL dump 10.11
--
-- Host: localhost    Database: issuecloudv2
-- ------------------------------------------------------
-- Server version	5.0.75-0ubuntu10.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `comment` (
  `cID` int(11) NOT NULL auto_increment COMMENT 'ID of comments',
  `iID` int(11) NOT NULL COMMENT 'ID of issue',
  `tID` int(11) NOT NULL COMMENT 'ID of tenant',
  `uID` int(11) NOT NULL,
  `createdate` date NOT NULL COMMENT 'Date of creation',
  `flag` int(11) NOT NULL COMMENT 'Showing',
  `description` text NOT NULL,
  PRIMARY KEY  (`cID`),
  KEY `FK38A5EE5FC4DD4FD2` (`uID`),
  KEY `FK38A5EE5FD5EE9746` (`iID`),
  CONSTRAINT `FK38A5EE5FC4DD4FD2` FOREIGN KEY (`uID`) REFERENCES `user` (`uID`),
  CONSTRAINT `FK38A5EE5FD5EE9746` FOREIGN KEY (`iID`) REFERENCES `issue` (`iID`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `issue`
--

DROP TABLE IF EXISTS `issue`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `issue` (
  `iID` int(11) NOT NULL auto_increment COMMENT 'ID of issue',
  `tID` int(11) NOT NULL COMMENT 'ID of tenant',
  `pID` int(11) NOT NULL COMMENT 'ID of project',
  `reportedVID` int(11) default NULL COMMENT 'Reported version',
  `fixedVID` int(11) default NULL COMMENT 'Fixed version',
  `reportedUID` int(11) default NULL COMMENT 'Reported user',
  `assignUID` int(11) default NULL COMMENT 'Assigned user',
  `name` varchar(140) NOT NULL COMMENT 'Issue name',
  `createdate` date NOT NULL COMMENT 'Date of creation',
  `closedate` date default NULL COMMENT 'Date of closure',
  `description` text COMMENT 'Issue description',
  `summary` text NOT NULL COMMENT 'Summary of issue',
  `issuetype` varchar(30) default '''bug''' COMMENT 'Type of issue',
  `priority` varchar(30) default '''minor''' COMMENT 'Issue priority',
  `path` varchar(80) default NULL COMMENT 'File names of attachments',
  `status` varchar(30) default '''open''' COMMENT 'Issue status',
  `flag` int(11) default '1' COMMENT 'Showing',
  PRIMARY KEY  (`iID`),
  KEY `FK5FDA8D98F1589DE` (`fixedVID`),
  KEY `FK5FDA8D9B676D61F` (`reportedUID`),
  KEY `FK5FDA8D919697483` (`assignUID`),
  KEY `FK5FDA8D97F082D8D` (`pID`),
  KEY `FK5FDA8D998069C1F` (`reportedVID`),
  CONSTRAINT `FK5FDA8D919697483` FOREIGN KEY (`assignUID`) REFERENCES `user` (`uID`),
  CONSTRAINT `FK5FDA8D97F082D8D` FOREIGN KEY (`pID`) REFERENCES `project` (`pID`),
  CONSTRAINT `FK5FDA8D98F1589DE` FOREIGN KEY (`fixedVID`) REFERENCES `version` (`vID`),
  CONSTRAINT `FK5FDA8D998069C1F` FOREIGN KEY (`reportedVID`) REFERENCES `version` (`vID`),
  CONSTRAINT `FK5FDA8D9B676D61F` FOREIGN KEY (`reportedUID`) REFERENCES `user` (`uID`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `project` (
  `pID` int(11) NOT NULL auto_increment COMMENT 'ID of the project',
  `tID` int(11) NOT NULL COMMENT 'ID of tenant',
  `name` varchar(60) NOT NULL COMMENT 'Project name',
  `description` text COMMENT 'Project description',
  `url` varchar(60) default NULL COMMENT 'URL',
  `prefix` varchar(12) NOT NULL COMMENT 'Project prefix',
  `flag` int(11) NOT NULL COMMENT 'Showing',
  PRIMARY KEY  (`pID`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `status` (
  `sID` int(11) NOT NULL auto_increment,
  `name` varchar(40) NOT NULL COMMENT 'Not sure what this is',
  PRIMARY KEY  (`sID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `tenant`
--

DROP TABLE IF EXISTS `tenant`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `tenant` (
  `tID` int(11) NOT NULL auto_increment COMMENT 'ID of tenant',
  `billcode` int(11) default NULL,
  `companyname` varchar(40) NOT NULL COMMENT 'Company name',
  `accountnumber` int(11) NOT NULL COMMENT 'Account number of tenant',
  `address` varchar(120) default NULL COMMENT 'Address of tenant',
  `phone` varchar(40) default NULL COMMENT 'phone number of tenant',
  `createdate` date NOT NULL,
  `flag` int(11) NOT NULL COMMENT 'Showing',
  PRIMARY KEY  (`tID`)
) ENGINE=InnoDB AUTO_INCREMENT=219 DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `user` (
  `uID` int(11) NOT NULL auto_increment COMMENT 'ID of user',
  `tID` int(11) NOT NULL COMMENT 'ID of tenant',
  `firstname` varchar(40) default NULL COMMENT 'First name of user',
  `lastname` varchar(40) default NULL COMMENT 'Last name of user',
  `username` varchar(40) default NULL COMMENT 'Username',
  `password` varchar(40) NOT NULL COMMENT 'Password',
  `email` varchar(40) NOT NULL COMMENT 'Email of user',
  `createdate` date NOT NULL COMMENT 'Date of creation',
  `role` varchar(20) NOT NULL COMMENT 'Role of user',
  `flag` int(11) NOT NULL COMMENT 'Showing',
  PRIMARY KEY  (`uID`)
) ENGINE=InnoDB AUTO_INCREMENT=241 DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `version`
--

DROP TABLE IF EXISTS `version`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `version` (
  `vID` int(11) NOT NULL auto_increment COMMENT 'ID of version',
  `tID` int(11) NOT NULL COMMENT 'ID of tenants',
  `pID` int(11) NOT NULL COMMENT 'ID of projects',
  `name` varchar(40) NOT NULL COMMENT 'Version name',
  `description` text COMMENT 'Description of version',
  `releasedate` date default NULL COMMENT 'Date of release',
  `status` varchar(40) NOT NULL COMMENT 'Version status',
  `flag` int(11) NOT NULL COMMENT 'Showing',
  PRIMARY KEY  (`vID`),
  KEY `FK14F51CD87F082D8D` (`pID`),
  CONSTRAINT `FK14F51CD87F082D8D` FOREIGN KEY (`pID`) REFERENCES `project` (`pID`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2011-03-23  1:24:36
