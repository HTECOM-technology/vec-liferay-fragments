-- ============================================================================
-- Module counter (vn.vec.custom.counter)
--
-- 3 loại counter:
--   1. Lượt truy cập website  -> VEC_CounterSiteVisit + VEC_CounterSiteVisitor
--   2. Người đang online      -> VEC_CounterOnlineSession
--   3. Lượt đọc 1 bài viết    -> VEC_CounterArticleRead + VEC_CounterArticleReader
--
-- Module tự chạy "create table if not exists" khi activate (CounterTableManager),
-- nên file này dùng để tạo/kiểm tra schema thủ công trên DB MySQL của Liferay.
-- ============================================================================

-- ─── 1. Lượt truy cập website: tổng hợp theo ngày ───────────────────────────
CREATE TABLE IF NOT EXISTS VEC_CounterSiteVisit (
  siteVisitId BIGINT NOT NULL AUTO_INCREMENT,
  companyId BIGINT NOT NULL DEFAULT 0,
  groupId BIGINT NOT NULL DEFAULT 0,
  visitDate DATE NOT NULL,
  totalVisits BIGINT NOT NULL DEFAULT 0,
  uniqueVisitors BIGINT NOT NULL DEFAULT 0,
  createDate DATETIME(6) NULL,
  modifiedDate DATETIME(6) NULL,
  PRIMARY KEY (siteVisitId),
  UNIQUE KEY IX_VEC_CounterSiteVisit_Day (companyId, groupId, visitDate),
  KEY IX_VEC_CounterSiteVisit_Date (visitDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 1b. Khách truy cập trong ngày: dùng để đếm unique visitor ──────────────
CREATE TABLE IF NOT EXISTS VEC_CounterSiteVisitor (
  siteVisitorId BIGINT NOT NULL AUTO_INCREMENT,
  companyId BIGINT NOT NULL DEFAULT 0,
  groupId BIGINT NOT NULL DEFAULT 0,
  visitDate DATE NOT NULL,
  visitorKey VARCHAR(64) NOT NULL,
  userId BIGINT NOT NULL DEFAULT 0,
  visits BIGINT NOT NULL DEFAULT 0,
  firstVisitDate DATETIME(6) NULL,
  lastVisitDate DATETIME(6) NULL,
  PRIMARY KEY (siteVisitorId),
  UNIQUE KEY IX_VEC_CounterSiteVisitor_Key (companyId, groupId, visitDate, visitorKey),
  KEY IX_VEC_CounterSiteVisitor_Date (visitDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 2. Người đang online: 1 dòng / visitor, hết hạn theo lastSeenDate ──────
CREATE TABLE IF NOT EXISTS VEC_CounterOnlineSession (
  onlineSessionId BIGINT NOT NULL AUTO_INCREMENT,
  companyId BIGINT NOT NULL DEFAULT 0,
  groupId BIGINT NOT NULL DEFAULT 0,
  visitorKey VARCHAR(64) NOT NULL,
  userId BIGINT NOT NULL DEFAULT 0,
  currentPath VARCHAR(500) NULL,
  firstSeenDate DATETIME(6) NULL,
  lastSeenDate DATETIME(6) NULL,
  PRIMARY KEY (onlineSessionId),
  UNIQUE KEY IX_VEC_CounterOnlineSession_Key (companyId, visitorKey),
  KEY IX_VEC_CounterOnlineSession_Seen (lastSeenDate),
  KEY IX_VEC_CounterOnlineSession_Group (groupId, lastSeenDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 3. Lượt đọc bài viết: tổng hợp theo articleId ──────────────────────────
CREATE TABLE IF NOT EXISTS VEC_CounterArticleRead (
  articleReadId BIGINT NOT NULL AUTO_INCREMENT,
  companyId BIGINT NOT NULL DEFAULT 0,
  groupId BIGINT NOT NULL DEFAULT 0,
  articleId VARCHAR(75) NOT NULL,
  resourcePrimKey BIGINT NOT NULL DEFAULT 0,
  totalReads BIGINT NOT NULL DEFAULT 0,
  uniqueReaders BIGINT NOT NULL DEFAULT 0,
  createDate DATETIME(6) NULL,
  modifiedDate DATETIME(6) NULL,
  lastReadDate DATETIME(6) NULL,
  PRIMARY KEY (articleReadId),
  UNIQUE KEY IX_VEC_CounterArticleRead_Key (companyId, groupId, articleId),
  KEY IX_VEC_CounterArticleRead_Article (articleId),
  KEY IX_VEC_CounterArticleRead_Top (companyId, groupId, totalReads)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 3b. Người đọc bài viết: đếm unique reader + chống tăng ảo ──────────────
CREATE TABLE IF NOT EXISTS VEC_CounterArticleReader (
  articleReaderId BIGINT NOT NULL AUTO_INCREMENT,
  companyId BIGINT NOT NULL DEFAULT 0,
  groupId BIGINT NOT NULL DEFAULT 0,
  articleId VARCHAR(75) NOT NULL,
  visitorKey VARCHAR(64) NOT NULL,
  userId BIGINT NOT NULL DEFAULT 0,
  readCount BIGINT NOT NULL DEFAULT 0,
  firstReadDate DATETIME(6) NULL,
  lastReadDate DATETIME(6) NULL,
  PRIMARY KEY (articleReaderId),
  UNIQUE KEY IX_VEC_CounterArticleReader_Key (companyId, groupId, articleId, visitorKey),
  KEY IX_VEC_CounterArticleReader_Read (lastReadDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
