-- MySQL dump 10.11
--
-- Host: localhost    Database: petstore
-- ------------------------------------------------------
-- Server version	5.0.41-community-nt

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
-- Table structure for table `account`
--

DROP SCHEMA IF EXISTS petstore;
CREATE SCHEMA petstore;
USE petstore;

DROP TABLE IF EXISTS `account`;
CREATE TABLE `account` (
  `userid` varchar(20) NOT NULL default '',
  `email` varchar(70) NOT NULL default '',
  `firstname` varchar(30) NOT NULL default '',
  `lastname` varchar(30) NOT NULL default '',
  `status` char(2) default NULL,
  `addr1` varchar(70) NOT NULL default '',
  `addr2` varchar(70) default NULL,
  `city` varchar(80) NOT NULL default '',
  `state` varchar(80) NOT NULL default '',
  `zip` varchar(12) NOT NULL default '',
  `country` varchar(20) NOT NULL default '',
  `phone` varchar(80) NOT NULL default '',
  `ccnumber` varchar(80) NOT NULL default '',
  `cctype` varchar(80) NOT NULL default '',
  `ccexpdate` date NOT NULL default '2000-01-01',
  `language` varchar(80) NOT NULL default '',
  `favoriteCategory` varchar(80) NOT NULL default '',
  `enableMyList` varchar(80) NOT NULL default '',
  `enablePetTip` varchar(80) NOT NULL default '',
  PRIMARY KEY  (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES ('ag','ag@xyz.com','Albert','Einstein','OK','500 3rd St','Suite 265','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag1','ag1@yourdomain.com','George','Washington','OK','500 3rd St','Suite 265','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag10','ag10@yourdomain.com','Isaac','Newton','OK','5010 3rd St','Suite 2610','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag11','ag11@yourdomain.com','Isaac','Newton','OK','5011 3rd St','Suite 2611','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','False','False'),('ag12','ag12@yourdomain.com','Isaac','Newton','OK','5012 3rd St','Suite 2612','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag13','ag13@yourdomain.com','Isaac','Newton','OK','5013 3rd St','Suite 2613','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','False','False'),('ag14','ag14@yourdomain.com','Isaac','Newton','OK','5014 3rd St','Suite 2614','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag15','ag15@yourdomain.com','Isaac','Newton','OK','5015 3rd St','Suite 2615','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','False','False'),('ag16','ag16@yourdomain.com','Isaac','Newton','OK','5016 3rd St','Suite 2616','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag17','ag17@yourdomain.com','Isaac','Newton','OK','5017 3rd St','Suite 2617','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','False','False'),('ag18','ag18@yourdomain.com','Isaac','Newton','OK','5018 3rd St','Suite 2618','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag19','ag19@yourdomain.com','Isaac','Newton','OK','5019 3rd St','Suite 2619','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','False','False'),('ag2','ag2@yourdomain.com','Abraham','Lincoln','OK','500 3rd St','Suite 265','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag20','ag20@yourdomain.com','Isaac','Newton','OK','5020 3rd St','Suite 2620','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag21','ag21@yourdomain.com','Isaac','Newton','OK','5021 3rd St','Suite 2621','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','False','False'),('ag22','ag22@yourdomain.com','Isaac','Newton','OK','5022 3rd St','Suite 2622','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag23','ag23@yourdomain.com','Isaac','Newton','OK','5023 3rd St','Suite 2623','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','False','False'),('ag24','ag24@yourdomain.com','Isaac','Newton','OK','5024 3rd St','Suite 2624','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag25','ag25@yourdomain.com','Isaac','Newton','OK','5025 3rd St','Suite 2625','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','False','False'),('ag26','ag26@yourdomain.com','Isaac','Newton','OK','5026 3rd St','Suite 2626','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag27','ag27@yourdomain.com','Isaac','Newton','OK','5027 3rd St','Suite 2627','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','False','False'),('ag28','ag28@yourdomain.com','Isaac','Newton','OK','5028 3rd St','Suite 2628','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag29','ag29@yourdomain.com','Isaac','Newton','OK','5029 3rd St','Suite 2629','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','False','False'),('ag3','ag3@yourdomain.com','Neil','Armstrong','OK','500 3rd St','Suite 265','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag30','ag30@yourdomain.com','Isaac','Newton','OK','5030 3rd St','Suite 2630','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag31','ag31@yourdomain.com','Isaac','Newton','OK','5031 3rd St','Suite 2631','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','False','False'),('ag32','ag32@yourdomain.com','Isaac','Newton','OK','5032 3rd St','Suite 2632','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag33','ag33@yourdomain.com','Isaac','Newton','OK','5033 3rd St','Suite 2633','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','False','False'),('ag34','ag34@yourdomain.com','Isaac','Newton','OK','5034 3rd St','Suite 2634','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag35','ag35@yourdomain.com','Isaac','Newton','OK','5035 3rd St','Suite 2635','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','False','False'),('ag36','ag36@yourdomain.com','Isaac','Newton','OK','5036 3rd St','Suite 2636','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag37','ag37@yourdomain.com','Isaac','Newton','OK','5037 3rd St','Suite 2637','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','False','False'),('ag38','ag38@yourdomain.com','Isaac','Newton','OK','5038 3rd St','Suite 2638','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag39','ag39@yourdomain.com','Isaac','Newton','OK','5039 3rd St','Suite 2639','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','False','False'),('ag4','ag4@yourdomain.com','Buzz','Aldrin','OK','500 3rd St','Suite 265','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag40','ag40@yourdomain.com','Isaac','Newton','OK','5040 3rd St','Suite 2640','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag41','ag41@yourdomain.com','Isaac','Newton','OK','5041 3rd St','Suite 2641','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','False','False'),('ag42','ag42@yourdomain.com','Isaac','Newton','OK','5042 3rd St','Suite 2642','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag43','ag43@yourdomain.com','Isaac','Newton','OK','5043 3rd St','Suite 2643','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','False','False'),('ag44','ag44@yourdomain.com','Isaac','Newton','OK','5044 3rd St','Suite 2644','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag45','ag45@yourdomain.com','Isaac','Newton','OK','5045 3rd St','Suite 2645','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','False','False'),('ag46','ag46@yourdomain.com','Isaac','Newton','OK','5046 3rd St','Suite 2646','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag47','ag47@yourdomain.com','Isaac','Newton','OK','5047 3rd St','Suite 2647','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','False','False'),('ag48','ag48@yourdomain.com','Isaac','Newton','OK','5048 3rd St','Suite 2648','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag49','ag49@yourdomain.com','Isaac','Newton','OK','5049 3rd St','Suite 2649','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','False','False'),('ag5','ag5@yourdomain.com','Isaac','Newton','OK','500 3rd St','Suite 265','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag6','ag6@yourdomain.com','Isaac','Newton','OK','506 3rd St','Suite 266','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag7','ag7@yourdomain.com','Isaac','Newton','OK','507 3rd St','Suite 267','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','False','False'),('ag8','ag8@yourdomain.com','Isaac','Newton','OK','508 3rd St','Suite 268','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','True','True'),('ag9','ag9@yourdomain.com','Isaac','Newton','OK','509 3rd St','Suite 269','San Francisco','CA','94107','United States','555-555-5555','4444 4444 4444 4444','ActiveGrid(TM) Card','2008-02-12','English','DOGS','False','False'),('wavemaker','xyz@activegrid.com','ActiveGrid','App Builder','OK','500 3rd St','Suite 265','San Francisco','CA','94107','USA','415-357-0210','1234 5678 9012 3456','ActiveGrid(TM) Card','2007-01-10','English','DOGS','True','False');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aclentries`
--

DROP TABLE IF EXISTS `aclentries`;
CREATE TABLE `aclentries` (
  `A_NAME` varchar(255) NOT NULL default '',
  `A_PRINCIPAL` varchar(255) NOT NULL default '',
  `A_PERMISSION` varchar(255) NOT NULL default '',
  PRIMARY KEY  (`A_NAME`,`A_PRINCIPAL`,`A_PERMISSION`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `aclentries`
--

LOCK TABLES `aclentries` WRITE;
/*!40000 ALTER TABLE `aclentries` DISABLE KEYS */;
INSERT INTO `aclentries` VALUES ('disk','engineering','read');
/*!40000 ALTER TABLE `aclentries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `catid` varchar(10) NOT NULL default '',
  `name` varchar(80) default NULL,
  PRIMARY KEY  (`catid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES ('BIRDS','Birds'),('CATS','Cats'),('DOGS','Dogs'),('FISH','Fish'),('REPTILES','Reptiles');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groupmembers`
--

DROP TABLE IF EXISTS `groupmembers`;
CREATE TABLE `groupmembers` (
  `GM_GROUP` varchar(255) NOT NULL default '',
  `GM_MEMBER` varchar(255) NOT NULL default '',
  PRIMARY KEY  (`GM_GROUP`,`GM_MEMBER`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `groupmembers`
--

LOCK TABLES `groupmembers` WRITE;
/*!40000 ALTER TABLE `groupmembers` DISABLE KEYS */;
INSERT INTO `groupmembers` VALUES ('cust','ag'),('gold','jim');
/*!40000 ALTER TABLE `groupmembers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
CREATE TABLE `inventory` (
  `itemid` char(10) NOT NULL default '',
  `qty` int(11) default NULL,
  PRIMARY KEY  (`itemid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES ('EST-1',10000),('EST-10',10000),('EST-11',10000),('EST-12',10000),('EST-13',10000),('EST-14',10000),('EST-15',10000),('EST-16',10000),('EST-17',10000),('EST-18',10000),('EST-19',10000),('EST-2',10000),('EST-20',10000),('EST-21',10000),('EST-22',10000),('EST-23',10000),('EST-24',10000),('EST-25',10000),('EST-26',10000),('EST-27',10000),('EST-3',10000),('EST-4',10000),('EST-5',10000),('EST-6',10000),('EST-7',10000),('EST-8',10000),('EST-9',10000);
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
CREATE TABLE `item` (
  `itemid` varchar(10) NOT NULL default '',
  `productid` varchar(10) default NULL,
  `listprice` decimal(10,2) default NULL,
  `unitcost` decimal(10,2) default NULL,
  `supplier` int(11) default NULL,
  `status` char(2) default NULL,
  `attr1` varchar(80) default NULL,
  `attr2` varchar(80) default NULL,
  `attr3` varchar(80) default NULL,
  `attr4` varchar(80) default NULL,
  `attr5` varchar(80) default NULL,
  PRIMARY KEY  (`itemid`),
  KEY `fk_item_1` (`productid`),
  KEY `fk_item_2` (`supplier`),
  CONSTRAINT `fk_item_1` FOREIGN KEY (`productid`) REFERENCES `product` (`productid`),
  CONSTRAINT `fk_item_2` FOREIGN KEY (`supplier`) REFERENCES `supplier` (`suppid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` VALUES ('EST-1','FI-SW-01','16.50','10.00',1,'P','Large',NULL,NULL,NULL,NULL),('EST-10','K9-DL-01','18.50','12.00',1,'P','Spotted Adult Female',NULL,NULL,NULL,NULL),('EST-11','RP-SN-01','18.50','12.00',1,'P','Venomless',NULL,NULL,NULL,NULL),('EST-12','RP-SN-01','18.50','12.00',1,'P','Rattleless',NULL,NULL,NULL,NULL),('EST-13','RP-LI-02','18.50','12.00',1,'P','Green Adult',NULL,NULL,NULL,NULL),('EST-14','FL-DSH-01','58.50','12.00',1,'P','Tailless',NULL,NULL,NULL,NULL),('EST-15','FL-DSH-01','23.50','12.00',1,'P','With tail',NULL,NULL,NULL,NULL),('EST-16','FL-DLH-02','93.50','12.00',1,'P','Adult Female',NULL,NULL,NULL,NULL),('EST-17','FL-DLH-02','93.50','12.00',1,'P','Adult Male',NULL,NULL,NULL,NULL),('EST-18','AV-CB-01','193.50','92.00',1,'P','Adult Male',NULL,NULL,NULL,NULL),('EST-19','AV-SB-02','15.50','2.00',1,'P','Adult Male',NULL,NULL,NULL,NULL),('EST-2','FI-SW-01','16.50','10.00',1,'P','Small',NULL,NULL,NULL,NULL),('EST-20','FI-FW-02','5.50','2.00',1,'P','Adult Male',NULL,NULL,NULL,NULL),('EST-21','FI-FW-02','5.29','1.00',1,'P','Adult Female',NULL,NULL,NULL,NULL),('EST-22','K9-RT-02','135.50','100.00',1,'P','Adult Male',NULL,NULL,NULL,NULL),('EST-23','K9-RT-02','145.49','100.00',1,'P','Adult Female',NULL,NULL,NULL,NULL),('EST-24','K9-RT-01','255.50','92.00',1,'P','Adult Male',NULL,NULL,NULL,NULL),('EST-25','K9-RT-01','325.29','90.00',1,'P','Adult Female',NULL,NULL,NULL,NULL),('EST-26','K9-CW-01','125.50','92.00',1,'P','Adult Male',NULL,NULL,NULL,NULL),('EST-27','K9-CW-01','155.29','90.00',1,'P','Adult Female',NULL,NULL,NULL,NULL),('EST-3','FI-SW-02','18.50','12.00',1,'P','Toothless',NULL,NULL,NULL,NULL),('EST-4','FI-FW-01','18.50','12.00',1,'P','Spotted',NULL,NULL,NULL,NULL),('EST-5','FI-FW-01','18.50','12.00',1,'P','Spotless',NULL,NULL,NULL,NULL),('EST-6','K9-BD-01','18.50','12.00',1,'P','Male Adult',NULL,NULL,NULL,NULL),('EST-7','K9-BD-01','18.50','12.00',1,'P','Female Puppy',NULL,NULL,NULL,NULL),('EST-8','K9-PO-02','18.50','12.00',1,'P','Male Puppy',NULL,NULL,NULL,NULL),('EST-9','K9-DL-01','18.50','12.00',1,'P','Spotless Male Puppy',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lineitem`
--

DROP TABLE IF EXISTS `lineitem`;
CREATE TABLE `lineitem` (
  `orderid` int(11) NOT NULL default '0',
  `linenum` int(11) NOT NULL default '0',
  `itemid` char(10) default NULL,
  `quantity` int(11) default NULL,
  `unitprice` decimal(10,2) default NULL,
  PRIMARY KEY  (`orderid`,`linenum`),
  KEY `fk_lineitem_2` (`itemid`),
  CONSTRAINT `fk_lineitem_1` FOREIGN KEY (`orderid`) REFERENCES `orders` (`orderid`),
  CONSTRAINT `fk_lineitem_2` FOREIGN KEY (`itemid`) REFERENCES `item` (`itemid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `lineitem`
--

LOCK TABLES `lineitem` WRITE;
/*!40000 ALTER TABLE `lineitem` DISABLE KEYS */;
INSERT INTO `lineitem` VALUES (584121390,1,'EST-18',1,'193.50'),(584121390,2,'EST-15',1,'23.50'),(584161698,1,'EST-11',1,'18.50'),(584161698,2,'EST-17',1,'93.50'),(584161698,3,'EST-21',1,'5.29'),(584161698,4,'EST-7',1,'18.50'),(584183790,1,'EST-12',1,'18.50'),(584183790,2,'EST-19',1,'15.50');
/*!40000 ALTER TABLE `lineitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `orderid` int(11) NOT NULL default '0',
  `userid` varchar(20) default NULL,
  `orderdate` varchar(80) default NULL,
  `shipaddr1` varchar(80) default NULL,
  `shipaddr2` varchar(80) default NULL,
  `shipcity` varchar(80) default NULL,
  `shipstate` varchar(80) default NULL,
  `shipzip` varchar(20) default NULL,
  `shipcountry` varchar(20) default NULL,
  `billaddr1` varchar(80) default NULL,
  `billaddr2` varchar(80) default NULL,
  `billcity` varchar(80) default NULL,
  `billstate` varchar(80) default NULL,
  `billzip` varchar(20) default NULL,
  `billcountry` varchar(20) default NULL,
  `courier` varchar(80) default NULL,
  `billtofirstname` varchar(80) default NULL,
  `billtolastname` varchar(80) default NULL,
  `shiptofirstname` varchar(80) default NULL,
  `shiptolastname` varchar(80) default NULL,
  `creditcard` varchar(80) default NULL,
  `exprdate` date default NULL,
  `cardtype` varchar(80) default NULL,
  `bonusmiles` int(11) default NULL,
  PRIMARY KEY  (`orderid`),
  KEY `fk_orders_1` (`userid`),
  CONSTRAINT `fk_orders_1` FOREIGN KEY (`userid`) REFERENCES `account` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (584121390,'wavemaker','12/13/2007','500 3rd St','Suite 265','San Francisco','CA','94107','USA','500 3rd St','Suite 265','San Francisco','CA','94107','USA','Fubar Delivery','ActiveGrid','App Builder','ActiveGrid','App Builder','1234 5678 9012 3456',NULL,'ActiveGrid(TM) Card',NULL),(584161698,'wavemaker','12/13/2007','500 3rd St','Suite 265','San Francisco','CA','94107','USA','500 3rd St','Suite 265','San Francisco','CA','94107','USA','Fubar Delivery','ActiveGrid','App Builder','ActiveGrid','App Builder','1234 5678 9012 3456',NULL,'ActiveGrid(TM) Card',NULL),(584183790,'wavemaker','12/13/2007','500 3rd St','Suite 265','San Francisco','CA','94107','USA','500 3rd St','Suite 265','San Francisco','CA','94107','USA','Fubar Delivery','ActiveGrid','App Builder','ActiveGrid','App Builder','1234 5678 9012 3456',NULL,'ActiveGrid(TM) Card',NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderstatus`
--

DROP TABLE IF EXISTS `orderstatus`;
CREATE TABLE `orderstatus` (
  `orderid` int(11) NOT NULL default '0',
  `linenum` int(11) NOT NULL default '0',
  `updatedate` varchar(80) default NULL,
  `status` char(2) default NULL,
  PRIMARY KEY  (`orderid`,`linenum`),
  CONSTRAINT `fk_orderstatus_1` FOREIGN KEY (`orderid`) REFERENCES `orders` (`orderid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `orderstatus`
--

LOCK TABLES `orderstatus` WRITE;
/*!40000 ALTER TABLE `orderstatus` DISABLE KEYS */;
/*!40000 ALTER TABLE `orderstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `productid` varchar(10) NOT NULL default '',
  `category` varchar(10) default NULL,
  `name` varchar(80) default NULL,
  `image` varchar(255) default NULL,
  `descn` varchar(255) default NULL,
  PRIMARY KEY  (`productid`),
  KEY `fk_product_1` (`category`),
  CONSTRAINT `fk_product_1` FOREIGN KEY (`category`) REFERENCES `category` (`catid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES ('AV-CB-01','BIRDS','Amazon Parrot','../images/bird4.gif','Great companion for up to 75 years'),('AV-SB-02','BIRDS','Finch','../images/bird1.gif','Great stress reliever'),('FI-FW-01','FISH','Koi','../images/fish3.gif','Fresh Water fish from Japan'),('FI-FW-02','FISH','Goldfish','../images/fish2.gif','Fresh Water fish from China'),('FI-SW-01','FISH','Angelfish','../images/fish4.gif','Salt Water fish from Australia'),('FI-SW-02','FISH','Tiger Shark','../images/fish4.gif','Salt Water fish from Australia'),('FL-DLH-02','CATS','Persian','../images/cat1.gif','Friendly house cat, doubles as a princess'),('FL-DSH-01','CATS','Manx','../images/cat3.gif','Great for reducing mouse populations'),('K9-BD-01','DOGS','Bulldog','../images/dog2.gif','Friendly dog from England'),('K9-CW-01','DOGS','Chihuahua','../images/dog4.gif','Great companion dog'),('K9-DL-01','DOGS','Dalmation','../images/dog5.gif','Great dog for a Fire Station'),('K9-PO-02','DOGS','Poodle','../images/dog6.gif','Cute dog from France'),('K9-RT-01','DOGS','Golden Retriever','../images/dog1.gif','Great family dog'),('K9-RT-02','DOGS','Labrador Retriever','../images/dog5.gif','Great hunting dog'),('RP-LI-02','REPTILES','Iguana','../images/lizard2.gif','Friendly green friend'),('RP-SN-01','REPTILES','Rattlesnake','../images/lizard3.gif','Doubles as a watch dog');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequence`
--

DROP TABLE IF EXISTS `sequence`;
CREATE TABLE `sequence` (
  `seqnum` int(11) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sequence`
--

LOCK TABLES `sequence` WRITE;
/*!40000 ALTER TABLE `sequence` DISABLE KEYS */;
INSERT INTO `sequence` VALUES (1);
/*!40000 ALTER TABLE `sequence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `state`
--

DROP TABLE IF EXISTS `state`;
CREATE TABLE `state` (
  `code` char(2) NOT NULL default '',
  `name` varchar(50) default NULL,
  PRIMARY KEY  (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `state`
--

LOCK TABLES `state` WRITE;
/*!40000 ALTER TABLE `state` DISABLE KEYS */;
INSERT INTO `state` VALUES ('CA','California'),('NY','New York'),('TX','Texas');
/*!40000 ALTER TABLE `state` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
CREATE TABLE `supplier` (
  `suppid` int(11) NOT NULL default '0',
  `name` varchar(80) default NULL,
  `status` char(2) default NULL,
  `addr1` varchar(80) default NULL,
  `addr2` varchar(80) default NULL,
  `city` varchar(80) default NULL,
  `state` varchar(80) default NULL,
  `zip` varchar(5) default NULL,
  `phone` varchar(80) default NULL,
  PRIMARY KEY  (`suppid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
INSERT INTO `supplier` VALUES (1,'XYZ Pets','AC','600 Avon Way',NULL,'Los Angeles','CA','94024','212-947-0797'),(2,'ABC Pets','AC','700 Abalone Way',NULL,'San Francisco','CA','94024','415-947-0797');
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `U_NAME` varchar(255) NOT NULL default '',
  `U_PASSWORD` varchar(255) default NULL,
  PRIMARY KEY  (`U_NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('ag','ag'),('ag1','ag1'),('ag10','ag10'),('ag11','ag11'),('ag12','ag12'),('ag13','ag13'),('ag14','ag14'),('ag15','ag15'),('ag16','ag16'),('ag17','ag17'),('ag18','ag18'),('ag19','ag19'),('ag2','ag2'),('ag20','ag20'),('ag21','ag21'),('ag22','ag22'),('ag23','ag23'),('ag24','ag24'),('ag25','ag25'),('ag26','ag26'),('ag27','ag27'),('ag28','ag28'),('ag29','ag29'),('ag3','ag3'),('ag30','ag30'),('ag31','ag31'),('ag32','ag32'),('ag33','ag33'),('ag34','ag34'),('ag35','ag35'),('ag36','ag36'),('ag37','ag37'),('ag38','ag38'),('ag39','ag39'),('ag4','ag4'),('ag40','ag40'),('ag41','ag41'),('ag42','ag42'),('ag43','ag43'),('ag44','ag44'),('ag45','ag45'),('ag46','ag46'),('ag47','ag47'),('ag48','ag48'),('ag49','ag49'),('ag5','ag5'),('ag6','ag6'),('ag7','ag7'),('ag8','ag8'),('ag9','ag9'),('jim','jim'),('wavemaker','wavemaker');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2007-12-13 22:19:47
