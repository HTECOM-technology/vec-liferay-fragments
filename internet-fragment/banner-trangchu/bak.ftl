<link rel="preload" as="image" href="/documents/20117/62177/Background+1.png/233ae1dc-e1b0-8a25-3293-b0f7c7d57bf9"
  fetchpriority="high" />
<link rel="preload" as="image" href="/documents/20117/62177/Background+2.png/eb5c8238-f3d9-3355-067d-14098282add5"
  fetchpriority="high" />
<link rel="preload" as="image" href="/documents/20117/62177/Background+3.png/b2514acc-3f53-7f43-ca39-081397b28e1d"
  fetchpriority="high" />
<link rel="preload" as="image" href="/documents/20117/62177/Background+4.png/5571719f-ec7b-83b4-0eec-139e8e73b97a"
  fetchpriority="high" />
<div class="homepage-hero">
  <div class="hero-slider vec-fade-in">
    <div class="slides vec-fade-in-up vec-delay-500">
  <#list entries as entry>
    <#assign article = entry.getAssetRenderer().getArticle()>
    <#assign rawContent = article.getContent()!"">
  
  <#if rawContent?has_content>
    <#assign doc = saxReaderUtil.read(rawContent)>
    <#assign root = doc.getRootElement()>

    <#assign title = root.selectSingleNode("//dynamic-element[@field-reference='title']/dynamic-content").getText()!"">
    <#assign description = root.selectSingleNode("//dynamic-element[@field-reference='description']/dynamic-content").getText()!"">
    
    <#assign bgNode = root.selectSingleNode("//dynamic-element[@field-reference='backGround']/dynamic-content")>
    <#assign bgJson = bgNode?has_content?then(jsonFactoryUtil.createJSONObject(bgNode.getText()), "")>
    <#assign bgUrl = bgJson?has_content?then(bgJson.getString("url"), "")>

    <div class="slide"
         data-title="${title}"
         data-description="${description}"
         data-image="${bgUrl}">
    </div>
  </#if>
  </#list>
</div>
    <button class="nav prev vec-fade-in">&#10094;</button>
    <button class="nav next vec-fade-in">&#10095;</button>
	  <div class="main-banner container">
		  <div class="content" data-aos="zoom-in-up" data-aos-once="false">
				<h1 id="title"></h1>
				<p id="description"></p>
			</div>
			<div class="vec-section" data-aos="fade-up" data-aos-once="false">
				<div class="vec-tabs">
					<div class="vec-tab active" data-tab="routes" data-search="Tìm kiếm tuyến đường cao tốc"
						data-url="/web/guest/trangchu/thongtintructuyen/thongtintuyenduong" src="/documents/d/guest/route-icon-png">
						<span class="icon"> <img alt="Tuyến đường" width="20" src="/documents/d/guest/route-icon-png" /> </span>
						TUYẾN ĐƯỜNG
					</div>
					<div class="vec-divider"></div>
					<div class="vec-tab" data-tab="costs"
						data-search=" Vui lòng nhập điểm đầu, điểm cuối (VD: Trạm Long Phước, Trạm 319 - HLD)"
						data-url="/web/guest/trangchu/thongtintructuyen/cuocphituyenduong">
						<span class="icon"> <img
								src="/documents/20117/50051/elements.png/a453332c-3929-294d-e27a-3d11322940b2?version=1.0&t=1767807055137"
								alt="Cước phí" width="20" /> </span>
						CƯỚC PHÍ
					</div>
					<div class="vec-divider"></div>
					<div class="vec-tab" data-tab="traffic" data-search="Tìm kiếm tình trạng giao thông trên tuyến"
						data-url="/web/guest/trangchu/thongtintructuyen/giaothongtrentuyen">
						<span class="icon"> <img
								src="/documents/20117/50051/elements+%281%29.png/bde03114-f27d-aa57-ba74-592b87a11d09?version=1.0&t=1767807086347"
								alt="Giao thông" width="20" /> </span>
						TÌNH TRẠNG GIAO THÔNG
					</div>

					<div class="vec-divider"></div>

					<div class="vec-tab" data-tab="camera" data-search="Tìm kiếm camera trên tuyến"
						data-url="/web/guest/trangchu/thongtintructuyen/hinhanhvideotructuyen">
						<span class="icon"> <img
								src="/documents/20117/50051/elements+%282%29.png/3e781144-2b05-9fc2-a73a-8914c546febd?version=1.0&t=1767807111300"
								alt="Camera" width="20" /> </span>
						CAMERA TRỰC TUYẾN
					</div>
				</div>

				<div class="vec-search">
					<img
						src="/documents/20117/50051/location-06.png/e4b80073-3afb-fccf-694b-bec244efec29?version=1.0&t=1767807137569"
						alt="Search" class="search-icon" width="18" />

					<input placeholder="Tìm kiếm tuyến đường cao tốc" id="search" autocomplete="off" tabindex="1" />

					<a class="search-btn" type="button" target="_blank">
						<img
							src="/documents/20117/50051/Search+Icon.png/92892458-b46c-ce55-27e1-87dc207bc4f5?version=1.0&t=1767807184479"
							alt="Search" class="search-arrow" tabindex="2" />
					</a>
				</div>
				<div id="suggestions" hidden> <span class="suggestion-item"></span> </div>
			</div>	
		</div>
		<div class="vec-info">
			<#list entries as entry>
				<#assign article = entry.getAssetRenderer().getArticle()>
				<#assign rawContent = article.getContent()!"">

				<#if rawContent?has_content>
					<#assign doc = saxReaderUtil.read(rawContent)>
					<#assign root = doc.getRootElement()>
					<#assign subTitle = root.selectSingleNode("//dynamic-element[@field-reference='subTitle']/dynamic-content").getText()!"">

					<div class="vec-info-item">
						${subTitle}
					</div>
				</#if>
			</#list>
		</div>
  </div>
</div>
<!-- VEC ALERT MODAL -->
<div id="vecAlertModal" class="vec-modal-overlay" aria-modal="true" role="dialog" aria-labelledby="vecModalTitle" hidden>
  <div class="vec-modal-box">
    <div class="vec-modal-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#FFF3CD"/>
        <path d="M12 7v5" stroke="#E6A817" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="16" r="1.2" fill="#E6A817"/>
      </svg>
    </div>
    <p id="vecModalTitle" class="vec-modal-message">Vui lòng chọn đường cao tốc và trạm thu phí hợp lệ để tra cứu cước phí.</p>
    <button class="vec-modal-close-btn" id="vecModalCloseBtn" aria-label="Đóng">Đóng</button>
  </div>
</div>

<style>
  input::placeholder {
    color: black;
  }
	
	/* ===============================
   ROOT CONTAINER (ISOLATION)
================================ */
.homepage-hero {
  width: 100%;
  font-family: "Inter", Arial, sans-serif;
  position: relative;
  min-height: 100vh;
	height: 100vh;
	max-height: 100vh;
}

/* ===============================
     HERO SLIDER
  ================================ */
.homepage-hero .hero-slider {
  position: relative;
  width: 100%;
  min-height: 100vh;
	height: 100vh;
	max-height: 100vh;
  overflow: hidden;
}

/* ===============================
     SLIDES
  ================================ */
.homepage-hero .slides {
  position: absolute;
  inset: 0;
  z-index: 1;
}

/*.homepage-hero .slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.homepage-hero .slide.active {
  opacity: 1;
} */
	
.homepage-hero .slide {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
}

.homepage-hero .slide.active {
  z-index: 2;
}

.homepage-hero .slide-strip {
  position: absolute;
  top: 0;
  height: 100%;
  background-repeat: no-repeat;
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.6s ease;
}

.homepage-hero .slide.active .slide-strip {
  transform: scaleY(1);
}
	
	.homepage-hero .main-banner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
  }

.homepage-hero .content {
  position: relative;
  z-index: 5;
  text-align: center;
  color: #ffffff;
  max-width: none;
}

.homepage-hero .content h1 {
  max-width: 769px;
  margin: 0 auto 16px;
  font-family: "Inter", Arial, sans-serif;
  font-size: 60px;
  font-weight: 700;
  line-height: 74px;
  white-space: pre-line;
}

.homepage-hero .content p {
  max-width: 768px;
  margin: 0 auto;

  font-size: 19px;
  font-weight: 500;
  line-height: 30px;
  color: #ffffff;
}
	
.homepage-hero .content h1,
.homepage-hero .content p {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.homepage-hero .content.no-transition h1,
.homepage-hero .content.no-transition p {
  transition: none;
}

.homepage-hero .content.offset-left h1,
.homepage-hero .content.offset-left p {
  opacity: 0;
  transform: translateX(-40px);
}

.homepage-hero .content.offset-right h1,
.homepage-hero .content.offset-right p {
  opacity: 0;
  transform: translateX(40px);
}

/* ===============================
     ARROWS
  ================================ */
.homepage-hero .nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 6;
  background: transparent;
  border: none;
  font-size: 32px;
  color: #FFFFFF;
  cursor: pointer;
}

.homepage-hero .prev {
  left: 24px;
}

.homepage-hero .next {
  right: 24px;
}

.homepage-hero .vec-section {
  position: relative;
  width: 100%;
  z-index: 7;
  margin-top: 30px;
}

.vec-tabs {
  width: 964px;
  height: 56px;
  margin: 0 auto;

  display: grid;
  grid-template-columns:
    auto 30px auto 30px auto 30px auto;

  align-items: center;

  background: #007AC5;
  border-radius: 16px 16px 0 0;
}

.homepage-hero .vec-search input::placeholder {
  color: #d3d2d0;
  opacity: 1;
  /* Firefox */
}

/* TAB */
.vec-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  white-space: nowrap;
  text-transform: uppercase;

  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

/* ICON */
.vec-tab .icon img {
  width: 18px;
  height: 18px;
  opacity: 0.4;
}

/* DIVIDER COLUMN */
.vec-divider {
  display: flex;
  justify-content: center;
}

.vec-divider::before {
  content: "";
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.2);
}

/* ACTIVE */
.vec-tab.active {
  color: #ffffff;
  font-weight: 600;
}

.vec-tab.active .icon img {
  opacity: 1;
}

/* HOVER */
.vec-tab:hover {
  color: #ffffff;
}

.vec-tab:hover .icon img {
  opacity: 1;
}


/* ===============================
     SEARCH
  ================================ */
.homepage-hero .vec-search {
  max-width: 1056px;
  height: 80px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  border-radius: 15.27px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(6px);
}

.homepage-hero .vec-search input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  outline: none;
  margin-left: 10px;
	font-size: 18px;
}

.homepage-hero .vec-search input::placeholder {
  font-size: 18px;
  font-weight: 400;
}

.homepage-hero .vec-search img {
  /*background-color: #E31C2A;*/
  height: 18px;
  margin: 10 auto;
  border-radius: 10px;
}

.homepage-hero .vec-search .search-btn img {
  background-color: #E31C2A;
  height: 42px;
  margin: auto;
  padding: 9px;
  border-radius: 10px;
}

/* ===============================
     INFO SECTION (ROOT POSITIONED)
  ================================ */
.homepage-hero .vec-info {
  position: absolute;
  bottom: 52px;
  /* ✅ from ROOT */
  left: 50%;
  transform: translateX(-50%) !important;

  max-width: 1100px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  text-align: center;
  color: #fff;
  z-index: 6;
}

.homepage-hero .vec-info-item {
  text-align: left;
}

.homepage-hero .vec-info-item::before {
  content: "";
  display: block;
  width: 230px;
  height: 1px;
  background: rgba(255, 255, 255, 0.4);
  margin: 0 0 10px 0;
}

.homepage-hero .vec-info .vec-info-item {
  color: #FFF;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
}

.homepage-hero .vec-info-item.active::before {
  width: 230px;
  background: #00AFFB;
}

.homepage-hero .vec-tab .icon img {
  display: block;
  font-size: 16px;
  margin: auto;
  margin-bottom: 6px;
}

/* ===============================
     RESPONSIVE
  ================================ */


/* ===============================
   CSS mới
================================ */
/* Container chính */
.search-container {
  position: relative;
  /* Quan trọng để gợi ý canh theo input */
  width: 100%;
  max-width: 600px;
}

/* Phần bọc input và icon */
.input-wrapper {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  /* Độ trong suốt như hình */
  border-radius: 8px;
  padding: 10px 15px;
}

/* Fix lỗi icon bị co */
.input-wrapper i,
.input-wrapper .icon-location {
  flex-shrink: 0;
  /* Ngăn không cho icon bị co lại */
  margin-right: 10px;
  width: 20px;
  /* Điều chỉnh theo kích thước thật của icon */
  height: 20px;
}

/* Hiển thị gợi ý tìm kiếm */
.search-box {
  position: relative;
  width: 100%;
}

#searchInput {
  width: 100%;
  height: 48px;
  border-radius: 10px;
  padding: 0 16px;
  border: none;
  outline: none;
}



#suggestions[hidden] {
  display: none;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #eee;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background-color: #f3f6fb;
}

/* #suggestions {
    position: absolute;    
    top:58%;
    left: 0;
    width: 100%;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
    z-index: 99999;
    overflow: hidden;  
    max-height: 240px;
    overflow-y: auto;
    overflow-x: hidden;
  } */

#suggestions {
  position: absolute;
  top: 58%;
  left: 22%;
  width: 56.5%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
  z-index: 99999;
  overflow: hidden;
  max-height: 240px;
  overflow-y: auto;
  overflow-x: hidden;
  justify-content: cencenter;
}


/* ===============================
   RESPONSIVE - EXTRA SMALL (≤360px)
================================ */
@media (max-width: 393px) {
  .suggestion-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    border-bottom: 1px solid #eee;
  }

  .suggestion-item:last-child {
    border-bottom: none;
  }

  .suggestion-item:hover {
    background-color: #f3f6fb;
  }

  #suggestions {
    position: absolute;
    top: 58%;
    left: 22%;
    width: 56.5%;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
    z-index: 99999;
    overflow: hidden;
    max-height: 240px;
    overflow-y: auto;
    overflow-x: hidden;
    justify-content: cencenter;
  }

  .homepage-hero .vec-section {
    position: relative;
    width: 100%;
    z-index: 7 !important;
    margin-top: 30px;
  }


  .homepage-hero .content h1 {
    font-size: 24px;
    line-height: 32px;
  }

  .homepage-hero .content p {
    font-size: 13px;
    line-height: 20px;
  }

  .homepage-hero .vec-tab {
    font-size: 8px;
    padding: 8px 2px;
  }

  .homepage-hero .vec-tab .icon img {
    width: 16px;
    height: 16px;
  }

  .homepage-hero {
    --line-width: 45px;
    --line-gap: 5px;
  }

  /* // Mới */

  .suggestion-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    border-bottom: 1px solid #eee;
  }

  .suggestion-item:last-child {
    border-bottom: none;
  }

  .suggestion-item:hover {
    background-color: #f3f6fb;
  }

    #suggestions {
        position: absolute;
        top: 58%;
        left: 15px;
        width: 92%;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
        z-index: 99999;
        overflow: hidden;
        max-height: 240px;
        overflow-y: auto;
        overflow-x: hidden;
        justify-content: cencenter;
    }

}

/* =====================================================
     TABLET (≤ 1024px)
  ===================================================== */
@media (max-width: 1024px) {
  .suggestion-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    border-bottom: 1px solid #eee;
  }

  .suggestion-item:last-child {
    border-bottom: none;
  }

  .suggestion-item:hover {
    background-color: #f3f6fb;
  }

  #suggestions {
    position: absolute;
    top: 58%;
    left: 22%;
    width: 56.5%;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
    z-index: 99999;
    overflow: hidden;
    max-height: 240px;
    overflow-y: auto;
    overflow-x: hidden;
    justify-content: cencenter;
  }

  .homepage-hero .vec-section {
    position: relative;
    width: 100%;
    z-index: 7 !important;
    margin-top: 30px;
  }

  .homepage-hero,
  .homepage-hero .hero-slider {
    min-height: 90vh;
  }

  .homepage-hero .content h1 {
    font-family: "Inter", Arial, sans-serif;
    font-size: 60px;
    font-weight: 700;
    line-height: 74px;
    margin: 0 auto 16px auto;
    white-space: pre-line;
  }

  .homepage-hero .content p {
    width: 768px;
		max-width: 100%;
    margin: 0 auto;
    font-size: 19px;
    font-weight: 500;
    line-height: 30px;
    color: rgba(255, 255, 255, 0.9);
  }

  .homepage-hero .vec-tabs {
    max-width: 100%;
  }
	
	.homepage-hero .vec-tabs .vec-tab {
    font-size: 12px;
		gap: 6px;
  }

  .homepage-hero .vec-search {
    max-width: 100%;
    padding: 10px;
  }

  .homepage-hero .vec-info {
    max-width: 90%;
    gap: 16px;
  }
}

/* ===============================
   RESPONSIVE - MOBILE (≤768px)
================================ */
@media (max-width: 768px) {
  .homepage-hero .vec-section {
    position: relative;
    width: 100%;
    z-index: 7 !important;
    margin-top: 30px;
  }

  .homepage-hero,
  .homepage-hero .hero-slider {
    min-height: 90vh;
    padding-bottom: 10px;
  }

  .homepage-hero .content h1 {
    font-size: 36px;
    line-height: 44px;
    max-width: 100%;
  }

  .homepage-hero .content p {
    font-size: 16px;
    line-height: 26px;
    max-width: 100%;
  }

  /* HIDE ARROWS */
  .homepage-hero .prev,
  .homepage-hero .next {
    display: none;
  }

  .homepage-hero .vec-section {
    position: relative;
    margin: 32px auto 0;
    width: 100%;
    max-width: 100%;
  }

  /* TABS - FORCE 4 IN ONE ROW */
  .homepage-hero .vec-tabs {
    display: flex !important;
    grid-template-columns: repeat(4, 1fr) !important;
    width: calc(100% - 20px);
    height: auto;
    max-height: 65px;
    margin: 0 auto;
    border-radius: 15px;
    overflow: hidden;
    gap: 0;
    box-sizing: border-box;
    align-items: start;
  }

  /* HIDE DIVIDERS */
  .homepage-hero .vec-divider {
    width: 1px;
    height: 70px;
    align-items: center;
  }

  .vec-divider::before {
    width: 1px;
    height: 45px;
  }

  .homepage-hero .vec-tab {
    min-width: 0 !important;
    padding: 10px 5px;
    font-size: 10px;
    line-height: 1.3;
    text-align: center;
    border-radius: 15px;
    white-space: normal;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    width: 25%;
  }

  .homepage-hero .vec-tab .icon {
    display: block;
    margin: 0 auto 4px;
  }

  .homepage-hero .vec-tab .icon img {
    width: 20px;
    height: 20px;
    display: block;
    margin: 0 auto;
  }

  /* SEARCH */
  .homepage-hero .vec-search {
    width: calc(100% - 20px);
    margin: 0 auto;
    height: 60px;
    max-height: 65px;
    padding: 8px;
    border-radius: 15px;
    box-sizing: border-box;
  }

  .homepage-hero .vec-search input {
    font-size: 16px;
    margin-left: 8px;
		margin-right: 8px;
  }

  .homepage-hero .vec-search input::placeholder {
    font-size: 14px;
  }

  .homepage-hero .vec-search .search-btn img {
    height: 36px;
    padding: 8px;
  }

  /* INFO - HIDE ON MOBILE */
  .homepage-hero .vec-info {
    display: none;
  }

  /* 4 INDICATOR LINES */
  .homepage-hero {
    --line-width: 60px;
    --line-gap: 8px;
    --line-height: 2px;
  }

  .homepage-hero::before {
    content: "";
    position: absolute;
    bottom: 27px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 7;
    height: var(--line-height);
    width: calc((var(--line-width) * 4) + (var(--line-gap) * 3));
    background:
      linear-gradient(#00b3ff, #00b3ff) 0 0 / var(--line-width) var(--line-height) no-repeat,
      linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)) calc(var(--line-width) + var(--line-gap)) 0 / var(--line-width) var(--line-height) no-repeat,
      linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)) calc((var(--line-width) + var(--line-gap)) * 2) 0 / var(--line-width) var(--line-height) no-repeat,
      linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)) calc((var(--line-width) + var(--line-gap)) * 3) 0 / var(--line-width) var(--line-height) no-repeat;
  }

  .suggestion-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    border-bottom: 1px solid #eee;
  }

  .suggestion-item:last-child {
    border-bottom: none;
  }

  .suggestion-item:hover {
    background-color: #f3f6fb;
  }

    #suggestions {
        position: absolute;
        top: 58%;
        left: 15px;
        width: 92%;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
        z-index: 99999;
        overflow: hidden;
        max-height: 240px;
        overflow-y: auto;
        overflow-x: hidden;
        justify-content: cencenter;
    }
	
	.homepage-hero .vec-tabs .vec-tab {
    font-size: 8px;
  }
	
	.hero-slider .content #description{
	  font-size: 14px !important;
	}
}

/* ===============================
   RESPONSIVE - SMALL MOBILE (≤480px)
================================ */
@media (max-width: 1292px){
	.hero-slider .content #description{
	  font-size: 16px;
	}
	
	.homepage-hero .content h1 {
	  font-size: 48px;
		line-height: 60px;
	}
}

@media (max-width: 480px) {
  .suggestion-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    border-bottom: 1px solid #eee;
  }

  .suggestion-item:last-child {
    border-bottom: none;
  }

  .suggestion-item:hover {
    background-color: #f3f6fb;
  }

    #suggestions {
        position: absolute;
        top: 58%;
        left: 15px;
        width: 92%;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
        z-index: 99999;
        overflow: hidden;
        max-height: 240px;
        overflow-y: auto;
        overflow-x: hidden;
        justify-content: cencenter;
    }

	.homepage-hero{padding-bottom: 0px !important;}
  .homepage-hero .vec-section {
    position: relative;
    width: 100%;
    z-index: 7 !important;
    margin-top: 30px;
  }

  .homepage-hero,
  .homepage-hero .hero-slider {
    min-height: 80vh;
  }

  .homepage-hero .content h1 {
    font-size: 24px;
    line-height: 30px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .homepage-hero .content p {
    font-size: 14px;
    line-height: 22px;
    font-weight: 500;
  }

  /* VEC SECTION - ADJUST POSITION */
  .homepage-hero .vec-section {
    margin-top: 24px;
  }

  /* TABS - FIXED HEIGHT & BORDER RADIUS */
  .homepage-hero .vec-tabs {
    height: 65px;
    border-radius: 15px;
    width: calc(100% - 32px);
    margin: 0 auto;
  }

  /* TABS - SMALLER TEXT */
  .homepage-hero .vec-tab {
    font-size: 10px;
    gap: 2px;
  }

  .homepage-hero .vec-tab .icon img {
    width: 18px;
    height: 18px;
  }

  /* SEARCH - MATCH TABS WIDTH & BORDER RADIUS */
  .homepage-hero .vec-search {
    height: 65px;
    border-radius: 15px 15px;
    width: calc(100% - 32px);
    margin: 0 auto;
  }

  .homepage-hero .vec-search input {
    font-size: 14px;
  }

  .homepage-hero .vec-search input::placeholder {
    font-size: 13px;
  }

  .homepage-hero .vec-search .search-btn img {
    height: 32px;
    padding: 7px;
  }

  /* INDICATOR LINES - SMALLER */
  .homepage-hero {
    --line-width: 50px;
    --line-gap: 6px;
  }
}
/* ===============================
   VEC ALERT MODAL
================================ */
.vec-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: vecModalFadeIn 0.2s ease;
}

.vec-modal-overlay[hidden] {
  display: none;
}

@keyframes vecModalFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.vec-modal-box {
  background: #ffffff;
  border-radius: 16px;
  padding: 36px 32px 28px;
  max-width: 420px;
  width: calc(100% - 40px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: vecModalSlideUp 0.25s ease;
}

@keyframes vecModalSlideUp {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

.vec-modal-icon {
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
}

.vec-modal-message {
  font-family: "Inter", Arial, sans-serif;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.6;
  color: #1a1a2e;
  margin: 0 0 24px;
}

.vec-modal-close-btn {
  display: inline-block;
  padding: 10px 36px;
  background: #007AC5;
  color: #ffffff;
  font-family: "Inter", Arial, sans-serif;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.vec-modal-close-btn:hover {
  background: #005f9e;
}

@media (max-width: 480px) {
  .vec-modal-box {
    padding: 28px 20px 22px;
  }

  .vec-modal-message {
    font-size: 14px;
  }
}

</style>
<script>
(function() {
  const imageLangGlobe = document.getElementById("imageLangGlobe");
  const vecLangToggle = document.getElementById("vecLangToggle");
  let xLinkHerf = "";
  if (imageLangGlobe) {
    xLinkHerf = imageLangGlobe.getAttribute("xlink:href");
  }
  // --------------------------------------------------------------------
  if (xLinkHerf.includes("vn.png")) {
    imageLangGlobe.setAttribute("data-lang", "vi");
    vecLangToggle.setAttribute("data-lang", "vi");
  } else if (xLinkHerf.includes("us.png")) {
    imageLangGlobe.setAttribute("data-lang", "us");
    vecLangToggle.setAttribute("data-lang", "us");
  } else if (xLinkHerf.includes("cn.png")) {
    imageLangGlobe.setAttribute("data-lang", "cn");
    vecLangToggle.setAttribute("data-lang", "cn");
  } else if (xLinkHerf.includes("jp.png")) {
    imageLangGlobe.setAttribute("data-lang", "jp");
    vecLangToggle.setAttribute("data-lang", "jp");
  }
  // --------------------------------------------------------------------
  let currentLang = vecLangToggle.getAttribute("data-lang");
  localStorage.setItem("lang", currentLang);

  const slides = document.querySelectorAll(".slide");
  const titleEl = document.getElementById("title");
  const descEl = document.getElementById("description");
  const prevBtn = document.querySelector(".nav.prev");
  const nextBtn = document.querySelector(".nav.next");
  const searchBtn = document.querySelector(".search-btn");
  const suggestionsBox = document.getElementById("suggestions");
  let dataTab = "routes";
  let domain = window.location.origin;
  let currentIndex = 0;
  let autoSlideInterval;

  // Data Thông tin tuyến đường  cao tốc, tình trạng giao thông, hình ảnh video
  const dataTuyenDuong = [
    { id: 42753, name: "Cao tốc Hồ Chí Minh - Long Thành - Dầu Giây" },
    { id: 43943, name: "Cao tốc Nội Bài - Lào Cai" },
    { id: 44090, name: "Cao tốc Đà Nẵng - Quảng Ngãi" },
    { id: 44147, name: "Cao tốc Cầu Giẽ - Ninh Bình" },
    { id: 74573, name: "Cao tốc Bến Lức - Long Thành" },
  ];

  // Data tra cứu cước phí
  let dataStation = [
    { id: 578726, name: "Trạm Long Phước", highway_id: 42753 },
    { id: 578728, name: "Trạm 319 - HLD", highway_id: 42753 },
    { id: 578730, name: "Trạm QL51", highway_id: 42753 },
    { id: 578732, name: "Trạm Dầu Giây - Phan Thiết", highway_id: 42753 },
    { id: 578734, name: "Trạm Dầu Giây", highway_id: 42753 },
    { id: 578736, name: "Trạm dừng nghỉ", highway_id: 42753 },
    { id: 580027, name: "Nút giao An Phú", highway_id: 42753 },
    { id: 580029, name: "Nút giao Vành đai II", highway_id: 42753 },
    { id: 580031, name: "Nút giao Đỗ Xuân Hợp", highway_id: 42753 },
    { id: 580033, name: "Nút giao Quốc lộ 51", highway_id: 42753 },
    { id: 580035, name: "Nút giao Dầu Giây", highway_id: 42753 },
    { id: 635929, name: "Nút giao VĐ 3 - HLD (C)", highway_id: 42753 },
    { id: 636186, name: "Nút giao VĐ 3 - HLD (O)", highway_id: 42753 },
    { id: 169480, name: "Nút giao Lập Thạch - Vĩnh Phúc", highway_id: 43943 },
    { id: 169483, name: "Nút giao Phù Ninh ", highway_id: 43943 },
    { id: 169485, name: "Nút giao Sai Nga", highway_id: 43943 },
    { id: 169487, name: "Nút giao TP.Yên Bái", highway_id: 43943 },
    { id: 169489, name: "Nút giao Mậu A", highway_id: 43943 },
    { id: 169491, name: "Nút giao Tam Đảo - Vĩnh Yên", highway_id: 43943 },
    { id: 169493, name: "Nút giao Hầm chui QL 2", highway_id: 43943 },
    { id: 169495, name: "Nút giao Bình Xuyên", highway_id: 43943 },
    { id: 169497, name: "Nút giao Văn Bàn", highway_id: 43943 },
    { id: 169499, name: "Nút giao Xuân Giao", highway_id: 43943 },
    { id: 169501, name: "Nút giao IC18", highway_id: 43943 },
    { id: 174124, name: "Trạm thu phí Km6+000", highway_id: 43943 },
    { id: 174126, name: "Trạm thu phí IC3", highway_id: 43943 },
    { id: 174128, name: "Trạm thu phí IC4", highway_id: 43943 },
    { id: 174130, name: "Trạm thu phí IC6", highway_id: 43943 },
    { id: 174134, name: "Trạm thu phí IC17", highway_id: 43943 },
    { id: 174136, name: "Trạm thu phí IC13", highway_id: 43943 },
    { id: 174138, name: "Trạm thu phí IC10", highway_id: 43943 },
    { id: 174140, name: "Trạm thu phí IC12", highway_id: 43943 },
    { id: 174142, name: "Trạm thu phí IC14", highway_id: 43943 },
    { id: 174144, name: "Trạm Thu phí IC8", highway_id: 43943 },
    { id: 174146, name: "Trạm thu phí IC7", highway_id: 43943 },
    { id: 575693, name: "Trạm dừng nghỉ Km22+900", highway_id: 43943 },
    { id: 575695, name: "Trạm dừng nghỉ Km 57+500", highway_id: 43943 },
    { id: 575697, name: "Trạm dừng nghỉ Km 117+500", highway_id: 43943 },
    { id: 575699, name: "Trạm dừng nghỉ Km 171+500", highway_id: 43943 },
    { id: 575701, name: "Trạm dừng nghỉ Km 236+900", highway_id: 43943 },
    { id: 590329, name: "Trạm thu phí IC11", highway_id: 43943 },
    { id: 635263, name: "Trạm thu phí IC9", highway_id: 43943 },
    { id: 635340, name: "Trạm thu phí IC16", highway_id: 43943 },
    { id: 635362, name: "Trạm thu phí Km237", highway_id: 43943 },
    { id: 636160, name: "Phố Lu", highway_id: 43943 },
    { id: 571397, name: "Trạm Túy Loan - Km4", highway_id: 44090 },
    { id: 571400, name: "Trạm Phong Thử - Km 13 ", highway_id: 44090 },
    { id: 571402, name: "Trạm Hà Lam - Km 41", highway_id: 44090 },
    { id: 571404, name: "Trạm Tam Kỳ - Km64", highway_id: 44090 },
    { id: 571406, name: "Trạm Chu Lai - Km 83", highway_id: 44090 },
    { id: 571408, name: "Trạm Bắc Quảng Ngãi - Km 124", highway_id: 44090 },
    { id: 571410, name: "Trạm Quảng Ngãi - Km 130", highway_id: 44090 },
    { id: 635498, name: "Trạm thu phí Dung Quất", highway_id: 44090 },
    { id: 572765, name: "Trạm thu phí Liêm Tuyền", highway_id: 44147 },
    { id: 572767, name: "Trạm thu phí Cao Bồ", highway_id: 44147 },
    { id: 572769, name: "Trạm thu phí Vực Vòng", highway_id: 44147 },
    { id: 572888, name: "Nút giao Đại Xuyên", highway_id: 44147 },
    { id: 572890, name: "Nút giao Vực Vòng", highway_id: 44147 },
    { id: 572904, name: "Nút giao Liêm Tuyền", highway_id: 44147 },
    { id: 572907, name: "Nút giao Cao Bồ", highway_id: 44147 },
    { id: 573035, name: "Trạm dừng nghỉ KM 227", highway_id: 44147 },
    { id: 629662, name: "Trạm thu phí Đại Xuyên", highway_id: 44147 },
    { id: 635996, name: "Trạm thu phí Pháp Vân", highway_id: 44147 },
    { id: 635998, name: "Trạm Thu phí Thường Tín", highway_id: 44147 },
    { id: 636000, name: "Trạm thu phí Vạn Điểm", highway_id: 44147 },
    { id: 636002, name: "Trạm thu phí Cầu Giẽ Hà Nam", highway_id: 44147 },
  ];
  var station = [
    "Trạm Long Phước",
    "Trạm 319 - HLD",
    "Trạm QL51",
    "Trạm Dầu Giây - Phan Thiết",
    "Trạm Dầu Giây",
    "Trạm dừng nghỉ",
    "Nút giao An Phú",
    "Nút giao Vành đai II",
    "Nút giao Đỗ Xuân Hợp",
    "Nút giao Quốc lộ 51",
    "Nút giao Dầu Giây",
    "Nút giao VĐ 3 - HLD (C)",
    "Nút giao VĐ 3 - HLD (O)",
    "Nút giao Lập Thạch - Vĩnh Phúc",
    "Nút giao Phù Ninh ",
    "Nút giao Sai Nga",
    "Nút giao TP.Yên Bái",
    "Nút giao Mậu A",
    "Nút giao Tam Đảo - Vĩnh Yên",
    "Nút giao Hầm chui QL 2",
    "Nút giao Bình Xuyên",
    "Nút giao Văn Bàn",
    "Nút giao Xuân Giao",
    "Nút giao IC18",
    "Trạm thu phí Km6+000",
    "Trạm thu phí IC3",
    "Trạm thu phí IC4",
    "Trạm thu phí IC6",
    "Trạm thu phí IC17",
    "Trạm thu phí IC13",
    "Trạm thu phí IC10",
    "Trạm thu phí IC12",
    "Trạm thu phí IC14",
    "Trạm Thu phí IC8",
    "Trạm thu phí IC7",
    "Trạm dừng nghỉ Km22+900",
    "Trạm dừng nghỉ Km 57+500",
    "Trạm dừng nghỉ Km 117+500",
    "Trạm dừng nghỉ Km 171+500",
    "Trạm dừng nghỉ Km 236+900",
    "Trạm thu phí IC11",
    "Trạm thu phí IC9",
    "Trạm thu phí IC16",
    "Trạm thu phí Km237",
    "Phố Lu",
    "Trạm Túy Loan - Km4",
    "Trạm Phong Thử - Km 13 ",
    "Trạm Hà Lam - Km 41",
    "Trạm Tam Kỳ - Km64",
    "Trạm Chu Lai - Km 83",
    "Trạm Bắc Quảng Ngãi - Km 124",
    "Trạm Quảng Ngãi - Km 130",
    "Trạm thu phí Dung Quất",
    "Trạm thu phí Liêm Tuyền",
    "Trạm thu phí Cao Bồ",
    "Trạm thu phí Vực Vòng",
    "Nút giao Đại Xuyên",
    "Nút giao Vực Vòng",
    "Nút giao Liêm Tuyền",
    "Nút giao Cao Bồ",
    "Trạm dừng nghỉ KM 227",
    "Trạm thu phí Đại Xuyên",
    "Trạm thu phí Pháp Vân",
    "Trạm Thu phí Thường Tín",
    "Trạm thu phí Vạn Điểm",
    "Trạm thu phí Cầu Giẽ Hà Nam",
  ];
  const infoItems = document.querySelectorAll(".vec-info-item");
	
  
  /* INIT SLIDES */
  /*slides.forEach((slide, index) => {
    slide.style.backgroundImage = 'url(' + slide.dataset.image + ')';
    if (index === 0) slide.classList.add("active");
  }); */
	const STRIP_COUNT = 8;

function buildStrips(slide) {
  const image = slide.dataset.image;

  for (let i = 0; i < STRIP_COUNT; i++) {
    const strip = document.createElement("div");
    strip.className = "slide-strip";
    strip.style.left = (i * 100) / STRIP_COUNT + "%";
    strip.style.width = 100 / STRIP_COUNT + "%";
    strip.style.backgroundImage = "url(" + image + ")";
    strip.style.backgroundSize = STRIP_COUNT * 100 + "% 100%";
    strip.style.backgroundPosition = (i * 100) / (STRIP_COUNT - 1) + "% center";
    strip.style.transitionDelay = i * 60 + "ms";
    slide.appendChild(strip);
  }
}

// Dựng ngay slide đầu tiên để hero hiển thị liền, không delay
if (slides.length > 0) {
  buildStrips(slides[0]);
  slides[0].classList.add("active");
}

// Các slide còn lại chưa cần hiển thị ngay -> hoãn lại để tránh giật lúc trang mới tải
setTimeout(function () {
  for (let i = 1; i < slides.length; i++) {
    buildStrips(slides[i]);
  }
}, 800);
  /* PAUSE ON HOVER */
  const heroSlider = document.querySelector(".hero-slider");
  heroSlider.addEventListener("mouseenter", () => {
    clearInterval(autoSlideInterval);
  });
  heroSlider.addEventListener("mouseleave", startAutoSlide);
  /* NEXT SLIDE */
nextBtn.addEventListener("click", () => {
  clearInterval(autoSlideInterval);
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlide(currentIndex, "next");
  startAutoSlide();
});
  /* PREVIOUS SLIDE */
prevBtn.addEventListener("click", () => {
  clearInterval(autoSlideInterval);
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateSlide(currentIndex, "prev");
  startAutoSlide();
});
  infoItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      clearInterval(autoSlideInterval);
      currentIndex = index;
      updateSlide(currentIndex);
      startAutoSlide();
    });

    item.style.cursor = "pointer";
  });
  /* INIT */
  updateSlide(currentIndex);
  startAutoSlide();

  // ---------------------------------------------------------------------------------------------

  // 1. Chọn ô input và tất cả các tab
  // ---------------------------------------------------------------
  const searchInput = document.getElementById("search");
  const suggestionBox = document.getElementById("suggestions");
  const tabs = document.querySelectorAll(".vec-tab");
  // 2. Lặp qua từng tab để gắn sự kiện click
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      suggestionsBox.hidden = true;
      searchInput.value = "";
      // Bước A: Xử lý chuyển đổi class active
      const currentActive = document.querySelector(".vec-tab.active");
      if (currentActive) {
        currentActive.classList.remove("active");
      }
      this.classList.add("active");
      const searchText = this.getAttribute("data-search");
      searchInput.placeholder = searchText;
      dataTab = this.getAttribute("data-tab");
			
			if (searchBtn) {
        searchBtn.removeAttribute("data-url");
      }
    });
  });  
  searchInput.addEventListener("input", function () {
    searchBtn.removeAttribute("data-url");
    const input = document.getElementById("search").value.trim().toLowerCase();
    switch (dataTab) {
      case "routes":
        routes_search(input, suggestionsBox, searchInput);
        break;
      case "costs":
        get_data_input(this.value);
        break;
      case "traffic":
        traffic_search(input, suggestionsBox, searchInput);
        break;
      case "camera":
        camera_search(input, suggestionsBox, searchInput);
        break;
      default:
        routes_search(input, suggestionsBox, searchInput);
    }
  });
  function get_data_input(value) {
    const parts = value.split(",").map((p) => p.trim());
    // 1. Nếu đã có 2 phần tử hoàn chỉnh (đã có dấu phẩy ngăn cách 2 trạm)
    // và người dùng cố gõ thêm dấu phẩy hoặc chữ ở phần thứ 3, ta chặn hiển thị gợi ý.
    if (parts.length > 2) {
      suggestionBox.style.display = "none";
      return;
    }
    const currentQuery = parts[parts.length - 1];
    if (currentQuery.length > 0) {
      const matches = station.filter((s) =>
        s.toLowerCase().includes(currentQuery.toLowerCase()),
      );
      renderSuggestions(matches);
    } else {
      suggestionBox.style.display = "none";
    }
  }
  function renderSuggestions(matches) {
    suggestionsBox.hidden = false;
    if (matches.length === 0) {
      suggestionBox.style.display = "none";
      return;
    }
    suggestionBox.innerHTML = matches
      .map(function(item) {
        return '<div class="suggestion-item" onclick="selectRoute(\'' + item + '\')">'
          + '<span class="icon-pin">📍</span>'
          + '<span>' + item + '</span>'
          + '</div>';
      })
      .join("");

    suggestionBox.style.display = "block";
  }
  window.selectRoute = function (name) {
    let parts = searchInput.value.split(",").map((p) => p.trim());
    // Xóa phần đang nhập dở
    parts.pop();
    // Thêm tên trạm đã chọn
    parts.push(name);

    // 2. Kiểm tra nếu là trạm thứ nhất thì thêm dấu phẩy để nhập tiếp trạm 2
    // Nếu đã là trạm thứ hai thì dừng lại, không thêm dấu phẩy cuối.
    if (parts.length === 1) {
      searchInput.value = parts.join(", ") + ", ";
    } else {
      searchInput.value = parts.slice(0, 2).join(", "); // Chỉ lấy tối đa 2 trạm
    }

    suggestionBox.style.display = "none";
    searchInput.focus();
  };
  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target)) suggestionBox.style.display = "none";
  });
  // ------------------------------------------------------------------------------
  // Tìm kiếm
  
	  searchBtn.addEventListener("click", function () {
    const input = searchInput.value;
    // Nếu ô nhập liệu trống, bạn có thể cân nhắc việc có chạy search hay không
    switch (dataTab) {
      case "routes":
        routes_search(input, suggestionsBox, searchInput);
        break;
      case "costs":
        let arrayInput = convert_text_array(input);
        costs_search(arrayInput, suggestionsBox, searchInput);
        break;
      case "traffic":
        traffic_search(input, suggestionsBox, searchInput);
        break;
      case "camera":
        camera_search(input, suggestionsBox, searchInput);
        break;
      default:
        routes_search(input, suggestionsBox, searchInput);
    }

   if (input.trim().length > 0 && $(this).attr("data-url").length > 0) {
        const url = $(this).attr("data-url");
        window.open(url, "_blank");
    } else {
        showVecModal("Vui lòng nhập thông tin cần tra cứu.");
    }   
  });

function updateSlide(index, direction) {
  if (!slides || slides.length === 0) return;
  if (index < 0 || index >= slides.length) return;

  slides.forEach((slide) => slide.classList.remove("active"));

  const activeSlide = slides[index];
  if (!activeSlide) return;

  activeSlide.classList.add("active");

  const contentEl = document.querySelector(".homepage-hero .content");

  if (contentEl) {
    const exitClass = direction === "prev" ? "offset-right" : "offset-left";
    const enterClass = direction === "prev" ? "offset-left" : "offset-right";

    contentEl.classList.add(exitClass);

    setTimeout(function () {
      if (titleEl) titleEl.textContent = activeSlide.dataset.title ?? "";
      if (descEl) descEl.textContent = activeSlide.dataset.description ?? "";

      contentEl.classList.add("no-transition");
      contentEl.classList.remove(exitClass);
      contentEl.classList.add(enterClass);

      void contentEl.offsetHeight; // ép trình duyệt tính lại layout ngay tại vị trí bắt đầu

      contentEl.classList.remove("no-transition");
      contentEl.classList.remove(enterClass);
    }, 400);
  } else {
    if (titleEl) titleEl.textContent = activeSlide.dataset.title ?? "";
    if (descEl) descEl.textContent = activeSlide.dataset.description ?? "";
  }

  updateInfoIndicator(index);
}
  async function get_data_api_not_timeout(url) {
    // Sử dụng proxy công cộng để vượt rào CORS
    const proxyUrl = "https://api.allorigins.win/get?url=";
    const apiUrl = encodeURIComponent(url);
    let data = [];
    try {
      const response = await fetch(proxyUrl + apiUrl);
      if (!response.ok) throw new Error("Không thể kết nối qua Proxy");
      const wrapper = await response.json();
      const res = JSON.parse(wrapper.contents);
      return res;
    } catch (error) {
      console.error("Lỗi khi fetch:", error);
    }
  }
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlide(currentIndex);
    }, 5000);
  }
  function updateInfoIndicator(index) {
    if (!infoItems.length) return;

    infoItems.forEach((item) => item.classList.remove("active"));

    if (infoItems[index]) {
      infoItems[index].classList.add("active");
    }
  }
  function routes_search(input, suggestionsBox, searchInput) {
    let dataUrl = "/web/guest/trangchu/thongtintructuyen/thongtintuyenduong";
    let highway = "?highway-id=";
    suggestionsBox.innerHTML = ""; // Xóa gợi ý cũ		
    if (input.length > 0) {
			console.log('Độ lớn: ', input.length);
      suggestionsBox.hidden = false;
      document.getElementById("suggestions").style.display = "block";
      // Lọc dữ liệu
      const filteredData = dataTuyenDuong.filter((item) =>
        item.name.toLowerCase().includes(input),
      );
      // Hiển thị gợi ý
      filteredData.forEach((item) => {
        const div = document.createElement("div");
        div.className = "suggestion-item";
        div.style.cursor = "pointer";
        div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">'
        + '<path d="M7.38338 15.6772C2.84281 9.09472 2 8.41916 2 6C2 2.68628 4.68628 0 8 0C11.3137 0 14 2.68628 14 6C14 8.41916 13.1572 9.09472 8.61662 15.6772C8.31866 16.1076 7.68131 16.1076 7.38338 15.6772ZM8 8.5C9.38072 8.5 10.5 7.38072 10.5 6C10.5 4.61928 9.38072 3.5 8 3.5C6.61928 3.5 5.5 4.61928 5.5 6C5.5 7.38072 6.61928 8.5 8 8.5Z" fill="#E31C2A"/>'
        + '</svg>'
        + '<span style="font-size:13px;font-weight:500;color:#000;">' + item.name + '</span>';
        // Xử lý khi người dùng click vào một gợi ý
        div.onclick = function () {
          searchInput.value = item.name;
          searchBtn.setAttribute(
            "data-url",
            domain + dataUrl + highway + item.id,
          );
          suggestionsBox.innerHTML = "";
          this.hidden = true;
        };
        suggestionsBox.appendChild(div);
      });
    } else {
      suggestionsBox.setAttribute("hidden", true);
      suggestionsBox.hidden = true;
    }
  }
  async function costs_single_search(input, suggestionsBox, searchInput) {
    let dataUrl = "/web/guest/trangchu/thongtintructuyen/cuocphituyenduong";
    let highway = "?highway-id=";
    let station = "&station-id=";
    suggestionsBox.innerHTML = ""; // Xóa gợi ý cũ
    if (input.length > 0) {
      suggestionsBox.hidden = false;
      // Lọc dữ liệu
      let res = await get_data_api_not_timeout(
        domain + "/o/c/stationinfos?pageSize=500",
      );
      let dataStationinfo = null;
      if (res.items) {
        dataStationinfo = get_data_costs_search(res.items);
      } else {
        dataStationinfo = dataStation;
      }
      // const filteredData = dataStation.filter((item) =>
      const filteredData = dataStationinfo.filter((item) =>
        item.name.toLowerCase().includes(input),
      );
      // Hiển thị gợi ý
      filteredData.forEach((item) => {
        const div = document.createElement("div");
        // div.textContent = item.name;
        div.className = "suggestion-item";
        div.style.cursor = "pointer";
        div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">'
        + '<path d="M7.38338 15.6772C2.84281 9.09472 2 8.41916 2 6C2 2.68628 4.68628 0 8 0C11.3137 0 14 2.68628 14 6C14 8.41916 13.1572 9.09472 8.61662 15.6772C8.31866 16.1076 7.68131 16.1076 7.38338 15.6772ZM8 8.5C9.38072 8.5 10.5 7.38072 10.5 6C10.5 4.61928 9.38072 3.5 8 3.5C6.61928 3.5 5.5 4.61928 5.5 6C5.5 7.38072 6.61928 8.5 8 8.5Z" fill="#E31C2A"/>'
        + '</svg>'
        + '<span style="font-size:13px;font-weight:500;color:#000;">' + item.name + '</span>';
        // Xử lý khi người dùng click vào một gợi ý
        div.onclick = function () {
          searchInput.value = item.name;
          searchBtn.setAttribute(
            "data-url",
            domain + dataUrl + highway + item.highway_id + station + item.id,
          );
          suggestionsBox.innerHTML = "";
          this.hidden = true;
        };
        suggestionsBox.appendChild(div);
      });
    } else {
      suggestionsBox.setAttribute("hidden", true);
      suggestionsBox.hidden = true;
    }
  }
     async function costs_search(input, suggestionsBox, searchInput) {
    // Data tra cứu cước phí
    let dataStation = [
      { id: 578726, name: "Trạm Long Phước", highway_id: 42753 },
      { id: 578728, name: "Trạm 319 - HLD", highway_id: 42753 },
      { id: 578730, name: "Trạm QL51", highway_id: 42753 },
      { id: 578732, name: "Trạm Dầu Giây - Phan Thiết", highway_id: 42753 },
      { id: 578734, name: "Trạm Dầu Giây", highway_id: 42753 },
      { id: 578736, name: "Trạm dừng nghỉ", highway_id: 42753 },
      { id: 580027, name: "Nút giao An Phú", highway_id: 42753 },
      { id: 580029, name: "Nút giao Vành đai II", highway_id: 42753 },
      { id: 580031, name: "Nút giao Đỗ Xuân Hợp", highway_id: 42753 },
      { id: 580033, name: "Nút giao Quốc lộ 51", highway_id: 42753 },
      { id: 580035, name: "Nút giao Dầu Giây", highway_id: 42753 },
      { id: 635929, name: "Nút giao VĐ 3 - HLD (C)", highway_id: 42753 },
      { id: 636186, name: "Nút giao VĐ 3 - HLD (O)", highway_id: 42753 },
      { id: 169480, name: "Nút giao Lập Thạch - Vĩnh Phúc", highway_id: 43943 },
      { id: 169483, name: "Nút giao Phù Ninh ", highway_id: 43943 },
      { id: 169485, name: "Nút giao Sai Nga", highway_id: 43943 },
      { id: 169487, name: "Nút giao TP.Yên Bái", highway_id: 43943 },
      { id: 169489, name: "Nút giao Mậu A", highway_id: 43943 },
      { id: 169491, name: "Nút giao Tam Đảo - Vĩnh Yên", highway_id: 43943 },
      { id: 169493, name: "Nút giao Hầm chui QL 2", highway_id: 43943 },
      { id: 169495, name: "Nút giao Bình Xuyên", highway_id: 43943 },
      { id: 169497, name: "Nút giao Văn Bàn", highway_id: 43943 },
      { id: 169499, name: "Nút giao Xuân Giao", highway_id: 43943 },
      { id: 169501, name: "Nút giao IC18", highway_id: 43943 },
      { id: 174124, name: "Trạm thu phí Km6+000", highway_id: 43943 },
      { id: 174126, name: "Trạm thu phí IC3", highway_id: 43943 },
      { id: 174128, name: "Trạm thu phí IC4", highway_id: 43943 },
      { id: 174130, name: "Trạm thu phí IC6", highway_id: 43943 },
      { id: 174134, name: "Trạm thu phí IC17", highway_id: 43943 },
      { id: 174136, name: "Trạm thu phí IC13", highway_id: 43943 },
      { id: 174138, name: "Trạm thu phí IC10", highway_id: 43943 },
      { id: 174140, name: "Trạm thu phí IC12", highway_id: 43943 },
      { id: 174142, name: "Trạm thu phí IC14", highway_id: 43943 },
      { id: 174144, name: "Trạm Thu phí IC8", highway_id: 43943 },
      { id: 174146, name: "Trạm thu phí IC7", highway_id: 43943 },
      { id: 575693, name: "Trạm dừng nghỉ Km22+900", highway_id: 43943 },
      { id: 575695, name: "Trạm dừng nghỉ Km 57+500", highway_id: 43943 },
      { id: 575697, name: "Trạm dừng nghỉ Km 117+500", highway_id: 43943 },
      { id: 575699, name: "Trạm dừng nghỉ Km 171+500", highway_id: 43943 },
      { id: 575701, name: "Trạm dừng nghỉ Km 236+900", highway_id: 43943 },
      { id: 590329, name: "Trạm thu phí IC11", highway_id: 43943 },
      { id: 635263, name: "Trạm thu phí IC9", highway_id: 43943 },
      { id: 635340, name: "Trạm thu phí IC16", highway_id: 43943 },
      { id: 635362, name: "Trạm thu phí Km237", highway_id: 43943 },
      { id: 636160, name: "Phố Lu", highway_id: 43943 },
      { id: 571397, name: "Trạm Túy Loan - Km4", highway_id: 44090 },
      { id: 571400, name: "Trạm Phong Thử - Km 13 ", highway_id: 44090 },
      { id: 571402, name: "Trạm Hà Lam - Km 41", highway_id: 44090 },
      { id: 571404, name: "Trạm Tam Kỳ - Km64", highway_id: 44090 },
      { id: 571406, name: "Trạm Chu Lai - Km 83", highway_id: 44090 },
      { id: 571408, name: "Trạm Bắc Quảng Ngãi - Km 124", highway_id: 44090 },
      { id: 571410, name: "Trạm Quảng Ngãi - Km 130", highway_id: 44090 },
      { id: 635498, name: "Trạm thu phí Dung Quất", highway_id: 44090 },
      { id: 572765, name: "Trạm thu phí Liêm Tuyền", highway_id: 44147 },
      { id: 572767, name: "Trạm thu phí Cao Bồ", highway_id: 44147 },
      { id: 572769, name: "Trạm thu phí Vực Vòng", highway_id: 44147 },
      { id: 572888, name: "Nút giao Đại Xuyên", highway_id: 44147 },
      { id: 572890, name: "Nút giao Vực Vòng", highway_id: 44147 },
      { id: 572904, name: "Nút giao Liêm Tuyền", highway_id: 44147 },
      { id: 572907, name: "Nút giao Cao Bồ", highway_id: 44147 },
      { id: 573035, name: "Trạm dừng nghỉ KM 227", highway_id: 44147 },
      { id: 629662, name: "Trạm thu phí Đại Xuyên", highway_id: 44147 },
      { id: 635996, name: "Trạm thu phí Pháp Vân", highway_id: 44147 },
      { id: 635998, name: "Trạm Thu phí Thường Tín", highway_id: 44147 },
      { id: 636000, name: "Trạm thu phí Vạn Điểm", highway_id: 44147 },
      { id: 636002, name: "Trạm thu phí Cầu Giẽ Hà Nam", highway_id: 44147 },
    ];
    suggestionsBox.innerHTML = ""; // Xóa gợi ý cũ   
    
    if (input.length > 0) {
      console.log('Dữ liệu: ', input);
      suggestionsBox.hidden = false;
      document.getElementById("suggestions").style.display = "block";
      let dataStationinfo = dataStation;
      let data_url = get_data_url(dataStationinfo, input);      
      if (data_url.length > 0) {
        searchBtn.setAttribute("data-url", data_url);        
      } else {
        showVecModal("Không tìm thấy kết quả phù hợp. Vui lòng thử lại với từ khóa khác.");
      }

      const filteredData = dataStationinfo.filter((item) =>
        item.name.toLowerCase().includes(dataStationinfo, input),
      );
      // Hiển thị gợi ý
      filteredData.forEach((item) => {
        const div = document.createElement("div");
        div.className = "suggestion-item";
        div.style.cursor = "pointer";
        div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">'
        + '<path d="M7.38338 15.6772C2.84281 9.09472 2 8.41916 2 6C2 2.68628 4.68628 0 8 0C11.3137 0 14 2.68628 14 6C14 8.41916 13.1572 9.09472 8.61662 15.6772C8.31866 16.1076 7.68131 16.1076 7.38338 15.6772ZM8 8.5C9.38072 8.5 10.5 7.38072 10.5 6C10.5 4.61928 9.38072 3.5 8 3.5C6.61928 3.5 5.5 4.61928 5.5 6C5.5 7.38072 6.61928 8.5 8 8.5Z" fill="#E31C2A"/>'
        + '</svg>'
        + '<span style="font-size:13px;font-weight:500;color:#000;">' + item.name + '</span>';
        // Xử lý khi người dùng click vào một gợi ý
        div.onclick = function () {
          searchInput.value = item.name;
          searchBtn.setAttribute("data-url", data_url);
          suggestionsBox.innerHTML = "";
          this.hidden = true;
        };
        suggestionsBox.appendChild(div);
      });
    } else {
      suggestionsBox.setAttribute("hidden", true);
      suggestionsBox.hidden = true;
    }
  }
  function traffic_search(input, suggestionsBox, searchInput) {    
    
    let dataUrl = "/web/guest/trangchu/thongtintructuyen/giaothongtrentuyen";
    let highway = "?highway-id=";
    suggestionsBox.innerHTML = ""; // Xóa gợi ý cũ
    if (input.length > 0) {
      suggestionsBox.hidden = false;
      document.getElementById("suggestions").style.display = "block";
      // Lọc dữ liệu
      const filteredData = dataTuyenDuong.filter((item) =>
        item.name.toLowerCase().includes(input),
      );
      // Hiển thị gợi ý
      filteredData.forEach((item) => {
        const div = document.createElement("div");
        // div.textContent = item.name;
        div.className = "suggestion-item";
        div.style.cursor = "pointer";
        div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">'
        + '<path d="M7.38338 15.6772C2.84281 9.09472 2 8.41916 2 6C2 2.68628 4.68628 0 8 0C11.3137 0 14 2.68628 14 6C14 8.41916 13.1572 9.09472 8.61662 15.6772C8.31866 16.1076 7.68131 16.1076 7.38338 15.6772ZM8 8.5C9.38072 8.5 10.5 7.38072 10.5 6C10.5 4.61928 9.38072 3.5 8 3.5C6.61928 3.5 5.5 4.61928 5.5 6C5.5 7.38072 6.61928 8.5 8 8.5Z" fill="#E31C2A"/>'
        + '</svg>'
        + '<span style="font-size:13px;font-weight:500;color:#000;">' + item.name + '</span>';
        // Xử lý khi người dùng click vào một gợi ý
        div.onclick = function () {
          console.log('url', domain + dataUrl + highway + item.id);
          
          searchInput.value = item.name;
          // searchBtn.setAttribute('data-url', domain + item.url);
          searchBtn.setAttribute(
            "data-url",
            domain + dataUrl + highway + item.id,
          );
          suggestionsBox.innerHTML = "";
          this.hidden = true;
        };
        suggestionsBox.appendChild(div);
      });
    } else {
      suggestionsBox.setAttribute("hidden", true);
      suggestionsBox.hidden = true;
    }
  }
  function camera_search_1(input, suggestionsBox, searchInput) {
    let dataUrl = "/web/guest/trangchu/thongtintructuyen/hinhanhvideotructuyen";
    let highway = "?highway-id=";
    suggestionsBox.innerHTML = ""; // Xóa gợi ý cũ
    if (input.length > 0) {
      suggestionsBox.hidden = false;
      // Lọc dữ liệu
      const filteredData = dataTuyenDuong.filter((item) =>
        item.name.toLowerCase().includes(input),
      );
      // Hiển thị gợi ý
      filteredData.forEach((item) => {
        const div = document.createElement("div");
        // div.textContent = item.name;
        div.className = "suggestion-item";
        div.style.cursor = "pointer";
        div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">'
        + '<path d="M7.38338 15.6772C2.84281 9.09472 2 8.41916 2 6C2 2.68628 4.68628 0 8 0C11.3137 0 14 2.68628 14 6C14 8.41916 13.1572 9.09472 8.61662 15.6772C8.31866 16.1076 7.68131 16.1076 7.38338 15.6772ZM8 8.5C9.38072 8.5 10.5 7.38072 10.5 6C10.5 4.61928 9.38072 3.5 8 3.5C6.61928 3.5 5.5 4.61928 5.5 6C5.5 7.38072 6.61928 8.5 8 8.5Z" fill="#E31C2A"/>'
        + '</svg>'
        + '<span style="font-size:13px;font-weight:500;color:#000;">' + item.name + '</span>';
        // Xử lý khi người dùng click vào một gợi ý
        div.onclick = function () {
          searchInput.value = item.name;
          searchBtn.setAttribute(
            "data-url",
            domain + dataUrl + highway + item.id,
          );
          suggestionsBox.innerHTML = "";
          this.hidden = true;
        };
        suggestionsBox.appendChild(div);
      });
    } else {
      suggestionsBox.setAttribute("hidden", true);
      suggestionsBox.hidden = true;
    }
  }
	function camera_search(input, suggestionsBox, searchInput) {
    let dataUrl = "/web/guest/trangchu/thongtintructuyen/hinhanhvideotructuyen";
    let highway = "?highway-id=";
    suggestionsBox.innerHTML = ""; // Xóa gợi ý cũ
    if (input.length > 0) {
      suggestionsBox.hidden = false;
      document.getElementById("suggestions").style.display = "block";
      // Lọc dữ liệu
      const filteredData = dataTuyenDuong.filter((item) =>
        item.name.toLowerCase().includes(input),
      );
      // Hiển thị gợi ý
      filteredData.forEach((item) => {
        const div = document.createElement("div");
        // div.textContent = item.name;
        div.className = "suggestion-item";
        div.style.cursor = "pointer";
        div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">'
        + '<path d="M7.38338 15.6772C2.84281 9.09472 2 8.41916 2 6C2 2.68628 4.68628 0 8 0C11.3137 0 14 2.68628 14 6C14 8.41916 13.1572 9.09472 8.61662 15.6772C8.31866 16.1076 7.68131 16.1076 7.38338 15.6772ZM8 8.5C9.38072 8.5 10.5 7.38072 10.5 6C10.5 4.61928 9.38072 3.5 8 3.5C6.61928 3.5 5.5 4.61928 5.5 6C5.5 7.38072 6.61928 8.5 8 8.5Z" fill="#E31C2A"/>'
        + '</svg>'
        + '<span style="font-size:13px;font-weight:500;color:#000;">' + item.name + '</span>';
        // Xử lý khi người dùng click vào một gợi ý
        div.onclick = function () {
          searchInput.value = item.name;
          searchBtn.setAttribute(
            "data-url",
            domain + dataUrl + highway + item.id,
          );
          suggestionsBox.innerHTML = "";
          this.hidden = true;
        };
        suggestionsBox.appendChild(div);
      });
    } else {
      suggestionsBox.setAttribute("hidden", true);
      suggestionsBox.hidden = true;
    }
  }
  function get_data_costs_search(params) {
    let data = [];
    params.forEach((item) => {
      data.push({
        id: item.id,
        name: item.name,
        highway_id: item.r_stationInfoAndHighwayFK_c_highwayId,
      });
    });
    return data;
  }
  function convert_text_array(str) {
    // let string = "Trạm Long Phương, Trạm 319 - HLD";
    let array = str.split(", ");
    return array;
  }
    function get_data_url(data, input) {
    let dataUrl =
      "/web/guest/trangchu/thongtintructuyen/cuocphituyenduong?highway-id=";
    let station_from = "&station-from-id=";
    let station_to = "&station-to-id=";
    let id = "";
    let highway_id = null;
    let station_from_id = "";
    let station_to_id = "";
    let url = "";
    let dem = 0;
    if (!Array.isArray(input) || !Array.isArray(data)) {
      return;
    }
    input.forEach((value) => {
      data.forEach((v) => {
        if (value.toLowerCase().trim() === v.name.toLowerCase().trim()) {
          highway_id = v.highway_id;
          if (dem == 0) {
            station_from_id = v.id;
          } else {
            station_to_id = v.id;
          }
          dem += 1;
        }
      });
    });
      url =
          dataUrl +
          highway_id +
          station_from +
          station_from_id +
          station_to +
          station_to_id;
    return url;
  }
  // ---------------------------------------------------------------------------
  // VEC ALERT MODAL – thay thế window.alert()
  // ---------------------------------------------------------------------------
  function showVecModal(message) {
    const overlay = document.getElementById("vecAlertModal");
    const msgEl   = document.getElementById("vecModalTitle");
    if (!overlay) return;
    if (message) msgEl.textContent = message;
    overlay.removeAttribute("hidden");
    document.getElementById("vecModalCloseBtn").focus();
  }

  function hideVecModal() {
    const overlay = document.getElementById("vecAlertModal");
    if (overlay) overlay.setAttribute("hidden", true);
  }

  document.addEventListener("click", function (e) {
    const overlay = document.getElementById("vecAlertModal");
    if (!overlay || overlay.hidden) return;
    if (e.target === overlay || e.target.id === "vecModalCloseBtn") {
      hideVecModal();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hideVecModal();
  });
  // --------------------------------------------------------------------------- 
})();	
	
(function () {
  const hero = document.querySelector(".homepage-hero");
  if (!hero) return;

  let isSnapping = false;

  window.addEventListener(
    "wheel",
    function (e) {
      if (isSnapping) return;

      const rect = hero.getBoundingClientRect();
      const heroVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (!heroVisible) return; // hero đã cuộn qua hẳn -> để trình duyệt scroll bình thường

      if (e.deltaY > 0) {
        // Cuộn xuống khi còn ở hero -> nhảy hẳn xuống phần tử ngay sau hero
        e.preventDefault();
        isSnapping = true;

        const heroBottom = window.scrollY + rect.bottom;
        window.scrollTo({ top: heroBottom, behavior: "smooth" });

        setTimeout(function () {
          isSnapping = false;
        }, 700);
      } else if (e.deltaY < 0) {
        // Cuộn lên và chạm lại vùng hero -> về thẳng đầu trang
        e.preventDefault();
        isSnapping = true;

        window.scrollTo({ top: 0, behavior: "smooth" });

        setTimeout(function () {
          isSnapping = false;
        }, 700);
      }
    },
    { passive: false }
  );
})();
</script>
