<#assign banners = [] />
<#list entries as entry>
    <#assign rawContent = (entry.getAssetRenderer().getArticle().getContent())!"" />

    <#if rawContent?has_content>
        <#assign root = saxReaderUtil.read(rawContent).getRootElement() />
        <#assign bgNode = root.selectSingleNode("//dynamic-element[@field-reference='backGround']/dynamic-content") />
        <#assign bgJson = bgNode?has_content?then(jsonFactoryUtil.createJSONObject(bgNode.getText()), "") />

        <#assign banners = banners + [{
            "title": (root.selectSingleNode("//dynamic-element[@field-reference='title']/dynamic-content").getText())!"",
            "description": (root.selectSingleNode("//dynamic-element[@field-reference='description']/dynamic-content").getText())!"",
            "subTitle": (root.selectSingleNode("//dynamic-element[@field-reference='subTitle']/dynamic-content").getText())!"",
            "image": bgJson?has_content?then(bgJson.getString("url"), "")
        }] />
    </#if>
</#list>

<#assign tabs = [
    {
        "key": "routes",
        "label": "TUYẾN ĐƯỜNG",
        "alt": "Tuyến đường",
        "icon": "/documents/d/guest/route-icon-png",
        "url": "/web/guest/trangchu/thongtintructuyen/thongtintuyenduong",
        "search": "Tìm kiếm tuyến đường cao tốc"
    },
    {
        "key": "costs",
        "label": "CƯỚC PHÍ",
        "alt": "Cước phí",
        "icon": "/documents/20117/50051/elements.png/a453332c-3929-294d-e27a-3d11322940b2?version=1.0&t=1767807055137",
        "url": "/web/guest/trangchu/thongtintructuyen/cuocphituyenduong",
        "search": "Vui lòng nhập điểm đầu, điểm cuối (VD: Trạm Long Phước, Trạm 319 - HLD)"
    },
    {
        "key": "traffic",
        "label": "TÌNH TRẠNG GIAO THÔNG",
        "alt": "Giao thông",
        "icon": "/documents/20117/50051/elements+%281%29.png/bde03114-f27d-aa57-ba74-592b87a11d09?version=1.0&t=1767807086347",
        "url": "/web/guest/trangchu/thongtintructuyen/giaothongtrentuyen",
        "search": "Tìm kiếm tình trạng giao thông trên tuyến"
    },
    {
        "key": "camera",
        "label": "CAMERA TRỰC TUYẾN",
        "alt": "Camera",
        "icon": "/documents/20117/50051/elements+%282%29.png/3e781144-2b05-9fc2-a73a-8914c546febd?version=1.0&t=1767807111300",
        "url": "/web/guest/trangchu/thongtintructuyen/hinhanhvideotructuyen",
        "search": "Tìm kiếm camera trên tuyến"
    }
] />

<#-- Chỉ preload ảnh của slide đầu tiên: các slide sau dựng sau 800ms nên không cần tranh băng thông lúc LCP -->
<#if banners?has_content && banners[0].image?has_content>
    <link rel="preload" as="image" href="${banners[0].image}" fetchpriority="high" />
</#if>

<div class="homepage-hero">
    <div class="hero-slider vec-fade-in">
        <div class="slides vec-fade-in-up vec-delay-500">
            <#list banners as banner>
                <div class="slide" data-title="${banner.title}" data-description="${banner.description}" data-image="${banner.image}"></div>
            </#list>
        </div>

        <button class="nav prev vec-fade-in" type="button" aria-label="Slide trước">&#10094;</button>
        <button class="nav next vec-fade-in" type="button" aria-label="Slide sau">&#10095;</button>

        <div class="main-banner container">
            <div class="content" data-aos="zoom-in-up" data-aos-once="false">
                <h1 id="title"></h1>
                <p id="description"></p>
            </div>

            <div class="vec-section" data-aos="fade-up" data-aos-once="false">
                <div class="vec-tabs">
                    <#list tabs as tab>
                        <#if tab?index gt 0>
                            <div class="vec-divider"></div>
                        </#if>

                        <div class="vec-tab<#if tab?index == 0> active</#if>" data-tab="${tab.key}" data-search="${tab.search}" data-url="${tab.url}">
                            <span class="icon"><img src="${tab.icon}" alt="${tab.alt}" width="20" /></span>
                            ${tab.label}
                        </div>
                    </#list>
                </div>

                <div class="vec-search">
                    <img src="/documents/20117/50051/location-06.png/e4b80073-3afb-fccf-694b-bec244efec29?version=1.0&t=1767807137569" alt="" class="search-icon" width="18" />

                    <input id="search" placeholder="Tìm kiếm tuyến đường cao tốc" autocomplete="off" tabindex="1" />

                    <a class="search-btn" target="_blank">
                        <img src="/documents/20117/50051/Search+Icon.png/92892458-b46c-ce55-27e1-87dc207bc4f5?version=1.0&t=1767807184479" alt="Tìm kiếm" class="search-arrow" tabindex="2" />
                    </a>
                </div>

                <div id="suggestions" hidden></div>
            </div>
        </div>

        <div class="vec-info">
            <#list banners as banner>
                <div class="vec-info-item">${banner.subTitle}</div>
            </#list>
        </div>
    </div>
</div>

<div id="vecAlertModal" class="vec-modal-overlay" aria-modal="true" role="dialog" aria-labelledby="vecModalTitle" hidden>
    <div class="vec-modal-box">
        <div class="vec-modal-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="#FFF3CD" />
                <path d="M12 7v5" stroke="#E6A817" stroke-width="2" stroke-linecap="round" />
                <circle cx="12" cy="16" r="1.2" fill="#E6A817" />
            </svg>
        </div>
        <p id="vecModalTitle" class="vec-modal-message">Vui lòng chọn đường cao tốc và trạm thu phí hợp lệ để tra cứu cước phí.</p>
        <button class="vec-modal-close-btn" id="vecModalCloseBtn" type="button" aria-label="Đóng">Đóng</button>
    </div>
</div>

<style>
  input::placeholder {
    color: black;
  }

  .homepage-hero {
    position: relative;
    width: 100%;
    min-height: 100vh;
    height: 100vh;
    max-height: 100vh;
    font-family: "Inter", Arial, sans-serif;
  }

  .homepage-hero .hero-slider {
    position: relative;
    width: 100%;
    min-height: 100vh;
    height: 100vh;
    max-height: 100vh;
    overflow: hidden;
  }

  .homepage-hero .slides {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

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
    max-width: none;
    text-align: center;
    color: #ffffff;
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
    color: #ffffff;
    font-size: 19px;
    font-weight: 500;
    line-height: 30px;
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

  .homepage-hero .nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 6;
    background: transparent;
    border: none;
    color: #ffffff;
    font-size: 32px;
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
    display: grid;
    grid-template-columns: auto 30px auto 30px auto 30px auto;
    align-items: center;
    width: 964px;
    height: 56px;
    margin: 0 auto;
    background: #007AC5;
    border-radius: 16px 16px 0 0;
  }

  .vec-tab {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.2);
    font-size: 16px;
    font-weight: 500;
    text-transform: uppercase;
    white-space: nowrap;
    cursor: pointer;
  }

  .homepage-hero .vec-tab .icon img {
    display: block;
    width: 18px;
    height: 18px;
    margin: auto auto 6px;
    opacity: 0.4;
  }

  .vec-tab.active {
    color: #ffffff;
    font-weight: 600;
  }

  .vec-tab:hover {
    color: #ffffff;
  }

  .vec-tab.active .icon img,
  .vec-tab:hover .icon img {
    opacity: 1;
  }

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

  .homepage-hero .vec-search {
    display: flex;
    align-items: center;
    max-width: 1056px;
    height: 80px;
    margin: 0 auto;
    padding: 12px;
    background: rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(6px);
    border-radius: 15.27px;
  }

  .homepage-hero .vec-search input {
    flex: 1;
    margin-left: 10px;
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
    font-size: 18px;
  }

  .homepage-hero .vec-search input::placeholder {
    color: #d3d2d0;
    opacity: 1; /* Firefox mặc định giảm opacity của placeholder */
    font-size: 18px;
    font-weight: 400;
  }

  .homepage-hero .vec-search img {
    height: 18px;
    border-radius: 10px;
  }

  .homepage-hero .vec-search .search-btn img {
    height: 42px;
    margin: auto;
    padding: 9px;
    background-color: #E31C2A;
    border-radius: 10px;
  }

  .homepage-hero .vec-info {
    position: absolute;
    bottom: 52px;
    left: 50%;
    transform: translateX(-50%) !important;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    width: 100%;
    max-width: 1100px;
    z-index: 6;
    color: #fff;
    text-align: center;
  }

  .homepage-hero .vec-info-item {
    color: #FFF;
    font-size: 18px;
    font-weight: 500;
    line-height: 24px;
    text-align: left;
  }

  .homepage-hero .vec-info-item::before {
    content: "";
    display: block;
    width: 230px;
    height: 1px;
    margin: 0 0 10px;
    background: rgba(255, 255, 255, 0.4);
  }

  .homepage-hero .vec-info-item.active::before {
    background: #00AFFB;
  }

  #suggestions {
    position: absolute;
    top: 58%;
    left: 22%;
    width: 56.5%;
    max-height: 240px;
    overflow-x: hidden;
    overflow-y: auto;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
    z-index: 99999;
  }

  #suggestions[hidden] {
    display: none;
  }

  .suggestion-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    border-bottom: 1px solid #eee;
    color: #333;
    font-size: 14px;
    cursor: pointer;
  }

  .suggestion-item:last-child {
    border-bottom: none;
  }

  .suggestion-item:hover {
    background-color: #f3f6fb;
  }

  .suggestion-name {
    color: #000;
    font-size: 13px;
    font-weight: 500;
  }

  .vec-modal-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.45);
    animation: vecModalFadeIn 0.2s ease;
    z-index: 99999;
  }

  .vec-modal-overlay[hidden] {
    display: none;
  }

  @keyframes vecModalFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes vecModalSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .vec-modal-box {
    width: calc(100% - 40px);
    max-width: 420px;
    padding: 36px 32px 28px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    text-align: center;
    animation: vecModalSlideUp 0.25s ease;
  }

  .vec-modal-icon {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
  }

  .vec-modal-message {
    margin: 0 0 24px;
    color: #1a1a2e;
    font-family: "Inter", Arial, sans-serif;
    font-size: 15px;
    font-weight: 500;
    line-height: 1.6;
  }

  .vec-modal-close-btn {
    display: inline-block;
    padding: 10px 36px;
    background: #007AC5;
    border: none;
    border-radius: 10px;
    color: #ffffff;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .vec-modal-close-btn:hover {
    background: #005f9e;
  }

  @media (max-width: 1292px) {
    .hero-slider .content #description {
      font-size: 16px;
    }

    .homepage-hero .content h1 {
      font-size: 48px;
      line-height: 60px;
    }
  }

  @media (max-width: 1024px) {
    .homepage-hero,
    .homepage-hero .hero-slider {
      min-height: 90vh;
    }

    .homepage-hero .content p {
      width: 768px;
      max-width: 100%;
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

  @media (max-width: 768px) {
    .homepage-hero,
    .homepage-hero .hero-slider {
      min-height: 90vh;
      padding-bottom: 10px;
    }

    .homepage-hero .content h1 {
      max-width: 100%;
      font-size: 36px;
      line-height: 44px;
    }

    .homepage-hero .content p {
      max-width: 100%;
      font-size: 16px;
      line-height: 26px;
    }

    .hero-slider .content #description {
      font-size: 14px !important;
    }

    .homepage-hero .prev,
    .homepage-hero .next {
      display: none;
    }

    .homepage-hero .vec-section {
      position: relative;
      width: 100%;
      max-width: 100%;
      margin: 32px auto 0;
    }

    .homepage-hero .vec-tabs {
      display: flex !important;
      align-items: start;
      width: calc(100% - 20px);
      height: auto;
      max-height: 65px;
      margin: 0 auto;
      gap: 0;
      border-radius: 15px;
      overflow: hidden;
      box-sizing: border-box;
    }

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
      flex: 1;
      flex-direction: column;
      gap: 4px;
      min-width: 0 !important;
      width: 25%;
      padding: 10px 5px;
      border-radius: 15px;
      font-size: 10px;
      line-height: 1.3;
      text-align: center;
      white-space: normal;
    }

    .homepage-hero .vec-tabs .vec-tab {
      font-size: 8px;
    }

    .homepage-hero .vec-tab .icon {
      display: block;
      margin: 0 auto 4px;
    }

    .homepage-hero .vec-tab .icon img {
      width: 20px;
      height: 20px;
      margin: 0 auto;
    }

    .homepage-hero .vec-search {
      width: calc(100% - 20px);
      height: 60px;
      max-height: 65px;
      margin: 0 auto;
      padding: 8px;
      border-radius: 15px;
      box-sizing: border-box;
    }

    .homepage-hero .vec-search input {
      margin-left: 8px;
      margin-right: 8px;
      font-size: 16px;
    }

    .homepage-hero .vec-search input::placeholder {
      font-size: 14px;
    }

    .homepage-hero .vec-search .search-btn img {
      height: 36px;
      padding: 8px;
    }

    .homepage-hero .vec-info {
      display: none;
    }

    #suggestions {
      left: 15px;
      width: 92%;
    }

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
  }

  @media (max-width: 480px) {
    .homepage-hero {
      padding-bottom: 0px !important;
      --line-width: 50px;
      --line-gap: 6px;
    }

    .homepage-hero,
    .homepage-hero .hero-slider {
      min-height: 80vh;
    }

    .homepage-hero .content h1 {
      margin-bottom: 10px;
      font-size: 24px;
      font-weight: 700;
      line-height: 30px;
    }

    .homepage-hero .content p {
      font-size: 14px;
      font-weight: 500;
      line-height: 22px;
    }

    .homepage-hero .vec-section {
      margin-top: 24px;
    }

    .homepage-hero .vec-tabs {
      width: calc(100% - 32px);
      height: 65px;
      margin: 0 auto;
      border-radius: 15px;
    }

    .homepage-hero .vec-tab {
      gap: 2px;
      font-size: 10px;
    }

    .homepage-hero .vec-tab .icon img {
      width: 18px;
      height: 18px;
    }

    .homepage-hero .vec-search {
      width: calc(100% - 32px);
      height: 65px;
      margin: 0 auto;
      border-radius: 15px;
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

    .vec-modal-box {
      padding: 28px 20px 22px;
    }

    .vec-modal-message {
      font-size: 14px;
    }
  }

  @media (max-width: 393px) {
    .homepage-hero {
      --line-width: 45px;
      --line-gap: 5px;
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
      padding: 8px 2px;
      font-size: 8px;
    }

    .homepage-hero .vec-tab .icon img {
      width: 16px;
      height: 16px;
    }
  }
</style>

<script>
  (function () {
    const hero = document.querySelector(".homepage-hero");
    if (!hero) return;

    const SLIDE_INTERVAL = 5000;
    const STRIP_COUNT = 8;
    const STRIP_BUILD_DELAY = 800;
    const PIN_SVG =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">' +
      '<path d="M7.38338 15.6772C2.84281 9.09472 2 8.41916 2 6C2 2.68628 4.68628 0 8 0C11.3137 0 14 2.68628 14 6C14 8.41916 13.1572 9.09472 8.61662 15.6772C8.31866 16.1076 7.68131 16.1076 7.38338 15.6772ZM8 8.5C9.38072 8.5 10.5 7.38072 10.5 6C10.5 4.61928 9.38072 3.5 8 3.5C6.61928 3.5 5.5 4.61928 5.5 6C5.5 7.38072 6.61928 8.5 8 8.5Z" fill="#E31C2A"/>' +
      "</svg>";

    const HIGHWAYS = [
      { id: 42753, name: "Cao tốc Hồ Chí Minh - Long Thành - Dầu Giây" },
      { id: 43943, name: "Cao tốc Nội Bài - Lào Cai" },
      { id: 44090, name: "Cao tốc Đà Nẵng - Quảng Ngãi" },
      { id: 44147, name: "Cao tốc Cầu Giẽ - Ninh Bình" },
      { id: 74573, name: "Cao tốc Bến Lức - Long Thành" }
    ];

    const STATIONS = [
      { id: 578726, name: "Trạm Long Phước", highwayId: 42753 },
      { id: 578728, name: "Trạm 319 - HLD", highwayId: 42753 },
      { id: 578730, name: "Trạm QL51", highwayId: 42753 },
      { id: 578732, name: "Trạm Dầu Giây - Phan Thiết", highwayId: 42753 },
      { id: 578734, name: "Trạm Dầu Giây", highwayId: 42753 },
      { id: 578736, name: "Trạm dừng nghỉ", highwayId: 42753 },
      { id: 580027, name: "Nút giao An Phú", highwayId: 42753 },
      { id: 580029, name: "Nút giao Vành đai II", highwayId: 42753 },
      { id: 580031, name: "Nút giao Đỗ Xuân Hợp", highwayId: 42753 },
      { id: 580033, name: "Nút giao Quốc lộ 51", highwayId: 42753 },
      { id: 580035, name: "Nút giao Dầu Giây", highwayId: 42753 },
      { id: 635929, name: "Nút giao VĐ 3 - HLD (C)", highwayId: 42753 },
      { id: 636186, name: "Nút giao VĐ 3 - HLD (O)", highwayId: 42753 },
      { id: 169480, name: "Nút giao Lập Thạch - Vĩnh Phúc", highwayId: 43943 },
      { id: 169483, name: "Nút giao Phù Ninh", highwayId: 43943 },
      { id: 169485, name: "Nút giao Sai Nga", highwayId: 43943 },
      { id: 169487, name: "Nút giao TP.Yên Bái", highwayId: 43943 },
      { id: 169489, name: "Nút giao Mậu A", highwayId: 43943 },
      { id: 169491, name: "Nút giao Tam Đảo - Vĩnh Yên", highwayId: 43943 },
      { id: 169493, name: "Nút giao Hầm chui QL 2", highwayId: 43943 },
      { id: 169495, name: "Nút giao Bình Xuyên", highwayId: 43943 },
      { id: 169497, name: "Nút giao Văn Bàn", highwayId: 43943 },
      { id: 169499, name: "Nút giao Xuân Giao", highwayId: 43943 },
      { id: 169501, name: "Nút giao IC18", highwayId: 43943 },
      { id: 174124, name: "Trạm thu phí Km6+000", highwayId: 43943 },
      { id: 174126, name: "Trạm thu phí IC3", highwayId: 43943 },
      { id: 174128, name: "Trạm thu phí IC4", highwayId: 43943 },
      { id: 174130, name: "Trạm thu phí IC6", highwayId: 43943 },
      { id: 174134, name: "Trạm thu phí IC17", highwayId: 43943 },
      { id: 174136, name: "Trạm thu phí IC13", highwayId: 43943 },
      { id: 174138, name: "Trạm thu phí IC10", highwayId: 43943 },
      { id: 174140, name: "Trạm thu phí IC12", highwayId: 43943 },
      { id: 174142, name: "Trạm thu phí IC14", highwayId: 43943 },
      { id: 174144, name: "Trạm Thu phí IC8", highwayId: 43943 },
      { id: 174146, name: "Trạm thu phí IC7", highwayId: 43943 },
      { id: 575693, name: "Trạm dừng nghỉ Km22+900", highwayId: 43943 },
      { id: 575695, name: "Trạm dừng nghỉ Km 57+500", highwayId: 43943 },
      { id: 575697, name: "Trạm dừng nghỉ Km 117+500", highwayId: 43943 },
      { id: 575699, name: "Trạm dừng nghỉ Km 171+500", highwayId: 43943 },
      { id: 575701, name: "Trạm dừng nghỉ Km 236+900", highwayId: 43943 },
      { id: 590329, name: "Trạm thu phí IC11", highwayId: 43943 },
      { id: 635263, name: "Trạm thu phí IC9", highwayId: 43943 },
      { id: 635340, name: "Trạm thu phí IC16", highwayId: 43943 },
      { id: 635362, name: "Trạm thu phí Km237", highwayId: 43943 },
      { id: 636160, name: "Phố Lu", highwayId: 43943 },
      { id: 571397, name: "Trạm Túy Loan - Km4", highwayId: 44090 },
      { id: 571400, name: "Trạm Phong Thử - Km 13", highwayId: 44090 },
      { id: 571402, name: "Trạm Hà Lam - Km 41", highwayId: 44090 },
      { id: 571404, name: "Trạm Tam Kỳ - Km64", highwayId: 44090 },
      { id: 571406, name: "Trạm Chu Lai - Km 83", highwayId: 44090 },
      { id: 571408, name: "Trạm Bắc Quảng Ngãi - Km 124", highwayId: 44090 },
      { id: 571410, name: "Trạm Quảng Ngãi - Km 130", highwayId: 44090 },
      { id: 635498, name: "Trạm thu phí Dung Quất", highwayId: 44090 },
      { id: 572765, name: "Trạm thu phí Liêm Tuyền", highwayId: 44147 },
      { id: 572767, name: "Trạm thu phí Cao Bồ", highwayId: 44147 },
      { id: 572769, name: "Trạm thu phí Vực Vòng", highwayId: 44147 },
      { id: 572888, name: "Nút giao Đại Xuyên", highwayId: 44147 },
      { id: 572890, name: "Nút giao Vực Vòng", highwayId: 44147 },
      { id: 572904, name: "Nút giao Liêm Tuyền", highwayId: 44147 },
      { id: 572907, name: "Nút giao Cao Bồ", highwayId: 44147 },
      { id: 573035, name: "Trạm dừng nghỉ KM 227", highwayId: 44147 },
      { id: 629662, name: "Trạm thu phí Đại Xuyên", highwayId: 44147 },
      { id: 635996, name: "Trạm thu phí Pháp Vân", highwayId: 44147 },
      { id: 635998, name: "Trạm Thu phí Thường Tín", highwayId: 44147 },
      { id: 636000, name: "Trạm thu phí Vạn Điểm", highwayId: 44147 },
      { id: 636002, name: "Trạm thu phí Cầu Giẽ Hà Nam", highwayId: 44147 }
    ];

    const slides = hero.querySelectorAll(".slide");
    const infoItems = hero.querySelectorAll(".vec-info-item");
    const contentEl = hero.querySelector(".content");
    const titleEl = hero.querySelector("#title");
    const descEl = hero.querySelector("#description");
    const prevBtn = hero.querySelector(".nav.prev");
    const nextBtn = hero.querySelector(".nav.next");
    const searchInput = hero.querySelector("#search");
    const searchBtn = hero.querySelector(".search-btn");
    const suggestions = hero.querySelector("#suggestions");
    const tabs = hero.querySelectorAll(".vec-tab");

    const domain = window.location.origin;
    let currentIndex = 0;
    let autoSlideTimer = null;
    let activeTab = { key: "routes", url: "" };

    function buildStrips(slide) {
      const image = slide.dataset.image;
      if (!image) return;

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

    function updateInfoIndicator(index) {
      infoItems.forEach((item) => item.classList.remove("active"));
      if (infoItems[index]) infoItems[index].classList.add("active");
    }

    function applySlideText(slide) {
      if (titleEl) titleEl.textContent = slide.dataset.title || "";
      if (descEl) descEl.textContent = slide.dataset.description || "";
    }

    function updateSlide(index, direction) {
      const activeSlide = slides[index];
      if (!activeSlide) return;

      slides.forEach((slide) => slide.classList.remove("active"));
      activeSlide.classList.add("active");

      if (!contentEl) {
        applySlideText(activeSlide);
        updateInfoIndicator(index);
        return;
      }

      const exitClass = direction === "prev" ? "offset-right" : "offset-left";
      const enterClass = direction === "prev" ? "offset-left" : "offset-right";

      contentEl.classList.add(exitClass);

      setTimeout(function () {
        applySlideText(activeSlide);

        contentEl.classList.add("no-transition");
        contentEl.classList.remove(exitClass);
        contentEl.classList.add(enterClass);

        void contentEl.offsetHeight; // ép tính lại layout ngay tại vị trí bắt đầu

        contentEl.classList.remove("no-transition");
        contentEl.classList.remove(enterClass);
      }, 400);

      updateInfoIndicator(index);
    }

    function stopAutoSlide() {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }

    function startAutoSlide() {
      stopAutoSlide();
      if (slides.length < 2) return;

      autoSlideTimer = setInterval(function () {
        if (document.hidden) return;
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlide(currentIndex);
      }, SLIDE_INTERVAL);
    }

    function goToSlide(index, direction) {
      stopAutoSlide();
      currentIndex = index;
      updateSlide(currentIndex, direction);
      startAutoSlide();
    }

    function hideSuggestions() {
      if (!suggestions) return;
      suggestions.innerHTML = "";
      suggestions.hidden = true;
    }

    function renderSuggestions(items, onPick) {
      if (!suggestions) return;

      suggestions.innerHTML = "";
      if (!items.length) {
        suggestions.hidden = true;
        return;
      }

      items.forEach((item) => {
        const row = document.createElement("div");
        row.className = "suggestion-item";
        row.innerHTML = PIN_SVG;

        const label = document.createElement("span");
        label.className = "suggestion-name";
        label.textContent = item.name;
        row.appendChild(label);

        row.addEventListener("click", function () {
          onPick(item);
        });

        suggestions.appendChild(row);
      });

      suggestions.hidden = false;
    }

    function setSearchTarget(url) {
      if (url) searchBtn.setAttribute("data-url", url);
      else searchBtn.removeAttribute("data-url");
    }

    // routes / traffic / camera dùng chung một luồng, chỉ khác đường dẫn đích của tab
    function highwaySearch(rawValue) {
      const query = rawValue.trim().toLowerCase();
      if (!query) {
        hideSuggestions();
        return;
      }

      const matches = HIGHWAYS.filter((item) => item.name.toLowerCase().includes(query));
      renderSuggestions(matches, function (item) {
        searchInput.value = item.name;
        setSearchTarget(domain + activeTab.url + "?highway-id=" + item.id);
        hideSuggestions();
      });
    }

    // Tab cước phí nhập 2 trạm ngăn nhau bằng dấu phẩy, gợi ý theo phần đang gõ dở
    function stationSearch(rawValue) {
      const parts = rawValue.split(",").map((part) => part.trim());
      const query = parts.length > 2 ? "" : parts[parts.length - 1].toLowerCase();
      if (!query) {
        hideSuggestions();
        return;
      }

      const matches = STATIONS.filter((item) => item.name.toLowerCase().includes(query));
      renderSuggestions(matches, function (item) {
        const current = searchInput.value.split(",").map((part) => part.trim());
        current.pop();
        current.push(item.name);

        searchInput.value =
          current.length === 1 ? current.join(", ") + ", " : current.slice(0, 2).join(", ");

        hideSuggestions();
        searchInput.focus();
      });
    }

    // Trả về "" khi chưa đủ 2 trạm hợp lệ, để phía gọi biết mà báo lỗi
    function resolveCostsUrl(rawValue) {
      const names = rawValue
        .split(",")
        .map((part) => part.trim().toLowerCase())
        .filter(Boolean);
      if (names.length < 2) return "";

      let highwayId = null;
      const stationIds = [];

      names.forEach((name) => {
        const found = STATIONS.find((item) => item.name.trim().toLowerCase() === name);
        if (!found) return;
        highwayId = found.highwayId;
        stationIds.push(found.id);
      });

      if (highwayId === null || stationIds.length < 2) return "";

      return (
        domain + activeTab.url +
        "?highway-id=" + highwayId +
        "&station-from-id=" + stationIds[0] +
        "&station-to-id=" + stationIds[1]
      );
    }

    function runSearch(rawValue) {
      if (activeTab.key === "costs") stationSearch(rawValue);
      else highwaySearch(rawValue);
    }

    function showVecModal(message) {
      const overlay = document.getElementById("vecAlertModal");
      if (!overlay) return;

      const messageEl = document.getElementById("vecModalTitle");
      if (messageEl && message) messageEl.textContent = message;

      overlay.removeAttribute("hidden");

      const closeBtn = document.getElementById("vecModalCloseBtn");
      if (closeBtn) closeBtn.focus();
    }

    function hideVecModal() {
      const overlay = document.getElementById("vecAlertModal");
      if (overlay) overlay.setAttribute("hidden", "hidden");
    }

    if (slides.length > 0) {
      // Dựng slide đầu ngay để hero hiện liền; phần còn lại hoãn lại tránh giật lúc tải trang
      buildStrips(slides[0]);
      slides[0].classList.add("active");

      setTimeout(function () {
        for (let i = 1; i < slides.length; i++) buildStrips(slides[i]);
      }, STRIP_BUILD_DELAY);
    }

    hero.addEventListener("mouseenter", stopAutoSlide);
    hero.addEventListener("mouseleave", startAutoSlide);

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goToSlide((currentIndex + 1) % slides.length, "next");
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goToSlide((currentIndex - 1 + slides.length) % slides.length, "prev");
      });
    }

    infoItems.forEach((item, index) => {
      item.style.cursor = "pointer";
      item.addEventListener("click", function () {
        goToSlide(index);
      });
    });

    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        const current = hero.querySelector(".vec-tab.active");
        if (current) current.classList.remove("active");
        tab.classList.add("active");

        activeTab = { key: tab.dataset.tab, url: tab.dataset.url || "" };

        if (searchInput) {
          searchInput.value = "";
          searchInput.placeholder = tab.dataset.search || "";
        }
        setSearchTarget("");
        hideSuggestions();
      });
    });

    const initialTab = hero.querySelector(".vec-tab.active") || tabs[0];
    if (initialTab) {
      activeTab = { key: initialTab.dataset.tab, url: initialTab.dataset.url || "" };
    }

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        setSearchTarget("");
        runSearch(searchInput.value);
      });
    }

    if (searchBtn && searchInput) {
      searchBtn.addEventListener("click", function () {
        const rawValue = searchInput.value;

        if (activeTab.key === "costs") {
          const url = resolveCostsUrl(rawValue);
          setSearchTarget(url);
          if (rawValue.trim() && !url) {
            showVecModal("Không tìm thấy kết quả phù hợp. Vui lòng thử lại với từ khóa khác.");
            return;
          }
        } else {
          runSearch(rawValue);
        }

        const target = searchBtn.getAttribute("data-url") || "";
        if (rawValue.trim() && target) {
          window.open(target, "_blank");
          return;
        }

        showVecModal("Vui lòng nhập thông tin cần tra cứu.");
      });
    }

    document.addEventListener("click", function (e) {
      if (searchInput && !searchInput.contains(e.target) && !suggestions.contains(e.target)) {
        hideSuggestions();
      }

      const overlay = document.getElementById("vecAlertModal");
      if (!overlay || overlay.hidden) return;
      if (e.target === overlay || e.target.id === "vecModalCloseBtn") hideVecModal();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") hideVecModal();
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopAutoSlide();
      else startAutoSlide();
    });

    updateSlide(currentIndex);
    startAutoSlide();
  })();

  (function () {
    const hero = document.querySelector(".homepage-hero");
    if (!hero) return;

    // Chờ người dùng ngừng cuộn rồi mới snap. Nhờ vậy không cần preventDefault, nên
    // chuột và touchpad đi chung một luồng và không còn đánh nhau với cuộn native.
    const SNAP_DELAY = 200;
    // Thời lượng animation. scrollTo behavior:"smooth" không cho chỉnh nên phải tự chạy frame.
    const SNAP_DURATION = 900;
    // Nuốt nốt scroll event do chính animation sinh ra trước khi nghe lại
    const SNAP_SETTLE = 80;
    // Quãng quá ngắn thì bỏ qua, snap vài px chỉ tổ giật
    const MIN_SNAP_DISTANCE = 12;
    // Lệch quá ngưỡng này so với vị trí ta vừa đặt = người dùng đang tự cuộn -> nhường họ
    const USER_SCROLL_TOLERANCE = 3;

    const root = document.scrollingElement || document.documentElement;

    let settleTimer = null;
    let isSnapping = false;
    let direction = null;
    let lastScrollY = window.scrollY;
    let lastWrittenY = null;
    let previousScrollBehavior = "";

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function endSnap() {
      root.style.scrollBehavior = previousScrollBehavior;
      lastWrittenY = null;

      setTimeout(function () {
        isSnapping = false;
        direction = null;
        lastScrollY = window.scrollY;
      }, SNAP_SETTLE);
    }

    function snapTo(target) {
      isSnapping = true;
      clearTimeout(settleTimer);

      // Nếu theme đặt html { scroll-behavior: smooth } thì mỗi frame sẽ tự animate
      // và cuộn bò rất chậm -> tắt trong lúc chạy rồi trả lại nguyên trạng
      previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";

      const start = window.scrollY;
      const distance = target - start;

      if (!distance || typeof requestAnimationFrame !== "function") {
        window.scrollTo(0, target);
        endSnap();
        return;
      }

      let startTime = null;

      requestAnimationFrame(function step(now) {
        // Vị trí thật lệch khỏi cái ta vừa ghi -> người dùng cuộn chen ngang, dừng animation
        if (lastWrittenY !== null && Math.abs(window.scrollY - lastWrittenY) > USER_SCROLL_TOLERANCE) {
          endSnap();
          return;
        }

        if (startTime === null) startTime = now;

        const progress = Math.min((now - startTime) / SNAP_DURATION, 1);
        window.scrollTo(0, start + distance * easeInOutCubic(progress));
        lastWrittenY = window.scrollY; // đọc lại giá trị thật sau khi trình duyệt kẹp biên

        if (progress < 1) requestAnimationFrame(step);
        else endSnap();
      });
    }

    function settle() {
      if (isSnapping || !direction) return;

      const rect = hero.getBoundingClientRect();
      const heroVisible = rect.bottom > 0 && rect.top < window.innerHeight;
      if (!heroVisible) return;

      // Lên mà gặp banner -> lên hẳn đầu trang.
      // Xuống mà banner còn hiện -> xuống hẳn section kế tiếp.
      const target = direction === "up" ? 0 : Math.round(window.scrollY + rect.bottom);
      if (Math.abs(target - window.scrollY) < MIN_SNAP_DISTANCE) return;

      snapTo(target);
    }

    // Nghe "scroll" (passive) thay cho "wheel": gom chung chuột, touchpad, bàn phím,
    // kéo thanh cuộn - tất cả đều quy về "đã ngừng cuộn ở đâu".
    window.addEventListener(
      "scroll",
      function () {
        if (isSnapping) return;

        const y = window.scrollY;
        if (y !== lastScrollY) direction = y > lastScrollY ? "down" : "up";
        lastScrollY = y;

        clearTimeout(settleTimer);
        settleTimer = setTimeout(settle, SNAP_DELAY);
      },
      { passive: true }
    );
  })();
</script>
