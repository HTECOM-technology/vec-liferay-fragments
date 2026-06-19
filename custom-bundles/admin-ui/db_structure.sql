
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
DROP TABLE IF EXISTS `AMImageEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AMImageEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amImageEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `configurationUuid` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileVersionId` bigint DEFAULT NULL,
  `mimeType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `height` int DEFAULT NULL,
  `width` int DEFAULT NULL,
  `size_` bigint DEFAULT NULL,
  PRIMARY KEY (`amImageEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_EBBEA9CD` (`configurationUuid`,`fileVersionId`,`ctCollectionId`),
  UNIQUE KEY `IX_681D2FFD` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_6DDD0C5F` (`companyId`),
  KEY `IX_51249CB0` (`configurationUuid`,`companyId`),
  KEY `IX_E879919E` (`fileVersionId`),
  KEY `IX_65AB1EA1` (`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AccountEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AccountEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accountEntryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `defaultBillingAddressId` bigint DEFAULT NULL,
  `defaultCPaymentMethodKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `defaultShippingAddressId` bigint DEFAULT NULL,
  `parentAccountEntryId` bigint DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `domains` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `emailAddress` varchar(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logoId` bigint DEFAULT NULL,
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `restrictMembership` tinyint DEFAULT NULL,
  `taxExemptionCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `taxIdNumber` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`accountEntryId`),
  UNIQUE KEY `IX_FBFAF640` (`companyId`,`externalReferenceCode`),
  KEY `IX_48CB043` (`companyId`,`status`),
  KEY `IX_908C3410` (`userId`,`type_`),
  KEY `IX_6901A669` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AccountEntryOrganizationRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AccountEntryOrganizationRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `accountEntryOrganizationRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `accountEntryId` bigint DEFAULT NULL,
  `organizationId` bigint DEFAULT NULL,
  PRIMARY KEY (`accountEntryOrganizationRelId`),
  KEY `IX_EC6CC41D` (`accountEntryId`,`organizationId`),
  KEY `IX_2FA4FA69` (`organizationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AccountEntryUserRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AccountEntryUserRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `accountEntryUserRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `accountEntryId` bigint DEFAULT NULL,
  `accountUserId` bigint DEFAULT NULL,
  PRIMARY KEY (`accountEntryUserRelId`),
  KEY `IX_ED720A80` (`accountEntryId`,`accountUserId`),
  KEY `IX_4EA60AB4` (`accountUserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AccountEntry_x_92605711380992`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AccountEntry_x_92605711380992` (
  `accountEntryId` bigint NOT NULL,
  PRIMARY KEY (`accountEntryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AccountGroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AccountGroup` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accountGroupId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `defaultAccountGroup` tinyint DEFAULT NULL,
  `description` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`accountGroupId`),
  UNIQUE KEY `IX_F7BFA1CD` (`companyId`,`externalReferenceCode`),
  KEY `IX_38BDB33` (`companyId`,`defaultAccountGroup`),
  KEY `IX_8EE6A92F` (`companyId`,`name`),
  KEY `IX_B4733E65` (`companyId`,`type_`),
  KEY `IX_E86A36FC` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AccountGroupRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AccountGroupRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `accountGroupRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `accountGroupId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  PRIMARY KEY (`accountGroupRelId`),
  KEY `IX_448835E3` (`accountGroupId`,`classNameId`,`classPK`),
  KEY `IX_E31F0762` (`classNameId`,`classPK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AccountRole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AccountRole` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accountRoleId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `accountEntryId` bigint DEFAULT NULL,
  `roleId` bigint DEFAULT NULL,
  PRIMARY KEY (`accountRoleId`),
  UNIQUE KEY `IX_88B680FE` (`companyId`,`externalReferenceCode`),
  KEY `IX_3A47CDD` (`accountEntryId`),
  KEY `IX_6BCBD313` (`companyId`,`accountEntryId`),
  KEY `IX_714A358E` (`roleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Address` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `addressId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `countryId` bigint DEFAULT NULL,
  `listTypeId` bigint DEFAULT NULL,
  `regionId` bigint DEFAULT NULL,
  `city` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `mailing` tinyint DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primary_` tinyint DEFAULT NULL,
  `street1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `street2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `street3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `validationDate` datetime(6) DEFAULT NULL,
  `validationStatus` int DEFAULT NULL,
  `zip` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`addressId`,`ctCollectionId`),
  UNIQUE KEY `IX_C0F7C08D` (`companyId`,`externalReferenceCode`,`ctCollectionId`),
  KEY `IX_FEAFC68A` (`companyId`,`classNameId`,`classPK`,`listTypeId`),
  KEY `IX_923BD178` (`companyId`,`classNameId`,`classPK`,`mailing`),
  KEY `IX_9226DBB4` (`companyId`,`classNameId`,`classPK`,`primary_`),
  KEY `IX_5A2093E7` (`countryId`),
  KEY `IX_C8E3E87D` (`regionId`),
  KEY `IX_5BC8B0D4` (`userId`),
  KEY `IX_381E55DA` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Address_x_92605711380992`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Address_x_92605711380992` (
  `addressId` bigint NOT NULL,
  PRIMARY KEY (`addressId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AnalyticsAssociation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AnalyticsAssociation` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `analyticsAssociationId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `associationClassName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `associationClassPK` bigint DEFAULT NULL,
  `className` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  PRIMARY KEY (`analyticsAssociationId`,`ctCollectionId`),
  KEY `IX_F25E6543` (`companyId`,`associationClassName`,`associationClassPK`),
  KEY `IX_6431FFA8` (`companyId`,`associationClassName`,`modifiedDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AnalyticsDeleteMessage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AnalyticsDeleteMessage` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `analyticsDeleteMessageId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `className` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  PRIMARY KEY (`analyticsDeleteMessageId`,`ctCollectionId`),
  KEY `IX_3BF42B97` (`companyId`,`modifiedDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AnalyticsMessage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AnalyticsMessage` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `analyticsMessageId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `body` longblob,
  PRIMARY KEY (`analyticsMessageId`,`ctCollectionId`),
  KEY `IX_3A69CC81` (`companyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AnnouncementsDelivery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AnnouncementsDelivery` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `deliveryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` tinyint DEFAULT NULL,
  `sms` tinyint DEFAULT NULL,
  `website` tinyint DEFAULT NULL,
  PRIMARY KEY (`deliveryId`,`ctCollectionId`),
  UNIQUE KEY `IX_7EA033` (`userId`,`type_`,`ctCollectionId`),
  KEY `IX_37B0A8A2` (`companyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AnnouncementsEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AnnouncementsEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `title` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `displayDate` datetime(6) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `priority` int DEFAULT NULL,
  `alert` tinyint DEFAULT NULL,
  PRIMARY KEY (`entryId`,`ctCollectionId`),
  KEY `IX_14F06A6B` (`classNameId`,`classPK`,`alert`),
  KEY `IX_94C04525` (`classNameId`,`classPK`,`companyId`,`alert`),
  KEY `IX_3F376E7C` (`companyId`),
  KEY `IX_D49C2E66` (`userId`),
  KEY `IX_1AFBDE08` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AnnouncementsFlag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AnnouncementsFlag` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `flagId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `entryId` bigint DEFAULT NULL,
  `value` int DEFAULT NULL,
  PRIMARY KEY (`flagId`,`ctCollectionId`),
  KEY `IX_EF1F022A` (`companyId`),
  KEY `IX_ED8CE4E8` (`entryId`,`userId`,`value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AssetAutoTaggerEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AssetAutoTaggerEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `assetAutoTaggerEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `assetEntryId` bigint DEFAULT NULL,
  `assetTagId` bigint DEFAULT NULL,
  PRIMARY KEY (`assetAutoTaggerEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_50FDB5E7` (`assetEntryId`,`assetTagId`,`ctCollectionId`),
  KEY `IX_10831A78` (`assetTagId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AssetCategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AssetCategory` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `parentCategoryId` bigint DEFAULT NULL,
  `treePath` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `vocabularyId` bigint DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`categoryId`,`ctCollectionId`),
  UNIQUE KEY `IX_F3842169` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_AF94405C` (`groupId`,`uuid_`,`ctCollectionId`),
  UNIQUE KEY `IX_8C99329D` (`vocabularyId`,`parentCategoryId`,`name`,`ctCollectionId`),
  KEY `IX_F67BECAD` (`groupId`,`parentCategoryId`),
  KEY `IX_2710C64A` (`groupId`,`vocabularyId`,`name`),
  KEY `IX_68169942` (`groupId`,`vocabularyId`,`parentCategoryId`),
  KEY `IX_9DDD15EA` (`parentCategoryId`,`name`),
  KEY `IX_4D37BB00` (`uuid_`),
  KEY `IX_3537E488` (`vocabularyId`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AssetCategoryProperty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AssetCategoryProperty` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoryPropertyId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `categoryId` bigint DEFAULT NULL,
  `key_` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`categoryPropertyId`,`ctCollectionId`),
  UNIQUE KEY `IX_87C75408` (`categoryId`,`key_`,`ctCollectionId`),
  UNIQUE KEY `IX_E889D6A0` (`companyId`,`ctCollectionId`,`externalReferenceCode`),
  KEY `IX_52340033` (`companyId`,`key_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AssetDisplayPageEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AssetDisplayPageEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assetDisplayPageEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `layoutPageTemplateEntryId` bigint DEFAULT NULL,
  `type_` int DEFAULT NULL,
  `plid` bigint DEFAULT NULL,
  PRIMARY KEY (`assetDisplayPageEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_F3AB130A` (`groupId`,`classNameId`,`ctCollectionId`,`classPK`),
  UNIQUE KEY `IX_9920AB1F` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_BFB8A913` (`layoutPageTemplateEntryId`),
  KEY `IX_DEA3F2DD` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AssetEntries_AssetTags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AssetEntries_AssetTags` (
  `companyId` bigint NOT NULL,
  `entryId` bigint NOT NULL,
  `tagId` bigint NOT NULL,
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `ctChangeType` tinyint DEFAULT NULL,
  PRIMARY KEY (`entryId`,`tagId`,`ctCollectionId`),
  KEY `IX_112337B8` (`companyId`),
  KEY `IX_B2A61B55` (`tagId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AssetEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AssetEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `entryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `classUuid` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classTypeId` bigint DEFAULT NULL,
  `listable` tinyint DEFAULT NULL,
  `visible` tinyint DEFAULT NULL,
  `startDate` datetime(6) DEFAULT NULL,
  `endDate` datetime(6) DEFAULT NULL,
  `publishDate` datetime(6) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `mimeType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `summary` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `layoutUuid` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `height` int DEFAULT NULL,
  `width` int DEFAULT NULL,
  `priority` double DEFAULT NULL,
  PRIMARY KEY (`entryId`,`ctCollectionId`),
  UNIQUE KEY `IX_7BF8337B` (`classNameId`,`classPK`,`ctCollectionId`),
  KEY `IX_23280E2` (`classNameId`,`companyId`),
  KEY `IX_7306C60` (`companyId`),
  KEY `IX_75D42FF9` (`expirationDate`),
  KEY `IX_6418BB52` (`groupId`,`classNameId`,`publishDate`,`expirationDate`),
  KEY `IX_82C4BEF6` (`groupId`,`classNameId`,`visible`),
  KEY `IX_1EBA6821` (`groupId`,`classUuid`),
  KEY `IX_FEC4A201` (`layoutUuid`),
  KEY `IX_2E4E3885` (`publishDate`),
  KEY `IX_9029E15A` (`visible`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AssetEntryAssetCategoryRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AssetEntryAssetCategoryRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `assetEntryAssetCategoryRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `assetEntryId` bigint DEFAULT NULL,
  `assetCategoryId` bigint DEFAULT NULL,
  `priority` int DEFAULT NULL,
  PRIMARY KEY (`assetEntryAssetCategoryRelId`,`ctCollectionId`),
  UNIQUE KEY `IX_7DEE7233` (`assetEntryId`,`assetCategoryId`,`ctCollectionId`),
  KEY `IX_19EC1746` (`assetCategoryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AssetLink`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AssetLink` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `linkId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `entryId1` bigint DEFAULT NULL,
  `entryId2` bigint DEFAULT NULL,
  `type_` int DEFAULT NULL,
  `weight` int DEFAULT NULL,
  PRIMARY KEY (`linkId`,`ctCollectionId`),
  UNIQUE KEY `IX_7FC555F2` (`entryId1`,`entryId2`,`type_`,`ctCollectionId`),
  KEY `IX_14D5A20D` (`entryId1`,`type_`),
  KEY `IX_91F132C` (`entryId2`,`type_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AssetListEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AssetListEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assetListEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `assetListEntryKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` int DEFAULT NULL,
  `assetEntrySubtype` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assetEntryType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`assetListEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_D3D0EE8D` (`groupId`,`ctCollectionId`,`assetListEntryKey`),
  UNIQUE KEY `IX_5856D7F` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_E08A6DF6` (`groupId`,`ctCollectionId`,`uuid_`),
  UNIQUE KEY `IX_5B95A9C6` (`groupId`,`title`,`ctCollectionId`),
  KEY `IX_D8D58598` (`groupId`,`assetEntryType`,`assetEntrySubtype`),
  KEY `IX_40A918D0` (`groupId`,`title`,`assetEntryType`,`assetEntrySubtype`),
  KEY `IX_4FE08A35` (`groupId`,`type_`),
  KEY `IX_5B11862A` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AssetListEntryAssetEntryRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AssetListEntryAssetEntryRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assetListEntryAssetEntryRelId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `assetListEntryId` bigint DEFAULT NULL,
  `assetEntryId` bigint DEFAULT NULL,
  `segmentsEntryId` bigint DEFAULT NULL,
  `position` int DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`assetListEntryAssetEntryRelId`,`ctCollectionId`),
  UNIQUE KEY `IX_FAAE938C` (`assetListEntryId`,`segmentsEntryId`,`position`,`ctCollectionId`),
  UNIQUE KEY `IX_A46B1691` (`uuid_`,`ctCollectionId`,`groupId`),
  KEY `IX_622F04CA` (`assetEntryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AssetListEntrySegmentsEntryRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AssetListEntrySegmentsEntryRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alEntrySegmentsEntryRelId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `assetListEntryId` bigint DEFAULT NULL,
  `priority` int DEFAULT NULL,
  `segmentsEntryId` bigint DEFAULT NULL,
  `typeSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`alEntrySegmentsEntryRelId`,`ctCollectionId`),
  UNIQUE KEY `IX_56302677` (`assetListEntryId`,`segmentsEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_AE822E09` (`uuid_`,`ctCollectionId`,`groupId`),
  KEY `IX_1C9A6A4C` (`segmentsEntryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AssetListEntryUsage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AssetListEntryUsage` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assetListEntryUsageId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `containerKey` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `containerType` bigint DEFAULT NULL,
  `key_` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plid` bigint DEFAULT NULL,
  `type_` int DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`assetListEntryUsageId`,`ctCollectionId`),
  UNIQUE KEY `IX_512AA275` (`groupId`,`classNameId`,`key_`,`plid`,`containerType`,`containerKey`,`ctCollectionId`),
  UNIQUE KEY `IX_57EC072B` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_E1D6CA09` (`classNameId`,`key_`,`companyId`),
  KEY `IX_10BA153A` (`groupId`,`classNameId`,`key_`,`type_`),
  KEY `IX_BBE5024F` (`plid`,`containerType`,`containerKey`),
  KEY `IX_561E0151` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AssetTag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AssetTag` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tagId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assetCount` int DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`tagId`,`ctCollectionId`),
  UNIQUE KEY `IX_FBB2C925` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_B421E018` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_D63322F9` (`groupId`,`name`),
  KEY `IX_C43137AF` (`name`),
  KEY `IX_562A3FC4` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `AssetVocabulary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AssetVocabulary` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vocabularyId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `settings_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `visibilityType` int DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`vocabularyId`,`ctCollectionId`),
  UNIQUE KEY `IX_E06DEF51` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_32F2132B` (`groupId`,`ctCollectionId`,`name`),
  UNIQUE KEY `IX_3966DE44` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_B22D908C` (`companyId`),
  KEY `IX_C0AAD74D` (`groupId`,`name`),
  KEY `IX_2F7F11EE` (`groupId`,`visibilityType`),
  KEY `IX_55F58818` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Audit_AuditEvent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Audit_AuditEvent` (
  `auditEventId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `eventType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `className` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classPK` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `clientHost` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clientIP` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serverName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serverPort` int DEFAULT NULL,
  `sessionID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `additionalInfo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`auditEventId`),
  KEY `IX_8FE31EDF` (`companyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `BackgroundTask`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BackgroundTask` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `backgroundTaskId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `servletContextNames` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `taskExecutorClassName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `taskContextMap` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `completed` tinyint DEFAULT NULL,
  `completionDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusMessage` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`backgroundTaskId`),
  KEY `IX_C5A6C78F` (`companyId`),
  KEY `IX_FBF5FAA2` (`completed`),
  KEY `IX_C71C3B7` (`groupId`,`status`),
  KEY `IX_F6136B70` (`groupId`,`taskExecutorClassName`,`completed`,`name`),
  KEY `IX_7FC3A8C9` (`groupId`,`taskExecutorClassName`,`name`),
  KEY `IX_7E757D70` (`groupId`,`taskExecutorClassName`,`status`),
  KEY `IX_75638CDF` (`status`),
  KEY `IX_2FCFE748` (`taskExecutorClassName`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `BatchEngineExportTask`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BatchEngineExportTask` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `batchEngineExportTaskId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `callbackURL` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `className` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` longblob,
  `contentType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `endTime` datetime(6) DEFAULT NULL,
  `errorMessage` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `fieldNames` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `executeStatus` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parameters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `processedItemsCount` int DEFAULT NULL,
  `startTime` datetime(6) DEFAULT NULL,
  `taskItemDelegateName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `totalItemsCount` int DEFAULT NULL,
  PRIMARY KEY (`batchEngineExportTaskId`),
  UNIQUE KEY `IX_EAC5DE50` (`companyId`,`externalReferenceCode`),
  KEY `IX_DADA545C` (`executeStatus`),
  KEY `IX_8B990859` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `BatchEngineImportTask`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BatchEngineImportTask` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `batchEngineImportTaskId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `batchSize` bigint DEFAULT NULL,
  `callbackURL` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `className` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` longblob,
  `contentType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `endTime` datetime(6) DEFAULT NULL,
  `errorMessage` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `executeStatus` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fieldNameMapping` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `importStrategy` int DEFAULT NULL,
  `operation` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parameters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `processedItemsCount` int DEFAULT NULL,
  `startTime` datetime(6) DEFAULT NULL,
  `taskItemDelegateName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `totalItemsCount` int DEFAULT NULL,
  PRIMARY KEY (`batchEngineImportTaskId`),
  UNIQUE KEY `IX_2BBBB941` (`companyId`,`externalReferenceCode`),
  KEY `IX_ABC8050B` (`executeStatus`),
  KEY `IX_4FFDD808` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `BatchEngineImportTaskError`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BatchEngineImportTaskError` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `batchEngineImportTaskErrorId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `batchEngineImportTaskId` bigint DEFAULT NULL,
  `item` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `itemIndex` int DEFAULT NULL,
  `message` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`batchEngineImportTaskErrorId`),
  KEY `IX_863EDEA9` (`batchEngineImportTaskId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `BatchPlannerMapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BatchPlannerMapping` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `batchPlannerMappingId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `batchPlannerPlanId` bigint DEFAULT NULL,
  `externalFieldName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalFieldType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `internalFieldName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `internalFieldType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `script` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`batchPlannerMappingId`),
  UNIQUE KEY `IX_E025DC1A` (`batchPlannerPlanId`,`externalFieldName`,`internalFieldName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `BatchPlannerPlan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BatchPlannerPlan` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `batchPlannerPlanId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `active_` tinyint DEFAULT NULL,
  `export` tinyint DEFAULT NULL,
  `externalType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `internalClassName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size_` int DEFAULT NULL,
  `taskItemDelegateName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total` int DEFAULT NULL,
  `template` tinyint DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`batchPlannerPlanId`),
  KEY `IX_18CD7477` (`companyId`,`export`,`template`),
  KEY `IX_221A54A0` (`companyId`,`name`),
  KEY `IX_F2F05D4F` (`companyId`,`template`),
  KEY `IX_874FA8DB` (`companyId`,`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `BatchPlannerPolicy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BatchPlannerPolicy` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `batchPlannerPolicyId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `batchPlannerPlanId` bigint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `value` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`batchPlannerPolicyId`),
  UNIQUE KEY `IX_A8E0209F` (`batchPlannerPlanId`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `BlogsEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BlogsEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subtitle` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `urlTitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `displayDate` datetime(6) DEFAULT NULL,
  `allowPingbacks` tinyint DEFAULT NULL,
  `allowTrackbacks` tinyint DEFAULT NULL,
  `trackbacks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `coverImageCaption` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `coverImageFileEntryId` bigint DEFAULT NULL,
  `coverImageURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `smallImage` tinyint DEFAULT NULL,
  `smallImageFileEntryId` bigint DEFAULT NULL,
  `smallImageId` bigint DEFAULT NULL,
  `smallImageURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`entryId`,`ctCollectionId`),
  UNIQUE KEY `IX_D05A3CBC` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_D6281CFE` (`groupId`,`ctCollectionId`,`urlTitle`),
  UNIQUE KEY `IX_69B961AF` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_430D791F` (`companyId`,`displayDate`),
  KEY `IX_8CACE77B` (`companyId`,`userId`),
  KEY `IX_621E19D` (`groupId`,`displayDate`),
  KEY `IX_FBDE0AA3` (`groupId`,`userId`,`displayDate`),
  KEY `IX_7B596F05` (`status`,`companyId`,`displayDate`),
  KEY `IX_D1CC59D5` (`status`,`companyId`,`userId`),
  KEY `IX_67121F73` (`status`,`displayDate`),
  KEY `IX_EC9E1903` (`status`,`groupId`,`displayDate`),
  KEY `IX_6D777C09` (`status`,`groupId`,`userId`,`displayDate`),
  KEY `IX_69157A4D` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `BookmarksEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BookmarksEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `folderId` bigint DEFAULT NULL,
  `treePath` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `priority` int DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`entryId`,`ctCollectionId`),
  UNIQUE KEY `IX_788BA343` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_1F90CA2D` (`companyId`),
  KEY `IX_5200100C` (`groupId`,`folderId`),
  KEY `IX_69D78EAC` (`groupId`,`status`,`folderId`,`userId`),
  KEY `IX_37518B0F` (`groupId`,`status`,`userId`),
  KEY `IX_F16A8A87` (`status`,`companyId`),
  KEY `IX_B670BA39` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `BookmarksFolder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BookmarksFolder` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `folderId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `parentFolderId` bigint DEFAULT NULL,
  `treePath` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`folderId`,`ctCollectionId`),
  UNIQUE KEY `IX_F2715D9` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_2ABA25D7` (`companyId`),
  KEY `IX_D16018A6` (`groupId`,`parentFolderId`,`status`),
  KEY `IX_8C7A9C31` (`status`,`companyId`),
  KEY `IX_451E7AE3` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `BrowserTracker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BrowserTracker` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `browserTrackerId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `browserKey` bigint DEFAULT NULL,
  PRIMARY KEY (`browserTrackerId`),
  UNIQUE KEY `IX_E7B95510` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CChannelAccountEntryRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CChannelAccountEntryRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `CChannelAccountEntryRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `accountEntryId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `commerceChannelId` bigint DEFAULT NULL,
  `overrideEligibility` tinyint DEFAULT NULL,
  `priority` double DEFAULT NULL,
  `type_` int DEFAULT NULL,
  PRIMARY KEY (`CChannelAccountEntryRelId`,`ctCollectionId`),
  UNIQUE KEY `IX_7451E203` (`commerceChannelId`,`type_`,`accountEntryId`,`classNameId`,`classPK`,`ctCollectionId`),
  KEY `IX_38280B2E` (`accountEntryId`),
  KEY `IX_5F765A4F` (`classNameId`,`classPK`),
  KEY `IX_E6E10CF1` (`commerceChannelId`,`type_`,`classNameId`,`classPK`),
  KEY `IX_52FD56CF` (`type_`,`accountEntryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CDiscountCAccountGroupRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CDiscountCAccountGroupRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `CDiscountCAccountGroupRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceDiscountId` bigint DEFAULT NULL,
  `commerceAccountGroupId` bigint DEFAULT NULL,
  PRIMARY KEY (`CDiscountCAccountGroupRelId`),
  UNIQUE KEY `IX_9D768AF5` (`commerceDiscountId`,`commerceAccountGroupId`),
  KEY `IX_F7FFBCCA` (`commerceAccountGroupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CIAudit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CIAudit` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `CIAuditId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `logType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logTypeSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `quantity` decimal(30,16) DEFAULT NULL,
  `sku` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unitOfMeasureKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`CIAuditId`),
  KEY `IX_45C5C370` (`companyId`,`sku`,`unitOfMeasureKey`),
  KEY `IX_E7D143D9` (`createDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CIBookedQuantity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CIBookedQuantity` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `CIBookedQuantityId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `bookedNote` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `quantity` decimal(30,16) DEFAULT NULL,
  `sku` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unitOfMeasureKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`CIBookedQuantityId`),
  KEY `IX_33BF9CB0` (`expirationDate`),
  KEY `IX_EB8535EA` (`sku`,`companyId`,`unitOfMeasureKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CIReplenishmentItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CIReplenishmentItem` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CIReplenishmentItemId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceInventoryWarehouseId` bigint DEFAULT NULL,
  `availabilityDate` datetime(6) DEFAULT NULL,
  `quantity` decimal(30,16) DEFAULT NULL,
  `sku` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unitOfMeasureKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`CIReplenishmentItemId`),
  UNIQUE KEY `IX_3462AACC` (`companyId`,`externalReferenceCode`),
  KEY `IX_F588314` (`availabilityDate`),
  KEY `IX_967CACA8` (`commerceInventoryWarehouseId`),
  KEY `IX_EBEBFEE2` (`sku`,`companyId`,`unitOfMeasureKey`),
  KEY `IX_DA9C2C43` (`sku`,`unitOfMeasureKey`,`availabilityDate`),
  KEY `IX_B359B95D` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CIWarehouse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CIWarehouse` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CIWarehouseId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `active_` tinyint DEFAULT NULL,
  `street1` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `street2` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `street3` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zip` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceRegionCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `countryTwoLettersISOCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`CIWarehouseId`),
  UNIQUE KEY `IX_68E6B8D8` (`companyId`,`externalReferenceCode`),
  KEY `IX_331A3FD3` (`companyId`,`active_`,`countryTwoLettersISOCode`),
  KEY `IX_DADA8974` (`companyId`,`countryTwoLettersISOCode`),
  KEY `IX_3CCB62D1` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CIWarehouseGroupRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CIWarehouseGroupRel` (
  `CIWarehouseGroupRelId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceWarehouseId` bigint DEFAULT NULL,
  `primary_` tinyint DEFAULT NULL,
  PRIMARY KEY (`CIWarehouseGroupRelId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CIWarehouseItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CIWarehouseItem` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CIWarehouseItemId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceInventoryWarehouseId` bigint DEFAULT NULL,
  `quantity` decimal(30,16) DEFAULT NULL,
  `reservedQuantity` decimal(30,16) DEFAULT NULL,
  `sku` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unitOfMeasureKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`CIWarehouseItemId`),
  UNIQUE KEY `IX_B4413476` (`commerceInventoryWarehouseId`,`sku`,`unitOfMeasureKey`),
  UNIQUE KEY `IX_8A09C40B` (`companyId`,`externalReferenceCode`),
  KEY `IX_B86B6C8B` (`companyId`,`sku`,`unitOfMeasureKey`),
  KEY `IX_4AD4537E` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CIWarehouseRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CIWarehouseRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `CIWarehouseRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `CIWarehouseId` bigint DEFAULT NULL,
  PRIMARY KEY (`CIWarehouseRelId`),
  UNIQUE KEY `IX_A743341B` (`CIWarehouseId`,`classNameId`,`classPK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CNTemplateCAccountGroupRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CNTemplateCAccountGroupRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `CNTemplateCAccountGroupRelId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceNotificationTemplateId` bigint DEFAULT NULL,
  `commerceAccountGroupId` bigint DEFAULT NULL,
  PRIMARY KEY (`CNTemplateCAccountGroupRelId`),
  UNIQUE KEY `IX_AFBF7DA` (`commerceNotificationTemplateId`,`commerceAccountGroupId`),
  KEY `IX_7951AAEB` (`commerceAccountGroupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CNotificationAttachment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CNotificationAttachment` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CNotificationAttachmentId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `CNotificationQueueEntryId` bigint DEFAULT NULL,
  `fileEntryId` bigint DEFAULT NULL,
  `deleteOnSend` tinyint DEFAULT NULL,
  PRIMARY KEY (`CNotificationAttachmentId`),
  UNIQUE KEY `IX_339EA78D` (`uuid_`,`groupId`),
  KEY `IX_6E9D8183` (`CNotificationQueueEntryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `COREntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `COREntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `COREntryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `active_` tinyint DEFAULT NULL,
  `description` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `displayDate` datetime(6) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` int DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `typeSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`COREntryId`),
  UNIQUE KEY `IX_4BD0EB07` (`companyId`,`externalReferenceCode`),
  KEY `IX_E0154022` (`companyId`,`active_`,`type_`),
  KEY `IX_FDA23B9F` (`companyId`,`type_`),
  KEY `IX_8599BE68` (`status`,`displayDate`),
  KEY `IX_4AFDBD89` (`status`,`expirationDate`),
  KEY `IX_DD753A02` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `COREntryRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `COREntryRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `COREntryRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `COREntryId` bigint DEFAULT NULL,
  PRIMARY KEY (`COREntryRelId`),
  UNIQUE KEY `IX_EA6EFFC3` (`COREntryId`,`classNameId`,`classPK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPAttachmentFileEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPAttachmentFileEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPAttachmentFileEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `fileEntryId` bigint DEFAULT NULL,
  `cdnEnabled` tinyint DEFAULT NULL,
  `cdnURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `displayDate` datetime(6) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `galleryEnabled` tinyint DEFAULT NULL,
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `priority` double DEFAULT NULL,
  `type_` int DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`CPAttachmentFileEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_25D041B5` (`ctCollectionId`,`externalReferenceCode`,`companyId`),
  UNIQUE KEY `IX_50416EE0` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_4E725857` (`classNameId`,`classPK`,`cdnURL`(255)),
  KEY `IX_DD114140` (`classNameId`,`classPK`,`fileEntryId`),
  KEY `IX_F34F24D9` (`classNameId`,`classPK`,`status`,`displayDate`),
  KEY `IX_5F3A96F1` (`classNameId`,`classPK`,`status`,`type_`,`galleryEnabled`),
  KEY `IX_6A165A0B` (`classNameId`,`fileEntryId`,`groupId`),
  KEY `IX_5B2A1075` (`fileEntryId`),
  KEY `IX_E153EF0E` (`status`,`displayDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPConfigurationEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPConfigurationEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPConfigurationEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `CPConfigurationListId` bigint DEFAULT NULL,
  `CPTaxCategoryId` bigint DEFAULT NULL,
  `allowedOrderQuantities` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `backOrders` tinyint DEFAULT NULL,
  `commerceAvailabilityEstimateId` bigint DEFAULT NULL,
  `CPDefinitionInventoryEngine` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `depth` double DEFAULT NULL,
  `displayAvailability` tinyint DEFAULT NULL,
  `displayStockQuantity` tinyint DEFAULT NULL,
  `freeShipping` tinyint DEFAULT NULL,
  `height` double DEFAULT NULL,
  `lowStockActivity` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `maxOrderQuantity` decimal(30,16) DEFAULT NULL,
  `minOrderQuantity` decimal(30,16) DEFAULT NULL,
  `minStockQuantity` decimal(30,16) DEFAULT NULL,
  `multipleOrderQuantity` decimal(30,16) DEFAULT NULL,
  `purchasable` tinyint DEFAULT NULL,
  `shippable` tinyint DEFAULT NULL,
  `shippingExtraPrice` double DEFAULT NULL,
  `shipSeparately` tinyint DEFAULT NULL,
  `taxExempt` tinyint DEFAULT NULL,
  `visible` tinyint DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `width` double DEFAULT NULL,
  PRIMARY KEY (`CPConfigurationEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_4B033D0` (`classNameId`,`classPK`,`ctCollectionId`,`CPConfigurationListId`),
  UNIQUE KEY `IX_B5AF3F22` (`ctCollectionId`,`companyId`,`externalReferenceCode`),
  UNIQUE KEY `IX_DE212C7` (`uuid_`,`ctCollectionId`,`groupId`),
  KEY `IX_FFC978A3` (`CPConfigurationListId`),
  KEY `IX_9CF4EC9E` (`classNameId`,`classPK`,`visible`),
  KEY `IX_69AB0AD9` (`companyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPConfigurationEntrySetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPConfigurationEntrySetting` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPConfigurationEntrySettingId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `CPConfigurationEntryId` bigint DEFAULT NULL,
  `type_` int DEFAULT NULL,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`CPConfigurationEntrySettingId`,`ctCollectionId`),
  UNIQUE KEY `IX_1A3FBF81` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_C07283B0` (`CPConfigurationEntryId`,`type_`),
  KEY `IX_576B525B` (`companyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPConfigurationList`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPConfigurationList` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPConfigurationListId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `parentCPConfigurationListId` bigint DEFAULT NULL,
  `master` tinyint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` double DEFAULT NULL,
  `displayDate` datetime(6) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`CPConfigurationListId`,`ctCollectionId`),
  UNIQUE KEY `IX_9AAA5A84` (`companyId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_E989EBF5` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_AC55D871` (`groupId`,`companyId`,`status`),
  KEY `IX_36C0FFD3` (`groupId`,`master`),
  KEY `IX_85ED285B` (`parentCPConfigurationListId`),
  KEY `IX_DD7144ED` (`status`,`displayDate`),
  KEY `IX_20625D47` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPConfigurationListRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPConfigurationListRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `CPConfigurationListRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `CPConfigurationListId` bigint DEFAULT NULL,
  PRIMARY KEY (`CPConfigurationListRelId`,`ctCollectionId`),
  UNIQUE KEY `IX_5B3D330D` (`CPConfigurationListId`,`classNameId`,`classPK`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPDAvailabilityEstimate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPDAvailabilityEstimate` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPDAvailabilityEstimateId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceAvailabilityEstimateId` bigint DEFAULT NULL,
  `CProductId` bigint DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`CPDAvailabilityEstimateId`),
  UNIQUE KEY `IX_17D56F1B` (`CProductId`),
  KEY `IX_E560850D` (`commerceAvailabilityEstimateId`),
  KEY `IX_109320B4` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPDSpecificationOptionValue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPDSpecificationOptionValue` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPDSpecificationOptionValueId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `CPDefinitionId` bigint DEFAULT NULL,
  `CPSpecificationOptionId` bigint DEFAULT NULL,
  `CPOptionCategoryId` bigint DEFAULT NULL,
  `key_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` double DEFAULT NULL,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`CPDSpecificationOptionValueId`,`ctCollectionId`),
  UNIQUE KEY `IX_CFB2B6D7` (`CPDefinitionId`,`ctCollectionId`,`key_`),
  UNIQUE KEY `IX_CE76817F` (`ctCollectionId`,`externalReferenceCode`,`companyId`),
  UNIQUE KEY `IX_1E581E2E` (`uuid_`,`ctCollectionId`,`groupId`),
  KEY `IX_95975FB4` (`CPDefinitionId`,`CPOptionCategoryId`),
  KEY `IX_173E8E91` (`CPDefinitionId`,`CPSpecificationOptionId`),
  KEY `IX_4F4EDBA5` (`CPOptionCategoryId`),
  KEY `IX_573BE140` (`CPSpecificationOptionId`),
  KEY `IX_8DA57014` (`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPDVirtualSettingFileEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPDVirtualSettingFileEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPDVirtualSettingFileEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `CPDefinitionVirtualSettingId` bigint DEFAULT NULL,
  `fileEntryId` bigint DEFAULT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`CPDVirtualSettingFileEntryId`),
  UNIQUE KEY `IX_762A2056` (`uuid_`,`groupId`),
  KEY `IX_C606354` (`CPDefinitionVirtualSettingId`),
  KEY `IX_B9327D21` (`fileEntryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPDefinition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPDefinition` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `defaultLanguageId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPDefinitionId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `CProductId` bigint DEFAULT NULL,
  `CPTaxCategoryId` bigint DEFAULT NULL,
  `productTypeName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `availableIndividually` tinyint DEFAULT NULL,
  `ignoreSKUCombinations` tinyint DEFAULT NULL,
  `shippable` tinyint DEFAULT NULL,
  `freeShipping` tinyint DEFAULT NULL,
  `shipSeparately` tinyint DEFAULT NULL,
  `shippingExtraPrice` double DEFAULT NULL,
  `width` double DEFAULT NULL,
  `height` double DEFAULT NULL,
  `depth` double DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `taxExempt` tinyint DEFAULT NULL,
  `telcoOrElectronics` tinyint DEFAULT NULL,
  `DDMStructureKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published` tinyint DEFAULT NULL,
  `displayDate` datetime(6) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `subscriptionEnabled` tinyint DEFAULT NULL,
  `subscriptionLength` int DEFAULT NULL,
  `subscriptionType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subscriptionTypeSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `maxSubscriptionCycles` bigint DEFAULT NULL,
  `deliverySubscriptionEnabled` tinyint DEFAULT NULL,
  `deliverySubscriptionLength` int DEFAULT NULL,
  `deliverySubscriptionType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliverySubTypeSettings` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliveryMaxSubscriptionCycles` bigint DEFAULT NULL,
  `accountGroupFilterEnabled` tinyint DEFAULT NULL,
  `channelFilterEnabled` tinyint DEFAULT NULL,
  `version` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`CPDefinitionId`,`ctCollectionId`),
  UNIQUE KEY `IX_96393D8E` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_3D5A0021` (`CPTaxCategoryId`),
  KEY `IX_1F4B9C67` (`CProductId`,`status`),
  KEY `IX_F1AEC8A7` (`CProductId`,`version`),
  KEY `IX_217AF702` (`companyId`),
  KEY `IX_419350EA` (`groupId`,`status`),
  KEY `IX_99C4ED10` (`groupId`,`subscriptionEnabled`),
  KEY `IX_E504F8F4` (`status`,`displayDate`),
  KEY `IX_46B4998E` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPDefinitionGroupedEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPDefinitionGroupedEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPDefinitionGroupedEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `CPDefinitionId` bigint DEFAULT NULL,
  `entryCProductId` bigint DEFAULT NULL,
  `priority` double DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`CPDefinitionGroupedEntryId`),
  UNIQUE KEY `IX_64F7EFA0` (`CPDefinitionId`,`entryCProductId`),
  UNIQUE KEY `IX_E30475B0` (`uuid_`,`groupId`),
  KEY `IX_8B75194F` (`entryCProductId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPDefinitionInventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPDefinitionInventory` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPDefinitionInventoryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `CPDefinitionId` bigint DEFAULT NULL,
  `CPDefinitionInventoryEngine` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lowStockActivity` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `displayAvailability` tinyint DEFAULT NULL,
  `displayStockQuantity` tinyint DEFAULT NULL,
  `minStockQuantity` decimal(30,16) DEFAULT NULL,
  `backOrders` tinyint DEFAULT NULL,
  `minOrderQuantity` decimal(30,16) DEFAULT NULL,
  `maxOrderQuantity` decimal(30,16) DEFAULT NULL,
  `allowedOrderQuantities` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `multipleOrderQuantity` decimal(30,16) DEFAULT NULL,
  PRIMARY KEY (`CPDefinitionInventoryId`,`ctCollectionId`),
  UNIQUE KEY `IX_C37B844F` (`ctCollectionId`,`CPDefinitionId`),
  UNIQUE KEY `IX_6C4F2D3A` (`uuid_`,`ctCollectionId`,`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPDefinitionLink`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPDefinitionLink` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPDefinitionLinkId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `CPDefinitionId` bigint DEFAULT NULL,
  `CProductId` bigint DEFAULT NULL,
  `displayDate` datetime(6) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `priority` double DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`CPDefinitionLinkId`,`ctCollectionId`),
  UNIQUE KEY `IX_3A90EAC9` (`CPDefinitionId`,`CProductId`,`type_`,`ctCollectionId`),
  UNIQUE KEY `IX_112757D8` (`uuid_`,`ctCollectionId`,`groupId`),
  KEY `IX_5572A666` (`CPDefinitionId`,`type_`),
  KEY `IX_F7B5F85A` (`CProductId`,`type_`),
  KEY `IX_FE4C04C0` (`status`,`CPDefinitionId`,`type_`),
  KEY `IX_786093B4` (`status`,`CProductId`,`type_`),
  KEY `IX_62BEA79A` (`status`,`displayDate`),
  KEY `IX_155AEF17` (`status`,`expirationDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPDefinitionLocalization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPDefinitionLocalization` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `cpDefinitionLocalizationId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `CPDefinitionId` bigint DEFAULT NULL,
  `languageId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `shortDescription` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `metaTitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metaDescription` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metaKeywords` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`cpDefinitionLocalizationId`,`ctCollectionId`),
  UNIQUE KEY `IX_CB617913` (`CPDefinitionId`,`languageId`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPDefinitionOptionRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPDefinitionOptionRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPDefinitionOptionRelId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `CPDefinitionId` bigint DEFAULT NULL,
  `CPOptionId` bigint DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `commerceOptionTypeKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `infoItemServiceKey` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` double DEFAULT NULL,
  `definedExternally` tinyint DEFAULT NULL,
  `facetable` tinyint DEFAULT NULL,
  `required` tinyint DEFAULT NULL,
  `skuContributor` tinyint DEFAULT NULL,
  `key_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priceType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `typeSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`CPDefinitionOptionRelId`,`ctCollectionId`),
  UNIQUE KEY `IX_64314388` (`CPDefinitionId`,`ctCollectionId`,`CPOptionId`),
  UNIQUE KEY `IX_78CCF36B` (`CPDefinitionId`,`ctCollectionId`,`key_`),
  UNIQUE KEY `IX_44B059C2` (`uuid_`,`ctCollectionId`,`groupId`),
  KEY `IX_BDB8420C` (`CPDefinitionId`,`required`),
  KEY `IX_749E99EB` (`CPDefinitionId`,`skuContributor`),
  KEY `IX_4E86C11B` (`CPOptionId`),
  KEY `IX_449BFCFE` (`companyId`),
  KEY `IX_A65BAB00` (`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPDefinitionOptionValueRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPDefinitionOptionValueRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPDefinitionOptionValueRelId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `CPDefinitionOptionRelId` bigint DEFAULT NULL,
  `CPInstanceUuid` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CProductId` bigint DEFAULT NULL,
  `key_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `preselected` tinyint DEFAULT NULL,
  `price` decimal(30,16) DEFAULT NULL,
  `priority` double DEFAULT NULL,
  `quantity` decimal(30,16) DEFAULT NULL,
  `unitOfMeasureKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`CPDefinitionOptionValueRelId`,`ctCollectionId`),
  UNIQUE KEY `IX_55A05F1E` (`CPDefinitionOptionRelId`,`key_`,`ctCollectionId`),
  UNIQUE KEY `IX_52855B17` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_4A77D282` (`CPDefinitionOptionRelId`,`preselected`),
  KEY `IX_3EB86274` (`CPInstanceUuid`),
  KEY `IX_44C2E505` (`companyId`),
  KEY `IX_695AE8C7` (`groupId`),
  KEY `IX_2434CAD7` (`key_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPDefinitionVirtualSetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPDefinitionVirtualSetting` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPDefinitionVirtualSettingId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `activationStatus` int DEFAULT NULL,
  `duration` bigint DEFAULT NULL,
  `maxUsages` int DEFAULT NULL,
  `useSample` tinyint DEFAULT NULL,
  `sampleFileEntryId` bigint DEFAULT NULL,
  `sampleURL` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `termsOfUseRequired` tinyint DEFAULT NULL,
  `termsOfUseContent` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `termsOfUseArticleResourcePK` bigint DEFAULT NULL,
  `override` tinyint DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`CPDefinitionVirtualSettingId`),
  UNIQUE KEY `IX_19B2FD20` (`classNameId`,`classPK`),
  UNIQUE KEY `IX_8ED43481` (`uuid_`,`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPDefinition_x_92605711380992`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPDefinition_x_92605711380992` (
  `CPDefinitionId` bigint NOT NULL,
  PRIMARY KEY (`CPDefinitionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPDisplayLayout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPDisplayLayout` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPDisplayLayoutId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `layoutPageTemplateEntryUuid` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `layoutUuid` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`CPDisplayLayoutId`,`ctCollectionId`),
  UNIQUE KEY `IX_7F728A18` (`groupId`,`classNameId`,`classPK`,`ctCollectionId`),
  UNIQUE KEY `IX_7649CF4D` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_290BF7BA` (`classNameId`,`classPK`),
  KEY `IX_965CA8C5` (`groupId`,`layoutPageTemplateEntryUuid`),
  KEY `IX_381B82DE` (`groupId`,`layoutUuid`),
  KEY `IX_FEC526EF` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPInstance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPInstance` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPInstanceId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `CPDefinitionId` bigint DEFAULT NULL,
  `CPInstanceUuid` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sku` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gtin` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manufacturerPartNumber` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purchasable` tinyint DEFAULT NULL,
  `width` double DEFAULT NULL,
  `height` double DEFAULT NULL,
  `depth` double DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `price` decimal(30,16) DEFAULT NULL,
  `promoPrice` decimal(30,16) DEFAULT NULL,
  `cost` decimal(30,16) DEFAULT NULL,
  `published` tinyint DEFAULT NULL,
  `displayDate` datetime(6) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `overrideSubscriptionInfo` tinyint DEFAULT NULL,
  `subscriptionEnabled` tinyint DEFAULT NULL,
  `subscriptionLength` int DEFAULT NULL,
  `subscriptionType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subscriptionTypeSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `maxSubscriptionCycles` bigint DEFAULT NULL,
  `deliverySubscriptionEnabled` tinyint DEFAULT NULL,
  `deliverySubscriptionLength` int DEFAULT NULL,
  `deliverySubscriptionType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliverySubTypeSettings` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliveryMaxSubscriptionCycles` bigint DEFAULT NULL,
  `unspsc` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discontinued` tinyint DEFAULT NULL,
  `discontinuedDate` datetime(6) DEFAULT NULL,
  `replacementCPInstanceUuid` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `replacementCProductId` bigint DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`CPInstanceId`,`ctCollectionId`),
  UNIQUE KEY `IX_95564486` (`CPDefinitionId`,`ctCollectionId`,`CPInstanceUuid`),
  UNIQUE KEY `IX_E06787D8` (`CPDefinitionId`,`ctCollectionId`,`sku`),
  UNIQUE KEY `IX_EB17985B` (`ctCollectionId`,`companyId`,`externalReferenceCode`),
  UNIQUE KEY `IX_A495773C` (`ctCollectionId`,`uuid_`,`groupId`),
  KEY `IX_4389A03` (`CPDefinitionId`,`status`,`displayDate`),
  KEY `IX_34763899` (`CPInstanceUuid`),
  KEY `IX_9FB1144D` (`companyId`,`sku`),
  KEY `IX_C1F8242` (`groupId`),
  KEY `IX_BD04B832` (`status`,`displayDate`),
  KEY `IX_75478E1C` (`status`,`groupId`),
  KEY `IX_1140BD8` (`status`,`replacementCPInstanceUuid`,`replacementCProductId`),
  KEY `IX_4654BD4C` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPInstanceOptionValueRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPInstanceOptionValueRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPInstanceOptionValueRelId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `CPDefinitionOptionRelId` bigint DEFAULT NULL,
  `CPDefinitionOptionValueRelId` bigint DEFAULT NULL,
  `CPInstanceId` bigint DEFAULT NULL,
  PRIMARY KEY (`CPInstanceOptionValueRelId`,`ctCollectionId`),
  UNIQUE KEY `IX_C7B0D143` (`CPInstanceId`,`CPDefinitionOptionRelId`,`CPDefinitionOptionValueRelId`,`ctCollectionId`),
  UNIQUE KEY `IX_4399CE9D` (`uuid_`,`ctCollectionId`,`groupId`),
  KEY `IX_E551D3AA` (`CPDefinitionOptionRelId`),
  KEY `IX_D3B702C2` (`CPInstanceId`,`CPDefinitionOptionValueRelId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPInstanceUOM`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPInstanceUOM` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPInstanceUOMId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `CPInstanceId` bigint DEFAULT NULL,
  `active_` tinyint DEFAULT NULL,
  `incrementalOrderQuantity` decimal(30,16) DEFAULT NULL,
  `key_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `precision_` int DEFAULT NULL,
  `pricingQuantity` decimal(30,16) DEFAULT NULL,
  `primary_` tinyint DEFAULT NULL,
  `priority` double DEFAULT NULL,
  `rate` decimal(30,16) DEFAULT NULL,
  `sku` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`CPInstanceUOMId`,`ctCollectionId`),
  UNIQUE KEY `IX_C6BA8E9A` (`CPInstanceId`,`key_`,`ctCollectionId`),
  KEY `IX_4351C7A1` (`CPInstanceId`,`active_`),
  KEY `IX_611154B9` (`CPInstanceId`,`primary_`),
  KEY `IX_2EED7F68` (`companyId`,`key_`,`sku`),
  KEY `IX_9DCFEBFC` (`companyId`,`sku`),
  KEY `IX_ABE6B4BD` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPLCommerceGroupAccountRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPLCommerceGroupAccountRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPLCommerceAccountGroupRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commercePriceListId` bigint DEFAULT NULL,
  `commerceAccountGroupId` bigint DEFAULT NULL,
  `order_` int DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`CPLCommerceAccountGroupRelId`,`ctCollectionId`),
  UNIQUE KEY `IX_8EF03EDA` (`commercePriceListId`,`commerceAccountGroupId`,`ctCollectionId`),
  KEY `IX_29EF081D` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPMeasurementUnit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPMeasurementUnit` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPMeasurementUnitId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `key_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rate` double DEFAULT NULL,
  `primary_` tinyint DEFAULT NULL,
  `priority` double DEFAULT NULL,
  `type_` int DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`CPMeasurementUnitId`,`ctCollectionId`),
  UNIQUE KEY `IX_D52621F0` (`companyId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_51CDE4C1` (`companyId`,`ctCollectionId`,`key_`),
  UNIQUE KEY `IX_E3424311` (`uuid_`,`ctCollectionId`,`groupId`),
  KEY `IX_F0C14577` (`companyId`,`type_`,`primary_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPMethodGroupRelQualifier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPMethodGroupRelQualifier` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `CPMethodGroupRelQualifierId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `CPaymentMethodGroupRelId` bigint DEFAULT NULL,
  PRIMARY KEY (`CPMethodGroupRelQualifierId`),
  UNIQUE KEY `IX_D9799B2A` (`CPaymentMethodGroupRelId`,`classNameId`,`classPK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPOption`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPOption` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPOptionId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `commerceOptionTypeKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facetable` tinyint DEFAULT NULL,
  `required` tinyint DEFAULT NULL,
  `skuContributor` tinyint DEFAULT NULL,
  `key_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`CPOptionId`,`ctCollectionId`),
  UNIQUE KEY `IX_4E312C7F` (`companyId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_143B0E52` (`companyId`,`ctCollectionId`,`key_`),
  KEY `IX_A64FCE2C` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPOptionCategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPOptionCategory` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPOptionCategoryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `priority` double DEFAULT NULL,
  `key_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`CPOptionCategoryId`,`ctCollectionId`),
  UNIQUE KEY `IX_685B389D` (`companyId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_E4988A74` (`companyId`,`ctCollectionId`,`key_`),
  KEY `IX_ABB730CE` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPOptionValue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPOptionValue` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPOptionValueId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `CPOptionId` bigint DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `priority` double DEFAULT NULL,
  `key_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`CPOptionValueId`,`ctCollectionId`),
  UNIQUE KEY `IX_DA77C838` (`CPOptionId`,`ctCollectionId`,`key_`),
  UNIQUE KEY `IX_DC509C0C` (`companyId`,`ctCollectionId`,`externalReferenceCode`),
  KEY `IX_D7C1A0BF` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPSOListTypeDefinitionRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPSOListTypeDefinitionRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `CPSOListTypeDefinitionRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `CPSpecificationOptionId` bigint DEFAULT NULL,
  `listTypeDefinitionId` bigint DEFAULT NULL,
  PRIMARY KEY (`CPSOListTypeDefinitionRelId`,`ctCollectionId`),
  KEY `IX_8A69C0A5` (`CPSpecificationOptionId`,`listTypeDefinitionId`),
  KEY `IX_BB2AB5C5` (`listTypeDefinitionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPSpecificationOption`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPSpecificationOption` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPSpecificationOptionId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `CPOptionCategoryId` bigint DEFAULT NULL,
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `facetable` tinyint DEFAULT NULL,
  `key_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` double DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`CPSpecificationOptionId`,`ctCollectionId`),
  UNIQUE KEY `IX_7CEAF068` (`companyId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_669F7749` (`companyId`,`ctCollectionId`,`key_`),
  KEY `IX_421ED80` (`CPOptionCategoryId`),
  KEY `IX_972DFDE3` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPTaxCategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPTaxCategory` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPTaxCategoryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`CPTaxCategoryId`,`ctCollectionId`),
  UNIQUE KEY `IX_79A007D5` (`companyId`,`externalReferenceCode`,`ctCollectionId`),
  KEY `IX_705EAB92` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CPricingClassCPDefinitionRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CPricingClassCPDefinitionRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `CPricingClassCPDefinitionRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commercePricingClassId` bigint DEFAULT NULL,
  `CPDefinitionId` bigint DEFAULT NULL,
  PRIMARY KEY (`CPricingClassCPDefinitionRelId`,`ctCollectionId`),
  UNIQUE KEY `IX_DA09B6F3` (`commercePricingClassId`,`CPDefinitionId`,`ctCollectionId`),
  KEY `IX_31653559` (`CPDefinitionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CProduct`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CProduct` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CProductId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `publishedCPDefinitionId` bigint DEFAULT NULL,
  `latestVersion` int DEFAULT NULL,
  PRIMARY KEY (`CProductId`,`ctCollectionId`),
  UNIQUE KEY `IX_CB3A891B` (`ctCollectionId`,`externalReferenceCode`,`companyId`),
  UNIQUE KEY `IX_F70CE3C6` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_77F5B8F8` (`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CSDiagramEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CSDiagramEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `CSDiagramEntryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `CPDefinitionId` bigint DEFAULT NULL,
  `CPInstanceId` bigint DEFAULT NULL,
  `CProductId` bigint DEFAULT NULL,
  `diagram` tinyint DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `sequence` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sku` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`CSDiagramEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_4748C557` (`CPDefinitionId`,`sequence`,`ctCollectionId`),
  KEY `IX_129C0EC6` (`CPInstanceId`),
  KEY `IX_E1E7EA90` (`CProductId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CSDiagramPin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CSDiagramPin` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `CSDiagramPinId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `CPDefinitionId` bigint DEFAULT NULL,
  `positionX` double DEFAULT NULL,
  `positionY` double DEFAULT NULL,
  `sequence` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`CSDiagramPinId`,`ctCollectionId`),
  KEY `IX_B0DD2127` (`CPDefinitionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CSDiagramSetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CSDiagramSetting` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CSDiagramSettingId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `CPAttachmentFileEntryId` bigint DEFAULT NULL,
  `CPDefinitionId` bigint DEFAULT NULL,
  `color` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `radius` double DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`CSDiagramSettingId`,`ctCollectionId`),
  UNIQUE KEY `IX_4F753100` (`CPDefinitionId`,`ctCollectionId`),
  KEY `IX_BCB38741` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CSFixedOptionQualifier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CSFixedOptionQualifier` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `CSFixedOptionQualifierId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `commerceShippingFixedOptionId` bigint DEFAULT NULL,
  PRIMARY KEY (`CSFixedOptionQualifierId`),
  UNIQUE KEY `IX_1D29E189` (`commerceShippingFixedOptionId`,`classNameId`,`classPK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CSOptionAccountEntryRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CSOptionAccountEntryRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `CSOptionAccountEntryRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `accountEntryId` bigint DEFAULT NULL,
  `commerceChannelId` bigint DEFAULT NULL,
  `commerceShippingMethodKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceShippingOptionKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`CSOptionAccountEntryRelId`),
  UNIQUE KEY `IX_4F4C712A` (`accountEntryId`,`commerceChannelId`),
  KEY `IX_B48AB5E` (`commerceChannelId`),
  KEY `IX_64B9CFFC` (`commerceShippingOptionKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CShippingFixedOptionRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CShippingFixedOptionRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `CShippingFixedOptionRelId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceShippingMethodId` bigint DEFAULT NULL,
  `commerceShippingFixedOptionId` bigint DEFAULT NULL,
  `commerceInventoryWarehouseId` bigint DEFAULT NULL,
  `countryId` bigint DEFAULT NULL,
  `regionId` bigint DEFAULT NULL,
  `zip` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `weightFrom` double DEFAULT NULL,
  `weightTo` double DEFAULT NULL,
  `fixedPrice` decimal(30,16) DEFAULT NULL,
  `rateUnitWeightPrice` decimal(30,16) DEFAULT NULL,
  `ratePercentage` double DEFAULT NULL,
  PRIMARY KEY (`CShippingFixedOptionRelId`),
  KEY `IX_D89A7E24` (`commerceShippingFixedOptionId`),
  KEY `IX_4AA09D60` (`commerceShippingMethodId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CTAutoResolutionInfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CTAutoResolutionInfo` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctAutoResolutionInfoId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `ctCollectionId` bigint DEFAULT NULL,
  `modelClassNameId` bigint DEFAULT NULL,
  `sourceModelClassPK` bigint DEFAULT NULL,
  `targetModelClassPK` bigint DEFAULT NULL,
  `conflictIdentifier` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ctAutoResolutionInfoId`),
  KEY `IX_F925260` (`ctCollectionId`,`modelClassNameId`,`sourceModelClassPK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CTCollection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CTCollection` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ctCollectionId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `ctRemoteId` bigint DEFAULT NULL,
  `schemaVersionId` bigint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `onDemandUserId` bigint DEFAULT NULL,
  `shareable` tinyint DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`ctCollectionId`),
  UNIQUE KEY `IX_30F5BCCA` (`companyId`,`externalReferenceCode`),
  KEY `IX_8D52E6F9` (`companyId`,`status`),
  KEY `IX_CCDD86CD` (`schemaVersionId`),
  KEY `IX_DA0BBE1F` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CTCollectionTemplate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CTCollectionTemplate` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionTemplateId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ctCollectionTemplateId`),
  KEY `IX_489283B9` (`companyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CTComment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CTComment` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCommentId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `ctCollectionId` bigint DEFAULT NULL,
  `ctEntryId` bigint DEFAULT NULL,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`ctCommentId`),
  KEY `IX_FE644B52` (`ctCollectionId`),
  KEY `IX_C5E592B8` (`ctEntryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CTEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CTEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ctEntryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `ctCollectionId` bigint DEFAULT NULL,
  `modelClassNameId` bigint DEFAULT NULL,
  `modelClassPK` bigint DEFAULT NULL,
  `modelMvccVersion` bigint DEFAULT NULL,
  `changeType` int DEFAULT NULL,
  PRIMARY KEY (`ctEntryId`),
  UNIQUE KEY `IX_295C418C` (`ctCollectionId`,`modelClassNameId`,`modelClassPK`),
  UNIQUE KEY `IX_7FBB3312` (`externalReferenceCode`,`companyId`),
  KEY `IX_E1E08DCD` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CTMessage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CTMessage` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctMessageId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `ctCollectionId` bigint DEFAULT NULL,
  `messageContent` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`ctMessageId`),
  KEY `IX_9FB742FA` (`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CTPreferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CTPreferences` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctPreferencesId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `ctCollectionId` bigint DEFAULT NULL,
  `previousCtCollectionId` bigint DEFAULT NULL,
  `confirmationEnabled` tinyint DEFAULT NULL,
  PRIMARY KEY (`ctPreferencesId`),
  UNIQUE KEY `IX_516E5375` (`companyId`,`userId`),
  KEY `IX_3FECC82B` (`ctCollectionId`),
  KEY `IX_D9EA7A42` (`previousCtCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CTProcess`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CTProcess` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctProcessId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `ctCollectionId` bigint DEFAULT NULL,
  `backgroundTaskId` bigint DEFAULT NULL,
  `type_` int DEFAULT NULL,
  PRIMARY KEY (`ctProcessId`),
  KEY `IX_7523B0A4` (`companyId`),
  KEY `IX_46BA2033` (`ctCollectionId`,`type_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CTRemote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CTRemote` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctRemoteId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clientId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clientSecret` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ctRemoteId`),
  KEY `IX_9B9391EB` (`companyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CTSContent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CTSContent` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `ctsContentId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `repositoryId` bigint DEFAULT NULL,
  `path_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_` longblob,
  `size_` bigint DEFAULT NULL,
  `storeType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ctsContentId`,`ctCollectionId`),
  UNIQUE KEY `IX_8948D363` (`companyId`,`repositoryId`,`storeType`,`path_`,`version`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CTSchemaVersion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CTSchemaVersion` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `schemaVersionId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `schemaContext` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`schemaVersionId`),
  KEY `IX_687AE35C` (`companyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CTScore`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CTScore` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctScoreId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `ctCollectionId` bigint DEFAULT NULL,
  `score` int DEFAULT NULL,
  PRIMARY KEY (`ctScoreId`),
  UNIQUE KEY `IX_13F5EC85` (`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CTermEntryLocalization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CTermEntryLocalization` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `cTermEntryLocalizationId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `commerceTermEntryId` bigint DEFAULT NULL,
  `languageId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `label` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`cTermEntryLocalizationId`),
  UNIQUE KEY `IX_B197F41B` (`commerceTermEntryId`,`languageId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CVirtualOrderItemFileEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CVirtualOrderItemFileEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cVirtualOrderItemFileEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceVirtualOrderItemId` bigint DEFAULT NULL,
  `fileEntryId` bigint DEFAULT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usages` int DEFAULT NULL,
  `version` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`cVirtualOrderItemFileEntryId`),
  UNIQUE KEY `IX_68E33939` (`uuid_`,`groupId`),
  KEY `IX_C83537E` (`commerceVirtualOrderItemId`,`fileEntryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Calendar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Calendar` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `calendarId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `calendarResourceId` bigint DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `timeZoneId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` int DEFAULT NULL,
  `defaultCalendar` tinyint DEFAULT NULL,
  `enableComments` tinyint DEFAULT NULL,
  `enableRatings` tinyint DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`calendarId`,`ctCollectionId`),
  UNIQUE KEY `IX_31D79378` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_97FC174E` (`groupId`,`calendarResourceId`,`defaultCalendar`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CalendarBooking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CalendarBooking` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `calendarBookingId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `calendarId` bigint DEFAULT NULL,
  `calendarResourceId` bigint DEFAULT NULL,
  `parentCalendarBookingId` bigint DEFAULT NULL,
  `recurringCalendarBookingId` bigint DEFAULT NULL,
  `vEventUid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `location` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `startTime` bigint DEFAULT NULL,
  `endTime` bigint DEFAULT NULL,
  `allDay` tinyint DEFAULT NULL,
  `recurrence` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `firstReminder` bigint DEFAULT NULL,
  `firstReminderType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `secondReminder` bigint DEFAULT NULL,
  `secondReminderType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`calendarBookingId`,`ctCollectionId`),
  UNIQUE KEY `IX_9090D8F0` (`calendarId`,`ctCollectionId`,`vEventUid`),
  UNIQUE KEY `IX_BD5AA0AC` (`calendarId`,`parentCalendarBookingId`,`ctCollectionId`),
  UNIQUE KEY `IX_99E210F9` (`uuid_`,`ctCollectionId`,`groupId`),
  KEY `IX_470170B4` (`calendarId`,`status`),
  KEY `IX_B198FFC` (`calendarResourceId`),
  KEY `IX_F7B8A941` (`parentCalendarBookingId`,`status`),
  KEY `IX_14ADC52E` (`recurringCalendarBookingId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CalendarNotificationTemplate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CalendarNotificationTemplate` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `calendarNotificationTemplateId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `calendarId` bigint DEFAULT NULL,
  `notificationType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notificationTypeSettings` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notificationTemplateType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `body` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`calendarNotificationTemplateId`,`ctCollectionId`),
  UNIQUE KEY `IX_10D0E1DD` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_7727A482` (`calendarId`,`notificationType`,`notificationTemplateType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CalendarResource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CalendarResource` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `calendarResourceId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `classUuid` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `active_` tinyint DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`calendarResourceId`,`ctCollectionId`),
  UNIQUE KEY `IX_D8D5DB05` (`ctCollectionId`,`classNameId`,`classPK`),
  UNIQUE KEY `IX_FD05567A` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_74AD9DDD` (`active_`,`code_`,`companyId`),
  KEY `IX_40678371` (`groupId`,`active_`),
  KEY `IX_55C2F8AA` (`groupId`,`code_`),
  KEY `IX_150E2F22` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ChangesetCollection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ChangesetCollection` (
  `changesetCollectionId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`changesetCollectionId`),
  UNIQUE KEY `IX_ABEEE793` (`groupId`,`name`),
  KEY `IX_9AC55E11` (`companyId`,`name`),
  KEY `IX_EE4B4B0E` (`groupId`,`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ChangesetEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ChangesetEntry` (
  `changesetEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `changesetCollectionId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  PRIMARY KEY (`changesetEntryId`),
  UNIQUE KEY `IX_EF48912A` (`changesetCollectionId`,`classNameId`,`classPK`),
  KEY `IX_A9985762` (`classNameId`,`groupId`),
  KEY `IX_CEB6AFA2` (`companyId`),
  KEY `IX_E00AB6A4` (`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ClassName_`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ClassName_` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `classNameId` bigint NOT NULL,
  `value` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`classNameId`),
  UNIQUE KEY `IX_B27A301F` (`value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ClientExtensionEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ClientExtensionEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clientExtensionEntryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `properties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `sourceCodeURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `typeSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`clientExtensionEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_EFD3CBF7` (`companyId`,`externalReferenceCode`,`ctCollectionId`),
  KEY `IX_32C1FC31` (`companyId`,`type_`),
  KEY `IX_526820B0` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ClientExtensionEntryRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ClientExtensionEntryRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clientExtensionEntryRelId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `cetExternalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `typeSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`clientExtensionEntryRelId`,`ctCollectionId`),
  UNIQUE KEY `IX_DB5627B6` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_E6F09C55` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_A3BB58FF` (`classNameId`,`classPK`,`type_`),
  KEY `IX_44C5316` (`companyId`,`cetExternalReferenceCode`),
  KEY `IX_BE94634` (`type_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceAddressRestriction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceAddressRestriction` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `commerceAddressRestrictionId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `countryId` bigint DEFAULT NULL,
  PRIMARY KEY (`commerceAddressRestrictionId`),
  UNIQUE KEY `IX_9DD3ABD3` (`classNameId`,`classPK`,`countryId`),
  KEY `IX_AE21488` (`countryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceAvailabilityEstimate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceAvailabilityEstimate` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceAvailabilityEstimateId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `priority` double DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`commerceAvailabilityEstimateId`),
  KEY `IX_72527224` (`companyId`),
  KEY `IX_B83AF5B0` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceCatalog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceCatalog` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceCatalogId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `accountEntryId` bigint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceCurrencyCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `catalogDefaultLanguageId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `system_` tinyint DEFAULT NULL,
  PRIMARY KEY (`commerceCatalogId`,`ctCollectionId`),
  UNIQUE KEY `IX_A8DE8457` (`companyId`,`externalReferenceCode`,`ctCollectionId`),
  KEY `IX_7A691498` (`accountEntryId`),
  KEY `IX_65864AFC` (`companyId`,`system_`),
  KEY `IX_37D36450` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceChannel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceChannel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceChannelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `accountEntryId` bigint DEFAULT NULL,
  `siteGroupId` bigint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `typeSettings` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceCurrencyCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priceDisplayType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discountsTargetNetPrice` tinyint DEFAULT NULL,
  PRIMARY KEY (`commerceChannelId`,`ctCollectionId`),
  UNIQUE KEY `IX_D8DAE041` (`companyId`,`externalReferenceCode`,`ctCollectionId`),
  KEY `IX_C2C38B02` (`accountEntryId`),
  KEY `IX_E1ECD95` (`siteGroupId`),
  KEY `IX_9E82EA6` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceChannelRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceChannelRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `commerceChannelRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `commerceChannelId` bigint DEFAULT NULL,
  PRIMARY KEY (`commerceChannelRelId`,`ctCollectionId`),
  UNIQUE KEY `IX_4469A625` (`classNameId`,`classPK`,`commerceChannelId`,`ctCollectionId`),
  KEY `IX_48F8F6FC` (`commerceChannelId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceCurrency`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceCurrency` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceCurrencyId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `code_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `symbol` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rate` decimal(30,16) DEFAULT NULL,
  `formatPattern` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `maxFractionDigits` int DEFAULT NULL,
  `minFractionDigits` int DEFAULT NULL,
  `roundingMode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primary_` tinyint DEFAULT NULL,
  `priority` double DEFAULT NULL,
  `active_` tinyint DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`commerceCurrencyId`),
  UNIQUE KEY `IX_2127F18C` (`companyId`,`code_`),
  UNIQUE KEY `IX_523F2087` (`companyId`,`externalReferenceCode`),
  KEY `IX_C671CBD3` (`companyId`,`active_`),
  KEY `IX_ADF54822` (`companyId`,`primary_`,`active_`),
  KEY `IX_EE967482` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceDiscount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceDiscount` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceDiscountId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `title` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `useCouponCode` tinyint DEFAULT NULL,
  `couponCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usePercentage` tinyint DEFAULT NULL,
  `maximumDiscountAmount` decimal(30,16) DEFAULT NULL,
  `levelType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `level1` decimal(30,16) DEFAULT NULL,
  `level2` decimal(30,16) DEFAULT NULL,
  `level3` decimal(30,16) DEFAULT NULL,
  `level4` decimal(30,16) DEFAULT NULL,
  `limitationType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `limitationTimes` int DEFAULT NULL,
  `limitationTimesPerAccount` int DEFAULT NULL,
  `numberOfUse` int DEFAULT NULL,
  `rulesConjunction` tinyint DEFAULT NULL,
  `active_` tinyint DEFAULT NULL,
  `displayDate` datetime(6) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`commerceDiscountId`),
  UNIQUE KEY `IX_D294CDB7` (`companyId`,`externalReferenceCode`),
  KEY `IX_A7A710FC` (`companyId`,`couponCode`,`active_`),
  KEY `IX_1CCF5211` (`companyId`,`status`,`active_`,`levelType`),
  KEY `IX_52CB3DB8` (`status`,`displayDate`),
  KEY `IX_DE0C3C39` (`status`,`expirationDate`),
  KEY `IX_F1A4C552` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceDiscountAccountRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceDiscountAccountRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceDiscountAccountRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceAccountId` bigint DEFAULT NULL,
  `commerceDiscountId` bigint DEFAULT NULL,
  `order_` int DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`commerceDiscountAccountRelId`),
  UNIQUE KEY `IX_E082887A` (`commerceAccountId`,`commerceDiscountId`),
  KEY `IX_6EA2AA99` (`commerceDiscountId`),
  KEY `IX_CEE71686` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceDiscountOrderTypeRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceDiscountOrderTypeRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceDiscountOrderTypeRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceDiscountId` bigint DEFAULT NULL,
  `commerceOrderTypeId` bigint DEFAULT NULL,
  `priority` int DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`commerceDiscountOrderTypeRelId`),
  UNIQUE KEY `IX_614617A` (`commerceDiscountId`,`commerceOrderTypeId`),
  KEY `IX_707E0345` (`commerceOrderTypeId`),
  KEY `IX_CEE22E81` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceDiscountRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceDiscountRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `commerceDiscountRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceDiscountId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `typeSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`commerceDiscountRelId`),
  KEY `IX_6B4EEC38` (`classNameId`,`classPK`),
  KEY `IX_DDFDEF40` (`commerceDiscountId`,`classNameId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceDiscountRule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceDiscountRule` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `commerceDiscountRuleId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceDiscountId` bigint DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `typeSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`commerceDiscountRuleId`),
  KEY `IX_CB9E6769` (`commerceDiscountId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceDiscountUsageEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceDiscountUsageEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `commerceDiscountUsageEntryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceAccountId` bigint DEFAULT NULL,
  `commerceOrderId` bigint DEFAULT NULL,
  `commerceDiscountId` bigint DEFAULT NULL,
  PRIMARY KEY (`commerceDiscountUsageEntryId`),
  KEY `IX_28CE20FF` (`commerceDiscountId`,`commerceAccountId`,`commerceOrderId`),
  KEY `IX_E40C6220` (`commerceDiscountId`,`commerceOrderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceNotificationQueueEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceNotificationQueueEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `CNotificationQueueEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `commerceNotificationTemplateId` bigint DEFAULT NULL,
  `from_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fromName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `to_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `toName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bcc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `body` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `priority` double DEFAULT NULL,
  `sent` tinyint DEFAULT NULL,
  `sentDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`CNotificationQueueEntryId`),
  KEY `IX_F9149FC` (`commerceNotificationTemplateId`),
  KEY `IX_56F7649E` (`groupId`,`sent`,`classNameId`,`classPK`),
  KEY `IX_BEFF6FD9` (`sent`),
  KEY `IX_80026CA7` (`sentDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceNotificationTemplate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceNotificationTemplate` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceNotificationTemplateId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `from_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `fromName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `to_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cc` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `bcc` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `enabled` tinyint DEFAULT NULL,
  `subject` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `body` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`commerceNotificationTemplateId`),
  UNIQUE KEY `IX_56F147B0` (`groupId`,`uuid_`),
  KEY `IX_6D6C3008` (`groupId`,`enabled`,`type_`),
  KEY `IX_753B890E` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceOrder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceOrder` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceOrderId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `billingAddressId` bigint DEFAULT NULL,
  `commerceAccountId` bigint DEFAULT NULL,
  `commerceCurrencyCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceOrderTypeId` bigint DEFAULT NULL,
  `commerceShippingMethodId` bigint DEFAULT NULL,
  `deliveryCommerceTermEntryId` bigint DEFAULT NULL,
  `paymentCommerceTermEntryId` bigint DEFAULT NULL,
  `shippingAddressId` bigint DEFAULT NULL,
  `advanceStatus` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commercePaymentMethodKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `couponCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliveryCTermEntryDescription` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `deliveryCommerceTermEntryName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastPriceUpdateDate` datetime(6) DEFAULT NULL,
  `manuallyAdjusted` tinyint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `orderDate` datetime(6) DEFAULT NULL,
  `orderStatus` int DEFAULT NULL,
  `paymentCTermEntryDescription` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `paymentCommerceTermEntryName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentStatus` int DEFAULT NULL,
  `printedNote` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `purchaseOrderNumber` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requestedDeliveryDate` datetime(6) DEFAULT NULL,
  `shippable` tinyint DEFAULT NULL,
  `shippingAmount` decimal(30,16) DEFAULT NULL,
  `shippingDiscountAmount` decimal(30,16) DEFAULT NULL,
  `shippingDiscountPercentLevel1` decimal(30,16) DEFAULT NULL,
  `shippingDiscountPercentLevel2` decimal(30,16) DEFAULT NULL,
  `shippingDiscountPercentLevel3` decimal(30,16) DEFAULT NULL,
  `shippingDiscountPercentLevel4` decimal(30,16) DEFAULT NULL,
  `shippingDiscountPctLev1WithTax` decimal(30,16) DEFAULT NULL,
  `shippingDiscountPctLev2WithTax` decimal(30,16) DEFAULT NULL,
  `shippingDiscountPctLev3WithTax` decimal(30,16) DEFAULT NULL,
  `shippingDiscountPctLev4WithTax` decimal(30,16) DEFAULT NULL,
  `shippingDiscountWithTaxAmount` decimal(30,16) DEFAULT NULL,
  `shippingOptionName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shippingWithTaxAmount` decimal(30,16) DEFAULT NULL,
  `subtotal` decimal(30,16) DEFAULT NULL,
  `subtotalDiscountAmount` decimal(30,16) DEFAULT NULL,
  `subtotalDiscountPercentLevel1` decimal(30,16) DEFAULT NULL,
  `subtotalDiscountPercentLevel2` decimal(30,16) DEFAULT NULL,
  `subtotalDiscountPercentLevel3` decimal(30,16) DEFAULT NULL,
  `subtotalDiscountPercentLevel4` decimal(30,16) DEFAULT NULL,
  `subtotalDiscountPctLev1WithTax` decimal(30,16) DEFAULT NULL,
  `subtotalDiscountPctLev2WithTax` decimal(30,16) DEFAULT NULL,
  `subtotalDiscountPctLev3WithTax` decimal(30,16) DEFAULT NULL,
  `subtotalDiscountPctLev4WithTax` decimal(30,16) DEFAULT NULL,
  `subtotalDiscountWithTaxAmount` decimal(30,16) DEFAULT NULL,
  `subtotalWithTaxAmount` decimal(30,16) DEFAULT NULL,
  `taxAmount` decimal(30,16) DEFAULT NULL,
  `total` decimal(30,16) DEFAULT NULL,
  `totalDiscountAmount` decimal(30,16) DEFAULT NULL,
  `totalDiscountPercentageLevel1` decimal(30,16) DEFAULT NULL,
  `totalDiscountPercentageLevel2` decimal(30,16) DEFAULT NULL,
  `totalDiscountPercentageLevel3` decimal(30,16) DEFAULT NULL,
  `totalDiscountPercentageLevel4` decimal(30,16) DEFAULT NULL,
  `totalDiscountPctLev1WithTax` decimal(30,16) DEFAULT NULL,
  `totalDiscountPctLev2WithTax` decimal(30,16) DEFAULT NULL,
  `totalDiscountPctLev3WithTax` decimal(30,16) DEFAULT NULL,
  `totalDiscountPctLev4WithTax` decimal(30,16) DEFAULT NULL,
  `totalDiscountWithTaxAmount` decimal(30,16) DEFAULT NULL,
  `totalWithTaxAmount` decimal(30,16) DEFAULT NULL,
  `transactionId` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`commerceOrderId`),
  UNIQUE KEY `IX_30FF90A4` (`externalReferenceCode`,`companyId`),
  UNIQUE KEY `IX_25C927E3` (`groupId`,`uuid_`),
  KEY `IX_12131FC1` (`billingAddressId`),
  KEY `IX_4650BB0A` (`commerceAccountId`,`orderStatus`,`createDate`),
  KEY `IX_4F4CAEE4` (`groupId`,`commerceAccountId`,`orderStatus`),
  KEY `IX_9C04F6F8` (`groupId`,`commercePaymentMethodKey`),
  KEY `IX_2F8AA139` (`groupId`,`orderStatus`,`userId`),
  KEY `IX_7759000F` (`orderStatus`,`userId`,`createDate`),
  KEY `IX_4B11FAD8` (`shippingAddressId`),
  KEY `IX_EFAA753` (`userId`),
  KEY `IX_35A4137B` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceOrderItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceOrderItem` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceOrderItemId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `CIBookedQuantityId` bigint DEFAULT NULL,
  `commerceOrderId` bigint DEFAULT NULL,
  `commercePriceListId` bigint DEFAULT NULL,
  `CPInstanceId` bigint DEFAULT NULL,
  `CPMeasurementUnitId` bigint DEFAULT NULL,
  `CProductId` bigint DEFAULT NULL,
  `customerCommerceOrderItemId` bigint DEFAULT NULL,
  `parentCommerceOrderItemId` bigint DEFAULT NULL,
  `shippingAddressId` bigint DEFAULT NULL,
  `deliveryGroupName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliveryMaxSubscriptionCycles` bigint DEFAULT NULL,
  `deliverySubscriptionLength` int DEFAULT NULL,
  `deliverySubscriptionType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliverySubTypeSettings` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `depth` double DEFAULT NULL,
  `discountAmount` decimal(30,16) DEFAULT NULL,
  `discountManuallyAdjusted` tinyint DEFAULT NULL,
  `discountPercentageLevel1` decimal(30,16) DEFAULT NULL,
  `discountPercentageLevel2` decimal(30,16) DEFAULT NULL,
  `discountPercentageLevel3` decimal(30,16) DEFAULT NULL,
  `discountPercentageLevel4` decimal(30,16) DEFAULT NULL,
  `discountPctLevel1WithTaxAmount` decimal(30,16) DEFAULT NULL,
  `discountPctLevel2WithTaxAmount` decimal(30,16) DEFAULT NULL,
  `discountPctLevel3WithTaxAmount` decimal(30,16) DEFAULT NULL,
  `discountPctLevel4WithTaxAmount` decimal(30,16) DEFAULT NULL,
  `discountWithTaxAmount` decimal(30,16) DEFAULT NULL,
  `finalPrice` decimal(30,16) DEFAULT NULL,
  `finalPriceWithTaxAmount` decimal(30,16) DEFAULT NULL,
  `freeShipping` tinyint DEFAULT NULL,
  `height` double DEFAULT NULL,
  `json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `manuallyAdjusted` tinyint DEFAULT NULL,
  `maxSubscriptionCycles` bigint DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `priceManuallyAdjusted` tinyint DEFAULT NULL,
  `priceOnApplication` tinyint DEFAULT NULL,
  `printedNote` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `promoPrice` decimal(30,16) DEFAULT NULL,
  `promoPriceWithTaxAmount` decimal(30,16) DEFAULT NULL,
  `quantity` decimal(30,16) DEFAULT NULL,
  `replacedCPInstanceId` bigint DEFAULT NULL,
  `replacedSku` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requestedDeliveryDate` datetime(6) DEFAULT NULL,
  `shipSeparately` tinyint DEFAULT NULL,
  `shippable` tinyint DEFAULT NULL,
  `shippedQuantity` decimal(30,16) DEFAULT NULL,
  `shippingExtraPrice` double DEFAULT NULL,
  `sku` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subscription` tinyint DEFAULT NULL,
  `subscriptionLength` int DEFAULT NULL,
  `subscriptionType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subscriptionTypeSettings` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `UOMIncrementalOrderQuantity` decimal(30,16) DEFAULT NULL,
  `unitOfMeasureKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unitPrice` decimal(30,16) DEFAULT NULL,
  `unitPriceWithTaxAmount` decimal(30,16) DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `width` double DEFAULT NULL,
  PRIMARY KEY (`commerceOrderItemId`),
  UNIQUE KEY `IX_FA3620D7` (`externalReferenceCode`,`companyId`),
  UNIQUE KEY `IX_F0116282` (`uuid_`,`groupId`),
  KEY `IX_654BB574` (`CIBookedQuantityId`),
  KEY `IX_2E1BB39D` (`CPInstanceId`),
  KEY `IX_F9E8D927` (`CProductId`),
  KEY `IX_415AF3E3` (`commerceOrderId`,`CPInstanceId`),
  KEY `IX_15B37023` (`commerceOrderId`,`subscription`),
  KEY `IX_F0E98FC7` (`customerCommerceOrderItemId`),
  KEY `IX_8E1472FB` (`parentCommerceOrderItemId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceOrderItem_x_92605711380992`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceOrderItem_x_92605711380992` (
  `commerceOrderItemId` bigint NOT NULL,
  PRIMARY KEY (`commerceOrderItemId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceOrderNote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceOrderNote` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceOrderNoteId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceOrderId` bigint DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `restricted` tinyint DEFAULT NULL,
  PRIMARY KEY (`commerceOrderNoteId`),
  UNIQUE KEY `IX_D75F9236` (`externalReferenceCode`,`companyId`),
  UNIQUE KEY `IX_76D9BDA1` (`uuid_`,`groupId`),
  KEY `IX_CEB86C22` (`commerceOrderId`,`restricted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceOrderPayment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceOrderPayment` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `commerceOrderPaymentId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceOrderId` bigint DEFAULT NULL,
  `commercePaymentMethodKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`commerceOrderPaymentId`),
  KEY `IX_CF274005` (`commerceOrderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceOrderType`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceOrderType` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceOrderTypeId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `active_` tinyint DEFAULT NULL,
  `displayDate` datetime(6) DEFAULT NULL,
  `displayOrder` int DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`commerceOrderTypeId`),
  UNIQUE KEY `IX_4EC1CAC8` (`companyId`,`externalReferenceCode`),
  KEY `IX_72C90BD4` (`companyId`,`active_`),
  KEY `IX_B535907` (`status`,`displayDate`),
  KEY `IX_4EE2A8A` (`status`,`expirationDate`),
  KEY `IX_FAD246E1` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceOrderTypeRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceOrderTypeRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceOrderTypeRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `commerceOrderTypeId` bigint DEFAULT NULL,
  PRIMARY KEY (`commerceOrderTypeRelId`),
  UNIQUE KEY `IX_1110AF1B` (`commerceOrderTypeId`,`classNameId`,`classPK`),
  UNIQUE KEY `IX_AD1B97D` (`externalReferenceCode`,`companyId`),
  KEY `IX_D24B6642` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceOrder_x_92605711380992`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceOrder_x_92605711380992` (
  `commerceOrderId` bigint NOT NULL,
  PRIMARY KEY (`commerceOrderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommercePaymentEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommercePaymentEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commercePaymentEntryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `commerceChannelId` bigint DEFAULT NULL,
  `amount` decimal(30,16) DEFAULT NULL,
  `callbackURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cancelURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `currencyCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `errorMessages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `languageId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `paymentIntegrationKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentIntegrationType` int DEFAULT NULL,
  `paymentStatus` int DEFAULT NULL,
  `reasonKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reasonName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `redirectURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `transactionCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` int DEFAULT NULL,
  PRIMARY KEY (`commercePaymentEntryId`),
  UNIQUE KEY `IX_ECEC8382` (`companyId`,`externalReferenceCode`),
  KEY `IX_DF716143` (`companyId`,`classNameId`,`classPK`,`type_`,`paymentStatus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommercePaymentEntryAudit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommercePaymentEntryAudit` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `commercePaymentEntryAuditId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commercePaymentEntryId` bigint DEFAULT NULL,
  `amount` decimal(30,16) DEFAULT NULL,
  `currencyCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logTypeSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`commercePaymentEntryAuditId`),
  KEY `IX_8BE29B30` (`commercePaymentEntryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommercePaymentMethodGroupRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommercePaymentMethodGroupRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `CPaymentMethodGroupRelId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `active_` tinyint DEFAULT NULL,
  `imageId` bigint DEFAULT NULL,
  `paymentIntegrationKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` double DEFAULT NULL,
  `typeSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`CPaymentMethodGroupRelId`),
  UNIQUE KEY `IX_FFF17D63` (`groupId`,`paymentIntegrationKey`),
  KEY `IX_98EF79EB` (`groupId`,`active_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommercePriceEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommercePriceEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commercePriceEntryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commercePriceListId` bigint DEFAULT NULL,
  `CPInstanceUuid` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CProductId` bigint DEFAULT NULL,
  `bulkPricing` tinyint DEFAULT NULL,
  `discountDiscovery` tinyint DEFAULT NULL,
  `discountLevel1` decimal(30,16) DEFAULT NULL,
  `discountLevel2` decimal(30,16) DEFAULT NULL,
  `discountLevel3` decimal(30,16) DEFAULT NULL,
  `discountLevel4` decimal(30,16) DEFAULT NULL,
  `displayDate` datetime(6) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `hasTierPrice` tinyint DEFAULT NULL,
  `price` decimal(30,16) DEFAULT NULL,
  `priceOnApplication` tinyint DEFAULT NULL,
  `pricingQuantity` decimal(30,16) DEFAULT NULL,
  `promoPrice` decimal(30,16) DEFAULT NULL,
  `quantity` decimal(30,16) DEFAULT NULL,
  `unitOfMeasureKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`commercePriceEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_95608EBD` (`companyId`,`externalReferenceCode`,`ctCollectionId`),
  KEY `IX_20ED9B62` (`CPInstanceUuid`,`commercePriceListId`,`status`),
  KEY `IX_CCBB916A` (`CPInstanceUuid`,`quantity`,`unitOfMeasureKey`),
  KEY `IX_CA7A2D0D` (`commercePriceListId`),
  KEY `IX_B9AEC410` (`status`,`displayDate`),
  KEY `IX_255AF6E1` (`status`,`expirationDate`),
  KEY `IX_C15BC5AA` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommercePriceList`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommercePriceList` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commercePriceListId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceCurrencyCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parentCommercePriceListId` bigint DEFAULT NULL,
  `catalogBasePriceList` tinyint DEFAULT NULL,
  `netPrice` tinyint DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` double DEFAULT NULL,
  `displayDate` datetime(6) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`commercePriceListId`,`ctCollectionId`),
  UNIQUE KEY `IX_A0692909` (`companyId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_22D6C1BA` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_6C8A40A3` (`companyId`,`commerceCurrencyCode`),
  KEY `IX_3AE5B429` (`groupId`,`catalogBasePriceList`),
  KEY `IX_3BE0F85F` (`groupId`,`companyId`,`status`,`type_`),
  KEY `IX_31F12A8E` (`groupId`,`type_`,`catalogBasePriceList`),
  KEY `IX_863045BB` (`parentCommercePriceListId`),
  KEY `IX_72305848` (`status`,`displayDate`),
  KEY `IX_1B0C9BE2` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommercePriceListAccountRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommercePriceListAccountRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commercePriceListAccountRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceAccountId` bigint DEFAULT NULL,
  `commercePriceListId` bigint DEFAULT NULL,
  `order_` int DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`commercePriceListAccountRelId`,`ctCollectionId`),
  UNIQUE KEY `IX_5FBCA042` (`commercePriceListId`,`commerceAccountId`,`ctCollectionId`),
  KEY `IX_919FF916` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommercePriceListChannelRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommercePriceListChannelRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CommercePriceListChannelRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceChannelId` bigint DEFAULT NULL,
  `commercePriceListId` bigint DEFAULT NULL,
  `order_` int DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`CommercePriceListChannelRelId`,`ctCollectionId`),
  UNIQUE KEY `IX_6B436902` (`commercePriceListId`,`commerceChannelId`,`ctCollectionId`),
  KEY `IX_A7045AEC` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommercePriceListDiscountRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommercePriceListDiscountRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commercePriceListDiscountRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceDiscountId` bigint DEFAULT NULL,
  `commercePriceListId` bigint DEFAULT NULL,
  `order_` int DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`commercePriceListDiscountRelId`,`ctCollectionId`),
  UNIQUE KEY `IX_7D707AEE` (`commercePriceListId`,`commerceDiscountId`,`ctCollectionId`),
  KEY `IX_4F76A982` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommercePriceListOrderTypeRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommercePriceListOrderTypeRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CPriceListOrderTypeRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commercePriceListId` bigint DEFAULT NULL,
  `commerceOrderTypeId` bigint DEFAULT NULL,
  `priority` int DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`CPriceListOrderTypeRelId`,`ctCollectionId`),
  UNIQUE KEY `IX_4EA60BE2` (`commercePriceListId`,`commerceOrderTypeId`,`ctCollectionId`),
  KEY `IX_C6ECAD11` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommercePriceModifier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommercePriceModifier` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commercePriceModifierId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commercePriceListId` bigint DEFAULT NULL,
  `title` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modifierAmount` decimal(30,16) DEFAULT NULL,
  `modifierType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` double DEFAULT NULL,
  `active_` tinyint DEFAULT NULL,
  `displayDate` datetime(6) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`commercePriceModifierId`,`ctCollectionId`),
  UNIQUE KEY `IX_DB76B9C2` (`companyId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_FAB45A5F` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_176CA5EC` (`commercePriceListId`),
  KEY `IX_AEE7A167` (`companyId`,`status`,`groupId`),
  KEY `IX_FCACD082` (`companyId`,`target`),
  KEY `IX_6A13CEF` (`status`,`displayDate`),
  KEY `IX_921ADDA2` (`status`,`expirationDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommercePriceModifierRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommercePriceModifierRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `commercePriceModifierRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commercePriceModifierId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  PRIMARY KEY (`commercePriceModifierRelId`,`ctCollectionId`),
  UNIQUE KEY `IX_510AD1A9` (`commercePriceModifierId`,`classNameId`,`classPK`,`ctCollectionId`),
  KEY `IX_391477EF` (`classNameId`,`classPK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommercePricingClass`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommercePricingClass` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commercePricingClassId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`commercePricingClassId`,`ctCollectionId`),
  UNIQUE KEY `IX_925EA26` (`companyId`,`externalReferenceCode`,`ctCollectionId`),
  KEY `IX_33040DE1` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommercePricingClass_x_92605711380992`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommercePricingClass_x_92605711380992` (
  `commercePricingClassId` bigint NOT NULL,
  PRIMARY KEY (`commercePricingClassId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceQualifierEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceQualifierEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `commerceQualifierEntryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `sourceClassNameId` bigint DEFAULT NULL,
  `sourceClassPK` bigint DEFAULT NULL,
  `sourceCQualifierMetadataKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `targetClassNameId` bigint DEFAULT NULL,
  `targetClassPK` bigint DEFAULT NULL,
  `targetCQualifierMetadataKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`commerceQualifierEntryId`),
  UNIQUE KEY `IX_30C98C7D` (`sourceClassNameId`,`targetClassNameId`,`sourceClassPK`,`targetClassPK`),
  KEY `IX_314E173E` (`sourceClassNameId`,`sourceClassPK`),
  KEY `IX_C11F2CFF` (`sourceClassNameId`,`targetClassNameId`,`targetClassPK`),
  KEY `IX_D4BE2EFE` (`targetClassNameId`,`targetClassPK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceShipment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceShipment` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceShipmentId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceAccountId` bigint DEFAULT NULL,
  `commerceAddressId` bigint DEFAULT NULL,
  `commerceShippingMethodId` bigint DEFAULT NULL,
  `carrier` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expectedDate` datetime(6) DEFAULT NULL,
  `shippingDate` datetime(6) DEFAULT NULL,
  `shippingOptionName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `trackingNumber` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trackingURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`commerceShipmentId`),
  UNIQUE KEY `IX_DD20F446` (`externalReferenceCode`,`companyId`),
  UNIQUE KEY `IX_88139005` (`groupId`,`uuid_`),
  KEY `IX_616BDD15` (`groupId`,`commerceAddressId`),
  KEY `IX_68FBA2B5` (`groupId`,`status`),
  KEY `IX_67979D19` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceShipmentItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceShipmentItem` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceShipmentItemId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceShipmentId` bigint DEFAULT NULL,
  `commerceOrderItemId` bigint DEFAULT NULL,
  `commerceInventoryWarehouseId` bigint DEFAULT NULL,
  `quantity` decimal(30,16) DEFAULT NULL,
  `unitOfMeasureKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`commerceShipmentItemId`),
  UNIQUE KEY `IX_4FAC36D0` (`commerceShipmentId`,`commerceOrderItemId`,`commerceInventoryWarehouseId`),
  UNIQUE KEY `IX_29D8E379` (`externalReferenceCode`,`companyId`),
  UNIQUE KEY `IX_D8C6E9A4` (`uuid_`,`groupId`),
  KEY `IX_3615B923` (`commerceOrderItemId`),
  KEY `IX_DB0BB83C` (`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceShippingFixedOption`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceShippingFixedOption` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `commerceShippingFixedOptionId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceShippingMethodId` bigint DEFAULT NULL,
  `amount` decimal(30,16) DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `key_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `priority` double DEFAULT NULL,
  PRIMARY KEY (`commerceShippingFixedOptionId`),
  UNIQUE KEY `IX_BCEAE976` (`companyId`,`key_`),
  KEY `IX_DCB21C1F` (`commerceShippingMethodId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceShippingMethod`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceShippingMethod` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `commerceShippingMethodId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `active_` tinyint DEFAULT NULL,
  `engineKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imageId` bigint DEFAULT NULL,
  `priority` double DEFAULT NULL,
  `trackingURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `typeSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`commerceShippingMethodId`),
  UNIQUE KEY `IX_C4557F93` (`groupId`,`engineKey`),
  KEY `IX_42E5F6EF` (`groupId`,`active_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceSubscriptionEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceSubscriptionEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceSubscriptionEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `CPInstanceUuid` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CProductId` bigint DEFAULT NULL,
  `commerceOrderItemId` bigint DEFAULT NULL,
  `subscriptionLength` int DEFAULT NULL,
  `subscriptionType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subscriptionTypeSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `currentCycle` bigint DEFAULT NULL,
  `maxSubscriptionCycles` bigint DEFAULT NULL,
  `subscriptionStatus` int DEFAULT NULL,
  `lastIterationDate` datetime(6) DEFAULT NULL,
  `nextIterationDate` datetime(6) DEFAULT NULL,
  `startDate` datetime(6) DEFAULT NULL,
  `deliverySubscriptionLength` int DEFAULT NULL,
  `deliverySubscriptionType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliverySubTypeSettings` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliveryCurrentCycle` bigint DEFAULT NULL,
  `deliveryMaxSubscriptionCycles` bigint DEFAULT NULL,
  `deliverySubscriptionStatus` int DEFAULT NULL,
  `deliveryLastIterationDate` datetime(6) DEFAULT NULL,
  `deliveryNextIterationDate` datetime(6) DEFAULT NULL,
  `deliveryStartDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`commerceSubscriptionEntryId`),
  UNIQUE KEY `IX_D7D137B1` (`commerceOrderItemId`),
  UNIQUE KEY `IX_943E0A56` (`uuid_`,`groupId`),
  KEY `IX_43E6F382` (`companyId`,`userId`),
  KEY `IX_B99DE058` (`groupId`,`companyId`,`userId`),
  KEY `IX_B496E103` (`subscriptionStatus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceTaxFixedRate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceTaxFixedRate` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `commerceTaxFixedRateId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `CPTaxCategoryId` bigint DEFAULT NULL,
  `commerceTaxMethodId` bigint DEFAULT NULL,
  `rate` double DEFAULT NULL,
  PRIMARY KEY (`commerceTaxFixedRateId`),
  UNIQUE KEY `IX_DA39AA7F` (`CPTaxCategoryId`,`commerceTaxMethodId`),
  KEY `IX_52767DD2` (`commerceTaxMethodId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceTaxFixedRateAddressRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceTaxFixedRateAddressRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `CTaxFixedRateAddressRelId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceTaxMethodId` bigint DEFAULT NULL,
  `CPTaxCategoryId` bigint DEFAULT NULL,
  `countryId` bigint DEFAULT NULL,
  `regionId` bigint DEFAULT NULL,
  `zip` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rate` double DEFAULT NULL,
  PRIMARY KEY (`CTaxFixedRateAddressRelId`),
  KEY `IX_37AE3A58` (`CPTaxCategoryId`),
  KEY `IX_CB69750D` (`commerceTaxMethodId`),
  KEY `IX_DB83CD12` (`countryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceTaxMethod`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceTaxMethod` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `commerceTaxMethodId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `engineKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `percentage` tinyint DEFAULT NULL,
  `active_` tinyint DEFAULT NULL,
  PRIMARY KEY (`commerceTaxMethodId`),
  UNIQUE KEY `IX_BA569BFA` (`groupId`,`engineKey`),
  KEY `IX_F3810116` (`groupId`,`active_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceTermEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceTermEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `defaultLanguageId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceTermEntryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `active_` tinyint DEFAULT NULL,
  `displayDate` datetime(6) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` double DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `typeSettings` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`commerceTermEntryId`),
  UNIQUE KEY `IX_B241C786` (`companyId`,`externalReferenceCode`),
  UNIQUE KEY `IX_2AB59656` (`companyId`,`name`),
  UNIQUE KEY `IX_F91A2436` (`companyId`,`type_`,`priority`),
  KEY `IX_E73B0D12` (`companyId`,`active_`),
  KEY `IX_E90D7AAB` (`companyId`,`type_`,`active_`),
  KEY `IX_25217F89` (`status`,`displayDate`),
  KEY `IX_1E15CC8` (`status`,`expirationDate`),
  KEY `IX_7C4118E3` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceTermEntryRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceTermEntryRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `commerceTermEntryRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `commerceTermEntryId` bigint DEFAULT NULL,
  PRIMARY KEY (`commerceTermEntryRelId`),
  UNIQUE KEY `IX_2AA8B117` (`commerceTermEntryId`,`classNameId`,`classPK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceTierPriceEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceTierPriceEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceTierPriceEntryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commercePriceEntryId` bigint DEFAULT NULL,
  `price` decimal(30,16) DEFAULT NULL,
  `promoPrice` decimal(30,16) DEFAULT NULL,
  `discountDiscovery` tinyint DEFAULT NULL,
  `discountLevel1` decimal(30,16) DEFAULT NULL,
  `discountLevel2` decimal(30,16) DEFAULT NULL,
  `discountLevel3` decimal(30,16) DEFAULT NULL,
  `discountLevel4` decimal(30,16) DEFAULT NULL,
  `minQuantity` decimal(30,16) DEFAULT NULL,
  `displayDate` datetime(6) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`commerceTierPriceEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_4072830C` (`commercePriceEntryId`,`minQuantity`,`ctCollectionId`),
  UNIQUE KEY `IX_4B03AB43` (`companyId`,`ctCollectionId`,`externalReferenceCode`),
  KEY `IX_89DE1E88` (`commercePriceEntryId`,`status`,`minQuantity`),
  KEY `IX_CB288BCE` (`status`,`displayDate`),
  KEY `IX_D00E2E63` (`status`,`expirationDate`),
  KEY `IX_71F6D1E8` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceVirtualOrderItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceVirtualOrderItem` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceVirtualOrderItemId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceOrderItemId` bigint DEFAULT NULL,
  `activationStatus` int DEFAULT NULL,
  `duration` bigint DEFAULT NULL,
  `maxUsages` int DEFAULT NULL,
  `active_` tinyint DEFAULT NULL,
  `startDate` datetime(6) DEFAULT NULL,
  `endDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`commerceVirtualOrderItemId`),
  UNIQUE KEY `IX_44EADF9A` (`commerceOrderItemId`),
  UNIQUE KEY `IX_81F354CD` (`uuid_`,`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceWishList`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceWishList` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commerceWishListId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `defaultWishList` tinyint DEFAULT NULL,
  PRIMARY KEY (`commerceWishListId`),
  UNIQUE KEY `IX_FB7BEB90` (`groupId`,`uuid_`),
  KEY `IX_777290D8` (`groupId`,`userId`,`defaultWishList`),
  KEY `IX_6680B6BE` (`userId`,`createDate`),
  KEY `IX_47CF092E` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CommerceWishListItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CommerceWishListItem` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `commerceWishListItemId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `commerceWishListId` bigint DEFAULT NULL,
  `CPInstanceUuid` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CProductId` bigint DEFAULT NULL,
  `json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`commerceWishListItemId`),
  KEY `IX_9DA3D36A` (`CPInstanceUuid`),
  KEY `IX_CF9B9CD4` (`CProductId`),
  KEY `IX_BC95AC54` (`commerceWishListId`,`CPInstanceUuid`,`CProductId`),
  KEY `IX_C172BCA3` (`commerceWishListId`,`CProductId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Company` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `companyId` bigint NOT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `webId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mx` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `homeURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `logoId` bigint DEFAULT NULL,
  `maxUsers` int DEFAULT NULL,
  `active_` tinyint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `legalName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `legalId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `legalType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sicCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tickerSymbol` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `industry` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `indexNameCurrent` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `indexNameNext` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`companyId`),
  UNIQUE KEY `IX_EC00543C` (`webId`),
  KEY `IX_38EFE3FD` (`logoId`),
  KEY `IX_12566EC2` (`mx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CompanyInfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CompanyInfo` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `companyInfoId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `key_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`companyInfoId`),
  UNIQUE KEY `IX_85C63FD7` (`companyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Configuration_`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Configuration_` (
  `configurationId` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dictionary` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`configurationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Contact_`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Contact_` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `contactId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `parentContactId` bigint DEFAULT NULL,
  `emailAddress` varchar(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `firstName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `middleName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prefixListTypeId` bigint DEFAULT NULL,
  `suffixListTypeId` bigint DEFAULT NULL,
  `male` tinyint DEFAULT NULL,
  `birthday` datetime(6) DEFAULT NULL,
  `smsSn` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facebookSn` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jabberSn` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `skypeSn` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `twitterSn` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employeeStatusId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employeeNumber` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jobTitle` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jobClass` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hoursOfOperation` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`contactId`),
  KEY `IX_791914FA` (`classNameId`,`classPK`),
  KEY `IX_FD2E9BDD` (`companyId`,`userId`),
  KEY `IX_42F94F9F` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Contacts_Entry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Contacts_Entry` (
  `entryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `fullName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emailAddress` varchar(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`entryId`),
  KEY `IX_C257DE32` (`userId`,`emailAddress`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Counter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Counter` (
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `currentId` bigint DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Country` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `defaultLanguageId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `countryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `a2` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `a3` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active_` tinyint DEFAULT NULL,
  `billingAllowed` tinyint DEFAULT NULL,
  `groupFilterEnabled` tinyint DEFAULT NULL,
  `idd_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `number_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` double DEFAULT NULL,
  `shippingAllowed` tinyint DEFAULT NULL,
  `subjectToVAT` tinyint DEFAULT NULL,
  `zipRequired` tinyint DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`countryId`,`ctCollectionId`),
  UNIQUE KEY `IX_7DA11A6F` (`companyId`,`ctCollectionId`,`a2`),
  UNIQUE KEY `IX_7DA11E30` (`companyId`,`ctCollectionId`,`a3`),
  UNIQUE KEY `IX_B2A91789` (`companyId`,`ctCollectionId`,`name`),
  UNIQUE KEY `IX_74AB3DC` (`companyId`,`ctCollectionId`,`number_`),
  KEY `IX_25D734CD` (`active_`),
  KEY `IX_F9CD867E` (`companyId`,`active_`,`billingAllowed`),
  KEY `IX_54E98CCD` (`companyId`,`active_`,`shippingAllowed`),
  KEY `IX_B59A9078` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `CountryLocalization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CountryLocalization` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `countryLocalizationId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `countryId` bigint DEFAULT NULL,
  `languageId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`countryLocalizationId`,`ctCollectionId`),
  UNIQUE KEY `IX_E22A5911` (`countryId`,`languageId`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DDLRecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DDLRecord` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recordId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `versionUserId` bigint DEFAULT NULL,
  `versionUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `DDMStorageId` bigint DEFAULT NULL,
  `recordSetId` bigint DEFAULT NULL,
  `recordSetVersion` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `className` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `version` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `displayIndex` int DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`recordId`,`ctCollectionId`),
  UNIQUE KEY `IX_7E71D397` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_D443D273` (`className`(255),`classPK`),
  KEY `IX_6A6C1C85` (`companyId`),
  KEY `IX_F12C61D4` (`recordSetId`,`recordSetVersion`),
  KEY `IX_AAC564D3` (`recordSetId`,`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DDLRecordSet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DDLRecordSet` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recordSetId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `versionUserId` bigint DEFAULT NULL,
  `versionUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `DDMStructureId` bigint DEFAULT NULL,
  `recordSetKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `minDisplayRows` int DEFAULT NULL,
  `scope` int DEFAULT NULL,
  `settings_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`recordSetId`,`ctCollectionId`),
  UNIQUE KEY `IX_2C896CFF` (`groupId`,`ctCollectionId`,`recordSetKey`),
  UNIQUE KEY `IX_A7D89A3F` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_6705D180` (`DDMStructureId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DDLRecordSetVersion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DDLRecordSetVersion` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `recordSetVersionId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `recordSetId` bigint DEFAULT NULL,
  `DDMStructureVersionId` bigint DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `settings_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `version` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`recordSetVersionId`,`ctCollectionId`),
  UNIQUE KEY `IX_577F80E3` (`recordSetId`,`version`,`ctCollectionId`),
  KEY `IX_1C4E1CC9` (`recordSetId`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DDLRecordVersion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DDLRecordVersion` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `recordVersionId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `DDMStorageId` bigint DEFAULT NULL,
  `recordSetId` bigint DEFAULT NULL,
  `recordSetVersion` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recordId` bigint DEFAULT NULL,
  `version` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `displayIndex` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`recordVersionId`,`ctCollectionId`),
  UNIQUE KEY `IX_8EDB4BA5` (`recordId`,`version`,`ctCollectionId`),
  KEY `IX_762ADC7` (`recordId`,`status`),
  KEY `IX_A1B81B16` (`recordSetId`,`recordSetVersion`,`status`,`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DDMContent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DDMContent` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contentId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `data_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`contentId`,`ctCollectionId`),
  UNIQUE KEY `IX_D4156486` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_E3BAF436` (`companyId`),
  KEY `IX_50BF1038` (`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DDMDataProviderInstance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DDMDataProviderInstance` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dataProviderInstanceId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `definition` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`dataProviderInstanceId`,`ctCollectionId`),
  UNIQUE KEY `IX_B7498537` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_DB54A6E5` (`companyId`),
  KEY `IX_1333A2A7` (`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DDMDataProviderInstanceLink`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DDMDataProviderInstanceLink` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `dataProviderInstanceLinkId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `dataProviderInstanceId` bigint DEFAULT NULL,
  `structureId` bigint DEFAULT NULL,
  PRIMARY KEY (`dataProviderInstanceLinkId`,`ctCollectionId`),
  UNIQUE KEY `IX_EC5795A0` (`dataProviderInstanceId`,`structureId`,`ctCollectionId`),
  KEY `IX_CB823541` (`structureId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DDMField`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DDMField` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `fieldId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `parentFieldId` bigint DEFAULT NULL,
  `storageId` bigint DEFAULT NULL,
  `structureVersionId` bigint DEFAULT NULL,
  `fieldName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fieldType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instanceId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `localizable` tinyint DEFAULT NULL,
  `priority` int DEFAULT NULL,
  PRIMARY KEY (`fieldId`,`ctCollectionId`),
  UNIQUE KEY `IX_1BB20E75` (`storageId`,`instanceId`,`ctCollectionId`),
  KEY `IX_DEA6624F` (`companyId`,`fieldType`),
  KEY `IX_10FC3BA2` (`storageId`,`fieldName`),
  KEY `IX_DE90A287` (`structureVersionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DDMFieldAttribute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DDMFieldAttribute` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `fieldAttributeId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `fieldId` bigint DEFAULT NULL,
  `storageId` bigint DEFAULT NULL,
  `attributeName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `languageId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `largeAttributeValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `smallAttributeValue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`fieldAttributeId`,`ctCollectionId`),
  UNIQUE KEY `IX_83964B3A` (`attributeName`,`languageId`,`fieldId`,`ctCollectionId`),
  KEY `IX_167E6FEA` (`attributeName`,`smallAttributeValue`),
  KEY `IX_D3B57A06` (`storageId`,`attributeName`),
  KEY `IX_FECE9ED8` (`storageId`,`languageId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DDMFormInstance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DDMFormInstance` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formInstanceId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `versionUserId` bigint DEFAULT NULL,
  `versionUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `structureId` bigint DEFAULT NULL,
  `version` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `settings_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`formInstanceId`,`ctCollectionId`),
  UNIQUE KEY `IX_EEBBA054` (`ctCollectionId`,`structureId`),
  UNIQUE KEY `IX_EAB7A400` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_9E1C31FE` (`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DDMFormInstanceRecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DDMFormInstanceRecord` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formInstanceRecordId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `versionUserId` bigint DEFAULT NULL,
  `versionUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `formInstanceId` bigint DEFAULT NULL,
  `formInstanceVersion` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `storageId` bigint DEFAULT NULL,
  `version` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ipAddress` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`formInstanceRecordId`,`ctCollectionId`),
  UNIQUE KEY `IX_90833BB1` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_5BC982B` (`companyId`),
  KEY `IX_242301EA` (`formInstanceId`,`formInstanceVersion`),
  KEY `IX_3C8DBDFF` (`formInstanceId`,`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DDMFormInstanceRecordVersion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DDMFormInstanceRecordVersion` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `formInstanceRecordVersionId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `formInstanceId` bigint DEFAULT NULL,
  `formInstanceVersion` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formInstanceRecordId` bigint DEFAULT NULL,
  `version` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `storageId` bigint DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`formInstanceRecordVersionId`,`ctCollectionId`),
  UNIQUE KEY `IX_272BBC86` (`formInstanceRecordId`,`version`,`ctCollectionId`),
  KEY `IX_EAAF6D80` (`formInstanceId`,`formInstanceVersion`),
  KEY `IX_F0C9356C` (`formInstanceId`,`userId`,`formInstanceVersion`,`status`),
  KEY `IX_B5A3FAC6` (`formInstanceRecordId`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DDMFormInstanceReport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DDMFormInstanceReport` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `formInstanceReportId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `formInstanceId` bigint DEFAULT NULL,
  `data_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`formInstanceReportId`,`ctCollectionId`),
  KEY `IX_953190E8` (`formInstanceId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DDMFormInstanceVersion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DDMFormInstanceVersion` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `formInstanceVersionId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `formInstanceId` bigint DEFAULT NULL,
  `structureVersionId` bigint DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `settings_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `version` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`formInstanceVersionId`,`ctCollectionId`),
  UNIQUE KEY `IX_8D381426` (`formInstanceId`,`version`,`ctCollectionId`),
  KEY `IX_EB92EF26` (`formInstanceId`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DDMStorageLink`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DDMStorageLink` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `storageLinkId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `structureId` bigint DEFAULT NULL,
  `structureVersionId` bigint DEFAULT NULL,
  PRIMARY KEY (`storageLinkId`,`ctCollectionId`),
  UNIQUE KEY `IX_6979A733` (`classPK`,`ctCollectionId`),
  KEY `IX_81776090` (`structureId`),
  KEY `IX_14DADA22` (`structureVersionId`),
  KEY `IX_32A18526` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DDMStructure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DDMStructure` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `structureId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `versionUserId` bigint DEFAULT NULL,
  `versionUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `parentStructureId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `structureKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `definition` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `storageType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` int DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`structureId`,`ctCollectionId`),
  UNIQUE KEY `IX_92B2F4CF` (`groupId`,`classNameId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_68770B0E` (`groupId`,`classNameId`,`ctCollectionId`,`structureKey`),
  UNIQUE KEY `IX_7BD0A294` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_FC299886` (`classNameId`,`companyId`),
  KEY `IX_43395316` (`groupId`,`parentStructureId`),
  KEY `IX_657899A8` (`parentStructureId`),
  KEY `IX_20FDE04C` (`structureKey`),
  KEY `IX_E61809C8` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DDMStructureLayout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DDMStructureLayout` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `structureLayoutId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `structureLayoutKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `structureVersionId` bigint DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `definition` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`structureLayoutId`,`ctCollectionId`),
  UNIQUE KEY `IX_BBA9AF0E` (`groupId`,`classNameId`,`structureLayoutKey`,`ctCollectionId`),
  UNIQUE KEY `IX_1D9B22DE` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_C72DCE6E` (`groupId`,`classNameId`,`structureVersionId`),
  KEY `IX_4CDF64C` (`structureLayoutKey`),
  KEY `IX_B7158C0A` (`structureVersionId`),
  KEY `IX_CC63DA3E` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DDMStructureLink`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DDMStructureLink` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `structureLinkId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `structureId` bigint DEFAULT NULL,
  PRIMARY KEY (`structureLinkId`,`ctCollectionId`),
  UNIQUE KEY `IX_C8DE7401` (`classNameId`,`classPK`,`structureId`,`ctCollectionId`),
  KEY `IX_17692B58` (`structureId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DDMStructureVersion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DDMStructureVersion` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `structureVersionId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `structureId` bigint DEFAULT NULL,
  `version` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parentStructureId` bigint DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `definition` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `storageType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`structureVersionId`,`ctCollectionId`),
  UNIQUE KEY `IX_1F8A4EA0` (`structureId`,`version`,`ctCollectionId`),
  KEY `IX_17B3C96C` (`structureId`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DDMTemplate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DDMTemplate` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `templateId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `versionUserId` bigint DEFAULT NULL,
  `versionUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `resourceClassNameId` bigint DEFAULT NULL,
  `templateKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mode_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `language` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `script` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cacheable` tinyint DEFAULT NULL,
  `smallImage` tinyint DEFAULT NULL,
  `smallImageId` bigint DEFAULT NULL,
  `smallImageURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`templateId`,`ctCollectionId`),
  UNIQUE KEY `IX_78329FE6` (`groupId`,`classNameId`,`ctCollectionId`,`templateKey`),
  UNIQUE KEY `IX_849840A2` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_BE57F195` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_B6356F93` (`classNameId`,`classPK`,`type_`),
  KEY `IX_32F83D16` (`classPK`),
  KEY `IX_F0C3449` (`groupId`,`classNameId`,`classPK`,`type_`,`mode_`),
  KEY `IX_B1C33EA6` (`groupId`,`classPK`),
  KEY `IX_33BEF579` (`language`),
  KEY `IX_127A35B0` (`smallImageId`),
  KEY `IX_CAE41A28` (`templateKey`),
  KEY `IX_C4F283C8` (`type_`),
  KEY `IX_F2A243A7` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DDMTemplateLink`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DDMTemplateLink` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `templateLinkId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `templateId` bigint DEFAULT NULL,
  PRIMARY KEY (`templateLinkId`,`ctCollectionId`),
  UNIQUE KEY `IX_79ED5CFA` (`classNameId`,`classPK`,`ctCollectionId`),
  KEY `IX_85278170` (`templateId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DDMTemplateVersion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DDMTemplateVersion` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `templateVersionId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `templateId` bigint DEFAULT NULL,
  `version` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `language` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `script` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`templateVersionId`,`ctCollectionId`),
  UNIQUE KEY `IX_64E82786` (`templateId`,`version`,`ctCollectionId`),
  KEY `IX_66382FC6` (`templateId`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DEDataDefinitionFieldLink`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DEDataDefinitionFieldLink` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deDataDefinitionFieldLinkId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `ddmStructureId` bigint DEFAULT NULL,
  `fieldName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`deDataDefinitionFieldLinkId`,`ctCollectionId`),
  UNIQUE KEY `IX_B0B67DC9` (`ddmStructureId`,`classNameId`,`fieldName`,`classPK`,`ctCollectionId`),
  UNIQUE KEY `IX_2F184154` (`uuid_`,`ctCollectionId`,`groupId`),
  KEY `IX_99628DD1` (`classNameId`,`classPK`),
  KEY `IX_E931B304` (`ddmStructureId`,`fieldName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DEDataListView`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DEDataListView` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deDataListViewId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `appliedFilters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `ddmStructureId` bigint DEFAULT NULL,
  `fieldNames` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `sortField` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`deDataListViewId`,`ctCollectionId`),
  UNIQUE KEY `IX_275E4568` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_1C932689` (`ddmStructureId`),
  KEY `IX_6C111CBD` (`groupId`,`ddmStructureId`,`companyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DLContent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DLContent` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `contentId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `repositoryId` bigint DEFAULT NULL,
  `path_` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_` longblob,
  `size_` bigint DEFAULT NULL,
  PRIMARY KEY (`contentId`,`ctCollectionId`),
  UNIQUE KEY `IX_8E223106` (`companyId`,`repositoryId`,`path_`,`version`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DLFileEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DLFileEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `repositoryId` bigint DEFAULT NULL,
  `folderId` bigint DEFAULT NULL,
  `treePath` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `extension` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mimeType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `extraSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `fileEntryTypeId` bigint DEFAULT NULL,
  `version` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size_` bigint DEFAULT NULL,
  `smallImageId` bigint DEFAULT NULL,
  `largeImageId` bigint DEFAULT NULL,
  `custom1ImageId` bigint DEFAULT NULL,
  `custom2ImageId` bigint DEFAULT NULL,
  `manualCheckInRequired` tinyint DEFAULT NULL,
  `displayDate` datetime(6) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `reviewDate` datetime(6) DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`fileEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_761F8629` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_672F1AA0` (`groupId`,`ctCollectionId`,`uuid_`),
  UNIQUE KEY `IX_1920CC0C` (`groupId`,`folderId`,`ctCollectionId`,`fileName`),
  UNIQUE KEY `IX_7BDA28F0` (`groupId`,`folderId`,`ctCollectionId`,`name`),
  UNIQUE KEY `IX_4ADDCFF7` (`groupId`,`folderId`,`ctCollectionId`,`title`),
  KEY `IX_4CB1B2B4` (`companyId`),
  KEY `IX_B8526DBE` (`custom1ImageId`),
  KEY `IX_AC9BDEDD` (`custom2ImageId`),
  KEY `IX_772ECDE7` (`fileEntryTypeId`),
  KEY `IX_8F6C75D0` (`folderId`,`name`),
  KEY `IX_57FFBBCA` (`folderId`,`repositoryId`),
  KEY `IX_29D0AF28` (`groupId`,`folderId`,`fileEntryTypeId`),
  KEY `IX_1DC796CD` (`groupId`,`folderId`,`userId`),
  KEY `IX_43261870` (`groupId`,`userId`),
  KEY `IX_4DB7A143` (`largeImageId`),
  KEY `IX_D9492CF6` (`mimeType`),
  KEY `IX_9EE96CAD` (`repositoryId`),
  KEY `IX_25F5CAB9` (`smallImageId`,`largeImageId`,`custom1ImageId`,`custom2ImageId`),
  KEY `IX_64F0FE40` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DLFileEntryMetadata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DLFileEntryMetadata` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileEntryMetadataId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `DDMStorageId` bigint DEFAULT NULL,
  `DDMStructureId` bigint DEFAULT NULL,
  `fileEntryId` bigint DEFAULT NULL,
  `fileVersionId` bigint DEFAULT NULL,
  PRIMARY KEY (`fileEntryMetadataId`,`ctCollectionId`),
  UNIQUE KEY `IX_36AA016C` (`ctCollectionId`,`externalReferenceCode`,`companyId`),
  UNIQUE KEY `IX_BE290777` (`fileVersionId`,`ctCollectionId`,`DDMStructureId`),
  KEY `IX_4F40FE5E` (`fileEntryId`),
  KEY `IX_D49AB5D1` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DLFileEntryType`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DLFileEntryType` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileEntryTypeId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `dataDefinitionId` bigint DEFAULT NULL,
  `fileEntryTypeKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `scope` int DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`fileEntryTypeId`,`ctCollectionId`),
  UNIQUE KEY `IX_93ED0F06` (`groupId`,`ctCollectionId`,`dataDefinitionId`),
  UNIQUE KEY `IX_8B9CF803` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_A5C4723D` (`groupId`,`ctCollectionId`,`fileEntryTypeKey`),
  UNIQUE KEY `IX_476F807A` (`groupId`,`ctCollectionId`,`uuid_`),
  KEY `IX_D2F8189A` (`companyId`),
  KEY `IX_90724726` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DLFileEntryTypes_DLFolders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DLFileEntryTypes_DLFolders` (
  `companyId` bigint NOT NULL,
  `fileEntryTypeId` bigint NOT NULL,
  `folderId` bigint NOT NULL,
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `ctChangeType` tinyint DEFAULT NULL,
  PRIMARY KEY (`fileEntryTypeId`,`folderId`,`ctCollectionId`),
  KEY `IX_2E64D9F9` (`companyId`),
  KEY `IX_6E00A2EC` (`folderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DLFileShortcut`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DLFileShortcut` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileShortcutId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `repositoryId` bigint DEFAULT NULL,
  `folderId` bigint DEFAULT NULL,
  `toFileEntryId` bigint DEFAULT NULL,
  `treePath` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `active_` tinyint DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`fileShortcutId`,`ctCollectionId`),
  UNIQUE KEY `IX_A9E34105` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_86FE17F8` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_8571953E` (`companyId`,`status`),
  KEY `IX_17EE3098` (`groupId`,`folderId`,`active_`,`status`),
  KEY `IX_4B7247F6` (`toFileEntryId`),
  KEY `IX_4831EBE4` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DLFileVersion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DLFileVersion` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileVersionId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `repositoryId` bigint DEFAULT NULL,
  `folderId` bigint DEFAULT NULL,
  `fileEntryId` bigint DEFAULT NULL,
  `treePath` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `fileName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `extension` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mimeType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `changeLog` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `extraSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `fileEntryTypeId` bigint DEFAULT NULL,
  `version` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size_` bigint DEFAULT NULL,
  `checksum` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `storeUUID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `displayDate` datetime(6) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `reviewDate` datetime(6) DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`fileVersionId`,`ctCollectionId`),
  UNIQUE KEY `IX_10E504DF` (`fileEntryId`,`version`,`ctCollectionId`),
  UNIQUE KEY `IX_350F5CAE` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_CF394FE` (`companyId`,`storeUUID`),
  KEY `IX_BC5541ED` (`groupId`,`folderId`,`version`,`title`),
  KEY `IX_FFB3395C` (`mimeType`),
  KEY `IX_5898E799` (`status`,`companyId`,`expirationDate`),
  KEY `IX_92309600` (`status`,`displayDate`),
  KEY `IX_D50EAA41` (`status`,`fileEntryId`),
  KEY `IX_799D5D47` (`status`,`groupId`,`folderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DLFileVersionPreview`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DLFileVersionPreview` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `dlFileVersionPreviewId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `fileEntryId` bigint DEFAULT NULL,
  `fileVersionId` bigint DEFAULT NULL,
  `previewStatus` int DEFAULT NULL,
  PRIMARY KEY (`dlFileVersionPreviewId`,`ctCollectionId`),
  UNIQUE KEY `IX_DA3FFE` (`fileEntryId`,`fileVersionId`,`ctCollectionId`),
  KEY `IX_E43957CD` (`fileVersionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DLFolder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DLFolder` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `folderId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `repositoryId` bigint DEFAULT NULL,
  `mountPoint` tinyint DEFAULT NULL,
  `parentFolderId` bigint DEFAULT NULL,
  `treePath` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lastPostDate` datetime(6) DEFAULT NULL,
  `defaultFileEntryTypeId` bigint DEFAULT NULL,
  `hidden_` tinyint DEFAULT NULL,
  `restrictionType` int DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`folderId`,`ctCollectionId`),
  UNIQUE KEY `IX_F0D74691` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_4C35E652` (`groupId`,`parentFolderId`,`ctCollectionId`,`name`),
  UNIQUE KEY `IX_53E6B584` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_A74DB14C` (`companyId`),
  KEY `IX_CE360BF6` (`groupId`,`parentFolderId`,`hidden_`,`status`),
  KEY `IX_2D8D2D2B` (`groupId`,`parentFolderId`,`mountPoint`,`hidden_`,`status`),
  KEY `IX_D6D77780` (`mountPoint`,`repositoryId`),
  KEY `IX_51556082` (`parentFolderId`,`name`),
  KEY `IX_56F3D47C` (`parentFolderId`,`repositoryId`),
  KEY `IX_EE29C715` (`repositoryId`),
  KEY `IX_B199E2A6` (`status`,`companyId`),
  KEY `IX_CBC408D8` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DLOpenerFileEntryReference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DLOpenerFileEntryReference` (
  `dlOpenerFileEntryReferenceId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `referenceKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referenceType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileEntryId` bigint DEFAULT NULL,
  `type_` int DEFAULT NULL,
  PRIMARY KEY (`dlOpenerFileEntryReferenceId`),
  UNIQUE KEY `IX_54148667` (`fileEntryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DLStorageQuota`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DLStorageQuota` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `dlStorageQuotaId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `storageSize` bigint DEFAULT NULL,
  PRIMARY KEY (`dlStorageQuotaId`),
  UNIQUE KEY `IX_1214035D` (`companyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DLSyncEvent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DLSyncEvent` (
  `syncEventId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `modifiedTime` bigint DEFAULT NULL,
  `event` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `typePK` bigint DEFAULT NULL,
  PRIMARY KEY (`syncEventId`),
  UNIQUE KEY `IX_57D82B06` (`typePK`),
  KEY `IX_3D8E1607` (`modifiedTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DepotAppCustomization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DepotAppCustomization` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `depotAppCustomizationId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `depotEntryId` bigint DEFAULT NULL,
  `enabled` tinyint DEFAULT NULL,
  `portletId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`depotAppCustomizationId`,`ctCollectionId`),
  UNIQUE KEY `IX_2CE1592A` (`depotEntryId`,`portletId`,`ctCollectionId`),
  KEY `IX_5B76D798` (`depotEntryId`,`enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DepotEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DepotEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `depotEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`depotEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_E3EB2C84` (`groupId`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DepotEntryGroupRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DepotEntryGroupRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `depotEntryGroupRelId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `ddmStructuresAvailable` tinyint DEFAULT NULL,
  `depotEntryId` bigint DEFAULT NULL,
  `searchable` tinyint DEFAULT NULL,
  `toGroupId` bigint DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`depotEntryGroupRelId`,`ctCollectionId`),
  UNIQUE KEY `IX_1DD0EA9C` (`toGroupId`,`depotEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_A83D9516` (`uuid_`,`ctCollectionId`,`groupId`),
  KEY `IX_146497CB` (`depotEntryId`),
  KEY `IX_7CA33F81` (`toGroupId`,`ddmStructuresAvailable`),
  KEY `IX_BA106967` (`toGroupId`,`searchable`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DispatchLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DispatchLog` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `dispatchLogId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `dispatchTriggerId` bigint DEFAULT NULL,
  `endDate` datetime(6) DEFAULT NULL,
  `error` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `output_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `startDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`dispatchLogId`),
  KEY `IX_36F4EB5F` (`dispatchTriggerId`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `DispatchTrigger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DispatchTrigger` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dispatchTriggerId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `active_` tinyint DEFAULT NULL,
  `cronExpression` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dispatchTaskClusterMode` int DEFAULT NULL,
  `dispatchTaskExecutorType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dispatchTaskSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `endDate` datetime(6) DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `overlapAllowed` tinyint DEFAULT NULL,
  `startDate` datetime(6) DEFAULT NULL,
  `system_` tinyint DEFAULT NULL,
  `timeZoneId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`dispatchTriggerId`),
  UNIQUE KEY `IX_10690B19` (`companyId`,`externalReferenceCode`),
  UNIQUE KEY `IX_D86DCE63` (`companyId`,`name`),
  KEY `IX_71D6AFE9` (`active_`,`dispatchTaskClusterMode`),
  KEY `IX_1B108A04` (`companyId`,`dispatchTaskExecutorType`),
  KEY `IX_F6ABBDDE` (`companyId`,`userId`),
  KEY `IX_EF08D30` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `EmailAddress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EmailAddress` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emailAddressId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `address` varchar(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `listTypeId` bigint DEFAULT NULL,
  `primary_` tinyint DEFAULT NULL,
  PRIMARY KEY (`emailAddressId`,`ctCollectionId`),
  UNIQUE KEY `IX_B4BA0791` (`companyId`,`externalReferenceCode`,`ctCollectionId`),
  KEY `IX_2A2CB130` (`companyId`,`classNameId`,`classPK`,`primary_`),
  KEY `IX_7B43CD8` (`userId`),
  KEY `IX_D24F3956` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ExpandoColumn`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ExpandoColumn` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `columnId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `tableId` bigint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` int DEFAULT NULL,
  `defaultData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `typeSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`columnId`,`ctCollectionId`),
  UNIQUE KEY `IX_4A7D3605` (`tableId`,`name`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ExpandoRow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ExpandoRow` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `rowId_` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `tableId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  PRIMARY KEY (`rowId_`,`ctCollectionId`),
  UNIQUE KEY `IX_488E0C53` (`tableId`,`classPK`,`ctCollectionId`),
  KEY `IX_49EB3118` (`classPK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ExpandoTable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ExpandoTable` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `tableId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`tableId`,`ctCollectionId`),
  UNIQUE KEY `IX_87D370E2` (`companyId`,`classNameId`,`name`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ExpandoValue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ExpandoValue` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `valueId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `tableId` bigint DEFAULT NULL,
  `columnId` bigint DEFAULT NULL,
  `rowId_` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `data_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`valueId`,`ctCollectionId`),
  UNIQUE KEY `IX_E6D98E43` (`columnId`,`rowId_`,`ctCollectionId`),
  UNIQUE KEY `IX_D8C72C45` (`tableId`,`columnId`,`classPK`,`ctCollectionId`),
  KEY `IX_CAD04B0D` (`classPK`,`classNameId`),
  KEY `IX_9112A7A0` (`rowId_`),
  KEY `IX_1BD3F4C` (`tableId`,`classPK`),
  KEY `IX_B71E92D5` (`tableId`,`rowId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ExportImportConfiguration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ExportImportConfiguration` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `exportImportConfigurationId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type_` int DEFAULT NULL,
  `settings_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`exportImportConfigurationId`),
  KEY `IX_1827A2E5` (`companyId`),
  KEY `IX_38FA468D` (`groupId`,`status`),
  KEY `IX_47CC6234` (`groupId`,`type_`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `FOO_Foo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FOO_Foo` (
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fooId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `field1` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `field2` tinyint DEFAULT NULL,
  `field3` int DEFAULT NULL,
  `field4` datetime(6) DEFAULT NULL,
  `field5` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`fooId`),
  UNIQUE KEY `IX_905CD589` (`uuid_`,`groupId`),
  KEY `IX_CFFD06FF` (`field2`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `FOO_HomeMenu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FOO_HomeMenu` (
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_` bigint NOT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` bigint DEFAULT NULL,
  `status` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_` int DEFAULT NULL,
  `redirect` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_`),
  KEY `IX_5855FA97` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `FOO_LatestPost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FOO_LatestPost` (
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_` bigint NOT NULL,
  `title` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_`),
  KEY `IX_A217810E` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `FOO_OnlineMeeting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FOO_OnlineMeeting` (
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_` bigint NOT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `organization` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `topic` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requestTime` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_`),
  KEY `IX_89A3979F` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `FOO_PublicInfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FOO_PublicInfo` (
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_` bigint NOT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `imgId` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `shortContent` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `attachmentId` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `viewNumber` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdLocation` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `redirectLink` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `fbUrl` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `tiktokUrl` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `createdDate` datetime(6) DEFAULT NULL,
  `updatedDate` datetime(6) DEFAULT NULL,
  `createdBy` datetime(6) DEFAULT NULL,
  `updatedBy` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id_`),
  KEY `IX_4E92811E` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `FOO_Resume`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FOO_Resume` (
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_` bigint NOT NULL,
  `fullName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attachment` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_`),
  KEY `IX_91EAA7E8` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `FOO_Setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FOO_Setting` (
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_` bigint NOT NULL,
  `defaultLanguage` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `localizationEnabled` tinyint DEFAULT NULL,
  `latestPostId` bigint DEFAULT NULL,
  PRIMARY KEY (`id_`),
  KEY `IX_91DEBD77` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `FOO_TrafficFeedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FOO_TrafficFeedback` (
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_` bigint NOT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trafficType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inforType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requestTime` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attachment` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_`),
  KEY `IX_EC89FA65` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `FragmentCollection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FragmentCollection` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fragmentCollectionId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `fragmentCollectionKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`fragmentCollectionId`,`ctCollectionId`),
  UNIQUE KEY `IX_3C778AA9` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_9BFCBA4D` (`groupId`,`ctCollectionId`,`fragmentCollectionKey`),
  UNIQUE KEY `IX_AD02299C` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_536510F5` (`groupId`,`name`),
  KEY `IX_8FB7E9C0` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `FragmentComposition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FragmentComposition` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fragmentCompositionId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `fragmentCollectionId` bigint DEFAULT NULL,
  `fragmentCompositionKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `data_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `previewFileEntryId` bigint DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`fragmentCompositionId`,`ctCollectionId`),
  UNIQUE KEY `IX_CE01B795` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_9A26E9A1` (`groupId`,`ctCollectionId`,`fragmentCompositionKey`),
  UNIQUE KEY `IX_5D7BAE88` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_5C61E2DD` (`fragmentCollectionId`),
  KEY `IX_11001AAC` (`groupId`,`fragmentCollectionId`,`name`,`status`),
  KEY `IX_28248B2D` (`groupId`,`fragmentCollectionId`,`status`),
  KEY `IX_70029354` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `FragmentEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FragmentEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `headId` bigint DEFAULT NULL,
  `head` tinyint DEFAULT NULL,
  `fragmentEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `fragmentCollectionId` bigint DEFAULT NULL,
  `fragmentEntryKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `css` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `html` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `js` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cacheable` tinyint DEFAULT NULL,
  `configuration` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `icon` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `previewFileEntryId` bigint DEFAULT NULL,
  `readOnly` tinyint DEFAULT NULL,
  `type_` int DEFAULT NULL,
  `typeOptions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`fragmentEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_25B5B355` (`ctCollectionId`,`headId`),
  UNIQUE KEY `IX_8DDC1989` (`groupId`,`head`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_C3F2A8E5` (`groupId`,`head`,`ctCollectionId`,`fragmentEntryKey`),
  UNIQUE KEY `IX_A420787C` (`groupId`,`head`,`uuid_`,`ctCollectionId`),
  KEY `IX_DFBAF515` (`externalReferenceCode`),
  KEY `IX_ADC3EFB9` (`fragmentCollectionId`,`head`),
  KEY `IX_8B622592` (`groupId`,`fragmentCollectionId`,`head`,`name`),
  KEY `IX_24159CF8` (`groupId`,`fragmentCollectionId`,`head`,`status`,`name`),
  KEY `IX_14AA0B48` (`groupId`,`fragmentCollectionId`,`head`,`type_`,`status`),
  KEY `IX_18F9DFE` (`groupId`,`fragmentCollectionId`,`name`),
  KEY `IX_BE29E964` (`groupId`,`fragmentCollectionId`,`status`,`name`),
  KEY `IX_BD1F4C5C` (`groupId`,`fragmentCollectionId`,`type_`,`status`),
  KEY `IX_7F3F0EB3` (`groupId`,`fragmentEntryKey`),
  KEY `IX_515CC759` (`head`,`type_`),
  KEY `IX_40CE21AD` (`type_`),
  KEY `IX_6E7DE18C` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `FragmentEntryLink`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FragmentEntryLink` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fragmentEntryLinkId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `originalFragmentEntryLinkId` bigint DEFAULT NULL,
  `fragmentEntryId` bigint DEFAULT NULL,
  `segmentsExperienceId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `plid` bigint DEFAULT NULL,
  `css` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `html` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `js` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `configuration` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `deleted` tinyint DEFAULT NULL,
  `editableValues` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `namespace` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` int DEFAULT NULL,
  `rendererKey` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` int DEFAULT NULL,
  `lastPropagationDate` datetime(6) DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`fragmentEntryLinkId`,`ctCollectionId`),
  UNIQUE KEY `IX_3CAD70F7` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_BE3A6BEA` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_67FF823E` (`fragmentEntryId`,`deleted`),
  KEY `IX_2FB5437D` (`groupId`,`classNameId`,`classPK`),
  KEY `IX_4A9E751A` (`groupId`,`fragmentEntryId`,`classNameId`,`classPK`),
  KEY `IX_3D731EF6` (`groupId`,`plid`,`deleted`),
  KEY `IX_A234739A` (`groupId`,`plid`,`fragmentEntryId`),
  KEY `IX_22C863E3` (`groupId`,`plid`,`originalFragmentEntryLinkId`),
  KEY `IX_EECD9CBD` (`groupId`,`plid`,`segmentsExperienceId`,`deleted`),
  KEY `IX_EAA73980` (`groupId`,`plid`,`segmentsExperienceId`,`rendererKey`),
  KEY `IX_EB688B56` (`groupId`,`segmentsExperienceId`,`classNameId`,`classPK`),
  KEY `IX_352AE29E` (`rendererKey`,`companyId`),
  KEY `IX_17C15BB2` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `FragmentEntryVersion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FragmentEntryVersion` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `fragmentEntryVersionId` bigint NOT NULL,
  `version` int DEFAULT NULL,
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fragmentEntryId` bigint DEFAULT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `fragmentCollectionId` bigint DEFAULT NULL,
  `fragmentEntryKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `css` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `html` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `js` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cacheable` tinyint DEFAULT NULL,
  `configuration` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `icon` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `previewFileEntryId` bigint DEFAULT NULL,
  `readOnly` tinyint DEFAULT NULL,
  `type_` int DEFAULT NULL,
  `typeOptions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`fragmentEntryVersionId`,`ctCollectionId`),
  UNIQUE KEY `IX_2D0AE389` (`groupId`,`version`,`ctCollectionId`,`fragmentEntryKey`),
  UNIQUE KEY `IX_AF627C58` (`groupId`,`version`,`uuid_`,`ctCollectionId`),
  UNIQUE KEY `IX_F81BA8E3` (`version`,`ctCollectionId`,`fragmentEntryId`),
  KEY `IX_7A6F05CF` (`fragmentCollectionId`,`version`),
  KEY `IX_391FD151` (`fragmentEntryId`),
  KEY `IX_2509F8CA` (`groupId`,`fragmentCollectionId`,`name`),
  KEY `IX_FD32B830` (`groupId`,`fragmentCollectionId`,`status`,`name`),
  KEY `IX_5F305710` (`groupId`,`fragmentCollectionId`,`type_`,`status`),
  KEY `IX_8D72731C` (`groupId`,`fragmentCollectionId`,`version`,`name`),
  KEY `IX_986CC082` (`groupId`,`fragmentCollectionId`,`version`,`status`,`name`),
  KEY `IX_2B3758FE` (`groupId`,`fragmentCollectionId`,`version`,`type_`,`status`),
  KEY `IX_519A387F` (`groupId`,`fragmentEntryKey`),
  KEY `IX_850F2979` (`type_`),
  KEY `IX_B2BEE958` (`uuid_`),
  KEY `IX_75B533A9` (`version`,`type_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `FriendlyURLEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FriendlyURLEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `defaultLanguageId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `friendlyURLEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  PRIMARY KEY (`friendlyURLEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_D51F1A48` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_F3DC928B` (`groupId`,`classNameId`,`classPK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `FriendlyURLEntryLocalization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FriendlyURLEntryLocalization` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `friendlyURLEntryLocalizationId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `friendlyURLEntryId` bigint DEFAULT NULL,
  `languageId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `urlTitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `groupId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  PRIMARY KEY (`friendlyURLEntryLocalizationId`,`ctCollectionId`),
  UNIQUE KEY `IX_53B5CB4B` (`classNameId`,`groupId`,`languageId`,`urlTitle`,`ctCollectionId`),
  UNIQUE KEY `IX_5292D20F` (`languageId`,`ctCollectionId`,`friendlyURLEntryId`),
  KEY `IX_2B00D1D3` (`classNameId`,`groupId`,`languageId`,`classPK`),
  KEY `IX_570320E6` (`classNameId`,`groupId`,`urlTitle`),
  KEY `IX_310462C` (`classNameId`,`urlTitle`,`ctCollectionId`,`companyId`),
  KEY `IX_BFA6E36A` (`friendlyURLEntryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `FriendlyURLEntryMapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FriendlyURLEntryMapping` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `friendlyURLEntryMappingId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `friendlyURLEntryId` bigint DEFAULT NULL,
  PRIMARY KEY (`friendlyURLEntryMappingId`,`ctCollectionId`),
  UNIQUE KEY `IX_5BE324B9` (`classNameId`,`classPK`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Group_`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Group_` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `groupId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `creatorUserId` bigint DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `parentGroupId` bigint DEFAULT NULL,
  `liveGroupId` bigint DEFAULT NULL,
  `treePath` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `groupKey` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type_` int DEFAULT NULL,
  `typeSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `manualMembership` tinyint DEFAULT NULL,
  `membershipRestriction` int DEFAULT NULL,
  `friendlyURL` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `site` tinyint DEFAULT NULL,
  `remoteStagingGroupCount` int DEFAULT NULL,
  `inheritContent` tinyint DEFAULT NULL,
  `active_` tinyint DEFAULT NULL,
  PRIMARY KEY (`groupId`,`ctCollectionId`),
  UNIQUE KEY `IX_DBA56EF9` (`companyId`,`classNameId`,`ctCollectionId`,`classPK`),
  UNIQUE KEY `IX_23B1C81D` (`companyId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_3551EED4` (`companyId`,`ctCollectionId`,`friendlyURL`),
  UNIQUE KEY `IX_42E6E774` (`companyId`,`ctCollectionId`,`groupKey`),
  KEY `IX_75017452` (`active_`,`type_`),
  KEY `IX_8257E37B` (`classNameId`,`classPK`),
  KEY `IX_DDC91A87` (`companyId`,`active_`),
  KEY `IX_ABE2D54` (`companyId`,`classNameId`,`parentGroupId`),
  KEY `IX_DF76A247` (`companyId`,`classNameId`,`site`),
  KEY `IX_5D75499E` (`companyId`,`parentGroupId`),
  KEY `IX_B91488EC` (`companyId`,`site`,`active_`),
  KEY `IX_7B216735` (`companyId`,`site`,`parentGroupId`,`inheritContent`),
  KEY `IX_16218A38` (`liveGroupId`),
  KEY `IX_F981514E` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Groups_Orgs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Groups_Orgs` (
  `companyId` bigint NOT NULL,
  `groupId` bigint NOT NULL,
  `organizationId` bigint NOT NULL,
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `ctChangeType` tinyint DEFAULT NULL,
  PRIMARY KEY (`groupId`,`organizationId`,`ctCollectionId`),
  KEY `IX_8BFD4548` (`companyId`),
  KEY `IX_6BBB7682` (`organizationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Groups_Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Groups_Roles` (
  `companyId` bigint NOT NULL,
  `groupId` bigint NOT NULL,
  `roleId` bigint NOT NULL,
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `ctChangeType` tinyint DEFAULT NULL,
  PRIMARY KEY (`groupId`,`roleId`,`ctCollectionId`),
  KEY `IX_557D8550` (`companyId`),
  KEY `IX_3103EF3D` (`roleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Groups_UserGroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Groups_UserGroups` (
  `companyId` bigint NOT NULL,
  `groupId` bigint NOT NULL,
  `userGroupId` bigint NOT NULL,
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `ctChangeType` tinyint DEFAULT NULL,
  PRIMARY KEY (`groupId`,`userGroupId`,`ctCollectionId`),
  KEY `IX_676FC818` (`companyId`),
  KEY `IX_3B69160F` (`userGroupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `IM_MemberRequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `IM_MemberRequest` (
  `memberRequestId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `key_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receiverUserId` bigint DEFAULT NULL,
  `invitedRoleId` bigint DEFAULT NULL,
  `invitedTeamId` bigint DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`memberRequestId`),
  KEY `IX_B4BCD9B4` (`key_`),
  KEY `IX_FED88A7B` (`receiverUserId`,`status`,`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Image` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `imageId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `height` int DEFAULT NULL,
  `width` int DEFAULT NULL,
  `size_` int DEFAULT NULL,
  PRIMARY KEY (`imageId`,`ctCollectionId`),
  KEY `IX_6A925A4D` (`size_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `JSONStorageEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `JSONStorageEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `jsonStorageEntryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `parentJSONStorageEntryId` bigint DEFAULT NULL,
  `index_` int DEFAULT NULL,
  `key_` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` int DEFAULT NULL,
  `valueLong` bigint DEFAULT NULL,
  `valueString` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`jsonStorageEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_28660EE5` (`classNameId`,`classPK`,`index_`,`key_`,`parentJSONStorageEntryId`,`ctCollectionId`),
  KEY `IX_8FDDE8E8` (`classNameId`,`companyId`,`index_`,`type_`,`valueLong`),
  KEY `IX_140EE1BB` (`classNameId`,`companyId`,`key_`,`type_`,`valueLong`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `JournalArticle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `JournalArticle` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_` bigint NOT NULL,
  `resourcePrimKey` bigint DEFAULT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `folderId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `treePath` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `articleId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` double DEFAULT NULL,
  `urlTitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DDMStructureId` bigint DEFAULT NULL,
  `DDMTemplateKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `defaultLanguageId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `layoutUuid` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `displayDate` datetime(6) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `reviewDate` datetime(6) DEFAULT NULL,
  `indexable` tinyint DEFAULT NULL,
  `smallImage` tinyint DEFAULT NULL,
  `smallImageId` bigint DEFAULT NULL,
  `smallImageSource` int DEFAULT NULL,
  `smallImageURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id_`,`ctCollectionId`),
  UNIQUE KEY `IX_D3ACAD4A` (`groupId`,`articleId`,`version`,`ctCollectionId`),
  UNIQUE KEY `IX_F73C7E0D` (`groupId`,`uuid_`,`ctCollectionId`),
  UNIQUE KEY `IX_FE3DB4F8` (`groupId`,`version`,`externalReferenceCode`,`ctCollectionId`),
  KEY `IX_745E04FA` (`DDMStructureId`),
  KEY `IX_75CCA4D1` (`DDMTemplateKey`),
  KEY `IX_3D070845` (`companyId`,`version`),
  KEY `IX_A2D2CDB8` (`externalReferenceCode`),
  KEY `IX_3048AF7A` (`groupId`,`DDMStructureId`),
  KEY `IX_31B74F51` (`groupId`,`DDMTemplateKey`),
  KEY `IX_6D117C1E` (`groupId`,`classNameId`,`DDMStructureId`),
  KEY `IX_6E801BF5` (`groupId`,`classNameId`,`DDMTemplateKey`),
  KEY `IX_9CE6E0FA` (`groupId`,`classNameId`,`classPK`),
  KEY `IX_A2534AC2` (`groupId`,`classNameId`,`layoutUuid`),
  KEY `IX_373DCC43` (`groupId`,`classNameId`,`userId`),
  KEY `IX_5CD17502` (`groupId`,`folderId`),
  KEY `IX_3C028C1E` (`groupId`,`layoutUuid`),
  KEY `IX_5CA5E0F6` (`groupId`,`status`,`articleId`),
  KEY `IX_BCAFC000` (`groupId`,`status`,`classNameId`,`folderId`),
  KEY `IX_9D8D768` (`groupId`,`status`,`folderId`),
  KEY `IX_CF8F8F68` (`groupId`,`status`,`urlTitle`),
  KEY `IX_22882D02` (`groupId`,`urlTitle`),
  KEY `IX_D19C1B9F` (`groupId`,`userId`),
  KEY `IX_3F1EA19E` (`layoutUuid`),
  KEY `IX_89FF8B06` (`resourcePrimKey`,`indexable`),
  KEY `IX_EF9B7028` (`smallImageId`),
  KEY `IX_15ADA32B` (`status`,`companyId`,`version`),
  KEY `IX_2AA511D5` (`status`,`displayDate`),
  KEY `IX_BCE7DFEC` (`status`,`resourcePrimKey`,`indexable`),
  KEY `IX_F029602F` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `JournalArticleLocalization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `JournalArticleLocalization` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `articleLocalizationId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `articlePK` bigint DEFAULT NULL,
  `title` varchar(800) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `languageId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`articleLocalizationId`,`ctCollectionId`),
  UNIQUE KEY `IX_5593D868` (`articlePK`,`languageId`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `JournalArticleResource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `JournalArticleResource` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resourcePrimKey` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `articleId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`resourcePrimKey`,`ctCollectionId`),
  UNIQUE KEY `IX_42F04A2C` (`groupId`,`ctCollectionId`,`articleId`),
  UNIQUE KEY `IX_37A8A767` (`uuid_`,`groupId`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `JournalContentSearch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `JournalContentSearch` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `contentSearchId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `privateLayout` tinyint DEFAULT NULL,
  `layoutId` bigint DEFAULT NULL,
  `portletId` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `articleId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`contentSearchId`,`ctCollectionId`),
  UNIQUE KEY `IX_F91BC3CC` (`groupId`,`privateLayout`,`articleId`,`layoutId`,`portletId`,`ctCollectionId`),
  KEY `IX_9207CB31` (`articleId`),
  KEY `IX_42F51F38` (`companyId`),
  KEY `IX_6838E427` (`groupId`,`articleId`),
  KEY `IX_7ACC74C9` (`groupId`,`privateLayout`,`layoutId`,`portletId`),
  KEY `IX_8DAF8A35` (`portletId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `JournalFeed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `JournalFeed` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `feedId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `DDMStructureId` bigint DEFAULT NULL,
  `DDMTemplateKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DDMRendererTemplateKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `delta` int DEFAULT NULL,
  `orderByCol` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `orderByType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `targetLayoutFriendlyUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `targetPortletId` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contentField` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `feedFormat` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `feedVersion` double DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id_`,`ctCollectionId`),
  UNIQUE KEY `IX_E5E4C71A` (`groupId`,`ctCollectionId`,`feedId`),
  UNIQUE KEY `IX_800F33AF` (`uuid_`,`groupId`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `JournalFolder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `JournalFolder` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `folderId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `parentFolderId` bigint DEFAULT NULL,
  `treePath` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `restrictionType` int DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`folderId`,`ctCollectionId`),
  UNIQUE KEY `IX_5C538C20` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_266332E3` (`groupId`,`parentFolderId`,`ctCollectionId`,`name`),
  UNIQUE KEY `IX_1965F913` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_E6E2725D` (`companyId`),
  KEY `IX_E988689E` (`groupId`,`name`),
  KEY `IX_EFD9CAC` (`groupId`,`parentFolderId`,`status`),
  KEY `IX_8D6902B7` (`status`,`companyId`),
  KEY `IX_63BDFA69` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `KBArticle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KBArticle` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kbArticleId` bigint NOT NULL,
  `resourcePrimKey` bigint DEFAULT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rootResourcePrimKey` bigint DEFAULT NULL,
  `parentResourceClassNameId` bigint DEFAULT NULL,
  `parentResourcePrimKey` bigint DEFAULT NULL,
  `kbFolderId` bigint DEFAULT NULL,
  `version` int DEFAULT NULL,
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `urlTitle` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `priority` double DEFAULT NULL,
  `sections` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `latest` tinyint DEFAULT NULL,
  `main` tinyint DEFAULT NULL,
  `sourceURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `displayDate` datetime(6) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `reviewDate` datetime(6) DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`kbArticleId`,`ctCollectionId`),
  UNIQUE KEY `IX_8DC73951` (`groupId`,`ctCollectionId`,`uuid_`),
  UNIQUE KEY `IX_1096F938` (`groupId`,`ctCollectionId`,`version`,`externalReferenceCode`),
  UNIQUE KEY `IX_9A21A6D4` (`resourcePrimKey`,`ctCollectionId`,`version`),
  KEY `IX_7E9C8FF8` (`externalReferenceCode`),
  KEY `IX_4A49CDD6` (`groupId`,`kbFolderId`,`urlTitle`),
  KEY `IX_7B1749F4` (`groupId`,`latest`,`kbFolderId`),
  KEY `IX_E2460F71` (`groupId`,`latest`,`parentResourcePrimKey`),
  KEY `IX_5C814FBF` (`groupId`,`main`,`parentResourcePrimKey`),
  KEY `IX_37000F91` (`groupId`,`resourcePrimKey`,`latest`),
  KEY `IX_FF9D0743` (`groupId`,`resourcePrimKey`,`main`),
  KEY `IX_F3FC873C` (`groupId`,`status`,`kbFolderId`,`urlTitle`),
  KEY `IX_9CD524DA` (`groupId`,`status`,`latest`,`kbFolderId`),
  KEY `IX_68D688CB` (`groupId`,`status`,`latest`,`parentResourcePrimKey`),
  KEY `IX_E3B45799` (`groupId`,`status`,`main`,`parentResourcePrimKey`),
  KEY `IX_FD8E8D66` (`groupId`,`status`,`parentResourcePrimKey`),
  KEY `IX_2C55146B` (`groupId`,`status`,`resourcePrimKey`,`latest`),
  KEY `IX_8C417A9D` (`groupId`,`status`,`resourcePrimKey`,`main`),
  KEY `IX_827ACC48` (`latest`,`companyId`),
  KEY `IX_B8038671` (`latest`,`parentResourcePrimKey`),
  KEY `IX_FD5B5196` (`main`,`companyId`),
  KEY `IX_A13086BF` (`main`,`parentResourcePrimKey`),
  KEY `IX_A9E2C691` (`resourcePrimKey`,`latest`),
  KEY `IX_69C17E43` (`resourcePrimKey`,`main`),
  KEY `IX_C5C0D1BD` (`status`,`companyId`),
  KEY `IX_A67A6415` (`status`,`displayDate`),
  KEY `IX_69DBFCA2` (`status`,`latest`,`companyId`),
  KEY `IX_12CFFCB` (`status`,`latest`,`parentResourcePrimKey`),
  KEY `IX_8020D070` (`status`,`main`,`companyId`),
  KEY `IX_BD3C8E99` (`status`,`main`,`parentResourcePrimKey`),
  KEY `IX_D34C0466` (`status`,`parentResourcePrimKey`),
  KEY `IX_8890CB6B` (`status`,`resourcePrimKey`,`latest`),
  KEY `IX_61FEF19D` (`status`,`resourcePrimKey`,`main`),
  KEY `IX_C23FA26F` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `KBComment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KBComment` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kbCommentId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `userRating` int DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`kbCommentId`,`ctCollectionId`),
  UNIQUE KEY `IX_3854CAF6` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_47D3AE89` (`classNameId`,`classPK`,`status`),
  KEY `IX_E952C7DD` (`classNameId`,`classPK`,`userId`),
  KEY `IX_E8D43932` (`groupId`,`classNameId`),
  KEY `IX_828BA082` (`groupId`,`status`),
  KEY `IX_8E470726` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `KBFolder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KBFolder` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kbFolderId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `parentKBFolderId` bigint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `urlTitle` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`kbFolderId`,`ctCollectionId`),
  UNIQUE KEY `IX_538A8E60` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_9697B53` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_F32A081D` (`companyId`),
  KEY `IX_3FA4415C` (`groupId`,`parentKBFolderId`,`name`),
  KEY `IX_C8923D43` (`groupId`,`parentKBFolderId`,`status`),
  KEY `IX_729A89FA` (`groupId`,`parentKBFolderId`,`urlTitle`),
  KEY `IX_30B67029` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `KBTemplate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KBTemplate` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kbTemplateId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`kbTemplateId`,`ctCollectionId`),
  UNIQUE KEY `IX_7C6D824B` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_83D9CC13` (`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `KaleoAction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KaleoAction` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `kaleoActionId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `kaleoClassName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kaleoClassPK` bigint DEFAULT NULL,
  `kaleoDefinitionId` bigint DEFAULT NULL,
  `kaleoDefinitionVersionId` bigint DEFAULT NULL,
  `kaleoNodeName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `executionType` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `script` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `scriptLanguage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scriptRequiredContexts` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `priority` int DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`kaleoActionId`,`ctCollectionId`),
  KEY `IX_50E9112C` (`companyId`),
  KEY `IX_ED710674` (`kaleoClassName`,`kaleoClassPK`,`companyId`,`executionType`),
  KEY `IX_4B2545E8` (`kaleoClassName`,`kaleoClassPK`,`executionType`),
  KEY `IX_F8808C50` (`kaleoDefinitionVersionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `KaleoCondition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KaleoCondition` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `kaleoConditionId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `kaleoDefinitionId` bigint DEFAULT NULL,
  `kaleoDefinitionVersionId` bigint DEFAULT NULL,
  `kaleoNodeId` bigint DEFAULT NULL,
  `script` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `scriptLanguage` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scriptRequiredContexts` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`kaleoConditionId`,`ctCollectionId`),
  KEY `IX_FEE46067` (`companyId`),
  KEY `IX_353B7FB5` (`kaleoDefinitionVersionId`),
  KEY `IX_86CBD4C` (`kaleoNodeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `KaleoDefinition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KaleoDefinition` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kaleoDefinitionId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `scope` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` int DEFAULT NULL,
  `active_` tinyint DEFAULT NULL,
  PRIMARY KEY (`kaleoDefinitionId`,`ctCollectionId`),
  UNIQUE KEY `IX_9F17D510` (`companyId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_1EE07E31` (`uuid_`,`ctCollectionId`,`groupId`),
  KEY `IX_EEFC11D0` (`active_`),
  KEY `IX_37ED1EF9` (`companyId`,`active_`,`name`),
  KEY `IX_D1C1A80A` (`companyId`,`active_`,`scope`),
  KEY `IX_EC14F81A` (`companyId`,`name`,`version`),
  KEY `IX_6E339BF5` (`companyId`,`scope`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `KaleoDefinitionVersion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KaleoDefinitionVersion` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `kaleoDefinitionVersionId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `kaleoDefinitionId` bigint DEFAULT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `version` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startKaleoNodeId` bigint DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`kaleoDefinitionVersionId`,`ctCollectionId`),
  UNIQUE KEY `IX_3ADEC2A` (`companyId`,`name`,`version`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `KaleoInstance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KaleoInstance` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `kaleoInstanceId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `kaleoDefinitionId` bigint DEFAULT NULL,
  `kaleoDefinitionVersionId` bigint DEFAULT NULL,
  `kaleoDefinitionName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kaleoDefinitionVersion` int DEFAULT NULL,
  `rootKaleoInstanceTokenId` bigint DEFAULT NULL,
  `active_` tinyint DEFAULT NULL,
  `className` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `completed` tinyint DEFAULT NULL,
  `completionDate` datetime(6) DEFAULT NULL,
  `workflowContext` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`kaleoInstanceId`,`ctCollectionId`),
  KEY `IX_58D85ECB` (`className`,`classPK`),
  KEY `IX_BF5839F8` (`companyId`,`kaleoDefinitionName`,`kaleoDefinitionVersion`,`completionDate`),
  KEY `IX_DFAFED59` (`companyId`,`userId`,`kaleoInstanceId`),
  KEY `IX_3D0874DE` (`completed`,`kaleoDefinitionId`),
  KEY `IX_3DA1A5AC` (`kaleoDefinitionVersionId`,`completed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `KaleoInstanceToken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KaleoInstanceToken` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `kaleoInstanceTokenId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `kaleoDefinitionId` bigint DEFAULT NULL,
  `kaleoDefinitionVersionId` bigint DEFAULT NULL,
  `kaleoInstanceId` bigint DEFAULT NULL,
  `parentKaleoInstanceTokenId` bigint DEFAULT NULL,
  `currentKaleoNodeId` bigint DEFAULT NULL,
  `currentKaleoNodeName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `className` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `completed` tinyint DEFAULT NULL,
  `completionDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`kaleoInstanceTokenId`,`ctCollectionId`),
  KEY `IX_360D34D9` (`companyId`,`parentKaleoInstanceTokenId`,`completionDate`),
  KEY `IX_1181057E` (`kaleoDefinitionVersionId`),
  KEY `IX_F42AAFF6` (`kaleoInstanceId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `KaleoLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KaleoLog` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `kaleoLogId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `kaleoClassName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kaleoClassPK` bigint DEFAULT NULL,
  `kaleoDefinitionId` bigint DEFAULT NULL,
  `kaleoDefinitionVersionId` bigint DEFAULT NULL,
  `kaleoInstanceId` bigint DEFAULT NULL,
  `kaleoInstanceTokenId` bigint DEFAULT NULL,
  `kaleoTaskInstanceTokenId` bigint DEFAULT NULL,
  `kaleoNodeName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `terminalKaleoNode` tinyint DEFAULT NULL,
  `kaleoActionId` bigint DEFAULT NULL,
  `kaleoActionName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kaleoActionDescription` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `previousKaleoNodeId` bigint DEFAULT NULL,
  `previousKaleoNodeName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `previousAssigneeClassName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `previousAssigneeClassPK` bigint DEFAULT NULL,
  `currentAssigneeClassName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `currentAssigneeClassPK` bigint DEFAULT NULL,
  `type_` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comment_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `startDate` datetime(6) DEFAULT NULL,
  `endDate` datetime(6) DEFAULT NULL,
  `duration` bigint DEFAULT NULL,
  `workflowContext` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`kaleoLogId`,`ctCollectionId`),
  KEY `IX_73B5F4DE` (`companyId`),
  KEY `IX_935D8E5E` (`kaleoDefinitionVersionId`),
  KEY `IX_5BC6AB16` (`kaleoInstanceId`),
  KEY `IX_18212EF6` (`kaleoInstanceTokenId`,`type_`,`kaleoClassName`,`kaleoClassPK`),
  KEY `IX_B0CDCA38` (`kaleoTaskInstanceTokenId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `KaleoNode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KaleoNode` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `kaleoNodeId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `kaleoDefinitionId` bigint DEFAULT NULL,
  `kaleoDefinitionVersionId` bigint DEFAULT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `label` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type_` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `initial_` tinyint DEFAULT NULL,
  `terminal` tinyint DEFAULT NULL,
  PRIMARY KEY (`kaleoNodeId`,`ctCollectionId`),
  KEY `IX_4B1D16B4` (`companyId`,`kaleoDefinitionVersionId`),
  KEY `IX_F066921C` (`kaleoDefinitionVersionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `KaleoNotification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KaleoNotification` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `kaleoNotificationId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `kaleoClassName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kaleoClassPK` bigint DEFAULT NULL,
  `kaleoDefinitionId` bigint DEFAULT NULL,
  `kaleoDefinitionVersionId` bigint DEFAULT NULL,
  `kaleoNodeName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `executionType` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `template` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `templateLanguage` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notificationTypes` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`kaleoNotificationId`,`ctCollectionId`),
  KEY `IX_38829497` (`companyId`),
  KEY `IX_F3362E93` (`kaleoClassName`,`kaleoClassPK`,`executionType`),
  KEY `IX_B8486585` (`kaleoDefinitionVersionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `KaleoNotificationRecipient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KaleoNotificationRecipient` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `kaleoNotificationRecipientId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `kaleoDefinitionId` bigint DEFAULT NULL,
  `kaleoDefinitionVersionId` bigint DEFAULT NULL,
  `kaleoNotificationId` bigint DEFAULT NULL,
  `recipientClassName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recipientClassPK` bigint DEFAULT NULL,
  `recipientRoleType` int DEFAULT NULL,
  `recipientScript` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `recipientScriptLanguage` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recipientScriptContexts` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notificationReceptionType` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`kaleoNotificationRecipientId`,`ctCollectionId`),
  KEY `IX_2C8C4AF4` (`companyId`),
  KEY `IX_B6D98988` (`kaleoDefinitionVersionId`),
  KEY `IX_7F4FED02` (`kaleoNotificationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `KaleoTask`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KaleoTask` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `kaleoTaskId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `kaleoDefinitionId` bigint DEFAULT NULL,
  `kaleoDefinitionVersionId` bigint DEFAULT NULL,
  `kaleoNodeId` bigint DEFAULT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`kaleoTaskId`,`ctCollectionId`),
  KEY `IX_E1F8B23D` (`companyId`),
  KEY `IX_FECA871F` (`kaleoDefinitionVersionId`),
  KEY `IX_77B3F1A2` (`kaleoNodeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `KaleoTaskAssignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KaleoTaskAssignment` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `kaleoTaskAssignmentId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `kaleoClassName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kaleoClassPK` bigint DEFAULT NULL,
  `kaleoDefinitionId` bigint DEFAULT NULL,
  `kaleoDefinitionVersionId` bigint DEFAULT NULL,
  `kaleoNodeId` bigint DEFAULT NULL,
  `assigneeClassName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigneeClassPK` bigint DEFAULT NULL,
  `assigneeActionId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigneeScript` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `assigneeScriptLanguage` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigneeScriptRequiredContexts` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`kaleoTaskAssignmentId`,`ctCollectionId`),
  KEY `IX_611732B0` (`companyId`),
  KEY `IX_1087068E` (`kaleoClassName`,`kaleoClassPK`,`assigneeClassName`),
  KEY `IX_E362B24C` (`kaleoDefinitionVersionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `KaleoTaskAssignmentInstance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KaleoTaskAssignmentInstance` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `kaleoTaskAssignmentInstanceId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `kaleoDefinitionId` bigint DEFAULT NULL,
  `kaleoDefinitionVersionId` bigint DEFAULT NULL,
  `kaleoInstanceId` bigint DEFAULT NULL,
  `kaleoInstanceTokenId` bigint DEFAULT NULL,
  `kaleoTaskInstanceTokenId` bigint DEFAULT NULL,
  `kaleoTaskId` bigint DEFAULT NULL,
  `kaleoTaskName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigneeClassName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigneeClassPK` bigint DEFAULT NULL,
  `completed` tinyint DEFAULT NULL,
  `completionDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`kaleoTaskAssignmentInstanceId`,`ctCollectionId`),
  KEY `IX_3BD436FD` (`assigneeClassName`,`assigneeClassPK`),
  KEY `IX_3E60C5A5` (`assigneeClassName`,`kaleoTaskInstanceTokenId`),
  KEY `IX_F6042803` (`assigneeClassPK`,`groupId`),
  KEY `IX_6E3CDA1B` (`companyId`),
  KEY `IX_B751E781` (`kaleoDefinitionVersionId`),
  KEY `IX_67A9EE93` (`kaleoInstanceId`),
  KEY `IX_D4C2235B` (`kaleoTaskInstanceTokenId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `KaleoTaskForm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KaleoTaskForm` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `kaleoTaskFormId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `kaleoDefinitionId` bigint DEFAULT NULL,
  `kaleoDefinitionVersionId` bigint DEFAULT NULL,
  `kaleoNodeId` bigint DEFAULT NULL,
  `kaleoTaskId` bigint DEFAULT NULL,
  `kaleoTaskName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `formCompanyId` bigint DEFAULT NULL,
  `formDefinition` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `formGroupId` bigint DEFAULT NULL,
  `formId` bigint DEFAULT NULL,
  `formUuid` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `priority` int DEFAULT NULL,
  PRIMARY KEY (`kaleoTaskFormId`,`ctCollectionId`),
  KEY `IX_EFDA7E59` (`companyId`),
  KEY `IX_3B8B7F83` (`kaleoDefinitionVersionId`),
  KEY `IX_945326BE` (`kaleoNodeId`),
  KEY `IX_E38A5954` (`kaleoTaskId`,`formUuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `KaleoTaskFormInstance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KaleoTaskFormInstance` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `kaleoTaskFormInstanceId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `kaleoDefinitionId` bigint DEFAULT NULL,
  `kaleoDefinitionVersionId` bigint DEFAULT NULL,
  `kaleoInstanceId` bigint DEFAULT NULL,
  `kaleoTaskId` bigint DEFAULT NULL,
  `kaleoTaskInstanceTokenId` bigint DEFAULT NULL,
  `kaleoTaskFormId` bigint DEFAULT NULL,
  `formValues` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `formValueEntryGroupId` bigint DEFAULT NULL,
  `formValueEntryId` bigint DEFAULT NULL,
  `formValueEntryUuid` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`kaleoTaskFormInstanceId`,`ctCollectionId`),
  KEY `IX_77B26CC4` (`companyId`),
  KEY `IX_F118DB8` (`kaleoDefinitionVersionId`),
  KEY `IX_FF271E7C` (`kaleoInstanceId`),
  KEY `IX_E7F42BD0` (`kaleoTaskFormId`),
  KEY `IX_2A86346C` (`kaleoTaskId`),
  KEY `IX_2C81C992` (`kaleoTaskInstanceTokenId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `KaleoTaskInstanceToken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KaleoTaskInstanceToken` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `kaleoTaskInstanceTokenId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `kaleoDefinitionId` bigint DEFAULT NULL,
  `kaleoDefinitionVersionId` bigint DEFAULT NULL,
  `kaleoInstanceId` bigint DEFAULT NULL,
  `kaleoInstanceTokenId` bigint DEFAULT NULL,
  `kaleoTaskId` bigint DEFAULT NULL,
  `kaleoTaskName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `className` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `completionUserId` bigint DEFAULT NULL,
  `completed` tinyint DEFAULT NULL,
  `completionDate` datetime(6) DEFAULT NULL,
  `dueDate` datetime(6) DEFAULT NULL,
  `workflowContext` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`kaleoTaskInstanceTokenId`,`ctCollectionId`),
  KEY `IX_A3271995` (`className`,`classPK`),
  KEY `IX_4B55EBE` (`companyId`,`userId`,`completed`),
  KEY `IX_B2822979` (`kaleoDefinitionVersionId`),
  KEY `IX_B857A115` (`kaleoInstanceId`,`kaleoTaskId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `KaleoTimer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KaleoTimer` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `kaleoTimerId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `kaleoClassName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kaleoClassPK` bigint DEFAULT NULL,
  `kaleoDefinitionId` bigint DEFAULT NULL,
  `kaleoDefinitionVersionId` bigint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `blocking` tinyint DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `duration` double DEFAULT NULL,
  `scale` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recurrenceDuration` double DEFAULT NULL,
  `recurrenceScale` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`kaleoTimerId`,`ctCollectionId`),
  KEY `IX_1A479F32` (`kaleoClassName`,`kaleoClassPK`,`blocking`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `KaleoTimerInstanceToken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KaleoTimerInstanceToken` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `kaleoTimerInstanceTokenId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `kaleoClassName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kaleoClassPK` bigint DEFAULT NULL,
  `kaleoDefinitionId` bigint DEFAULT NULL,
  `kaleoDefinitionVersionId` bigint DEFAULT NULL,
  `kaleoInstanceId` bigint DEFAULT NULL,
  `kaleoInstanceTokenId` bigint DEFAULT NULL,
  `kaleoTaskInstanceTokenId` bigint DEFAULT NULL,
  `kaleoTimerId` bigint DEFAULT NULL,
  `kaleoTimerName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `blocking` tinyint DEFAULT NULL,
  `completionUserId` bigint DEFAULT NULL,
  `completed` tinyint DEFAULT NULL,
  `completionDate` datetime(6) DEFAULT NULL,
  `workflowContext` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`kaleoTimerInstanceTokenId`,`ctCollectionId`),
  KEY `IX_DB96C55B` (`kaleoInstanceId`),
  KEY `IX_9932524C` (`kaleoInstanceTokenId`,`completed`,`blocking`),
  KEY `IX_13A5BA2C` (`kaleoInstanceTokenId`,`kaleoTimerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `KaleoTransition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KaleoTransition` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `kaleoTransitionId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `kaleoDefinitionId` bigint DEFAULT NULL,
  `kaleoDefinitionVersionId` bigint DEFAULT NULL,
  `kaleoNodeId` bigint DEFAULT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `label` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `sourceKaleoNodeId` bigint DEFAULT NULL,
  `sourceKaleoNodeName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `targetKaleoNodeId` bigint DEFAULT NULL,
  `targetKaleoNodeName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `defaultTransition` tinyint DEFAULT NULL,
  PRIMARY KEY (`kaleoTransitionId`,`ctCollectionId`),
  KEY `IX_41D6C6D` (`companyId`),
  KEY `IX_16B426EF` (`kaleoDefinitionVersionId`),
  KEY `IX_A38E2194` (`kaleoNodeId`,`defaultTransition`),
  KEY `IX_85268A11` (`kaleoNodeId`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `L_92605711380992_APIApplication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `L_92605711380992_APIApplication` (
  `l_apiApplicationId_` bigint NOT NULL,
  `applicationStatus_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `baseURL_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`l_apiApplicationId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `L_92605711380992_APIApplication_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `L_92605711380992_APIApplication_x` (
  `l_apiApplicationId_` bigint NOT NULL,
  PRIMARY KEY (`l_apiApplicationId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `L_92605711380992_APIEndpoint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `L_92605711380992_APIEndpoint` (
  `l_apiEndpointId_` bigint NOT NULL,
  `description_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `httpMethod_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `path_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pathParameter_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pathParameterDescription_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `retrieveType_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scope_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`l_apiEndpointId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `L_92605711380992_APIEndpoint_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `L_92605711380992_APIEndpoint_x` (
  `l_apiEndpointId_` bigint NOT NULL,
  `r_requestAPISchemaToAPIEndpoints_l_apiSchemaId` bigint DEFAULT '0',
  `r_responseAPISchemaToAPIEndpoints_l_apiSchemaId` bigint DEFAULT '0',
  `r_apiApplicationToAPIEndpoints_l_apiApplicationId` bigint DEFAULT '0',
  PRIMARY KEY (`l_apiEndpointId_`),
  KEY `IX_3A07E0CE` (`r_requestAPISchemaToAPIEndpoints_l_apiSchemaId`),
  KEY `IX_73578AE2` (`r_responseAPISchemaToAPIEndpoints_l_apiSchemaId`),
  KEY `IX_B5375133` (`r_apiApplicationToAPIEndpoints_l_apiApplicationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `L_92605711380992_APIFilter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `L_92605711380992_APIFilter` (
  `l_apiFilterId_` bigint NOT NULL,
  `oDataFilter_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`l_apiFilterId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `L_92605711380992_APIFilter_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `L_92605711380992_APIFilter_x` (
  `l_apiFilterId_` bigint NOT NULL,
  `r_apiEndpointToAPIFilters_l_apiEndpointId` bigint DEFAULT '0',
  PRIMARY KEY (`l_apiFilterId_`),
  KEY `IX_37850205` (`r_apiEndpointToAPIFilters_l_apiEndpointId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `L_92605711380992_APIProperty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `L_92605711380992_APIProperty` (
  `l_apiPropertyId_` bigint NOT NULL,
  `description_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectFieldERC_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectRelationshipNames_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `r_apiPropertyToAPIProperties_l_apiPropertyId` bigint DEFAULT '0',
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`l_apiPropertyId_`),
  KEY `IX_351D2B61` (`r_apiPropertyToAPIProperties_l_apiPropertyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `L_92605711380992_APIProperty_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `L_92605711380992_APIProperty_x` (
  `l_apiPropertyId_` bigint NOT NULL,
  `r_apiSchemaToAPIProperties_l_apiSchemaId` bigint DEFAULT '0',
  PRIMARY KEY (`l_apiPropertyId_`),
  KEY `IX_E4DD14DA` (`r_apiSchemaToAPIProperties_l_apiSchemaId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `L_92605711380992_APISchema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `L_92605711380992_APISchema` (
  `l_apiSchemaId_` bigint NOT NULL,
  `description_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mainObjectDefinitionERC_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`l_apiSchemaId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `L_92605711380992_APISchema_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `L_92605711380992_APISchema_x` (
  `l_apiSchemaId_` bigint NOT NULL,
  `r_apiApplicationToAPISchemas_l_apiApplicationId` bigint DEFAULT '0',
  PRIMARY KEY (`l_apiSchemaId_`),
  KEY `IX_E2D32C33` (`r_apiApplicationToAPISchemas_l_apiApplicationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `L_92605711380992_APISort`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `L_92605711380992_APISort` (
  `l_apiSortId_` bigint NOT NULL,
  `oDataSort_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`l_apiSortId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `L_92605711380992_APISort_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `L_92605711380992_APISort_x` (
  `l_apiSortId_` bigint NOT NULL,
  `r_apiEndpointToAPISorts_l_apiEndpointId` bigint DEFAULT '0',
  PRIMARY KEY (`l_apiSortId_`),
  KEY `IX_2682E339` (`r_apiEndpointToAPISorts_l_apiEndpointId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `L_92605711380992_FunctionalCookieEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `L_92605711380992_FunctionalCookieEntry` (
  `l_functionalCookieEntryId_` bigint NOT NULL,
  `collectedData_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expiration_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `host_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purpose_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`l_functionalCookieEntryId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `L_92605711380992_FunctionalCookieEntry_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `L_92605711380992_FunctionalCookieEntry_x` (
  `l_functionalCookieEntryId_` bigint NOT NULL,
  PRIMARY KEY (`l_functionalCookieEntryId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `L_92605711380992_NecessaryCookieEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `L_92605711380992_NecessaryCookieEntry` (
  `l_necessaryCookieEntryId_` bigint NOT NULL,
  `collectedData_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expiration_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `host_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purpose_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`l_necessaryCookieEntryId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `L_92605711380992_NecessaryCookieEntry_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `L_92605711380992_NecessaryCookieEntry_x` (
  `l_necessaryCookieEntryId_` bigint NOT NULL,
  PRIMARY KEY (`l_necessaryCookieEntryId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `L_92605711380992_PerformanceCookieEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `L_92605711380992_PerformanceCookieEntry` (
  `l_performanceCookieEntryId_` bigint NOT NULL,
  `collectedData_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expiration_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `host_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purpose_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`l_performanceCookieEntryId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `L_92605711380992_PerformanceCookieEntry_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `L_92605711380992_PerformanceCookieEntry_x` (
  `l_performanceCookieEntryId_` bigint NOT NULL,
  PRIMARY KEY (`l_performanceCookieEntryId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `L_92605711380992_PersonalizationCookieEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `L_92605711380992_PersonalizationCookieEntry` (
  `l_personalizationCookieEntryId_` bigint NOT NULL,
  `collectedData_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expiration_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `host_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purpose_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`l_personalizationCookieEntryId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `L_92605711380992_PersonalizationCookieEntry_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `L_92605711380992_PersonalizationCookieEntry_x` (
  `l_personalizationCookieEntryId_` bigint NOT NULL,
  PRIMARY KEY (`l_personalizationCookieEntryId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Layout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Layout` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plid` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `parentPlid` bigint DEFAULT NULL,
  `privateLayout` tinyint DEFAULT NULL,
  `layoutId` bigint DEFAULT NULL,
  `parentLayoutId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `keywords` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `robots` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `typeSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `hidden_` tinyint DEFAULT NULL,
  `system_` tinyint DEFAULT NULL,
  `friendlyURL` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `iconImageId` bigint DEFAULT NULL,
  `themeId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `colorSchemeId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `styleBookEntryId` bigint DEFAULT NULL,
  `css` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `priority` int DEFAULT NULL,
  `faviconFileEntryId` bigint DEFAULT NULL,
  `masterLayoutPlid` bigint DEFAULT NULL,
  `layoutPrototypeUuid` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `layoutPrototypeLinkEnabled` tinyint DEFAULT NULL,
  `sourcePrototypeLayoutUuid` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publishDate` datetime(6) DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`plid`,`ctCollectionId`),
  UNIQUE KEY `IX_E81EADC5` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_502B1A93` (`groupId`,`privateLayout`,`ctCollectionId`,`friendlyURL`),
  UNIQUE KEY `IX_4FBF955A` (`groupId`,`privateLayout`,`ctCollectionId`,`layoutId`),
  UNIQUE KEY `IX_18646B93` (`groupId`,`privateLayout`,`ctCollectionId`,`uuid_`),
  KEY `IX_B8E1E6E5` (`classNameId`,`classPK`),
  KEY `IX_881EABCB` (`companyId`,`layoutPrototypeUuid`),
  KEY `IX_993CBA31` (`groupId`,`masterLayoutPlid`),
  KEY `IX_7DAA999F` (`groupId`,`privateLayout`,`parentLayoutId`,`hidden_`),
  KEY `IX_7399B71E` (`groupId`,`privateLayout`,`parentLayoutId`,`priority`),
  KEY `IX_8F78BAFA` (`groupId`,`privateLayout`,`parentLayoutId`,`system_`),
  KEY `IX_8CE8C0D9` (`groupId`,`privateLayout`,`sourcePrototypeLayoutUuid`),
  KEY `IX_A0364689` (`groupId`,`privateLayout`,`status`),
  KEY `IX_1A1B61D2` (`groupId`,`privateLayout`,`type_`),
  KEY `IX_6EDC627B` (`groupId`,`type_`),
  KEY `IX_23922F7D` (`iconImageId`),
  KEY `IX_B529BFD3` (`layoutPrototypeUuid`),
  KEY `IX_1D4DCAA5` (`parentPlid`),
  KEY `IX_3BC009C0` (`privateLayout`,`iconImageId`),
  KEY `IX_39A18ECC` (`sourcePrototypeLayoutUuid`),
  KEY `IX_D0822724` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `LayoutBranch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LayoutBranch` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `layoutBranchId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `layoutSetBranchId` bigint DEFAULT NULL,
  `plid` bigint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `master` tinyint DEFAULT NULL,
  PRIMARY KEY (`layoutBranchId`),
  UNIQUE KEY `IX_FD57097D` (`layoutSetBranchId`,`plid`,`name`),
  KEY `IX_A705FF94` (`layoutSetBranchId`,`plid`,`master`),
  KEY `IX_72FC531D` (`plid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `LayoutClassedModelUsage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LayoutClassedModelUsage` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `layoutClassedModelUsageId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `cmExternalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `containerKey` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `containerType` bigint DEFAULT NULL,
  `plid` bigint DEFAULT NULL,
  `type_` int DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`layoutClassedModelUsageId`,`ctCollectionId`),
  UNIQUE KEY `IX_9A7A2997` (`classNameId`,`classPK`,`cmExternalReferenceCode`,`containerType`,`plid`,`groupId`,`containerKey`,`ctCollectionId`),
  UNIQUE KEY `IX_8A32D79F` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_B041F1F5` (`classNameId`,`classPK`,`type_`),
  KEY `IX_B51E9567` (`classNameId`,`companyId`,`cmExternalReferenceCode`,`type_`),
  KEY `IX_6AAEDC6` (`classNameId`,`companyId`,`containerType`),
  KEY `IX_F747B9BD` (`containerType`,`plid`,`containerKey`),
  KEY `IX_19448DD6` (`plid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `LayoutFriendlyURL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LayoutFriendlyURL` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `layoutFriendlyURLId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `plid` bigint DEFAULT NULL,
  `privateLayout` tinyint DEFAULT NULL,
  `friendlyURL` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `languageId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`layoutFriendlyURLId`,`ctCollectionId`),
  UNIQUE KEY `IX_8B1B117C` (`groupId`,`friendlyURL`,`ctCollectionId`,`privateLayout`,`languageId`),
  UNIQUE KEY `IX_2C37488` (`groupId`,`uuid_`,`ctCollectionId`),
  UNIQUE KEY `IX_A4D8B1D0` (`plid`,`ctCollectionId`,`languageId`),
  KEY `IX_EAB317C8` (`companyId`),
  KEY `IX_C23A9814` (`friendlyURL`,`companyId`),
  KEY `IX_D3B2D6DF` (`friendlyURL`,`plid`),
  KEY `IX_26AE82D3` (`groupId`,`friendlyURL`,`privateLayout`),
  KEY `IX_9F80D54` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `LayoutLocalization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LayoutLocalization` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `layoutLocalizationId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `languageId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plid` bigint DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`layoutLocalizationId`,`ctCollectionId`),
  UNIQUE KEY `IX_7925C939` (`plid`,`ctCollectionId`,`languageId`),
  UNIQUE KEY `IX_8DC09EE1` (`uuid_`,`ctCollectionId`,`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `LayoutPageTemplateCollection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LayoutPageTemplateCollection` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `layoutPageTemplateCollectionId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `parentLPTCollectionId` bigint DEFAULT NULL,
  `lptCollectionKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type_` int DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`layoutPageTemplateCollectionId`,`ctCollectionId`),
  UNIQUE KEY `IX_210E664C` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_42B0A0C3` (`groupId`,`ctCollectionId`,`uuid_`),
  UNIQUE KEY `IX_F074765` (`groupId`,`type_`,`ctCollectionId`,`lptCollectionKey`),
  UNIQUE KEY `IX_59C463EE` (`groupId`,`type_`,`ctCollectionId`,`parentLPTCollectionId`,`name`),
  KEY `IX_5A1F4BFC` (`groupId`,`parentLPTCollectionId`),
  KEY `IX_D2A97D41` (`groupId`,`type_`,`name`),
  KEY `IX_A27EFF8D` (`groupId`,`type_`,`parentLPTCollectionId`),
  KEY `IX_A17F0EBD` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `LayoutPageTemplateEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LayoutPageTemplateEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `layoutPageTemplateEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `layoutPageTemplateCollectionId` bigint DEFAULT NULL,
  `layoutPageTemplateEntryKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classTypeId` bigint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` int DEFAULT NULL,
  `previewFileEntryId` bigint DEFAULT NULL,
  `defaultTemplate` tinyint DEFAULT NULL,
  `layoutPrototypeId` bigint DEFAULT NULL,
  `plid` bigint DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`layoutPageTemplateEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_E4BCB00E` (`ctCollectionId`,`plid`),
  UNIQUE KEY `IX_8B1AF2DA` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_246C8117` (`groupId`,`ctCollectionId`,`layoutPageTemplateEntryKey`),
  UNIQUE KEY `IX_92540951` (`groupId`,`ctCollectionId`,`uuid_`),
  UNIQUE KEY `IX_10008A8D` (`groupId`,`type_`,`name`,`layoutPageTemplateCollectionId`,`ctCollectionId`),
  KEY `IX_A6459477` (`groupId`,`classNameId`,`classTypeId`,`defaultTemplate`),
  KEY `IX_E7CC5585` (`groupId`,`layoutPageTemplateCollectionId`),
  KEY `IX_FFE79984` (`groupId`,`name`,`layoutPageTemplateCollectionId`),
  KEY `IX_416DDC6A` (`groupId`,`name`,`status`,`layoutPageTemplateCollectionId`),
  KEY `IX_F328D6D1` (`groupId`,`status`,`classNameId`,`classTypeId`,`defaultTemplate`),
  KEY `IX_DB1B076B` (`groupId`,`status`,`layoutPageTemplateCollectionId`),
  KEY `IX_186B1B7F` (`groupId`,`type_`,`classNameId`,`classTypeId`),
  KEY `IX_F406284D` (`groupId`,`type_`,`classNameId`,`defaultTemplate`),
  KEY `IX_CD9D4A70` (`groupId`,`type_`,`layoutPageTemplateCollectionId`),
  KEY `IX_DE43E7E` (`groupId`,`type_`,`name`,`classNameId`,`classTypeId`),
  KEY `IX_FB160AE4` (`groupId`,`type_`,`name`,`status`,`classNameId`,`classTypeId`),
  KEY `IX_C7B456E5` (`groupId`,`type_`,`status`,`classNameId`,`classTypeId`),
  KEY `IX_9C2D0C95` (`groupId`,`type_`,`status`,`defaultTemplate`),
  KEY `IX_A185457E` (`layoutPrototypeId`),
  KEY `IX_2D68D26F` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `LayoutPageTemplateStructure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LayoutPageTemplateStructure` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `layoutPageTemplateStructureId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `plid` bigint DEFAULT NULL,
  PRIMARY KEY (`layoutPageTemplateStructureId`,`ctCollectionId`),
  UNIQUE KEY `IX_350C34AD` (`groupId`,`ctCollectionId`,`plid`),
  UNIQUE KEY `IX_545A15BA` (`uuid_`,`groupId`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `LayoutPageTemplateStructureRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LayoutPageTemplateStructureRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lPageTemplateStructureRelId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `layoutPageTemplateStructureId` bigint DEFAULT NULL,
  `segmentsExperienceId` bigint DEFAULT NULL,
  `data_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`lPageTemplateStructureRelId`,`ctCollectionId`),
  UNIQUE KEY `IX_843407A3` (`layoutPageTemplateStructureId`,`segmentsExperienceId`,`ctCollectionId`),
  UNIQUE KEY `IX_812060B7` (`uuid_`,`ctCollectionId`,`groupId`),
  KEY `IX_12808938` (`segmentsExperienceId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `LayoutPrototype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LayoutPrototype` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `layoutPrototypeId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `settings_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `active_` tinyint DEFAULT NULL,
  PRIMARY KEY (`layoutPrototypeId`,`ctCollectionId`),
  KEY `IX_557A639F` (`companyId`,`active_`),
  KEY `IX_CEF72136` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `LayoutRevision`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LayoutRevision` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `layoutRevisionId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `layoutSetBranchId` bigint DEFAULT NULL,
  `layoutBranchId` bigint DEFAULT NULL,
  `parentLayoutRevisionId` bigint DEFAULT NULL,
  `head` tinyint DEFAULT NULL,
  `major` tinyint DEFAULT NULL,
  `plid` bigint DEFAULT NULL,
  `privateLayout` tinyint DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `keywords` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `robots` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `typeSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `iconImageId` bigint DEFAULT NULL,
  `themeId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `colorSchemeId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `css` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`layoutRevisionId`),
  KEY `IX_9EC9F954` (`layoutSetBranchId`,`head`,`status`),
  KEY `IX_538BFC54` (`layoutSetBranchId`,`plid`,`head`,`layoutBranchId`),
  KEY `IX_84668240` (`layoutSetBranchId`,`plid`,`layoutBranchId`),
  KEY `IX_F93E5CC3` (`layoutSetBranchId`,`plid`,`parentLayoutRevisionId`),
  KEY `IX_70DA9ECB` (`layoutSetBranchId`,`plid`,`status`),
  KEY `IX_7FFAE700` (`layoutSetBranchId`,`status`),
  KEY `IX_27F4B32A` (`plid`,`head`),
  KEY `IX_8EC3D2BC` (`plid`,`status`),
  KEY `IX_421223B1` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `LayoutSEOEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LayoutSEOEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `layoutSEOEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `privateLayout` tinyint DEFAULT NULL,
  `layoutId` bigint DEFAULT NULL,
  `canonicalURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `canonicalURLEnabled` tinyint DEFAULT NULL,
  `DDMStorageId` bigint DEFAULT NULL,
  `openGraphDescription` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `openGraphDescriptionEnabled` tinyint DEFAULT NULL,
  `openGraphImageAlt` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `openGraphImageFileEntryId` bigint DEFAULT NULL,
  `openGraphTitle` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `openGraphTitleEnabled` tinyint DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`layoutSEOEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_962A7193` (`groupId`,`ctCollectionId`,`privateLayout`,`layoutId`),
  UNIQUE KEY `IX_63195F59` (`uuid_`,`groupId`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `LayoutSEOSite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LayoutSEOSite` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `layoutSEOSiteId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `openGraphEnabled` tinyint DEFAULT NULL,
  `openGraphImageAlt` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `openGraphImageFileEntryId` bigint DEFAULT NULL,
  PRIMARY KEY (`layoutSEOSiteId`,`ctCollectionId`),
  UNIQUE KEY `IX_E4DFAF28` (`groupId`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `LayoutSet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LayoutSet` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `layoutSetId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `privateLayout` tinyint DEFAULT NULL,
  `logoId` bigint DEFAULT NULL,
  `themeId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `colorSchemeId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `faviconFileEntryId` bigint DEFAULT NULL,
  `css` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `settings_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `layoutSetPrototypeUuid` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `layoutSetPrototypeLinkEnabled` tinyint DEFAULT NULL,
  PRIMARY KEY (`layoutSetId`,`ctCollectionId`),
  UNIQUE KEY `IX_3F2A9AEF` (`groupId`,`privateLayout`,`ctCollectionId`),
  KEY `IX_C629311` (`layoutSetPrototypeUuid`,`companyId`),
  KEY `IX_1B698D9` (`privateLayout`,`logoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `LayoutSetBranch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LayoutSetBranch` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `layoutSetBranchId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `privateLayout` tinyint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `master` tinyint DEFAULT NULL,
  `logoId` bigint DEFAULT NULL,
  `themeId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `colorSchemeId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `css` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `settings_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `layoutSetPrototypeUuid` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `layoutSetPrototypeLinkEnabled` tinyint DEFAULT NULL,
  PRIMARY KEY (`layoutSetBranchId`),
  UNIQUE KEY `IX_5FF18552` (`groupId`,`privateLayout`,`name`),
  KEY `IX_CCF0DA29` (`groupId`,`privateLayout`,`master`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `LayoutSetPrototype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LayoutSetPrototype` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `layoutSetPrototypeId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `settings_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `active_` tinyint DEFAULT NULL,
  PRIMARY KEY (`layoutSetPrototypeId`),
  KEY `IX_9178FC71` (`companyId`,`active_`),
  KEY `IX_C5D69B24` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `LayoutUtilityPageEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LayoutUtilityPageEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LayoutUtilityPageEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `plid` bigint DEFAULT NULL,
  `previewFileEntryId` bigint DEFAULT NULL,
  `defaultLayoutUtilityPageEntry` tinyint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`LayoutUtilityPageEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_CA8014F0` (`ctCollectionId`,`plid`),
  UNIQUE KEY `IX_373A213C` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_28103BB3` (`groupId`,`ctCollectionId`,`uuid_`),
  UNIQUE KEY `IX_2089F80F` (`groupId`,`type_`,`ctCollectionId`,`name`),
  KEY `IX_DCFECA00` (`groupId`,`type_`,`defaultLayoutUtilityPageEntry`),
  KEY `IX_B0D10431` (`groupId`,`type_`,`name`),
  KEY `IX_997885CD` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ListType`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ListType` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `listTypeId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`listTypeId`),
  UNIQUE KEY `IX_BF6DBF8A` (`companyId`,`type_`,`name`),
  KEY `IX_56E29D16` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ListTypeDefinition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ListTypeDefinition` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `listTypeDefinitionId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `system_` tinyint DEFAULT NULL,
  PRIMARY KEY (`listTypeDefinitionId`),
  UNIQUE KEY `IX_17295166` (`companyId`,`externalReferenceCode`),
  KEY `IX_67134731` (`companyId`,`userId`),
  KEY `IX_C3F53B03` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ListTypeEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ListTypeEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `listTypeEntryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `listTypeDefinitionId` bigint DEFAULT NULL,
  `key_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`listTypeEntryId`),
  KEY `IX_749438E2` (`companyId`,`userId`),
  KEY `IX_8FB531BD` (`externalReferenceCode`),
  KEY `IX_C413932E` (`listTypeDefinitionId`,`key_`),
  KEY `IX_79966E34` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Lock_`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Lock_` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lockId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `className` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `key_` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `owner` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inheritable` tinyint DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`lockId`),
  UNIQUE KEY `IX_228562AD` (`className`,`key_`),
  KEY `IX_E24BC29` (`className`,`companyId`,`userId`),
  KEY `IX_E3F1286B` (`expirationDate`),
  KEY `IX_13C5CD3A` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `MBBan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MBBan` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `banId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `banUserId` bigint DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`banId`,`ctCollectionId`),
  UNIQUE KEY `IX_80F14E99` (`groupId`,`banUserId`,`ctCollectionId`),
  UNIQUE KEY `IX_6F119354` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_69951A25` (`banUserId`),
  KEY `IX_48814BBA` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `MBCategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MBCategory` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `parentCategoryId` bigint DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `displayStyle` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `friendlyURL` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`categoryId`,`ctCollectionId`),
  UNIQUE KEY `IX_ED533FEE` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_B73EC7E5` (`groupId`,`ctCollectionId`,`friendlyURL`),
  UNIQUE KEY `IX_7B308E1` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_BC735DCF` (`companyId`),
  KEY `IX_72DC3FF5` (`groupId`,`parentCategoryId`,`categoryId`),
  KEY `IX_F69FCDDB` (`groupId`,`parentCategoryId`,`status`,`categoryId`),
  KEY `IX_DA84A9F7` (`groupId`,`status`),
  KEY `IX_AB585C29` (`status`,`companyId`),
  KEY `IX_C2626EDB` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `MBDiscussion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MBDiscussion` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discussionId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `threadId` bigint DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`discussionId`,`ctCollectionId`),
  UNIQUE KEY `IX_4B5416` (`ctCollectionId`,`classNameId`,`classPK`),
  UNIQUE KEY `IX_C88E75BA` (`ctCollectionId`,`threadId`),
  UNIQUE KEY `IX_BEBA7CFB` (`uuid_`,`ctCollectionId`,`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `MBMailingList`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MBMailingList` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mailingListId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `categoryId` bigint DEFAULT NULL,
  `emailAddress` varchar(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inProtocol` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inServerName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inServerPort` int DEFAULT NULL,
  `inUseSSL` tinyint DEFAULT NULL,
  `inUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inPassword` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inReadInterval` int DEFAULT NULL,
  `outEmailAddress` varchar(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `outCustom` tinyint DEFAULT NULL,
  `outServerName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `outServerPort` int DEFAULT NULL,
  `outUseSSL` tinyint DEFAULT NULL,
  `outUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `outPassword` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `allowAnonymous` tinyint DEFAULT NULL,
  `active_` tinyint DEFAULT NULL,
  PRIMARY KEY (`mailingListId`,`ctCollectionId`),
  UNIQUE KEY `IX_5AFAF63B` (`groupId`,`ctCollectionId`,`categoryId`),
  UNIQUE KEY `IX_212E7CE` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_BFEB984F` (`active_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `MBMessage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MBMessage` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `messageId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `categoryId` bigint DEFAULT NULL,
  `threadId` bigint DEFAULT NULL,
  `rootMessageId` bigint DEFAULT NULL,
  `parentMessageId` bigint DEFAULT NULL,
  `treePath` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `subject` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `urlSubject` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `body` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `format` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `anonymous` tinyint DEFAULT NULL,
  `priority` double DEFAULT NULL,
  `allowPingbacks` tinyint DEFAULT NULL,
  `answer` tinyint DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`messageId`,`ctCollectionId`),
  UNIQUE KEY `IX_CAD6292D` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_C3FB4E01` (`groupId`,`ctCollectionId`,`urlSubject`),
  UNIQUE KEY `IX_94D65020` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_51A8D44D` (`classNameId`,`classPK`),
  KEY `IX_B1432D30` (`companyId`),
  KEY `IX_1073AB9F` (`groupId`,`categoryId`),
  KEY `IX_1D0DEF85` (`groupId`,`status`,`categoryId`),
  KEY `IX_5084DE7E` (`groupId`,`status`,`threadId`,`categoryId`),
  KEY `IX_D12CECD2` (`groupId`,`status`,`userId`),
  KEY `IX_C19015CA` (`groupId`,`threadId`,`categoryId`,`answer`),
  KEY `IX_8EB8C5EC` (`groupId`,`userId`),
  KEY `IX_58465030` (`parentMessageId`),
  KEY `IX_936ECAB3` (`status`,`classNameId`,`classPK`),
  KEY `IX_E4D73A8A` (`status`,`companyId`),
  KEY `IX_D6CD720A` (`status`,`parentMessageId`),
  KEY `IX_6F212FD7` (`status`,`threadId`),
  KEY `IX_2E9F9D6D` (`status`,`userId`,`classNameId`,`classPK`),
  KEY `IX_9D7C3B23` (`threadId`,`answer`),
  KEY `IX_A7038CD7` (`threadId`,`parentMessageId`),
  KEY `IX_ABEB6D07` (`userId`,`classNameId`,`classPK`),
  KEY `IX_C57B16BC` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `MBSuspiciousActivity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MBSuspiciousActivity` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `suspiciousActivityId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `messageId` bigint DEFAULT NULL,
  `threadId` bigint DEFAULT NULL,
  `reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `validated` tinyint DEFAULT NULL,
  PRIMARY KEY (`suspiciousActivityId`,`ctCollectionId`),
  UNIQUE KEY `IX_A3E15B5B` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_977DB0CB` (`messageId`),
  KEY `IX_9EE25540` (`threadId`),
  KEY `IX_39C9A751` (`userId`,`messageId`),
  KEY `IX_939A75FA` (`userId`,`threadId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `MBThread`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MBThread` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `threadId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `categoryId` bigint DEFAULT NULL,
  `rootMessageId` bigint DEFAULT NULL,
  `rootMessageUserId` bigint DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastPostByUserId` bigint DEFAULT NULL,
  `lastPostDate` datetime(6) DEFAULT NULL,
  `priority` double DEFAULT NULL,
  `question` tinyint DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`threadId`,`ctCollectionId`),
  UNIQUE KEY `IX_4790702D` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_41F6DC8A` (`categoryId`,`priority`),
  KEY `IX_50F1904A` (`groupId`,`categoryId`,`lastPostDate`),
  KEY `IX_485F7E98` (`groupId`,`categoryId`,`status`),
  KEY `IX_E1E7142B` (`groupId`,`status`),
  KEY `IX_15AE30B5` (`priority`,`lastPostDate`),
  KEY `IX_CC993ECB` (`rootMessageId`),
  KEY `IX_7E264A0F` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `MBThreadFlag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MBThreadFlag` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `threadFlagId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `threadId` bigint DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`threadFlagId`,`ctCollectionId`),
  UNIQUE KEY `IX_B2386762` (`userId`,`threadId`,`ctCollectionId`),
  UNIQUE KEY `IX_78C515E9` (`uuid_`,`ctCollectionId`,`groupId`),
  KEY `IX_8CB0A24A` (`threadId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Marketplace_App`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Marketplace_App` (
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `appId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `remoteAppId` bigint DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `iconURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `version` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `required` tinyint DEFAULT NULL,
  PRIMARY KEY (`appId`),
  KEY `IX_94A7EF25` (`category`),
  KEY `IX_865B7BD5` (`companyId`),
  KEY `IX_20F14D93` (`remoteAppId`),
  KEY `IX_3E667FE1` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Marketplace_Module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Marketplace_Module` (
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `moduleId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `appId` bigint DEFAULT NULL,
  `bundleSymbolicName` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bundleVersion` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contextName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`moduleId`),
  KEY `IX_5848F52D` (`appId`,`bundleSymbolicName`(255),`bundleVersion`),
  KEY `IX_C6938724` (`appId`,`contextName`),
  KEY `IX_DD03D499` (`bundleSymbolicName`(255)),
  KEY `IX_F2F1E964` (`contextName`),
  KEY `IX_A7EFD80E` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `MembershipRequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MembershipRequest` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `membershipRequestId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `comments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `replyComments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `replyDate` datetime(6) DEFAULT NULL,
  `replierUserId` bigint DEFAULT NULL,
  `statusId` bigint DEFAULT NULL,
  PRIMARY KEY (`membershipRequestId`),
  KEY `IX_C28C72EC` (`groupId`,`statusId`),
  KEY `IX_35AA8FA6` (`groupId`,`userId`,`statusId`),
  KEY `IX_66D70879` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `MicroblogsEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MicroblogsEntry` (
  `microblogsEntryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `creatorClassNameId` bigint DEFAULT NULL,
  `creatorClassPK` bigint DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type_` int DEFAULT NULL,
  `parentMicroblogsEntryId` bigint DEFAULT NULL,
  `socialRelationType` int DEFAULT NULL,
  PRIMARY KEY (`microblogsEntryId`),
  KEY `IX_837C013D` (`companyId`),
  KEY `IX_DBBE9592` (`creatorClassNameId`,`companyId`,`creatorClassPK`),
  KEY `IX_D07BC0AC` (`creatorClassNameId`,`creatorClassPK`),
  KEY `IX_6CA26C53` (`type_`,`creatorClassNameId`,`companyId`,`creatorClassPK`),
  KEY `IX_9A7A988B` (`type_`,`creatorClassNameId`,`creatorClassPK`),
  KEY `IX_6BD29B9C` (`type_`,`parentMicroblogsEntryId`),
  KEY `IX_AA96AEF9` (`type_`,`userId`,`socialRelationType`,`createDate`),
  KEY `IX_6C297B45` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `NQueueEntryAttachment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `NQueueEntryAttachment` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `NQueueEntryAttachmentId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `fileEntryId` bigint DEFAULT NULL,
  `notificationQueueEntryId` bigint DEFAULT NULL,
  PRIMARY KEY (`NQueueEntryAttachmentId`),
  KEY `IX_42E60133` (`notificationQueueEntryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `NTemplateAttachment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `NTemplateAttachment` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `NTemplateAttachmentId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `notificationTemplateId` bigint DEFAULT NULL,
  `objectFieldId` bigint DEFAULT NULL,
  PRIMARY KEY (`NTemplateAttachmentId`),
  UNIQUE KEY `IX_8F1205E1` (`notificationTemplateId`,`objectFieldId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `NotificationQueueEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `NotificationQueueEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `notificationQueueEntryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `notificationTemplateId` bigint DEFAULT NULL,
  `body` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `priority` double DEFAULT NULL,
  `sentDate` datetime(6) DEFAULT NULL,
  `subject` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`notificationQueueEntryId`),
  KEY `IX_559C5AD6` (`companyId`),
  KEY `IX_83DBCE06` (`notificationTemplateId`),
  KEY `IX_3B9F9C6C` (`sentDate`),
  KEY `IX_74855369` (`type_`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `NotificationRecipient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `NotificationRecipient` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notificationRecipientId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  PRIMARY KEY (`notificationRecipientId`),
  KEY `IX_470340CF` (`classPK`),
  KEY `IX_2ADCE1A0` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `NotificationRecipientSetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `NotificationRecipientSetting` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notificationRecipientSettingId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `notificationRecipientId` bigint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`notificationRecipientSettingId`),
  KEY `IX_B6D4DBB0` (`notificationRecipientId`,`name`),
  KEY `IX_5B9A04C` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `NotificationTemplate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `NotificationTemplate` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notificationTemplateId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `objectDefinitionId` bigint DEFAULT NULL,
  `body` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `editorType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `recipientType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `system_` tinyint DEFAULT NULL,
  `type_` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`notificationTemplateId`),
  UNIQUE KEY `IX_7E887280` (`companyId`,`externalReferenceCode`),
  KEY `IX_7256D229` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `OA2Auths_OA2ScopeGrants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OA2Auths_OA2ScopeGrants` (
  `companyId` bigint NOT NULL,
  `oAuth2AuthorizationId` bigint NOT NULL,
  `oAuth2ScopeGrantId` bigint NOT NULL,
  PRIMARY KEY (`oAuth2AuthorizationId`,`oAuth2ScopeGrantId`),
  KEY `IX_87DAF9C3` (`companyId`),
  KEY `IX_2F541817` (`oAuth2ScopeGrantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `OAuth2Application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OAuth2Application` (
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oAuth2ApplicationId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `oA2AScopeAliasesId` bigint DEFAULT NULL,
  `allowedGrantTypes` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clientAuthenticationMethod` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clientCredentialUserId` bigint DEFAULT NULL,
  `clientCredentialUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clientId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clientProfile` int DEFAULT NULL,
  `clientSecret` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `homePageURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `iconFileEntryId` bigint DEFAULT NULL,
  `jwks` varchar(3999) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `privacyPolicyURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `redirectURIs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `rememberDevice` tinyint DEFAULT NULL,
  `trustedApplication` tinyint DEFAULT NULL,
  PRIMARY KEY (`oAuth2ApplicationId`),
  UNIQUE KEY `IX_67BC29B0` (`companyId`,`externalReferenceCode`(255)),
  KEY `IX_523E5C67` (`companyId`,`clientId`),
  KEY `IX_949C9C01` (`companyId`,`clientProfile`),
  KEY `IX_361558F9` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `OAuth2ApplicationScopeAliases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OAuth2ApplicationScopeAliases` (
  `oA2AScopeAliasesId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `oAuth2ApplicationId` bigint DEFAULT NULL,
  PRIMARY KEY (`oA2AScopeAliasesId`),
  KEY `IX_282ECE83` (`companyId`),
  KEY `IX_2F9EBCBB` (`oAuth2ApplicationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `OAuth2Authorization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OAuth2Authorization` (
  `oAuth2AuthorizationId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `oAuth2ApplicationId` bigint DEFAULT NULL,
  `oA2AScopeAliasesId` bigint DEFAULT NULL,
  `accessTokenContent` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `accessTokenContentHash` bigint DEFAULT NULL,
  `accessTokenCreateDate` datetime(6) DEFAULT NULL,
  `accessTokenExpirationDate` datetime(6) DEFAULT NULL,
  `remoteHostInfo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remoteIPInfo` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refreshTokenContent` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `refreshTokenContentHash` bigint DEFAULT NULL,
  `refreshTokenCreateDate` datetime(6) DEFAULT NULL,
  `refreshTokenExpirationDate` datetime(6) DEFAULT NULL,
  `rememberDeviceContent` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`oAuth2AuthorizationId`),
  KEY `IX_FB9F7B8A` (`companyId`,`accessTokenContentHash`),
  KEY `IX_673EE35` (`companyId`,`refreshTokenContentHash`),
  KEY `IX_70DD169C` (`oAuth2ApplicationId`),
  KEY `IX_EFE93C04` (`userId`,`oAuth2ApplicationId`,`rememberDeviceContent`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `OAuth2ScopeGrant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OAuth2ScopeGrant` (
  `oAuth2ScopeGrantId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `oA2AScopeAliasesId` bigint DEFAULT NULL,
  `applicationName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bundleSymbolicName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scope` varchar(240) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scopeAliases` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`oAuth2ScopeGrantId`),
  KEY `IX_8E6F6B4B` (`oA2AScopeAliasesId`,`companyId`,`applicationName`,`bundleSymbolicName`,`scope`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `OAuthClientASLocalMetadata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OAuthClientASLocalMetadata` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `oAuthClientASLocalMetadataId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `localWellKnownURI` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadataJSON` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`oAuthClientASLocalMetadataId`),
  UNIQUE KEY `IX_AD59C966` (`localWellKnownURI`(255)),
  KEY `IX_51E47B3C` (`companyId`),
  KEY `IX_D41859A6` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `OAuthClientEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OAuthClientEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `oAuthClientEntryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `authRequestParametersJSON` varchar(3999) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `authServerWellKnownURI` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clientId` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `infoJSON` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `oidcUserInfoMapperJSON` varchar(3999) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tokenRequestParametersJSON` varchar(3999) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`oAuthClientEntryId`),
  UNIQUE KEY `IX_FEC415C2` (`companyId`,`authServerWellKnownURI`(255),`clientId`(255)),
  KEY `IX_29A83E50` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_BookingOnline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_BookingOnline` (
  `c_bookingOnlineId_` bigint NOT NULL,
  `email_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `organization_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requestTime_` datetime(6) DEFAULT NULL,
  `topic_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`c_bookingOnlineId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_BookingOnline_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_BookingOnline_x` (
  `c_bookingOnlineId_` bigint NOT NULL,
  PRIMARY KEY (`c_bookingOnlineId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_CameraInfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_CameraInfo` (
  `c_cameraInfoId_` bigint NOT NULL,
  `endLocation_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `highwayID_` int DEFAULT '0',
  `startLocation_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stationID_` int DEFAULT '0',
  `videoURL_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`c_cameraInfoId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_CameraInfo_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_CameraInfo_x` (
  `c_cameraInfoId_` bigint NOT NULL,
  `cameraName_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `highwayName_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stationName_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`c_cameraInfoId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_Categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_Categories` (
  `c_categoriesId_` bigint NOT NULL,
  `siteId_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`c_categoriesId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_Categories_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_Categories_x` (
  `c_categoriesId_` bigint NOT NULL,
  PRIMARY KEY (`c_categoriesId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_DeepLinkHeaderSearch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_DeepLinkHeaderSearch` (
  `c_deepLinkHeaderSearchId_` bigint NOT NULL,
  `name_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`c_deepLinkHeaderSearchId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_DeepLinkHeaderSearch_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_DeepLinkHeaderSearch_x` (
  `c_deepLinkHeaderSearchId_` bigint NOT NULL,
  `uRL_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`c_deepLinkHeaderSearchId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_Highway`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_Highway` (
  `c_highwayId_` bigint NOT NULL,
  `description_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `drivingLaneNum_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergencyLaneNum_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `endLat_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `endLng_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_` bigint DEFAULT '0',
  `intersectionNum_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `length_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serviceAreaNum_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startLat_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startLng_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tollStationNum_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`c_highwayId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_HighwayInfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_HighwayInfo` (
  `c_highwayInfoId_` bigint NOT NULL,
  PRIMARY KEY (`c_highwayInfoId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_HighwayInfo_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_HighwayInfo_x` (
  `c_highwayInfoId_` bigint NOT NULL,
  `time_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `progress_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `investment_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `partner_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `chainage_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `totalLanes_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startPoint_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `endPoint_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `r_highwayInfoFK_c_highwayId` bigint DEFAULT '0',
  `r_highwayInfo_c_cameraInfoId` bigint DEFAULT '0',
  PRIMARY KEY (`c_highwayInfoId_`),
  KEY `IX_22294689` (`r_highwayInfoFK_c_highwayId`),
  KEY `IX_315246D6` (`r_highwayInfo_c_cameraInfoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_HighwayLane`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_HighwayLane` (
  `c_highwayLaneId_` bigint NOT NULL,
  `maxSpeed_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `minSpeed_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`c_highwayLaneId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_HighwayLane_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_HighwayLane_x` (
  `c_highwayLaneId_` bigint NOT NULL,
  `r_highwayLaneFK_c_highwaySegmentId` bigint DEFAULT '0',
  PRIMARY KEY (`c_highwayLaneId_`),
  KEY `IX_CF0A3B24` (`r_highwayLaneFK_c_highwaySegmentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_HighwaySegment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_HighwaySegment` (
  `c_highwaySegmentId_` bigint NOT NULL,
  `description_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `endLatitude_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `endLongitude_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `r_highwaySegmentFK_c_highwayId` bigint DEFAULT '0',
  `startLatitude_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startLongitude_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vehicleLaneDivisionn_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `vehiclesProhibited_` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`c_highwaySegmentId_`),
  KEY `IX_AE62E0D8` (`r_highwaySegmentFK_c_highwayId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_HighwaySegment_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_HighwaySegment_x` (
  `c_highwaySegmentId_` bigint NOT NULL,
  `r_highwaySegmentFK_c_highwayId` bigint DEFAULT '0',
  PRIMARY KEY (`c_highwaySegmentId_`),
  KEY `IX_12962C51` (`r_highwaySegmentFK_c_highwayId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_Highway_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_Highway_x` (
  `c_highwayId_` bigint NOT NULL,
  `r_highwayRelationship_c_trafficConditionsId` bigint DEFAULT '0',
  `order_` int DEFAULT '0',
  PRIMARY KEY (`c_highwayId_`),
  KEY `IX_52F36C64` (`r_highwayRelationship_c_trafficConditionsId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_QuickLinksTrangCh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_QuickLinksTrangCh` (
  `c_quickLinksTrangChId_` bigint NOT NULL,
  `title_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uRL_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`c_quickLinksTrangChId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_QuickLinksTrangCh_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_QuickLinksTrangCh_x` (
  `c_quickLinksTrangChId_` bigint NOT NULL,
  PRIMARY KEY (`c_quickLinksTrangChId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_Resume`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_Resume` (
  `c_resumeId_` bigint NOT NULL,
  `email_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fullname_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`c_resumeId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_ResumeAttachment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_ResumeAttachment` (
  `c_resumeAttachmentId_` bigint NOT NULL,
  `attachment_` bigint DEFAULT '0',
  `r_resumeAttachmentFK_c_resumeId` bigint DEFAULT '0',
  PRIMARY KEY (`c_resumeAttachmentId_`),
  KEY `IX_B4E47128` (`r_resumeAttachmentFK_c_resumeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_ResumeAttachment_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_ResumeAttachment_x` (
  `c_resumeAttachmentId_` bigint NOT NULL,
  PRIMARY KEY (`c_resumeAttachmentId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_Resume_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_Resume_x` (
  `c_resumeId_` bigint NOT NULL,
  `attachment_` bigint DEFAULT '0',
  PRIMARY KEY (`c_resumeId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_ShortLinkThngTinNhnS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_ShortLinkThngTinNhnS` (
  `c_shortLinkThngTinNhnSId_` bigint NOT NULL,
  `title_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uRL_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`c_shortLinkThngTinNhnSId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_ShortLinkThngTinNhnS_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_ShortLinkThngTinNhnS_x` (
  `c_shortLinkThngTinNhnSId_` bigint NOT NULL,
  PRIMARY KEY (`c_shortLinkThngTinNhnSId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_ShortLinkVnPhnginT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_ShortLinkVnPhnginT` (
  `c_shortLinkVnPhnginTId_` bigint NOT NULL,
  `title_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uRL_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`c_shortLinkVnPhnginTId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_ShortLinkVnPhnginT_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_ShortLinkVnPhnginT_x` (
  `c_shortLinkVnPhnginTId_` bigint NOT NULL,
  PRIMARY KEY (`c_shortLinkVnPhnginTId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_ShortLinkiSotThuPh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_ShortLinkiSotThuPh` (
  `c_shortLinkiSotThuPhId_` bigint NOT NULL,
  `title_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uRL_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`c_shortLinkiSotThuPhId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_ShortLinkiSotThuPh_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_ShortLinkiSotThuPh_x` (
  `c_shortLinkiSotThuPhId_` bigint NOT NULL,
  PRIMARY KEY (`c_shortLinkiSotThuPhId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_StationInfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_StationInfo` (
  `c_stationInfoId_` bigint NOT NULL,
  `description_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `image_` bigint DEFAULT '0',
  `lat_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lng_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`c_stationInfoId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_StationInfo_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_StationInfo_x` (
  `c_stationInfoId_` bigint NOT NULL,
  `r_stationInfoAndHighwayFK_c_highwayId` bigint DEFAULT '0',
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detailDescription_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `code_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isNotVecToll_` tinyint DEFAULT '0',
  `r_stationInfo_c_cameraInfoId` bigint DEFAULT '0',
  PRIMARY KEY (`c_stationInfoId_`),
  KEY `IX_3110F77F` (`r_stationInfoAndHighwayFK_c_highwayId`),
  KEY `IX_14F37FF6` (`r_stationInfo_c_cameraInfoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_SystemKey`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_SystemKey` (
  `c_systemKeyId_` bigint NOT NULL,
  `key_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `value_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`c_systemKeyId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_SystemKey_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_SystemKey_x` (
  `c_systemKeyId_` bigint NOT NULL,
  PRIMARY KEY (`c_systemKeyId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_TollStationInfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_TollStationInfo` (
  `c_tollStationInfoId_` bigint NOT NULL,
  `description_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `price_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`c_tollStationInfoId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_TollStationInfo_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_TollStationInfo_x` (
  `c_tollStationInfoId_` bigint NOT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `r_toStationFK_c_stationInfoId` bigint DEFAULT '0',
  `r_fromStationFK_c_stationInfoId` bigint DEFAULT '0',
  PRIMARY KEY (`c_tollStationInfoId_`),
  KEY `IX_2DA87770` (`r_toStationFK_c_stationInfoId`),
  KEY `IX_CFCB2961` (`r_fromStationFK_c_stationInfoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_TrafficConditions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_TrafficConditions` (
  `c_trafficConditionsId_` bigint NOT NULL,
  `cause_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `directionFrom_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `directionTo_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `googleMapUrl_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `highwayId_` int DEFAULT '0',
  `highwayName_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imageUrl_` bigint DEFAULT '0',
  `latitude_` double DEFAULT '0',
  `longitude_` double DEFAULT '0',
  `r_highways_c_highwayId` bigint DEFAULT '0',
  `title_` varchar(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`c_trafficConditionsId_`),
  KEY `IX_3CC0BB1C` (`r_highways_c_highwayId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `O_92605711380992_TrafficConditions_x`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `O_92605711380992_TrafficConditions_x` (
  `c_trafficConditionsId_` bigint NOT NULL,
  PRIMARY KEY (`c_trafficConditionsId_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ObjectAction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObjectAction` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectActionId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `objectDefinitionId` bigint DEFAULT NULL,
  `active_` tinyint DEFAULT NULL,
  `conditionExpression` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `errorMessage` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `label` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectActionExecutorKey` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectActionTriggerKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parameters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `system_` tinyint DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`objectActionId`),
  UNIQUE KEY `IX_7CB6AA71` (`objectDefinitionId`,`companyId`,`externalReferenceCode`),
  KEY `IX_D89CE7B9` (`active_`,`objectActionExecutorKey`),
  KEY `IX_E3B248CA` (`active_`,`objectActionTriggerKey`,`companyId`),
  KEY `IX_2B979E5C` (`objectDefinitionId`,`active_`,`objectActionTriggerKey`,`name`),
  KEY `IX_E817201B` (`objectDefinitionId`,`name`),
  KEY `IX_570E3859` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ObjectDefinition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObjectDefinition` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectDefinitionId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `accountERObjectFieldId` bigint DEFAULT NULL,
  `descriptionObjectFieldId` bigint DEFAULT NULL,
  `objectFolderId` bigint DEFAULT NULL,
  `rootObjectDefinitionId` bigint DEFAULT NULL,
  `titleObjectFieldId` bigint DEFAULT NULL,
  `accountEntryRestricted` tinyint DEFAULT NULL,
  `active_` tinyint DEFAULT NULL,
  `className` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dbTableName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `enableCategorization` tinyint DEFAULT NULL,
  `enableComments` tinyint DEFAULT NULL,
  `enableFriendlyURLCustomization` tinyint DEFAULT NULL,
  `enableIndexSearch` tinyint DEFAULT NULL,
  `enableLocalization` tinyint DEFAULT NULL,
  `enableObjectEntryDraft` tinyint DEFAULT NULL,
  `enableObjectEntryHistory` tinyint DEFAULT NULL,
  `label` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `modifiable` tinyint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `panelAppOrder` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `panelCategoryKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pkObjectFieldDBColumnName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pkObjectFieldName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pluralLabel` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `portlet` tinyint DEFAULT NULL,
  `scope` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `storageType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `system_` tinyint DEFAULT NULL,
  `version` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`objectDefinitionId`),
  UNIQUE KEY `IX_F861636D` (`companyId`,`externalReferenceCode`),
  KEY `IX_2B2CA94C` (`accountEntryRestricted`),
  KEY `IX_2A008543` (`companyId`,`className`),
  KEY `IX_3E56F38F` (`companyId`,`name`),
  KEY `IX_66A8EEB3` (`companyId`,`rootObjectDefinitionId`),
  KEY `IX_7D686D13` (`companyId`,`status`,`active_`),
  KEY `IX_12BECBE8` (`companyId`,`system_`,`modifiable`),
  KEY `IX_F8B95773` (`companyId`,`system_`,`status`,`active_`),
  KEY `IX_86E0480A` (`companyId`,`userId`),
  KEY `IX_8D232754` (`objectFolderId`),
  KEY `IX_55C39BCE` (`system_`,`status`),
  KEY `IX_7B61F95C` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ObjectEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObjectEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `objectDefinitionId` bigint DEFAULT NULL,
  `rootObjectEntryId` bigint DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`objectEntryId`),
  UNIQUE KEY `IX_28B2B723` (`groupId`,`uuid_`),
  UNIQUE KEY `IX_E60FE3FC` (`groupId`,`externalReferenceCode`(255),`companyId`),
  UNIQUE KEY `IX_5979B105` (`objectDefinitionId`,`externalReferenceCode`(255),`companyId`),
  KEY `IX_622DB416` (`objectDefinitionId`,`groupId`,`status`),
  KEY `IX_A388E5A0` (`objectDefinitionId`,`status`),
  KEY `IX_68B7FB2` (`objectDefinitionId`,`userId`,`createDate`),
  KEY `IX_BD205C3B` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ObjectField`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObjectField` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectFieldId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `listTypeDefinitionId` bigint DEFAULT NULL,
  `objectDefinitionId` bigint DEFAULT NULL,
  `businessType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dbColumnName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dbTableName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dbType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `indexed` tinyint DEFAULT NULL,
  `indexedAsKeyword` tinyint DEFAULT NULL,
  `indexedLanguageId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `label` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `localized` tinyint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `readOnly` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `readOnlyConditionExpression` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `relationshipType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `required` tinyint DEFAULT NULL,
  `state_` tinyint DEFAULT NULL,
  `system_` tinyint DEFAULT NULL,
  PRIMARY KEY (`objectFieldId`),
  UNIQUE KEY `IX_B0716ED7` (`objectDefinitionId`,`companyId`,`externalReferenceCode`),
  KEY `IX_EAECE0E1` (`companyId`,`userId`),
  KEY `IX_6DCE835D` (`listTypeDefinitionId`,`state_`),
  KEY `IX_87111650` (`objectDefinitionId`,`businessType`),
  KEY `IX_5DDCF209` (`objectDefinitionId`,`dbTableName`),
  KEY `IX_52AAA62B` (`objectDefinitionId`,`indexed`,`dbType`),
  KEY `IX_2D0537E9` (`objectDefinitionId`,`localized`),
  KEY `IX_A59C5981` (`objectDefinitionId`,`name`),
  KEY `IX_4A69C63E` (`objectDefinitionId`,`system_`),
  KEY `IX_FBA3DCB3` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ObjectFieldSetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObjectFieldSetting` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectFieldSettingId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `objectFieldId` bigint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`objectFieldSettingId`),
  UNIQUE KEY `IX_BB322D4A` (`objectFieldId`,`name`),
  KEY `IX_66E899D9` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ObjectFilter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObjectFilter` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectFilterId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `objectFieldId` bigint DEFAULT NULL,
  `filterBy` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filterType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `json` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`objectFilterId`),
  KEY `IX_B3C95F49` (`objectFieldId`),
  KEY `IX_444AB557` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ObjectFolder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObjectFolder` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectFolderId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `label` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`objectFolderId`),
  UNIQUE KEY `IX_677F9088` (`companyId`,`externalReferenceCode`),
  KEY `IX_8FBAE114` (`companyId`,`name`),
  KEY `IX_14631921` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ObjectFolderItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObjectFolderItem` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectFolderItemId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `objectDefinitionId` bigint DEFAULT NULL,
  `objectFolderId` bigint DEFAULT NULL,
  `positionX` int DEFAULT NULL,
  `positionY` int DEFAULT NULL,
  PRIMARY KEY (`objectFolderItemId`),
  UNIQUE KEY `IX_61EBCE03` (`objectDefinitionId`,`objectFolderId`),
  KEY `IX_F9E61F22` (`objectFolderId`),
  KEY `IX_880861CE` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ObjectLayout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObjectLayout` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectLayoutId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `objectDefinitionId` bigint DEFAULT NULL,
  `defaultObjectLayout` tinyint DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`objectLayoutId`),
  KEY `IX_CE888CFD` (`defaultObjectLayout`,`companyId`),
  KEY `IX_FD0CCE8A` (`objectDefinitionId`,`defaultObjectLayout`),
  KEY `IX_7D8E0DE5` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ObjectLayoutBox`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObjectLayoutBox` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectLayoutBoxId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `objectLayoutTabId` bigint DEFAULT NULL,
  `collapsable` tinyint DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `priority` int DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`objectLayoutBoxId`),
  KEY `IX_5F97F7CF` (`objectLayoutTabId`),
  KEY `IX_356E03CC` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ObjectLayoutColumn`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObjectLayoutColumn` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectLayoutColumnId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `objectFieldId` bigint DEFAULT NULL,
  `objectLayoutRowId` bigint DEFAULT NULL,
  `priority` int DEFAULT NULL,
  `size_` int DEFAULT NULL,
  PRIMARY KEY (`objectLayoutColumnId`),
  KEY `IX_E992BFE1` (`objectFieldId`),
  KEY `IX_46CE5537` (`objectLayoutRowId`),
  KEY `IX_EC6A2DEF` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ObjectLayoutRow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObjectLayoutRow` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectLayoutRowId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `objectLayoutBoxId` bigint DEFAULT NULL,
  `priority` int DEFAULT NULL,
  PRIMARY KEY (`objectLayoutRowId`),
  KEY `IX_FA14DE56` (`objectLayoutBoxId`),
  KEY `IX_BC3EE89D` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ObjectLayoutTab`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObjectLayoutTab` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectLayoutTabId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `objectLayoutId` bigint DEFAULT NULL,
  `objectRelationshipId` bigint DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `priority` int DEFAULT NULL,
  PRIMARY KEY (`objectLayoutTabId`),
  KEY `IX_F01F1EEA` (`objectLayoutId`),
  KEY `IX_4CC508B8` (`objectRelationshipId`),
  KEY `IX_9D1A2542` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ObjectRelationship`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObjectRelationship` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectRelationshipId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `objectDefinitionId1` bigint DEFAULT NULL,
  `objectDefinitionId2` bigint DEFAULT NULL,
  `objectFieldId2` bigint DEFAULT NULL,
  `parameterObjectFieldId` bigint DEFAULT NULL,
  `deletionType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dbTableName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `edge` tinyint DEFAULT NULL,
  `label` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reverse` tinyint DEFAULT NULL,
  `system_` tinyint DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`objectRelationshipId`),
  KEY `IX_44505405` (`companyId`,`userId`),
  KEY `IX_9FD90360` (`externalReferenceCode`),
  KEY `IX_97E37468` (`objectDefinitionId1`,`edge`),
  KEY `IX_A71785B6` (`objectDefinitionId1`,`name`),
  KEY `IX_C44DA840` (`objectDefinitionId1`,`objectDefinitionId2`,`reverse`,`type_`,`name`),
  KEY `IX_FE6B0156` (`objectDefinitionId1`,`objectDefinitionId2`,`type_`,`name`),
  KEY `IX_6FD91117` (`objectDefinitionId1`,`reverse`,`deletionType`),
  KEY `IX_EA05FD3A` (`objectDefinitionId1`,`reverse`,`type_`),
  KEY `IX_2C27E369` (`objectDefinitionId2`,`edge`),
  KEY `IX_B7B05EFB` (`objectDefinitionId2`,`reverse`,`type_`),
  KEY `IX_F1DC092D` (`objectFieldId2`),
  KEY `IX_820C98BE` (`parameterObjectFieldId`),
  KEY `IX_8B817F36` (`reverse`,`dbTableName`),
  KEY `IX_E95FE5D7` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ObjectState`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObjectState` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectStateId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `listTypeEntryId` bigint DEFAULT NULL,
  `objectStateFlowId` bigint DEFAULT NULL,
  PRIMARY KEY (`objectStateId`),
  KEY `IX_C34F0F9E` (`listTypeEntryId`,`objectStateFlowId`),
  KEY `IX_F9D4BA53` (`objectStateFlowId`),
  KEY `IX_3030D2FC` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ObjectStateFlow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObjectStateFlow` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectStateFlowId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `objectFieldId` bigint DEFAULT NULL,
  PRIMARY KEY (`objectStateFlowId`),
  KEY `IX_AE828160` (`objectFieldId`),
  KEY `IX_8316DE6E` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ObjectStateTransition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObjectStateTransition` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectStateTransitionId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `objectStateFlowId` bigint DEFAULT NULL,
  `sourceObjectStateId` bigint DEFAULT NULL,
  `targetObjectStateId` bigint DEFAULT NULL,
  PRIMARY KEY (`objectStateTransitionId`),
  KEY `IX_DB56B27E` (`objectStateFlowId`),
  KEY `IX_9C3FAB55` (`sourceObjectStateId`),
  KEY `IX_FB9AC71F` (`targetObjectStateId`),
  KEY `IX_5E1D73A7` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ObjectValidationRule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObjectValidationRule` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectValidationRuleId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `objectDefinitionId` bigint DEFAULT NULL,
  `active_` tinyint DEFAULT NULL,
  `engine` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `errorLabel` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `outputType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `script` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `system_` tinyint DEFAULT NULL,
  PRIMARY KEY (`objectValidationRuleId`),
  UNIQUE KEY `IX_88476606` (`objectDefinitionId`,`externalReferenceCode`,`companyId`),
  KEY `IX_23EC0B65` (`active_`,`engine`),
  KEY `IX_C476B36E` (`objectDefinitionId`,`active_`),
  KEY `IX_EE533031` (`objectDefinitionId`,`engine`),
  KEY `IX_465D010A` (`objectDefinitionId`,`outputType`),
  KEY `IX_ADDDA15A` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ObjectValidationRuleSetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObjectValidationRuleSetting` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectValidationRuleSettingId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `objectValidationRuleId` bigint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `value` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`objectValidationRuleSettingId`),
  UNIQUE KEY `IX_7FCFA51D` (`objectValidationRuleId`,`name`,`value`),
  KEY `IX_76851E60` (`name`,`value`),
  KEY `IX_9CCE9B52` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ObjectView`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObjectView` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectViewId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `objectDefinitionId` bigint DEFAULT NULL,
  `defaultObjectView` tinyint DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`objectViewId`),
  KEY `IX_6AF6C9EA` (`objectDefinitionId`,`defaultObjectView`),
  KEY `IX_877B3D0A` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ObjectViewColumn`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObjectViewColumn` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectViewColumnId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `objectViewId` bigint DEFAULT NULL,
  `label` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `objectFieldName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` int DEFAULT NULL,
  PRIMARY KEY (`objectViewColumnId`),
  KEY `IX_B7B14E3` (`objectViewId`,`objectFieldName`),
  KEY `IX_FABEAD54` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ObjectViewFilterColumn`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObjectViewFilterColumn` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectViewFilterColumnId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `objectViewId` bigint DEFAULT NULL,
  `filterType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `objectFieldName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`objectViewFilterColumnId`),
  KEY `IX_B8CD6D4B` (`objectViewId`,`objectFieldName`),
  KEY `IX_A8A1BDBC` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ObjectViewSortColumn`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ObjectViewSortColumn` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectViewSortColumnId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `objectViewId` bigint DEFAULT NULL,
  `objectFieldName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` int DEFAULT NULL,
  `sortOrder` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`objectViewSortColumnId`),
  KEY `IX_55C88365` (`objectViewId`,`objectFieldName`),
  KEY `IX_314101D6` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `OpenIdConnectSession`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OpenIdConnectSession` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `openIdConnectSessionId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `accessToken` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `accessTokenExpirationDate` datetime(6) DEFAULT NULL,
  `authServerWellKnownURI` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clientId` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `idToken` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `refreshToken` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`openIdConnectSessionId`),
  UNIQUE KEY `IX_60980B41` (`userId`,`authServerWellKnownURI`(255),`clientId`(255)),
  KEY `IX_396C5BCB` (`accessTokenExpirationDate`),
  KEY `IX_AE077141` (`authServerWellKnownURI`(255),`clientId`(255),`companyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `OrgLabor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OrgLabor` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `orgLaborId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `organizationId` bigint DEFAULT NULL,
  `listTypeId` bigint DEFAULT NULL,
  `sunOpen` int DEFAULT NULL,
  `sunClose` int DEFAULT NULL,
  `monOpen` int DEFAULT NULL,
  `monClose` int DEFAULT NULL,
  `tueOpen` int DEFAULT NULL,
  `tueClose` int DEFAULT NULL,
  `wedOpen` int DEFAULT NULL,
  `wedClose` int DEFAULT NULL,
  `thuOpen` int DEFAULT NULL,
  `thuClose` int DEFAULT NULL,
  `friOpen` int DEFAULT NULL,
  `friClose` int DEFAULT NULL,
  `satOpen` int DEFAULT NULL,
  `satClose` int DEFAULT NULL,
  PRIMARY KEY (`orgLaborId`),
  KEY `IX_6AF0D434` (`organizationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Organization_`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Organization_` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `organizationId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `parentOrganizationId` bigint DEFAULT NULL,
  `treePath` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recursable` tinyint DEFAULT NULL,
  `regionId` bigint DEFAULT NULL,
  `countryId` bigint DEFAULT NULL,
  `statusListTypeId` bigint DEFAULT NULL,
  `comments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `logoId` bigint DEFAULT NULL,
  PRIMARY KEY (`organizationId`,`ctCollectionId`),
  UNIQUE KEY `IX_87E47DA9` (`companyId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_F1E40A53` (`companyId`,`name`,`ctCollectionId`),
  KEY `IX_4BCBAB21` (`companyId`,`name`,`parentOrganizationId`),
  KEY `IX_418E4522` (`companyId`,`parentOrganizationId`),
  KEY `IX_396D6B42` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Organization_x_92605711380992`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Organization_x_92605711380992` (
  `organizationId` bigint NOT NULL,
  PRIMARY KEY (`organizationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `PLOEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PLOEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ploEntryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `key_` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `languageId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`ploEntryId`),
  UNIQUE KEY `IX_FD42DFE` (`companyId`,`key_`(255),`languageId`),
  KEY `IX_5EFCB06A` (`companyId`,`languageId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `PasswordPolicy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PasswordPolicy` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passwordPolicyId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `defaultPolicy` tinyint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `changeable` tinyint DEFAULT NULL,
  `changeRequired` tinyint DEFAULT NULL,
  `minAge` bigint DEFAULT NULL,
  `checkSyntax` tinyint DEFAULT NULL,
  `allowDictionaryWords` tinyint DEFAULT NULL,
  `minAlphanumeric` int DEFAULT NULL,
  `minLength` int DEFAULT NULL,
  `minLowerCase` int DEFAULT NULL,
  `minNumbers` int DEFAULT NULL,
  `minSymbols` int DEFAULT NULL,
  `minUpperCase` int DEFAULT NULL,
  `regex` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `history` tinyint DEFAULT NULL,
  `historyCount` int DEFAULT NULL,
  `expireable` tinyint DEFAULT NULL,
  `maxAge` bigint DEFAULT NULL,
  `warningTime` bigint DEFAULT NULL,
  `graceLimit` int DEFAULT NULL,
  `lockout` tinyint DEFAULT NULL,
  `maxFailure` int DEFAULT NULL,
  `lockoutDuration` bigint DEFAULT NULL,
  `requireUnlock` tinyint DEFAULT NULL,
  `resetFailureCount` bigint DEFAULT NULL,
  `resetTicketMaxAge` bigint DEFAULT NULL,
  PRIMARY KEY (`passwordPolicyId`),
  UNIQUE KEY `IX_3FBFA9F4` (`companyId`,`name`),
  KEY `IX_2C1142E` (`companyId`,`defaultPolicy`),
  KEY `IX_51437A01` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `PasswordPolicyRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PasswordPolicyRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `passwordPolicyRelId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `passwordPolicyId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  PRIMARY KEY (`passwordPolicyRelId`),
  UNIQUE KEY `IX_C3A17327` (`classNameId`,`classPK`),
  KEY `IX_CD25266E` (`passwordPolicyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `PasswordTracker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PasswordTracker` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `passwordTrackerId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `password_` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`passwordTrackerId`),
  KEY `IX_326F75BD` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Phone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Phone` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phoneId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `number_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `extension` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `listTypeId` bigint DEFAULT NULL,
  `primary_` tinyint DEFAULT NULL,
  PRIMARY KEY (`phoneId`,`ctCollectionId`),
  UNIQUE KEY `IX_DC0DF107` (`companyId`,`externalReferenceCode`,`ctCollectionId`),
  KEY `IX_812CE07A` (`companyId`,`classNameId`,`classPK`,`primary_`),
  KEY `IX_F202B9CE` (`userId`),
  KEY `IX_EA6245A0` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `PluginSetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PluginSetting` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `pluginSettingId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `pluginId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pluginType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `roles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `active_` tinyint DEFAULT NULL,
  PRIMARY KEY (`pluginSettingId`),
  UNIQUE KEY `IX_7171B2E8` (`companyId`,`pluginId`,`pluginType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `PortalPreferenceValue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PortalPreferenceValue` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `portalPreferenceValueId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `portalPreferencesId` bigint DEFAULT NULL,
  `index_` int DEFAULT NULL,
  `key_` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `largeValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `namespace` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `smallValue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`portalPreferenceValueId`),
  UNIQUE KEY `IX_D5E35599` (`portalPreferencesId`,`namespace`,`key_`(255),`index_`),
  KEY `IX_737DBC36` (`portalPreferencesId`,`namespace`,`key_`(255),`smallValue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `PortalPreferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PortalPreferences` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `portalPreferencesId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `ownerId` bigint DEFAULT NULL,
  `ownerType` int DEFAULT NULL,
  PRIMARY KEY (`portalPreferencesId`),
  KEY `IX_D1846D13` (`ownerType`,`ownerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Portlet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Portlet` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `id_` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `portletId` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `roles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `active_` tinyint DEFAULT NULL,
  PRIMARY KEY (`id_`),
  UNIQUE KEY `IX_12B5E51D` (`companyId`,`portletId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `PortletItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PortletItem` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `portletItemId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `portletId` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  PRIMARY KEY (`portletItemId`),
  KEY `IX_C6246ECD` (`groupId`,`classNameId`,`portletId`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `PortletPreferenceValue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PortletPreferenceValue` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `portletPreferenceValueId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `portletPreferencesId` bigint DEFAULT NULL,
  `index_` int DEFAULT NULL,
  `largeValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `readOnly` tinyint DEFAULT NULL,
  `smallValue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`portletPreferenceValueId`,`ctCollectionId`),
  UNIQUE KEY `IX_B517784D` (`portletPreferencesId`,`name`,`index_`,`ctCollectionId`),
  KEY `IX_EE8C5489` (`name`,`smallValue`,`companyId`),
  KEY `IX_8E75AB8C` (`portletPreferencesId`,`name`,`smallValue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `PortletPreferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PortletPreferences` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `portletPreferencesId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `ownerId` bigint DEFAULT NULL,
  `ownerType` int DEFAULT NULL,
  `plid` bigint DEFAULT NULL,
  `portletId` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`portletPreferencesId`,`ctCollectionId`),
  UNIQUE KEY `IX_8CCEB8CB` (`portletId`,`ownerType`,`ownerId`,`plid`,`ctCollectionId`),
  KEY `IX_3EAB5A5A` (`ownerId`),
  KEY `IX_6DD4B410` (`ownerType`,`ownerId`,`plid`),
  KEY `IX_F15C1C4F` (`plid`),
  KEY `IX_CEA05B46` (`portletId`,`ownerType`,`ownerId`,`companyId`),
  KEY `IX_EF5FCC07` (`portletId`,`ownerType`,`plid`),
  KEY `IX_8DCFD52C` (`portletId`,`plid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `PushNotificationsDevice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PushNotificationsDevice` (
  `pushNotificationsDeviceId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `platform` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`pushNotificationsDeviceId`),
  UNIQUE KEY `IX_2F3EDC9F` (`token`(255)),
  KEY `IX_2FBF066B` (`userId`,`platform`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `QUARTZ_BLOB_TRIGGERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `QUARTZ_BLOB_TRIGGERS` (
  `SCHED_NAME` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `TRIGGER_NAME` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `TRIGGER_GROUP` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `BLOB_DATA` longblob,
  PRIMARY KEY (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `QUARTZ_CALENDARS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `QUARTZ_CALENDARS` (
  `SCHED_NAME` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `CALENDAR_NAME` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `CALENDAR` longblob NOT NULL,
  PRIMARY KEY (`SCHED_NAME`,`CALENDAR_NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `QUARTZ_CRON_TRIGGERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `QUARTZ_CRON_TRIGGERS` (
  `SCHED_NAME` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `TRIGGER_NAME` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `TRIGGER_GROUP` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `CRON_EXPRESSION` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `TIME_ZONE_ID` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `QUARTZ_FIRED_TRIGGERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `QUARTZ_FIRED_TRIGGERS` (
  `SCHED_NAME` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ENTRY_ID` varchar(95) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `TRIGGER_NAME` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `TRIGGER_GROUP` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `INSTANCE_NAME` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `FIRED_TIME` bigint NOT NULL,
  `PRIORITY` int NOT NULL,
  `STATE` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `JOB_NAME` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `JOB_GROUP` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `IS_NONCONCURRENT` tinyint DEFAULT NULL,
  `REQUESTS_RECOVERY` tinyint DEFAULT NULL,
  PRIMARY KEY (`SCHED_NAME`,`ENTRY_ID`),
  KEY `IX_339E078M` (`SCHED_NAME`,`INSTANCE_NAME`,`REQUESTS_RECOVERY`),
  KEY `IX_BC2F03B0` (`SCHED_NAME`,`JOB_GROUP`),
  KEY `IX_5005E3AF` (`SCHED_NAME`,`JOB_NAME`,`JOB_GROUP`),
  KEY `IX_4BD722BM` (`SCHED_NAME`,`TRIGGER_GROUP`),
  KEY `IX_BE3835E5` (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `QUARTZ_JOB_DETAILS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `QUARTZ_JOB_DETAILS` (
  `SCHED_NAME` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `JOB_NAME` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `JOB_GROUP` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `DESCRIPTION` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `JOB_CLASS_NAME` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `IS_DURABLE` tinyint NOT NULL,
  `IS_NONCONCURRENT` tinyint NOT NULL,
  `IS_UPDATE_DATA` tinyint NOT NULL,
  `REQUESTS_RECOVERY` tinyint NOT NULL,
  `JOB_DATA` longblob,
  PRIMARY KEY (`SCHED_NAME`,`JOB_NAME`,`JOB_GROUP`),
  KEY `IX_88328984` (`SCHED_NAME`,`JOB_GROUP`),
  KEY `IX_779BCA37` (`SCHED_NAME`,`REQUESTS_RECOVERY`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `QUARTZ_LOCKS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `QUARTZ_LOCKS` (
  `SCHED_NAME` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `LOCK_NAME` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`SCHED_NAME`,`LOCK_NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `QUARTZ_PAUSED_TRIGGER_GRPS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `QUARTZ_PAUSED_TRIGGER_GRPS` (
  `SCHED_NAME` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `TRIGGER_GROUP` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`SCHED_NAME`,`TRIGGER_GROUP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `QUARTZ_SCHEDULER_STATE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `QUARTZ_SCHEDULER_STATE` (
  `SCHED_NAME` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `INSTANCE_NAME` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `LAST_CHECKIN_TIME` bigint NOT NULL,
  `CHECKIN_INTERVAL` bigint NOT NULL,
  PRIMARY KEY (`SCHED_NAME`,`INSTANCE_NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `QUARTZ_SIMPLE_TRIGGERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `QUARTZ_SIMPLE_TRIGGERS` (
  `SCHED_NAME` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `TRIGGER_NAME` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `TRIGGER_GROUP` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `REPEAT_COUNT` bigint NOT NULL,
  `REPEAT_INTERVAL` bigint NOT NULL,
  `TIMES_TRIGGERED` bigint NOT NULL,
  PRIMARY KEY (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `QUARTZ_SIMPROP_TRIGGERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `QUARTZ_SIMPROP_TRIGGERS` (
  `SCHED_NAME` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `TRIGGER_NAME` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `TRIGGER_GROUP` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `STR_PROP_1` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `STR_PROP_2` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `STR_PROP_3` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `INT_PROP_1` int DEFAULT NULL,
  `INT_PROP_2` int DEFAULT NULL,
  `LONG_PROP_1` bigint DEFAULT NULL,
  `LONG_PROP_2` bigint DEFAULT NULL,
  `DEC_PROP_1` decimal(13,4) DEFAULT NULL,
  `DEC_PROP_2` decimal(13,4) DEFAULT NULL,
  `BOOL_PROP_1` tinyint DEFAULT NULL,
  `BOOL_PROP_2` tinyint DEFAULT NULL,
  PRIMARY KEY (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `QUARTZ_TRIGGERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `QUARTZ_TRIGGERS` (
  `SCHED_NAME` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `TRIGGER_NAME` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `TRIGGER_GROUP` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `JOB_NAME` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `JOB_GROUP` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `DESCRIPTION` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NEXT_FIRE_TIME` bigint DEFAULT NULL,
  `PREV_FIRE_TIME` bigint DEFAULT NULL,
  `PRIORITY` int DEFAULT NULL,
  `TRIGGER_STATE` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `TRIGGER_TYPE` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `START_TIME` bigint NOT NULL,
  `END_TIME` bigint DEFAULT NULL,
  `CALENDAR_NAME` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MISFIRE_INSTR` int DEFAULT NULL,
  `JOB_DATA` longblob,
  PRIMARY KEY (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`),
  KEY `IX_CD7132D0` (`SCHED_NAME`,`CALENDAR_NAME`),
  KEY `IX_8AA50BE1` (`SCHED_NAME`,`JOB_GROUP`),
  KEY `IX_A85822A0` (`SCHED_NAME`,`JOB_NAME`,`JOB_GROUP`),
  KEY `IX_1F92813C` (`SCHED_NAME`,`NEXT_FIRE_TIME`,`MISFIRE_INSTR`),
  KEY `IX_F2DD7C7E` (`SCHED_NAME`,`NEXT_FIRE_TIME`,`TRIGGER_STATE`,`MISFIRE_INSTR`),
  KEY `IX_91CA7CCE` (`SCHED_NAME`,`TRIGGER_GROUP`,`NEXT_FIRE_TIME`,`TRIGGER_STATE`,`MISFIRE_INSTR`),
  KEY `IX_D219AFDE` (`SCHED_NAME`,`TRIGGER_GROUP`,`TRIGGER_STATE`),
  KEY `IX_99108B6E` (`SCHED_NAME`,`TRIGGER_STATE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `RatingsEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RatingsEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `score` double DEFAULT NULL,
  PRIMARY KEY (`entryId`,`ctCollectionId`),
  UNIQUE KEY `IX_119FF2EF` (`classNameId`,`classPK`,`userId`,`ctCollectionId`),
  KEY `IX_A1A8CB8B` (`classNameId`,`classPK`,`score`),
  KEY `IX_C34DEAF2` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `RatingsStats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RatingsStats` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `statsId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `totalEntries` int DEFAULT NULL,
  `totalScore` double DEFAULT NULL,
  `averageScore` double DEFAULT NULL,
  PRIMARY KEY (`statsId`,`ctCollectionId`),
  UNIQUE KEY `IX_C286E0E2` (`classNameId`,`classPK`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ReadingTimeEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ReadingTimeEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `readingTimeEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `readingTime` bigint DEFAULT NULL,
  PRIMARY KEY (`readingTimeEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_12901B5E` (`groupId`,`ctCollectionId`,`classNameId`,`classPK`),
  UNIQUE KEY `IX_4FDED5F3` (`uuid_`,`groupId`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `RecentLayoutBranch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RecentLayoutBranch` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `recentLayoutBranchId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `layoutBranchId` bigint DEFAULT NULL,
  `layoutSetBranchId` bigint DEFAULT NULL,
  `plid` bigint DEFAULT NULL,
  PRIMARY KEY (`recentLayoutBranchId`),
  UNIQUE KEY `IX_C27D6369` (`userId`,`layoutSetBranchId`,`plid`),
  KEY `IX_B91F79BD` (`groupId`),
  KEY `IX_351E86E8` (`layoutBranchId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `RecentLayoutRevision`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RecentLayoutRevision` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `recentLayoutRevisionId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `layoutRevisionId` bigint DEFAULT NULL,
  `layoutSetBranchId` bigint DEFAULT NULL,
  `plid` bigint DEFAULT NULL,
  PRIMARY KEY (`recentLayoutRevisionId`),
  UNIQUE KEY `IX_4C600BD0` (`userId`,`layoutSetBranchId`,`plid`),
  KEY `IX_8D8A2724` (`groupId`),
  KEY `IX_DA0788DA` (`layoutRevisionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `RecentLayoutSetBranch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RecentLayoutSetBranch` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `recentLayoutSetBranchId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `layoutSetBranchId` bigint DEFAULT NULL,
  `layoutSetId` bigint DEFAULT NULL,
  PRIMARY KEY (`recentLayoutSetBranchId`),
  UNIQUE KEY `IX_4654D204` (`userId`,`layoutSetId`),
  KEY `IX_711995A5` (`groupId`),
  KEY `IX_23FF0700` (`layoutSetBranchId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `RedirectEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RedirectEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `redirectEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `destinationURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `expirationDate` datetime(6) DEFAULT NULL,
  `lastOccurrenceDate` datetime(6) DEFAULT NULL,
  `permanent_` tinyint DEFAULT NULL,
  `sourceURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`redirectEntryId`),
  UNIQUE KEY `IX_E33009E6` (`groupId`,`uuid_`),
  UNIQUE KEY `IX_5040C136` (`groupId`,`sourceURL`(255)),
  KEY `IX_106FBFC3` (`groupId`,`destinationURL`(255)),
  KEY `IX_90CD5218` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `RedirectNotFoundEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RedirectNotFoundEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `redirectNotFoundEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `ignored` tinyint DEFAULT NULL,
  `url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`redirectNotFoundEntryId`),
  UNIQUE KEY `IX_84671762` (`groupId`,`url`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Region`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Region` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `defaultLanguageId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `regionId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `countryId` bigint DEFAULT NULL,
  `active_` tinyint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` double DEFAULT NULL,
  `regionCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`regionId`,`ctCollectionId`),
  UNIQUE KEY `IX_183BFDBA` (`countryId`,`regionCode`,`ctCollectionId`),
  KEY `IX_2D9A426F` (`active_`),
  KEY `IX_11FB3E42` (`countryId`,`active_`),
  KEY `IX_48A89E9A` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `RegionLocalization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RegionLocalization` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `regionLocalizationId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `regionId` bigint DEFAULT NULL,
  `languageId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`regionLocalizationId`,`ctCollectionId`),
  UNIQUE KEY `IX_982329B` (`regionId`,`languageId`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Release_`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Release_` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `releaseId` bigint NOT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `servletContextName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `schemaVersion` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `buildNumber` int DEFAULT NULL,
  `buildDate` datetime(6) DEFAULT NULL,
  `verified` tinyint DEFAULT NULL,
  `state_` int DEFAULT NULL,
  `testString` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`releaseId`),
  UNIQUE KEY `IX_8BD6BCA7` (`servletContextName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `RememberMeToken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RememberMeToken` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `rememberMeTokenId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`rememberMeTokenId`),
  KEY `IX_D4C6FBCB` (`expirationDate`),
  KEY `IX_291F58D4` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Repository`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Repository` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `repositoryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `portletId` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `typeSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `dlFolderId` bigint DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`repositoryId`,`ctCollectionId`),
  UNIQUE KEY `IX_1F8735E5` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_470608AE` (`groupId`,`ctCollectionId`,`name`,`portletId`),
  UNIQUE KEY `IX_E9E7CCD8` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_74C17B04` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `RepositoryEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RepositoryEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `repositoryEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `repositoryId` bigint DEFAULT NULL,
  `mappedId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manualCheckInRequired` tinyint DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`repositoryEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_B43A3F67` (`repositoryId`,`ctCollectionId`,`mappedId`),
  UNIQUE KEY `IX_239165C6` (`uuid_`,`ctCollectionId`,`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ResourceAction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ResourceAction` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `resourceActionId` bigint NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `actionId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bitwiseValue` bigint DEFAULT NULL,
  PRIMARY KEY (`resourceActionId`),
  UNIQUE KEY `IX_EDB9986E` (`name`,`actionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ResourcePermission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ResourcePermission` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `resourcePermissionId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scope` int DEFAULT NULL,
  `primKey` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primKeyId` bigint DEFAULT NULL,
  `roleId` bigint DEFAULT NULL,
  `ownerId` bigint DEFAULT NULL,
  `actionIds` bigint DEFAULT NULL,
  `viewActionId` tinyint DEFAULT NULL,
  PRIMARY KEY (`resourcePermissionId`,`ctCollectionId`),
  UNIQUE KEY `IX_FD2D2D64` (`companyId`,`scope`,`name`,`roleId`,`primKey`,`ctCollectionId`),
  KEY `IX_26284944` (`companyId`,`primKey`),
  KEY `IX_A24F62CB` (`companyId`,`scope`,`name`,`primKey`),
  KEY `IX_D8997757` (`companyId`,`scope`,`name`,`roleId`,`viewActionId`,`primKeyId`),
  KEY `IX_F6BAE86A` (`companyId`,`scope`,`primKey`),
  KEY `IX_D5F1E2A2` (`name`),
  KEY `IX_A37A0588` (`roleId`),
  KEY `IX_F4555981` (`scope`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Role_`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Role_` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `roleId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type_` int DEFAULT NULL,
  `subtype` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`roleId`,`ctCollectionId`),
  UNIQUE KEY `IX_CC85CC2C` (`companyId`,`ctCollectionId`,`classNameId`,`classPK`),
  UNIQUE KEY `IX_C849CE46` (`companyId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_D11C3796` (`companyId`,`ctCollectionId`,`name`),
  KEY `IX_F436EC8E` (`name`),
  KEY `IX_5EB4E2FB` (`subtype`),
  KEY `IX_CBE204` (`type_`,`subtype`),
  KEY `IX_26DB26C5` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `SAPEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SAPEntry` (
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sapEntryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `allowedServiceSignatures` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `defaultSAPEntry` tinyint DEFAULT NULL,
  `enabled` tinyint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`sapEntryId`),
  KEY `IX_6D669D6F` (`companyId`,`defaultSAPEntry`),
  KEY `IX_90740311` (`companyId`,`name`),
  KEY `IX_DE62235E` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `SavedContentEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SavedContentEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `savedContentEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  PRIMARY KEY (`savedContentEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_A4BA5449` (`classNameId`,`userId`,`classPK`,`ctCollectionId`,`companyId`),
  UNIQUE KEY `IX_3C86B2DD` (`groupId`,`classNameId`,`userId`,`classPK`,`ctCollectionId`),
  UNIQUE KEY `IX_8168C76E` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_85EFE02D` (`classNameId`,`classPK`,`companyId`),
  KEY `IX_5F4B6779` (`groupId`,`classNameId`,`classPK`),
  KEY `IX_26BC5C5E` (`groupId`,`userId`),
  KEY `IX_39920D80` (`userId`),
  KEY `IX_AAA0B3AE` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `SegmentsEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SegmentsEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `segmentsEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `segmentsEntryKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `active_` tinyint DEFAULT NULL,
  `criteria` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `source` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`segmentsEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_7DDC7831` (`groupId`,`ctCollectionId`,`segmentsEntryKey`),
  UNIQUE KEY `IX_78D59000` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_F6225631` (`active_`),
  KEY `IX_175FC150` (`companyId`),
  KEY `IX_2E0C3F77` (`groupId`,`active_`),
  KEY `IX_1EDBDAA1` (`groupId`,`source`),
  KEY `IX_90AB04A7` (`source`),
  KEY `IX_8046BADC` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `SegmentsEntryRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SegmentsEntryRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `segmentsEntryRelId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `segmentsEntryId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  PRIMARY KEY (`segmentsEntryRelId`,`ctCollectionId`),
  UNIQUE KEY `IX_E418FCB9` (`classNameId`,`classPK`,`segmentsEntryId`,`ctCollectionId`),
  KEY `IX_64CBABA8` (`classNameId`,`classPK`,`groupId`),
  KEY `IX_AB286250` (`segmentsEntryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `SegmentsEntryRole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SegmentsEntryRole` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `segmentsEntryRoleId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `segmentsEntryId` bigint DEFAULT NULL,
  `roleId` bigint DEFAULT NULL,
  PRIMARY KEY (`segmentsEntryRoleId`,`ctCollectionId`),
  UNIQUE KEY `IX_2876B1F2` (`segmentsEntryId`,`roleId`,`ctCollectionId`),
  KEY `IX_65648B53` (`roleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `SegmentsExperience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SegmentsExperience` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `segmentsExperienceId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `segmentsEntryId` bigint DEFAULT NULL,
  `segmentsExperienceKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plid` bigint DEFAULT NULL,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `priority` int DEFAULT NULL,
  `active_` tinyint DEFAULT NULL,
  `typeSettings` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`segmentsExperienceId`,`ctCollectionId`),
  UNIQUE KEY `IX_3C2677C5` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_6C24C43C` (`groupId`,`ctCollectionId`,`uuid_`),
  UNIQUE KEY `IX_6E29AF1B` (`groupId`,`plid`,`ctCollectionId`,`priority`),
  UNIQUE KEY `IX_1877BBA2` (`groupId`,`plid`,`ctCollectionId`,`segmentsExperienceKey`),
  KEY `IX_EBCFE1C4` (`groupId`,`plid`,`active_`),
  KEY `IX_4EA4A03D` (`groupId`,`plid`,`priority`),
  KEY `IX_3A0FEF1` (`groupId`,`plid`,`segmentsEntryId`,`active_`),
  KEY `IX_E90B4ACD` (`segmentsEntryId`),
  KEY `IX_42071D24` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `SegmentsExperiment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SegmentsExperiment` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `segmentsExperimentId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `segmentsEntryId` bigint DEFAULT NULL,
  `segmentsExperienceId` bigint DEFAULT NULL,
  `segmentsExperimentKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plid` bigint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `typeSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`segmentsExperimentId`,`ctCollectionId`),
  UNIQUE KEY `IX_4516B4A9` (`groupId`,`ctCollectionId`,`segmentsExperienceId`,`plid`),
  UNIQUE KEY `IX_243B65ED` (`groupId`,`ctCollectionId`,`segmentsExperimentKey`),
  UNIQUE KEY `IX_451FEC8B` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_127B4FCF` (`segmentsExperimentKey`),
  KEY `IX_2701CFF1` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `SegmentsExperimentRel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SegmentsExperimentRel` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `segmentsExperimentRelId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `segmentsExperimentId` bigint DEFAULT NULL,
  `segmentsExperienceId` bigint DEFAULT NULL,
  `split` double DEFAULT NULL,
  PRIMARY KEY (`segmentsExperimentRelId`,`ctCollectionId`),
  UNIQUE KEY `IX_9EDCFAE5` (`segmentsExperimentId`,`segmentsExperienceId`,`ctCollectionId`),
  KEY `IX_A96BB95B` (`segmentsExperienceId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ServiceComponent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ServiceComponent` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `serviceComponentId` bigint NOT NULL,
  `buildNamespace` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `buildNumber` bigint DEFAULT NULL,
  `buildDate` bigint DEFAULT NULL,
  `data_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`serviceComponentId`),
  UNIQUE KEY `IX_4F0315B8` (`buildNamespace`,`buildNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `SharingEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SharingEntry` (
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sharingEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `toUserId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `shareable` tinyint DEFAULT NULL,
  `actionIds` bigint DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`sharingEntryId`),
  UNIQUE KEY `IX_E0D3AF7C` (`classNameId`,`toUserId`,`classPK`),
  UNIQUE KEY `IX_5EDE78D2` (`uuid_`,`groupId`),
  KEY `IX_1ED300B1` (`classNameId`,`classPK`),
  KEY `IX_8E0359AC` (`classNameId`,`userId`),
  KEY `IX_1E35B88D` (`expirationDate`),
  KEY `IX_F066C0CE` (`groupId`),
  KEY `IX_C024CFB1` (`toUserId`),
  KEY `IX_EA2FF796` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `SiteFriendlyURL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SiteFriendlyURL` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `siteFriendlyURLId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `friendlyURL` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `languageId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`siteFriendlyURLId`),
  UNIQUE KEY `IX_FF899B2F` (`companyId`,`friendlyURL`),
  UNIQUE KEY `IX_7A3B7A2C` (`companyId`,`groupId`,`languageId`),
  UNIQUE KEY `IX_82D4AAD9` (`uuid_`,`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `SiteNavigationMenu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SiteNavigationMenu` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `siteNavigationMenuId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` int DEFAULT NULL,
  `auto_` tinyint DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`siteNavigationMenuId`,`ctCollectionId`),
  UNIQUE KEY `IX_710D4B55` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_4EE39EA7` (`groupId`,`ctCollectionId`,`name`),
  UNIQUE KEY `IX_9BA6C248` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_68E2B208` (`companyId`),
  KEY `IX_1D786176` (`groupId`,`auto_`),
  KEY `IX_ECBADAC9` (`groupId`,`name`),
  KEY `IX_1125400B` (`groupId`,`type_`),
  KEY `IX_828EC794` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `SiteNavigationMenuItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SiteNavigationMenuItem` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `siteNavigationMenuItemId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `siteNavigationMenuId` bigint DEFAULT NULL,
  `parentSiteNavigationMenuItemId` bigint DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `typeSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `order_` int DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`siteNavigationMenuItemId`,`ctCollectionId`),
  UNIQUE KEY `IX_6542AAC8` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_CD998367` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_B88C2AB5` (`companyId`),
  KEY `IX_75495C39` (`parentSiteNavigationMenuItemId`),
  KEY `IX_9FA7003B` (`siteNavigationMenuId`,`name`),
  KEY `IX_2294C622` (`siteNavigationMenuId`,`parentSiteNavigationMenuItemId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `SocialActivity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SocialActivity` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `activityId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `createDate` bigint DEFAULT NULL,
  `activitySetId` bigint DEFAULT NULL,
  `mirrorActivityId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `parentClassNameId` bigint DEFAULT NULL,
  `parentClassPK` bigint DEFAULT NULL,
  `type_` int DEFAULT NULL,
  `extraData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `receiverUserId` bigint DEFAULT NULL,
  PRIMARY KEY (`activityId`,`ctCollectionId`),
  UNIQUE KEY `IX_7E6A9AAD` (`classNameId`,`classPK`,`groupId`,`userId`,`type_`,`receiverUserId`,`ctCollectionId`,`createDate`),
  KEY `IX_F542E9BC` (`activitySetId`),
  KEY `IX_85370BF4` (`classNameId`,`classPK`,`mirrorActivityId`),
  KEY `IX_D0E9029E` (`classNameId`,`classPK`,`type_`),
  KEY `IX_F885EA9C` (`classNameId`,`companyId`),
  KEY `IX_64B1BC66` (`companyId`),
  KEY `IX_2A2468` (`groupId`),
  KEY `IX_1271F25F` (`mirrorActivityId`),
  KEY `IX_121CA3CB` (`receiverUserId`),
  KEY `IX_3504B8BC` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `SocialActivityAchievement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SocialActivityAchievement` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `activityAchievementId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `createDate` bigint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `firstInGroup` tinyint DEFAULT NULL,
  PRIMARY KEY (`activityAchievementId`,`ctCollectionId`),
  UNIQUE KEY `IX_5ED94F08` (`groupId`,`userId`,`name`,`ctCollectionId`),
  KEY `IX_83E16F2F` (`groupId`,`firstInGroup`),
  KEY `IX_8F6408F0` (`groupId`,`name`),
  KEY `IX_AABC18E9` (`groupId`,`userId`,`firstInGroup`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `SocialActivityCounter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SocialActivityCounter` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `activityCounterId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ownerType` int DEFAULT NULL,
  `currentValue` int DEFAULT NULL,
  `totalValue` int DEFAULT NULL,
  `graceValue` int DEFAULT NULL,
  `startPeriod` int DEFAULT NULL,
  `endPeriod` int DEFAULT NULL,
  `active_` tinyint DEFAULT NULL,
  PRIMARY KEY (`activityCounterId`,`ctCollectionId`),
  UNIQUE KEY `IX_56195A6B` (`groupId`,`classNameId`,`classPK`,`ownerType`,`name`,`ctCollectionId`,`endPeriod`),
  UNIQUE KEY `IX_379AA3B2` (`groupId`,`classNameId`,`classPK`,`ownerType`,`name`,`ctCollectionId`,`startPeriod`),
  KEY `IX_A4B9A23B` (`classNameId`,`classPK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `SocialActivityLimit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SocialActivityLimit` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `activityLimitId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `activityType` int DEFAULT NULL,
  `activityCounterName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `value` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`activityLimitId`,`ctCollectionId`),
  UNIQUE KEY `IX_4A636E75` (`groupId`,`userId`,`classNameId`,`classPK`,`activityType`,`activityCounterName`,`ctCollectionId`),
  KEY `IX_B15863FA` (`classNameId`,`classPK`),
  KEY `IX_6F9EDE9F` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `SocialActivitySet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SocialActivitySet` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `activitySetId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `createDate` bigint DEFAULT NULL,
  `modifiedDate` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `type_` int DEFAULT NULL,
  `extraData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `activityCount` int DEFAULT NULL,
  PRIMARY KEY (`activitySetId`,`ctCollectionId`),
  KEY `IX_9E13F2DE` (`groupId`),
  KEY `IX_5D1FA9E` (`type_`,`classNameId`,`classPK`),
  KEY `IX_241D10A4` (`userId`,`type_`,`classNameId`,`classPK`),
  KEY `IX_6D0C8733` (`userId`,`type_`,`groupId`,`classNameId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `SocialActivitySetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SocialActivitySetting` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `activitySettingId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `activityType` int DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `value` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`activitySettingId`,`ctCollectionId`),
  KEY `IX_384788CD` (`groupId`,`activityType`),
  KEY `IX_D984AABA` (`groupId`,`classNameId`,`activityType`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `SocialRelation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SocialRelation` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `relationId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `createDate` bigint DEFAULT NULL,
  `userId1` bigint DEFAULT NULL,
  `userId2` bigint DEFAULT NULL,
  `type_` int DEFAULT NULL,
  PRIMARY KEY (`relationId`,`ctCollectionId`),
  UNIQUE KEY `IX_ECA579C5` (`type_`,`userId1`,`userId2`,`ctCollectionId`),
  KEY `IX_61171E99` (`companyId`),
  KEY `IX_5E1F07A2` (`type_`,`companyId`),
  KEY `IX_C91168D6` (`type_`,`userId2`),
  KEY `IX_B5C9C690` (`userId1`,`userId2`),
  KEY `IX_5A40D18D` (`userId2`),
  KEY `IX_F0CA24A5` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `SocialRequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SocialRequest` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requestId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `createDate` bigint DEFAULT NULL,
  `modifiedDate` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `type_` int DEFAULT NULL,
  `extraData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `receiverUserId` bigint DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`requestId`,`ctCollectionId`),
  UNIQUE KEY `IX_2FE40453` (`userId`,`classNameId`,`classPK`,`receiverUserId`,`type_`,`ctCollectionId`),
  UNIQUE KEY `IX_87DD8A60` (`uuid_`,`ctCollectionId`,`groupId`),
  KEY `IX_E8468A49` (`classNameId`,`classPK`,`receiverUserId`,`status`,`type_`),
  KEY `IX_A90FE5A0` (`companyId`),
  KEY `IX_D9380CB7` (`receiverUserId`,`status`),
  KEY `IX_7CFF5CB8` (`userId`,`classNameId`,`classPK`,`status`,`type_`),
  KEY `IX_AB5906A8` (`userId`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `StyleBookEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `StyleBookEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `headId` bigint DEFAULT NULL,
  `head` tinyint DEFAULT NULL,
  `styleBookEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `defaultStyleBookEntry` tinyint DEFAULT NULL,
  `frontendTokensValues` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `previewFileEntryId` bigint DEFAULT NULL,
  `styleBookEntryKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `themeId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`styleBookEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_EC8C186B` (`ctCollectionId`,`headId`),
  UNIQUE KEY `IX_DD34F41F` (`groupId`,`head`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_1FCDFAB9` (`groupId`,`head`,`ctCollectionId`,`styleBookEntryKey`),
  UNIQUE KEY `IX_C05F123A` (`groupId`,`uuid_`,`head`,`ctCollectionId`),
  KEY `IX_B498953F` (`externalReferenceCode`),
  KEY `IX_957FE3BD` (`groupId`,`defaultStyleBookEntry`),
  KEY `IX_9EFBE469` (`groupId`,`head`,`defaultStyleBookEntry`),
  KEY `IX_9F9B48BF` (`groupId`,`head`,`name`),
  KEY `IX_F379E6EB` (`groupId`,`name`),
  KEY `IX_9A76A32B` (`groupId`,`styleBookEntryKey`),
  KEY `IX_346515B6` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `StyleBookEntryVersion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `StyleBookEntryVersion` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `styleBookEntryVersionId` bigint NOT NULL,
  `version` int DEFAULT NULL,
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `styleBookEntryId` bigint DEFAULT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `defaultStyleBookEntry` tinyint DEFAULT NULL,
  `frontendTokensValues` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `previewFileEntryId` bigint DEFAULT NULL,
  `styleBookEntryKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `themeId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`styleBookEntryVersionId`,`ctCollectionId`),
  UNIQUE KEY `IX_D274CB96` (`groupId`,`uuid_`,`version`,`ctCollectionId`),
  UNIQUE KEY `IX_24879115` (`groupId`,`version`,`ctCollectionId`,`styleBookEntryKey`),
  UNIQUE KEY `IX_A87495E7` (`version`,`ctCollectionId`,`styleBookEntryId`),
  KEY `IX_E9CC1685` (`groupId`,`defaultStyleBookEntry`),
  KEY `IX_B5D7AB23` (`groupId`,`name`),
  KEY `IX_8E1B79F3` (`groupId`,`styleBookEntryKey`),
  KEY `IX_D77F24C5` (`groupId`,`version`,`defaultStyleBookEntry`),
  KEY `IX_917554E3` (`groupId`,`version`,`name`),
  KEY `IX_6C02234D` (`styleBookEntryId`),
  KEY `IX_930691EE` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Subscription` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `subscriptionId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `frequency` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`subscriptionId`,`ctCollectionId`),
  UNIQUE KEY `IX_6CA01A0A` (`userId`,`classNameId`,`companyId`,`classPK`,`ctCollectionId`),
  KEY `IX_6BBFF1A6` (`classNameId`,`companyId`,`classPK`),
  KEY `IX_C4FAEA47` (`groupId`),
  KEY `IX_C717464D` (`userId`,`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `SystemEvent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SystemEvent` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `systemEventId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `classUuid` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referrerClassNameId` bigint DEFAULT NULL,
  `parentSystemEventId` bigint DEFAULT NULL,
  `systemEventSetKey` bigint DEFAULT NULL,
  `type_` int DEFAULT NULL,
  `extraData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`systemEventId`,`ctCollectionId`),
  KEY `IX_FFCBB747` (`groupId`,`classNameId`,`classPK`,`type_`),
  KEY `IX_A19C89FF` (`groupId`,`systemEventSetKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Team` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `teamId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `groupId` bigint DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`teamId`,`ctCollectionId`),
  UNIQUE KEY `IX_58777164` (`groupId`,`ctCollectionId`,`name`),
  UNIQUE KEY `IX_1AAF62D7` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_93AB8545` (`companyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `TemplateEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TemplateEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `templateEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `ddmTemplateId` bigint DEFAULT NULL,
  `infoItemClassName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `infoItemFormVariationKey` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`templateEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_D36C36F3` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_F7DCA9E6` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_9B9729B4` (`ddmTemplateId`),
  KEY `IX_D011CDAB` (`groupId`,`infoItemClassName`,`infoItemFormVariationKey`),
  KEY `IX_3AF3BA36` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Ticket` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ticketId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `key_` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_` int DEFAULT NULL,
  `extraInfo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `expirationDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`ticketId`),
  KEY `IX_DAD135B4` (`classNameId`,`classPK`,`companyId`,`type_`),
  KEY `IX_1E8DFB2E` (`classNameId`,`classPK`,`type_`),
  KEY `IX_B2468446` (`key_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `TranslationEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TranslationEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `translationEntryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `contentType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `languageId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`translationEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_B69D02A1` (`classNameId`,`classPK`,`ctCollectionId`,`languageId`),
  UNIQUE KEY `IX_91DCD4BF` (`uuid_`,`ctCollectionId`,`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `TrashEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TrashEntry` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `entryId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `systemEventSetKey` bigint DEFAULT NULL,
  `typeSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`entryId`,`ctCollectionId`),
  UNIQUE KEY `IX_16DA0033` (`classNameId`,`classPK`,`ctCollectionId`),
  KEY `IX_2674F2A8` (`companyId`),
  KEY `IX_FC4EEA64` (`groupId`,`classNameId`),
  KEY `IX_6CAAE2E8` (`groupId`,`createDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `TrashVersion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TrashVersion` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `versionId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `entryId` bigint DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `typeSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`versionId`,`ctCollectionId`),
  UNIQUE KEY `IX_96536499` (`classNameId`,`classPK`,`ctCollectionId`),
  KEY `IX_72D58D37` (`entryId`,`classNameId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `UserGroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserGroup` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userGroupId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `parentUserGroupId` bigint DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `addedByLDAPImport` tinyint DEFAULT NULL,
  PRIMARY KEY (`userGroupId`,`ctCollectionId`),
  UNIQUE KEY `IX_A33BD191` (`companyId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_3F4FC96B` (`companyId`,`name`,`ctCollectionId`),
  KEY `IX_69771487` (`companyId`,`parentUserGroupId`),
  KEY `IX_5F1DD85A` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `UserGroupGroupRole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserGroupGroupRole` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `userGroupGroupRoleId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userGroupId` bigint DEFAULT NULL,
  `groupId` bigint DEFAULT NULL,
  `roleId` bigint DEFAULT NULL,
  PRIMARY KEY (`userGroupGroupRoleId`,`ctCollectionId`),
  UNIQUE KEY `IX_618D3E5F` (`groupId`,`userGroupId`,`roleId`,`ctCollectionId`),
  KEY `IX_CAB0CCC8` (`groupId`,`roleId`),
  KEY `IX_1CDF88C` (`roleId`),
  KEY `IX_DCDED558` (`userGroupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `UserGroupRole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserGroupRole` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `userGroupRoleId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `groupId` bigint DEFAULT NULL,
  `roleId` bigint DEFAULT NULL,
  PRIMARY KEY (`userGroupRoleId`,`ctCollectionId`),
  UNIQUE KEY `IX_5427FB77` (`groupId`,`userId`,`roleId`,`ctCollectionId`),
  KEY `IX_871412DF` (`groupId`,`roleId`),
  KEY `IX_887A2C95` (`roleId`),
  KEY `IX_887BE56A` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `UserGroups_Teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserGroups_Teams` (
  `companyId` bigint NOT NULL,
  `teamId` bigint NOT NULL,
  `userGroupId` bigint NOT NULL,
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `ctChangeType` tinyint DEFAULT NULL,
  PRIMARY KEY (`teamId`,`userGroupId`,`ctCollectionId`),
  KEY `IX_2AC5356C` (`companyId`),
  KEY `IX_7F187E63` (`userGroupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `UserIdMapper`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserIdMapper` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `userIdMapperId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalUserId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`userIdMapperId`),
  UNIQUE KEY `IX_41A32E0D` (`type_`,`externalUserId`),
  UNIQUE KEY `IX_D1C44A6E` (`userId`,`type_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `UserNotificationDelivery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserNotificationDelivery` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `userNotificationDeliveryId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `portletId` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `notificationType` int DEFAULT NULL,
  `deliveryType` int DEFAULT NULL,
  `deliver` tinyint DEFAULT NULL,
  PRIMARY KEY (`userNotificationDeliveryId`),
  UNIQUE KEY `IX_8B6E3ACE` (`userId`,`portletId`,`classNameId`,`notificationType`,`deliveryType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `UserNotificationEvent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserNotificationEvent` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userNotificationEventId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `type_` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timestamp` bigint DEFAULT NULL,
  `deliveryType` int DEFAULT NULL,
  `deliverBy` bigint DEFAULT NULL,
  `delivered` tinyint DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `actionRequired` tinyint DEFAULT NULL,
  `archived` tinyint DEFAULT NULL,
  PRIMARY KEY (`userNotificationEventId`),
  KEY `IX_BF29100B` (`type_`),
  KEY `IX_6E095243` (`userId`,`archived`,`actionRequired`),
  KEY `IX_E32CC19` (`userId`,`delivered`,`actionRequired`),
  KEY `IX_AE54166F` (`userId`,`delivered`,`archived`,`actionRequired`),
  KEY `IX_7522B7DB` (`userId`,`delivered`,`deliveryType`,`actionRequired`),
  KEY `IX_3BE9B7B1` (`userId`,`delivered`,`deliveryType`,`archived`,`actionRequired`),
  KEY `IX_2AB8294D` (`userId`,`delivered`,`deliveryType`,`archived`,`type_`),
  KEY `IX_105871E3` (`userId`,`delivered`,`deliveryType`,`type_`),
  KEY `IX_EBF87241` (`userId`,`delivered`,`type_`,`timestamp`),
  KEY `IX_D60FB085` (`userId`,`deliveryType`,`archived`,`actionRequired`),
  KEY `IX_ECD8CFEA` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `UserTracker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserTracker` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `userTrackerId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `sessionId` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remoteAddr` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remoteHost` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userAgent` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`userTrackerId`),
  KEY `IX_29BA1CF5` (`companyId`),
  KEY `IX_46B0AE8E` (`sessionId`),
  KEY `IX_E4EFBA8D` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `UserTrackerPath`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserTrackerPath` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `userTrackerPathId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userTrackerId` bigint DEFAULT NULL,
  `path_` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `pathDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`userTrackerPathId`),
  KEY `IX_14D8BCC0` (`userTrackerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `User_`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User_` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `contactId` bigint DEFAULT NULL,
  `password_` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passwordEncrypted` tinyint DEFAULT NULL,
  `passwordReset` tinyint DEFAULT NULL,
  `passwordModifiedDate` datetime(6) DEFAULT NULL,
  `digest` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reminderQueryQuestion` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reminderQueryAnswer` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `graceLoginCount` int DEFAULT NULL,
  `screenName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emailAddress` varchar(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facebookId` bigint DEFAULT NULL,
  `googleUserId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ldapServerId` bigint DEFAULT NULL,
  `openId` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `portraitId` bigint DEFAULT NULL,
  `languageId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timeZoneId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `greeting` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `firstName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `middleName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jobTitle` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `loginDate` datetime(6) DEFAULT NULL,
  `loginIP` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastLoginDate` datetime(6) DEFAULT NULL,
  `lastLoginIP` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastFailedLoginDate` datetime(6) DEFAULT NULL,
  `failedLoginAttempts` int DEFAULT NULL,
  `lockout` tinyint DEFAULT NULL,
  `lockoutDate` datetime(6) DEFAULT NULL,
  `agreedToTermsOfUse` tinyint DEFAULT NULL,
  `emailAddressVerified` tinyint DEFAULT NULL,
  `type_` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`userId`,`ctCollectionId`),
  UNIQUE KEY `IX_77D89D58` (`companyId`,`ctCollectionId`,`emailAddress`),
  UNIQUE KEY `IX_6FF64E11` (`companyId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_6B7C3D77` (`companyId`,`ctCollectionId`,`screenName`),
  UNIQUE KEY `IX_E902F853` (`ctCollectionId`,`contactId`),
  KEY `IX_BCFDA257` (`companyId`,`createDate`,`modifiedDate`),
  KEY `IX_1D731F03` (`companyId`,`facebookId`),
  KEY `IX_B6E3AE1` (`companyId`,`googleUserId`),
  KEY `IX_EE8ABD19` (`companyId`,`modifiedDate`),
  KEY `IX_89509087` (`companyId`,`openId`(255)),
  KEY `IX_F6039434` (`companyId`,`status`),
  KEY `IX_FD06BAAD` (`companyId`,`type_`,`status`),
  KEY `IX_762F63C6` (`emailAddress`),
  KEY `IX_A18034A4` (`portraitId`),
  KEY `IX_E0422BDA` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `User_x_92605711380992`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User_x_92605711380992` (
  `userId` bigint NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Users_Groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users_Groups` (
  `companyId` bigint NOT NULL,
  `groupId` bigint NOT NULL,
  `userId` bigint NOT NULL,
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `ctChangeType` tinyint DEFAULT NULL,
  PRIMARY KEY (`groupId`,`userId`,`ctCollectionId`),
  KEY `IX_3499B657` (`companyId`),
  KEY `IX_F10B6C6B` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Users_Orgs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users_Orgs` (
  `companyId` bigint NOT NULL,
  `organizationId` bigint NOT NULL,
  `userId` bigint NOT NULL,
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `ctChangeType` tinyint DEFAULT NULL,
  PRIMARY KEY (`organizationId`,`userId`,`ctCollectionId`),
  KEY `IX_5FBB883C` (`companyId`),
  KEY `IX_FB646CA6` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Users_Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users_Roles` (
  `companyId` bigint NOT NULL,
  `roleId` bigint NOT NULL,
  `userId` bigint NOT NULL,
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `ctChangeType` tinyint DEFAULT NULL,
  PRIMARY KEY (`roleId`,`userId`,`ctCollectionId`),
  KEY `IX_F987A0DC` (`companyId`),
  KEY `IX_C1A01806` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Users_Teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users_Teams` (
  `companyId` bigint NOT NULL,
  `teamId` bigint NOT NULL,
  `userId` bigint NOT NULL,
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `ctChangeType` tinyint DEFAULT NULL,
  PRIMARY KEY (`teamId`,`userId`,`ctCollectionId`),
  KEY `IX_799F8283` (`companyId`),
  KEY `IX_A098EFBF` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Users_UserGroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users_UserGroups` (
  `companyId` bigint NOT NULL,
  `userId` bigint NOT NULL,
  `userGroupId` bigint NOT NULL,
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `ctChangeType` tinyint DEFAULT NULL,
  PRIMARY KEY (`userId`,`userGroupId`,`ctCollectionId`),
  KEY `IX_BB65040C` (`companyId`),
  KEY `IX_66FF2503` (`userGroupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `VEC_AUDIT_LOG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VEC_AUDIT_LOG` (
  `auditLogId` bigint NOT NULL,
  `companyId` bigint DEFAULT '0',
  `groupId` bigint DEFAULT '0',
  `siteName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userId` bigint DEFAULT '0',
  `userName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userEmail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `actionType` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `targetType` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `className` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classPK` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pid` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `factoryPid` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scope` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `changedKeys` longtext COLLATE utf8mb4_unicode_ci,
  `targetTitle` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `targetUrl` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `beforeData` longtext COLLATE utf8mb4_unicode_ci,
  `afterData` longtext COLLATE utf8mb4_unicode_ci,
  `diffData` longtext COLLATE utf8mb4_unicode_ci,
  `requestUri` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ipAddress` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userAgent` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sessionId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `errorCode` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `errorMessage` longtext COLLATE utf8mb4_unicode_ci,
  `createDate` datetime(6) DEFAULT NULL,
  `completedDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`auditLogId`),
  KEY `IX_VEC_AUDIT_LOG_DATE` (`createDate`),
  KEY `IX_VEC_AUDIT_LOG_USER` (`userId`),
  KEY `IX_VEC_AUDIT_LOG_TARGET` (`targetType`,`classPK`),
  KEY `IX_VEC_AUDIT_LOG_PID` (`pid`(255)),
  KEY `IX_VEC_AUDIT_LOG_ACTION` (`actionType`),
  KEY `IX_VEC_AUDIT_LOG_GROUP` (`groupId`),
  KEY `IX_VEC_AUDIT_LOG_ERROR_CODE` (`errorCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `VEC_AdminNetworkPolicy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VEC_AdminNetworkPolicy` (
  `policyId` bigint NOT NULL,
  `companyId` bigint NOT NULL DEFAULT '0',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `networkAddress` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `networkType` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '0',
  `description` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` int NOT NULL DEFAULT '100',
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `userId` bigint NOT NULL DEFAULT '0',
  `userName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastModifiedByUserId` bigint NOT NULL DEFAULT '0',
  `lastModifiedByUserName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`policyId`),
  KEY `IX_VEC_ANP_COMPANY_ENABLED` (`companyId`,`enabled`),
  KEY `IX_VEC_ANP_COMPANY_NETWORK` (`companyId`,`networkAddress`),
  KEY `IX_VEC_ANP_PRIORITY` (`companyId`,`enabled`,`priority`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `VEC_HomeMenu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VEC_HomeMenu` (
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_` bigint NOT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` bigint DEFAULT NULL,
  `status` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_` int DEFAULT NULL,
  `redirect` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_`),
  KEY `IX_71965DE5` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `VEC_InternalSurvey`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VEC_InternalSurvey` (
  `surveyId` bigint NOT NULL AUTO_INCREMENT,
  `companyId` bigint DEFAULT '0',
  `groupId` bigint DEFAULT '0',
  `userId` bigint DEFAULT '0',
  `userName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `multipleChoice` tinyint(1) NOT NULL DEFAULT '0',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `startDate` datetime(6) DEFAULT NULL,
  `endDate` datetime(6) DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`surveyId`),
  KEY `IX_VEC_IS_STATUS_CREATE` (`status`,`createDate`),
  KEY `IX_VEC_IS_USER` (`userId`),
  KEY `IX_VEC_IS_DATE` (`startDate`,`endDate`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `VEC_InternalSurveyOption`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VEC_InternalSurveyOption` (
  `optionId` bigint NOT NULL AUTO_INCREMENT,
  `surveyId` bigint NOT NULL,
  `optionText` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`optionId`),
  KEY `IX_VEC_ISO_SURVEY_SORT` (`surveyId`,`sortOrder`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `VEC_InternalSurveyParticipant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VEC_InternalSurveyParticipant` (
  `participantId` bigint NOT NULL AUTO_INCREMENT,
  `surveyId` bigint NOT NULL,
  `scopeType` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `organizationId` bigint NOT NULL DEFAULT '0',
  `departmentId` bigint NOT NULL DEFAULT '0',
  `userId` bigint NOT NULL DEFAULT '0',
  `createDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`participantId`),
  KEY `IX_VEC_ISP_SURVEY_SCOPE` (`surveyId`,`scopeType`),
  KEY `IX_VEC_ISP_ORG` (`organizationId`),
  KEY `IX_VEC_ISP_DEPT` (`departmentId`),
  KEY `IX_VEC_ISP_USER` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `VEC_InternalSurveyVote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VEC_InternalSurveyVote` (
  `voteId` bigint NOT NULL AUTO_INCREMENT,
  `surveyId` bigint NOT NULL,
  `optionId` bigint NOT NULL,
  `userId` bigint NOT NULL,
  `userName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `organizationId` bigint NOT NULL DEFAULT '0',
  `departmentId` bigint NOT NULL DEFAULT '0',
  `createDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`voteId`),
  UNIQUE KEY `UX_VEC_ISV_USER_OPTION` (`surveyId`,`userId`,`optionId`),
  KEY `IX_VEC_ISV_SURVEY_USER` (`surveyId`,`userId`),
  KEY `IX_VEC_ISV_OPTION` (`optionId`),
  KEY `IX_VEC_ISV_ORG` (`organizationId`),
  KEY `IX_VEC_ISV_DEPT` (`departmentId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `VEC_OnlineMeeting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VEC_OnlineMeeting` (
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_` bigint NOT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `organization` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `topic` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requestTime` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_`),
  KEY `IX_AD431511` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `VEC_PublicInfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VEC_PublicInfo` (
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_` bigint NOT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `imgId` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `shortContent` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `attachmentId` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `viewNumber` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdLocation` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `redirectLink` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `fbUrl` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `tiktokUrl` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `createdDate` datetime(6) DEFAULT NULL,
  `updatedDate` datetime(6) DEFAULT NULL,
  `createdBy` datetime(6) DEFAULT NULL,
  `updatedBy` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id_`),
  KEY `IX_194748EC` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `VEC_Resume`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VEC_Resume` (
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_` bigint NOT NULL,
  `fullName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attachment` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_`),
  KEY `IX_F6E786B6` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `VEC_TrafficFeedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VEC_TrafficFeedback` (
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_` bigint NOT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trafficType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inforType` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requestTime` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attachment` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_`),
  KEY `IX_A63FE357` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `VEC_WebhookLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VEC_WebhookLog` (
  `logId` bigint NOT NULL AUTO_INCREMENT,
  `source` varchar(100) NOT NULL DEFAULT 'tinytalk',
  `eventType` varchar(100) DEFAULT NULL,
  `botId` varchar(100) DEFAULT NULL,
  `conversationId` varchar(100) DEFAULT NULL,
  `contactId` varchar(100) DEFAULT NULL,
  `messageRole` varchar(50) DEFAULT NULL,
  `messageContent` text,
  `rawPayload` longtext NOT NULL,
  `idempotencyKey` varchar(255) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'RECEIVED',
  `errorMessage` text,
  `createDate` datetime NOT NULL,
  PRIMARY KEY (`logId`),
  KEY `idx_source` (`source`),
  KEY `idx_eventType` (`eventType`),
  KEY `idx_conversationId` (`conversationId`),
  KEY `idx_contactId` (`contactId`),
  KEY `idx_idempotencyKey` (`idempotencyKey`),
  KEY `idx_createDate` (`createDate`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ViewCountEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ViewCountEntry` (
  `companyId` bigint NOT NULL,
  `classNameId` bigint NOT NULL,
  `classPK` bigint NOT NULL,
  `viewCount` bigint DEFAULT NULL,
  PRIMARY KEY (`companyId`,`classNameId`,`classPK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `VirtualHost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VirtualHost` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `virtualHostId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `layoutSetId` bigint DEFAULT NULL,
  `hostname` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `defaultVirtualHost` tinyint DEFAULT NULL,
  `languageId` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`virtualHostId`,`ctCollectionId`),
  UNIQUE KEY `IX_76A64FBE` (`hostname`,`ctCollectionId`),
  KEY `IX_EECA5FDA` (`companyId`,`layoutSetId`,`defaultVirtualHost`),
  KEY `IX_774643D1` (`layoutSetId`,`hostname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `WebDAVProps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WebDAVProps` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `webDavPropsId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `props` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`webDavPropsId`),
  UNIQUE KEY `IX_97DFA146` (`classNameId`,`classPK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Website`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Website` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `websiteId` bigint NOT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `listTypeId` bigint DEFAULT NULL,
  `primary_` tinyint DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`websiteId`),
  UNIQUE KEY `IX_36B86556` (`companyId`,`externalReferenceCode`),
  KEY `IX_1AA07A6D` (`companyId`,`classNameId`,`classPK`,`primary_`),
  KEY `IX_F75690BB` (`userId`),
  KEY `IX_76F15D13` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `WikiNode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WikiNode` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nodeId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lastPostDate` datetime(6) DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`nodeId`,`ctCollectionId`),
  UNIQUE KEY `IX_4378AA6D` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_2C8CCC8F` (`groupId`,`ctCollectionId`,`name`),
  UNIQUE KEY `IX_73235160` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_B54332D6` (`companyId`,`status`),
  KEY `IX_23325358` (`groupId`,`status`),
  KEY `IX_6C112D7C` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `WikiPage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WikiPage` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pageId` bigint NOT NULL,
  `resourcePrimKey` bigint DEFAULT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nodeId` bigint DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` double DEFAULT NULL,
  `minorEdit` tinyint DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `summary` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `format` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `head` tinyint DEFAULT NULL,
  `parentTitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `redirectTitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `statusByUserId` bigint DEFAULT NULL,
  `statusByUserName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`pageId`,`ctCollectionId`),
  UNIQUE KEY `IX_5769831` (`groupId`,`ctCollectionId`,`uuid_`),
  UNIQUE KEY `IX_B6761658` (`groupId`,`ctCollectionId`,`version`,`externalReferenceCode`),
  UNIQUE KEY `IX_D1FC265` (`nodeId`,`resourcePrimKey`,`ctCollectionId`,`version`),
  UNIQUE KEY `IX_C6E9CBD8` (`nodeId`,`title`,`ctCollectionId`,`version`),
  KEY `IX_B65BBC83` (`companyId`),
  KEY `IX_8DBCF518` (`externalReferenceCode`),
  KEY `IX_A2001730` (`format`),
  KEY `IX_F8CFBCE8` (`nodeId`,`head`,`groupId`,`title`),
  KEY `IX_65E84AF4` (`nodeId`,`head`,`parentTitle`),
  KEY `IX_64CCB282` (`nodeId`,`head`,`redirectTitle`),
  KEY `IX_E30FDBD1` (`nodeId`,`head`,`resourcePrimKey`),
  KEY `IX_FCA31EC4` (`nodeId`,`head`,`status`,`groupId`,`parentTitle`),
  KEY `IX_9DEB1BCE` (`nodeId`,`head`,`status`,`parentTitle`),
  KEY `IX_A75EB4DC` (`nodeId`,`head`,`status`,`redirectTitle`),
  KEY `IX_676415FE` (`nodeId`,`head`,`title`),
  KEY `IX_46EEF3C8` (`nodeId`,`parentTitle`),
  KEY `IX_1ECC7656` (`nodeId`,`redirectTitle`),
  KEY `IX_6F9E3908` (`nodeId`,`status`,`groupId`,`userId`),
  KEY `IX_D1F6BA7F` (`nodeId`,`status`,`resourcePrimKey`),
  KEY `IX_4A2D62C` (`nodeId`,`status`,`title`),
  KEY `IX_EF476996` (`nodeId`,`status`,`userId`),
  KEY `IX_85E7CC76` (`resourcePrimKey`),
  KEY `IX_5D2E2B50` (`status`,`resourcePrimKey`),
  KEY `IX_9C0E478F` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `WikiPageResource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WikiPageResource` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resourcePrimKey` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `nodeId` bigint DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`resourcePrimKey`,`ctCollectionId`),
  UNIQUE KEY `IX_DF42DE46` (`ctCollectionId`,`nodeId`,`title`),
  UNIQUE KEY `IX_B2B35D0B` (`uuid_`,`ctCollectionId`,`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `WorkflowDefinitionLink`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WorkflowDefinitionLink` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `externalReferenceCode` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `workflowDefinitionLinkId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `typePK` bigint DEFAULT NULL,
  `workflowDefinitionName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `workflowDefinitionVersion` int DEFAULT NULL,
  PRIMARY KEY (`workflowDefinitionLinkId`,`ctCollectionId`),
  UNIQUE KEY `IX_BF1277A7` (`groupId`,`ctCollectionId`,`externalReferenceCode`),
  UNIQUE KEY `IX_6D62D29A` (`groupId`,`uuid_`,`ctCollectionId`),
  KEY `IX_A4DB1F0F` (`companyId`,`workflowDefinitionName`,`workflowDefinitionVersion`),
  KEY `IX_705B40EE` (`groupId`,`companyId`,`classNameId`,`classPK`,`typePK`),
  KEY `IX_407C8F33` (`groupId`,`companyId`,`classPK`),
  KEY `IX_336A4F02` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `WorkflowInstanceLink`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WorkflowInstanceLink` (
  `mvccVersion` bigint NOT NULL DEFAULT '0',
  `ctCollectionId` bigint NOT NULL DEFAULT '0',
  `workflowInstanceLinkId` bigint NOT NULL,
  `groupId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `userName` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint DEFAULT NULL,
  `classPK` bigint DEFAULT NULL,
  `workflowInstanceId` bigint DEFAULT NULL,
  PRIMARY KEY (`workflowInstanceLinkId`,`ctCollectionId`),
  KEY `IX_415A7007` (`groupId`,`companyId`,`classNameId`,`classPK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file` (
  `file_id` int NOT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `path` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `download_url` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `modified_by` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`file_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `highway`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `highway` (
  `highway_id` int NOT NULL,
  `created_by` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `modified_by` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `img_id` int DEFAULT NULL,
  `location` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `length` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `toll_station_num` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `service_area_num` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `intersection_num` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `driving_lane_num` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_lane_num` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_lat` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_lng` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `end_lat` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `end_lng` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`highway_id`),
  KEY `IX_6634A0BA` (`status`,`highway_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `highway_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `highway_info` (
  `highway_info_id` int NOT NULL,
  `created_by` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `modified_by` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  `highway_id` int DEFAULT NULL,
  `time` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `progress` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `investment` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `partner` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `chainage` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_lanes` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_point` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `end_point` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`highway_info_id`),
  KEY `IX_1C1F0A27` (`highway_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `live_camera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `live_camera` (
  `live_camera_id` int NOT NULL,
  `created_by` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `modified_by` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  `highway_id` int DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lat` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lng` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video_url` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`live_camera_id`),
  KEY `IX_F9184A5F` (`highway_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news` (
  `news_id` int NOT NULL,
  `type` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `img_id` int DEFAULT NULL,
  `video_id` int DEFAULT NULL,
  `short_content` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `view_num` int DEFAULT NULL,
  `created_location` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `modified_by` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`news_id`),
  KEY `IX_9FC77BBF` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `online_meeting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `online_meeting` (
  `uuid_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_` bigint NOT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `organization` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `topic` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requestTime` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_`),
  KEY `IX_FF7B3FBF` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `product_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_service` (
  `productServiceId` bigint NOT NULL,
  `type_` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imgId` bigint DEFAULT NULL,
  `status` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `viewNum` int DEFAULT NULL,
  PRIMARY KEY (`productServiceId`),
  KEY `IX_2756BDD1` (`status`),
  KEY `IX_ECEAE18A` (`type_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `setting` (
  `setting_id` int NOT NULL,
  `type` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `key` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `value` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `modified_by` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`setting_id`),
  KEY `IX_B03DF829` (`key`,`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `station_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `station_info` (
  `station_info_id` int NOT NULL,
  `created_by` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `modified_by` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  `highway_id` int DEFAULT NULL,
  `type` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lat` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lng` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `img_id` int DEFAULT NULL,
  PRIMARY KEY (`station_info_id`),
  KEY `IX_54DD804E` (`highway_id`,`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `tags_id` int NOT NULL,
  `post_id` int DEFAULT NULL,
  `post_type` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `setting_id` int DEFAULT NULL,
  `created_by` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `modified_by` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`tags_id`),
  KEY `IX_B6E4C8FE` (`post_id`,`post_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `toll_station_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `toll_station_info` (
  `toll_station_info_id` int NOT NULL,
  `created_by` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `modified_by` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  `station_info_id` int DEFAULT NULL,
  `price` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`toll_station_info_id`),
  KEY `IX_D04ACBAE` (`station_info_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `traffic_safety`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `traffic_safety` (
  `traffic_safety_id` int NOT NULL,
  `type` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `img_id` int DEFAULT NULL,
  `short_content` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `view_num` int DEFAULT NULL,
  `created_by` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `modified_by` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`traffic_safety_id`),
  KEY `IX_29043700` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 DROP PROCEDURE IF EXISTS `search_all_tables` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`vec_prod_user`@`%` PROCEDURE `search_all_tables`(IN search_text VARCHAR(255))
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_table VARCHAR(255);
    DECLARE v_column VARCHAR(255);

    DECLARE cur CURSOR FOR
        SELECT TABLE_NAME, COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND DATA_TYPE IN ('varchar', 'char', 'text', 'mediumtext', 'longtext');

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO v_table, v_column;
        IF done THEN
            LEAVE read_loop;
        END IF;

        SET @sql = CONCAT(
                'SELECT ''', v_table, ''' AS table_name, ''', v_column, ''' AS column_name, ',
                v_column, ' AS value FROM ', v_table,
                ' WHERE ', v_column, ' LIKE ''%', search_text, '%'''
                   );

        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;

    END LOOP;

    CLOSE cur;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

