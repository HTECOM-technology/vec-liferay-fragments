-- Cấu hình người xử lý theo từng loại yêu cầu hỗ trợ của Intranet.
-- Chạy thủ công trên database Liferay trước khi deploy module admin-ui mới.

CREATE TABLE IF NOT EXISTS VEC_SupportHandlerConfig (
  configId BIGINT NOT NULL AUTO_INCREMENT,
  companyId BIGINT NOT NULL,
  processKey VARCHAR(75) NOT NULL,
  requestTypeKey VARCHAR(150) NOT NULL,
  organizationId BIGINT NOT NULL,
  departmentId BIGINT NOT NULL,
  createUserId BIGINT NOT NULL DEFAULT 0,
  modifiedUserId BIGINT NOT NULL DEFAULT 0,
  createDate DATETIME(6) NULL,
  modifiedDate DATETIME(6) NULL,
  PRIMARY KEY (configId),
  UNIQUE KEY IX_VEC_SHC_CompanyType (
    companyId,
    processKey,
    requestTypeKey
  ),
  KEY IX_VEC_SHC_Organization (organizationId),
  KEY IX_VEC_SHC_Department (departmentId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS VEC_SupportHandlerConfigUser (
  configUserId BIGINT NOT NULL AUTO_INCREMENT,
  configId BIGINT NOT NULL,
  userId BIGINT NOT NULL,
  PRIMARY KEY (configUserId),
  UNIQUE KEY IX_VEC_SHCU_ConfigUser (configId, userId),
  KEY IX_VEC_SHCU_User (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS VEC_SupportRequest (
  requestId BIGINT NOT NULL AUTO_INCREMENT,
  companyId BIGINT NOT NULL,
  groupId BIGINT NOT NULL DEFAULT 0,
  creatorUserId BIGINT NOT NULL,
  creatorUserName VARCHAR(255) NOT NULL,
  processKey VARCHAR(75) NOT NULL,
  requestTypeKey VARCHAR(150) NOT NULL,
  title VARCHAR(500) NOT NULL,
  content LONGTEXT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'cho-xu-ly',
  priority VARCHAR(30) NOT NULL DEFAULT 'thuong',
  notificationTypes VARCHAR(255) NULL,
  dueDate DATETIME(6) NULL,
  startDate DATETIME(6) NULL,
  endDate DATETIME(6) NULL,
  periodType VARCHAR(75) NULL,
  createDate DATETIME(6) NULL,
  modifiedDate DATETIME(6) NULL,
  PRIMARY KEY (requestId),
  KEY IX_VEC_SR_CompanyStatus (companyId, status),
  KEY IX_VEC_SR_CompanyType (companyId, processKey, requestTypeKey),
  KEY IX_VEC_SR_Creator (companyId, creatorUserId),
  KEY IX_VEC_SR_CreateDate (companyId, createDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS VEC_SupportRequestHandler (
  requestHandlerId BIGINT NOT NULL AUTO_INCREMENT,
  requestId BIGINT NOT NULL,
  userId BIGINT NOT NULL,
  assignedByUserId BIGINT NOT NULL DEFAULT 0,
  createDate DATETIME(6) NULL,
  PRIMARY KEY (requestHandlerId),
  UNIQUE KEY IX_VEC_SRH_RequestUser (requestId, userId),
  KEY IX_VEC_SRH_User (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS VEC_SupportRequestFollower (
  requestFollowerId BIGINT NOT NULL AUTO_INCREMENT,
  requestId BIGINT NOT NULL,
  userId BIGINT NOT NULL,
  createDate DATETIME(6) NULL,
  PRIMARY KEY (requestFollowerId),
  UNIQUE KEY IX_VEC_SRF_RequestUser (requestId, userId),
  KEY IX_VEC_SRF_User (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS VEC_SupportRequestAttachment (
  attachmentId BIGINT NOT NULL AUTO_INCREMENT,
  requestId BIGINT NOT NULL,
  fileName VARCHAR(500) NOT NULL,
  contentType VARCHAR(255) NULL,
  fileSize BIGINT NOT NULL DEFAULT 0,
  fileContent LONGBLOB NOT NULL,
  createDate DATETIME(6) NULL,
  PRIMARY KEY (attachmentId),
  KEY IX_VEC_SRA_Request (requestId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS VEC_SupportRequestComment (
  commentId BIGINT NOT NULL AUTO_INCREMENT,
  requestId BIGINT NOT NULL,
  userId BIGINT NOT NULL,
  userName VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  createDate DATETIME(6) NULL,
  PRIMARY KEY (commentId),
  KEY IX_VEC_SRC_RequestDate (requestId, createDate),
  KEY IX_VEC_SRC_User (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS VEC_SupportRequestStatusHistory (
  historyId BIGINT NOT NULL AUTO_INCREMENT,
  requestId BIGINT NOT NULL,
  fromStatus VARCHAR(30) NOT NULL,
  toStatus VARCHAR(30) NOT NULL,
  changedByUserId BIGINT NOT NULL,
  changedByUserName VARCHAR(255) NOT NULL,
  createDate DATETIME(6) NULL,
  PRIMARY KEY (historyId),
  KEY IX_VEC_SRSH_RequestDate (requestId, createDate),
  KEY IX_VEC_SRSH_User (changedByUserId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
