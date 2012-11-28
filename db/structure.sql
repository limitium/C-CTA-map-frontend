/*
SQLyog Ultimate - MySQL GUI v8.2 
MySQL - 5.1.63-0+squeeze1 : Database - tiberium_map
*********************************************************************
*/


/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`tiberium_map` /*!40100 DEFAULT CHARACTER SET utf8 */;

/*Table structure for table `marker` */

DROP TABLE IF EXISTS `marker`;

CREATE TABLE `marker` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `world` int(10) NOT NULL,
  `hash` varchar(6) NOT NULL,
  `paths` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

/*Table structure for table `marker_user` */

DROP TABLE IF EXISTS `marker_user`;

CREATE TABLE `marker_user` (
  `marker_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  UNIQUE KEY `uniq` (`marker_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `settings` */

DROP TABLE IF EXISTS `settings`;

CREATE TABLE `settings` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `color-background` varchar(7) DEFAULT NULL,
  `color-grid` varchar(7) DEFAULT NULL,
  `color-grid-label` varchar(7) DEFAULT NULL,
  `color-base` varchar(7) DEFAULT NULL,
  `color-selected` varchar(7) DEFAULT NULL,
  `color-self` varchar(7) DEFAULT NULL,
  `color-protected` varchar(7) DEFAULT NULL,
  `color-altered` varchar(7) DEFAULT NULL,
  `color-aircraft` varchar(7) DEFAULT NULL,
  `color-crystal` varchar(7) DEFAULT NULL,
  `color-tiberium` varchar(7) DEFAULT NULL,
  `color-reactor` varchar(7) DEFAULT NULL,
  `color-resonator` varchar(7) DEFAULT NULL,
  `color-tungsten` varchar(7) DEFAULT NULL,
  `color-uranium` varchar(7) DEFAULT NULL,
  `filter-unselected-hide` tinyint(1) DEFAULT NULL,
  `filter-poi-hide` tinyint(1) DEFAULT NULL,
  `filter-noalliance-hide` tinyint(1) DEFAULT NULL,
  `filter-alliance-min-level` int(11) DEFAULT NULL,
  `filter-base-min-level` int(11) DEFAULT NULL,
  `filter-poi-min-level` int(11) DEFAULT NULL,
  `size-base` float unsigned DEFAULT NULL,
  `size-poi` float unsigned DEFAULT NULL,
  `notice-email` varchar(255) DEFAULT NULL,
  `notice-name` varchar(255) DEFAULT NULL,
  `notice-altered` tinyint(1) DEFAULT NULL,
  `notice-ruined` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_settings` (`user_id`),
  CONSTRAINT `FK_settings` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `identity` varchar(255) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `uid` varchar(255) NOT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Uniq_per_prov` (`provider`,`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
