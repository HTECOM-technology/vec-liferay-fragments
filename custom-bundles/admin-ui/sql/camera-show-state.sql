CREATE TABLE IF NOT EXISTS VEC_CameraVisibility (
  visibilityId BIGINT NOT NULL AUTO_INCREMENT,
  companyId BIGINT NOT NULL DEFAULT 0,
  highwayId BIGINT NOT NULL,
  cameraId VARCHAR(255) NOT NULL,
  internetVisible TINYINT(1) NOT NULL DEFAULT 1,
  intranetVisible TINYINT(1) NOT NULL DEFAULT 1,
  createDate DATETIME(6) NULL,
  modifiedDate DATETIME(6) NULL,
  PRIMARY KEY (visibilityId),
  UNIQUE KEY IX_VEC_CameraVisibility_Key (highwayId, cameraId),
  KEY IX_VEC_CameraVisibility_HighwayId (highwayId),
  KEY IX_VEC_CameraVisibility_CameraId (cameraId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
