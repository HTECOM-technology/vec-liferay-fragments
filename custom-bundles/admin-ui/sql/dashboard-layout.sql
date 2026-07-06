CREATE TABLE IF NOT EXISTS VEC_DashboardLayout (
  layoutId BIGINT NOT NULL AUTO_INCREMENT,
  companyId BIGINT NOT NULL DEFAULT 0,
  userId BIGINT NOT NULL,
  flatOrder LONGTEXT NOT NULL,
  hiddenIds LONGTEXT NOT NULL,
  createDate DATETIME(6) NULL,
  modifiedDate DATETIME(6) NULL,
  PRIMARY KEY (layoutId),
  UNIQUE KEY IX_VEC_DashboardLayout_User (companyId, userId),
  KEY IX_VEC_DashboardLayout_UserId (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
