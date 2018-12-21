 Server: 72.167.233.103  -   Database: notetaker
 
-- phpMyAdmin SQL Dump
-- version 2.11.11.3
-- http://www.phpmyadmin.net
--
-- Host: 72.167.233.103
-- Generation Time: Dec 21, 2018 at 01:42 PM
-- Server version: 5.5.43
-- PHP Version: 5.1.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Database: `notetaker`
--

-- --------------------------------------------------------

--
-- Table structure for table `image`
--

DROP TABLE IF EXISTS `image`;
CREATE TABLE `image` (
  `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ImageID',
  `USER_ID` int(11) NOT NULL COMMENT 'Foreign Key to USER.ID',
  `NOTE_ID` int(11) NOT NULL COMMENT 'Foreign Key to NOTES.ID',
  `CREATED_ON` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date created on',
  `IMAGE_ENCODE` blob NOT NULL COMMENT 'The actual image uploaded',
  `DELETED` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  KEY `IMAGE_NOTES_ID` (`NOTE_ID`),
  KEY `IMAGE_USER_ID` (`USER_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
CREATE TABLE `notes` (
  `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Note ID',
  `USER_ID` int(11) NOT NULL,
  `CREATED_ON` datetime NOT NULL COMMENT 'Date created',
  `UPDATED` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date updated',
  `POSITION_X` int(11) NOT NULL COMMENT 'UI position X value',
  `POSITION_Y` int(11) NOT NULL COMMENT 'UI position Y value',
  `COLOR` varchar(10) NOT NULL DEFAULT 'red' COMMENT 'CSS color for the note',
  `WIDTH` int(11) NOT NULL COMMENT 'Width of displayed note',
  `HEIGHT` int(11) NOT NULL COMMENT 'Height of displayed note',
  `LAYER` int(11) NOT NULL DEFAULT '0' COMMENT 'Z value of displayed note',
  `IMAGE_ID` int(11) DEFAULT NULL COMMENT 'Foreign Key to IMAGE.ID',
  `CONTENTS` blob COMMENT 'The HTML contents of the note',
  `DELETED` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  KEY `NOTE_ID` (`IMAGE_ID`),
  KEY `Notes_User_Id` (`USER_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT 'User ID',
  `USER_NAME` varchar(100) NOT NULL COMMENT 'Login name',
  `NAME` varchar(100) NOT NULL COMMENT 'User''s real name',
  `EMAIL` varchar(100) NOT NULL COMMENT 'Email address',
  `PASSWORD` mediumtext NOT NULL COMMENT 'Hashed password',
  `LAST_ACCESS` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last access date',
  `CREATED_ON` datetime NOT NULL COMMENT 'Account create date',
  `VIEW` tinyint(255) NOT NULL DEFAULT '0' COMMENT 'Which View they selected as their default view',
  `THEME` tinyint(255) NOT NULL DEFAULT '0' COMMENT 'Which Theme they want to use',
  `ACCOUNT_STATUS` char(255) NOT NULL DEFAULT 'N' COMMENT 'Active status',
  `DEFAULT_NOTE_COLOR` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `image`
--
ALTER TABLE `image`
  ADD CONSTRAINT `IMAGE_NOTES_ID` FOREIGN KEY (`NOTE_ID`) REFERENCES `notes` (`ID`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `IMAGE_USER_ID` FOREIGN KEY (`USER_ID`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `Notes_User_Id` FOREIGN KEY (`USER_ID`) REFERENCES `users` (`ID`);

