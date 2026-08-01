<#assign groupId = themeDisplay.getSiteGroupId() />
<#assign currentLanguageId = locale.toString() />

<#assign siteNavigationMenuLocalService = serviceLocator.findService("com.liferay.site.navigation.service.SiteNavigationMenuLocalService") />
<#assign siteNavigationMenuItemLocalService = serviceLocator.findService("com.liferay.site.navigation.service.SiteNavigationMenuItemLocalService") />

<#assign PRIMARY_NAVIGATION = 1 />

<#-- Menu chính của site, đã sort theo order. Không có menu nào thì allItems rỗng. -->
<#assign allItems = [] />
<#list siteNavigationMenuLocalService.getSiteNavigationMenus(groupId) as menu>
    <#if menu.getType() == PRIMARY_NAVIGATION>
        <#assign allItems = siteNavigationMenuItemLocalService.getSiteNavigationMenuItems(menu.getSiteNavigationMenuId())?sort_by("order") />
    </#if>
</#list>

<#assign languages = [
    {"code": "vi", "key": "VI", "flag": "vn", "title": "Vietnamese"},
    {"code": "en", "key": "EN", "flag": "gb", "title": "English"},
    {"code": "zh-CN", "key": "CN", "flag": "cn", "title": "Chinese"},
    {"code": "ja", "key": "JP", "flag": "jp", "title": "Japanese"}
] />

<#-- typeSettings là chuỗi key=value nhiều dòng, name_<locale> có thể bị nối thêm key khác ở cuối dòng -->
<#assign NAME_STOP_KEYS = [" url=", " useNewTab=", " layoutUuid=", " groupId=", " defaultLanguageId=", " type="] />

<#function getItemName typeSettings>
    <#local nameKey = "name_" + currentLanguageId + "=" />
    <#if !typeSettings?contains(nameKey)>
        <#local nameKey = "name_en_US=" />
    </#if>
    <#if !typeSettings?contains(nameKey)>
        <#local nameKey = "name_vi_VN=" />
    </#if>
    <#if !typeSettings?contains(nameKey)>
        <#return "" />
    </#if>

    <#local value = typeSettings?keep_after(nameKey)?keep_before("\n")?trim />
    <#list NAME_STOP_KEYS as stopKey>
        <#if value?contains(stopKey)>
            <#local value = value?keep_before(stopKey)?trim />
        </#if>
    </#list>

    <#return value />
</#function>

<#function getItemUrl typeSettings>
    <#list typeSettings?split("\n") as line>
        <#if line?starts_with("url=")>
            <#return line?substring(4)?trim />
        </#if>
    </#list>

    <#return "#" />
</#function>

<#function getItemTarget typeSettings>
    <#if typeSettings?contains("useNewTab=true")>
        <#return "_blank" />
    </#if>

    <#return "_self" />
</#function>

<#function hasChildren items parentId>
    <#list items as item>
        <#if item.getParentSiteNavigationMenuItemId() == parentId>
            <#return true />
        </#if>
    </#list>

    <#return false />
</#function>

<#macro vecLogo width height>
    <svg width="${width}" height="${height}" viewBox="0 0 80 69" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 0.5C61.8887 0.5 79.5 15.746 79.5 34.4004C79.4998 53.0546 61.8885 68.2998 40 68.2998C18.1115 68.2998 0.500245 53.0546 0.5 34.4004C0.5 15.746 18.1113 0.5 40 0.5Z" fill="#0090CF" stroke="white" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.8318 55.2912L40.2146 2.06882L26.5187 44.9827L34.7906 35.2485H36.923L23.0983 55.2768H17.8318V55.2912Z" fill="#E31C2A" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M38.1679 34.9907L36.8799 45.2848L46.5686 45.2131L45.853 43.2174L40.0856 43.0738V39.4989L44.8656 39.3553L44.5078 38.0631L40.0856 38.1349V36.1393L44.0784 36.2111L43.6491 35.1343L38.1679 34.9907Z" fill="#E31C2A" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M45.939 35.1331L53.71 34.9178L54.4255 36.7124L52.2216 36.7842L51.8638 36.1382L48.5865 36.2099L51.0052 43.1445H54.6402L54.2967 42.0677H56.7583L58.0749 45.2263L49.2019 45.2837L45.939 35.1331Z" fill="#E31C2A" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M24.9158 55.2046L41.3308 55.0754L41.3594 47.1071L30.4685 46.8917L24.9158 55.2046Z" fill="white" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M44.4651 47.0358L58.8193 47.0646L62.1681 54.961L45.2093 55.1333L44.4651 47.0358Z" fill="white" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M40.6725 14.3733L40.8156 20.1162H42.1609L41.7029 14.3733H40.6725ZM41.016 5.04105L52.9945 33.2818L43.2628 33.3966H43.2056L42.7619 27.783H41.016L41.1591 33.3966H31.9426L41.016 5.04105Z" fill="white" />
    </svg>
</#macro>

<#macro vecTitle>
    <div class="title-container">
        <p class="title-vn" data-ignore-translate="true">TỔNG CÔNG TY ĐẦU TƯ PHÁT TRIỂN ĐƯỜNG CAO TỐC VIỆT NAM</p>
        <p class="title-eu notranslate">Vietnam Expressway Corporation (VEC)</p>
    </div>
</#macro>

<#macro langFlag key flag>
    <svg width="26" height="17" viewBox="0 0 26 17" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <rect width="26" height="17" rx="3" fill="url(#patternLang${key})" />
        <defs>
            <pattern id="patternLang${key}" patternContentUnits="objectBoundingBox" width="1" height="1">
                <use xlink:href="#imageLang${key}" transform="matrix(0.00363636 0 0 0.0055615 0 -0.00887701)" />
            </pattern>
            <image id="imageLang${key}" width="275" height="183" preserveAspectRatio="none" xlink:href="https://flagcdn.com/w40/${flag}.png" />
        </defs>
    </svg>
</#macro>

<#macro langDropdown toggleId suffix handler extraClass="">
    <div class="vec-lang-dropdown${extraClass}">
        <div class="vec-icon-btn vec-search-icon vec-lang-toggle" id="${toggleId}">
            <@langFlag key=("Globe" + suffix) flag="vn" />
        </div>
        <div class="vec-lang-menu">
            <#list languages as language>
                <div class="vec-icon-btn vec-search-icon" data-lang="${language.code}" data-flag-url="https://flagcdn.com/w40/${language.flag}.png" title="${language.title}" onclick="${handler}(this)">
                    <@langFlag key=(language.key + suffix) flag=language.flag />
                </div>
            </#list>
        </div>
    </div>
</#macro>

<#macro selectArrow>
    <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
        <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
    </div>
</#macro>

<#macro feeSelect id placeholder wrapperClass disabled=false>
    <div class="${wrapperClass}">
        <select id="${id}" class="w-full border border-gray-300 rounded-md py-2.5 px-2.5 text-sm appearance-none focus:outline-none focus:ring-1 bg-white cursor-pointer transition-all"<#if disabled> disabled</#if>>
            <option value="" disabled>${placeholder}</option>
        </select>
        <@selectArrow />
    </div>
</#macro>

<#macro feeAction href color label>
    <a href="${href}" style="background-color: ${color};" class="flex-1 text-white font-medium py-3 rounded-md transition duration-300 uppercase text-sm flex items-center justify-center text-center hover:bg-opacity-90 no-underline hover:no-underline">
        ${label}
    </a>
</#macro>

<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css" />
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
<script src="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XRD1KGF2FL"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-XRD1KGF2FL');
</script>

<div class="vec-wrapper has-banner" id="header-wrapper">
    <div class="mySwiper swiper header-swiper">
        <div class="swiper-wrapper">
            <#if entries?has_content>
                <#list entries as entry>
                    <#assign assetRenderer = entry.getAssetRenderer() />
                    <#assign article = assetRenderer.getArticle() />
                    <#assign root = saxReaderUtil.read(article.getContentByLocale(locale)).getRootElement() />
                    <#assign articleURL = assetPublisherHelper.getAssetViewURL(renderRequest, renderResponse, entry, true) />
                    <#assign titleNode = root.selectSingleNode("//dynamic-element[@field-reference='title']/dynamic-content") />
                    <#assign title = titleNode?has_content?then(titleNode.getText(), "") />

                    <div class="hot-news swiper-slide">
                        <div class="vec-badge">MỚI</div>
                        <a class="vec-top-news-text" href="${articleURL}">${title}</a>
                    </div>
                </#list>
            </#if>
        </div>
    </div>

    <div class="vec-top-bar">
        <div class="vec-container container">
            <div class="vec-top-left">
                <span id="weather">☀️38°C</span>
                <span id="date-time"></span>
            </div>
            <div class="vec-top-right">
                <div class="vec-top-right-links">
                    <a class="vec-nav-item" href="/web/guest/trangchu/thongtintructuyen/thongtintuyenduong">Tra cứu tuyến cao tốc</a>
                    <a class="vec-nav-item" onclick="toggleModal(true)">Biểu phí</a>
                    <a class="vec-nav-item" href="/web/guest/trangchu/vevec/gioithieuchung">Thông tin nội bộ</a>
                    <a class="vec-nav-item" href="/web/guest/trangchu/lienhevec">Liên hệ VEC</a>
                </div>

                <@langDropdown toggleId="vecLangToggle" suffix="" handler="vecTranslate" />

                <div class="vec-icon-btn vec-search-icon" onclick="openModal()">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>

                <div class="vec-icon-btn vec-user-icon" id="userBtn">
                    <i class="fa-regular fa-user"></i>
                    <div class="vec-popover" id="userPopover">
                        <#if themeDisplay.isSignedIn()>
                            <a href="/web/guest/manage?p_p_id=com_liferay_my_account_web_portlet_MyAccountPortlet" class="vec-popover-item vec-username-wrapper">
                                <div class="vec-username-icon">
                                    <svg class="lexicon-icon lexicon-icon-user" role="presentation">
                                        <use href="/o/classic-theme/images/clay/icons.svg#user"></use>
                                    </svg>
                                </div>
                                <span class="vec-username">${themeDisplay.getUser().getFullName()}</span>
                            </a>
                            <a href="/web/guest/intranet" class="vec-popover-item">
                                <span>Cổng thông tin nội bộ</span>
                            </a>
                            <a href="/c/portal/logout" class="vec-popover-item">
                                <span>Đăng xuất</span>
                            </a>
                        <#else>
                            <a href="/c/admin?redirect=/web/guest/intranet" class="vec-popover-item">
                                <span>Cổng thông tin nội bộ</span>
                            </a>
                            <a href="/c/admin" class="vec-popover-item">
                                <span>Quản trị hệ thống</span>
                            </a>
                        </#if>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <header class="vec-header">
        <div class="vec-container container">
            <a class="vec-logo-section logo-desktop" href="/web/guest/trangchu">
                <@vecLogo width="80" height="69" />
                <@vecTitle />
            </a>

            <nav class="vec-main-nav" id="vecMainNav">
                <#if allItems?has_content>
                    <a class="vec-nav-item" href="/web/guest/trangchu">
                        <i class="fa-solid fa-house"></i>
                    </a>

                    <#list allItems as parentItem>
                        <#if parentItem.getParentSiteNavigationMenuItemId() == 0>
                            <#assign parentId = parentItem.getSiteNavigationMenuItemId() />
                            <#assign parentName = getItemName(parentItem.getTypeSettings()) />

                            <#if hasChildren(allItems, parentId)>
                                <div class="vec-nav-item">
                                    ${parentName} <i class="fa-solid fa-angle-down"></i>
                                    <div class="vec-dropdown">
                                        <#list allItems as childItem>
                                            <#if childItem.getParentSiteNavigationMenuItemId() == parentId>
                                                <a href="${getItemUrl(childItem.getTypeSettings())}" target="${getItemTarget(childItem.getTypeSettings())}">${getItemName(childItem.getTypeSettings())}</a>
                                            </#if>
                                        </#list>
                                    </div>
                                </div>
                            <#else>
                                <a class="vec-nav-item" href="${getItemUrl(parentItem.getTypeSettings())}" target="${getItemTarget(parentItem.getTypeSettings())}">${parentName}</a>
                            </#if>
                        </#if>
                    </#list>
                </#if>
            </nav>
        </div>

        <div class="vec-container container">
            <a class="vec-logo-section logo-mobile" href="/web/guest/trangchu">
                <@vecLogo width="64" height="55.2" />
                <@vecTitle />
            </a>

            <div class="flex gap-3 items-center">
                <@langDropdown toggleId="vecLangToggleMobile" suffix="Mobile" handler="vecTranslateMobile" extraClass=" vec-lang-dropdown-mobile" />

                <button class="open-btn" id="openMenu">
                    <i class="fa-solid fa-bars"></i>
                </button>
            </div>
        </div>
    </header>
</div>

<div class="overlay" id="overlay"></div>

<aside class="drawer" id="drawer">
    <div class="drawer-header">
        <div class="drawer-weather-datetime">
            <span id="weather-mobile">☀️38°C</span>
            <span id="date-time-mobile"></span>
        </div>
        <button id="closeMenu">
            <i class="fa-solid fa-xmark"></i>
        </button>
    </div>

    <div class="search-box">
        <div class="input-wrap">
            <input type="text" placeholder="Nhập từ khóa" id="mSearchInput" />
            <i class="fa-solid fa-magnifying-glass" id="mSearchBtn"></i>
        </div>
    </div>

    <nav class="menu">
        <a href="/web/guest/trangchu" class="home">
            <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.4" d="M11 0.25C9.95116 0.25 9.04948 0.664353 8.10742 1.35356C7.19322 2.02238 6.16347 3.0098 4.86415 4.2557L4.82911 4.2893L2.25 6.67179V12.0564C2.24998 13.8942 2.24997 15.3498 2.40314 16.489C2.56076 17.6614 2.89288 18.6104 3.64124 19.3588C4.38961 20.1071 5.33856 20.4392 6.51098 20.5969C7.65018 20.75 9.1058 20.75 10.9435 20.75H11.0564C12.8942 20.75 14.3498 20.75 15.489 20.5969C16.6614 20.4392 17.6104 20.1071 18.3588 19.3588C19.1071 18.6104 19.4392 17.6614 19.5969 16.489C19.75 15.3498 19.75 13.8942 19.75 12.0565V6.67179L17.1709 4.28932L17.1359 4.25572C15.8365 3.00981 14.8068 2.02238 13.8926 1.35357C12.9505 0.664354 12.0488 0.25 11 0.25Z" fill="#0090CF" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.75 15.5C9.75 14.8096 10.3076 14.25 10.9955 14.25C11.6777 14.25 12.25 14.8117 12.25 15.5C12.25 16.1883 11.6777 16.75 10.9955 16.75C10.3076 16.75 9.75 16.1904 9.75 15.5Z" fill="#0090CF" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.14071 2.76594C8.33333 3.35661 7.38869 4.25951 6.03526 5.55727L1.69211 9.72179C1.29347 10.104 0.660447 10.0907 0.278207 9.69211C-0.104033 9.29347 -0.0907422 8.66045 0.307894 8.27821L4.70301 4.06386C5.99217 2.82768 7.03207 1.83052 7.9598 1.1518C8.92464 0.44593 9.87769 0 11 0C12.1223 0 13.0754 0.445931 14.0402 1.1518C14.9679 1.83053 16.0078 2.82768 17.297 4.06387L21.6921 8.27821C22.0907 8.66045 22.104 9.29347 21.7218 9.69211C21.3396 10.0907 20.7065 10.104 20.3079 9.72179L15.9647 5.55728C14.6113 4.25951 13.6667 3.35662 12.8593 2.76594C12.0766 2.19332 11.5345 2 11 2C10.4655 2 9.92342 2.19332 9.14071 2.76594Z" fill="#0090CF" />
            </svg>
        </a>

        <#list allItems as parentItem>
            <#if parentItem.getParentSiteNavigationMenuItemId() == 0>
                <#assign parentId = parentItem.getSiteNavigationMenuItemId() />
                <#assign parentName = getItemName(parentItem.getTypeSettings()) />

                <#if hasChildren(allItems, parentId)>
                    <div class="menu-item">
                        <button class="menu-toggle">
                            <span>${parentName}</span>
                            <i class="fa-solid fa-chevron-down"></i>
                        </button>
                        <div class="menu-content">
                            <#list allItems as childItem>
                                <#if childItem.getParentSiteNavigationMenuItemId() == parentId>
                                    <a href="${getItemUrl(childItem.getTypeSettings())}">${getItemName(childItem.getTypeSettings())}</a>
                                </#if>
                            </#list>
                        </div>
                    </div>
                <#else>
                    <a class="menu-item" href="${getItemUrl(parentItem.getTypeSettings())}" target="${getItemTarget(parentItem.getTypeSettings())}">${parentName}</a>
                </#if>
            </#if>
        </#list>

        <div style="padding-bottom: 16px;"></div>

        <div class="static-links">
            <a href="/web/guest/trangchu/thongtintructuyen/thongtintuyenduong">Tra cứu tuyến cao tốc</a>
            <a href="#" onclick="toggleModal(true); return false;">Biểu phí</a>
            <a href="/web/guest/trangchu/vevec/gioithieuchung">Thông tin nội bộ</a>
            <a href="/web/guest/trangchu/lienhevec">Liên hệ VEC</a>

            <div style="border-top: 1px solid #E4E4E4; margin-top: 8px;">
                <#if themeDisplay.isSignedIn()>
                    <div style="padding: 10px 0; font-size: 15px; font-weight: 500; color: #1e1e1e;">
                        <i class="fa-regular fa-user" style="margin-right: 8px; color: #148acb;"></i>
                        ${themeDisplay.getUser().getFullName()}
                    </div>
                    <a href="/web/guest/intranet" style="padding-left: 14px;">Cổng thông tin nội bộ</a>
                    <a href="/c/portal/logout" style="padding-left: 14px; color: #dc0000;">Đăng xuất</a>
                <#else>
                    <div class="menu-item" id="loginMenuItem">
                        <button class="menu-toggle">
                            <span>Đăng nhập</span>
                            <i class="fa-solid fa-chevron-down"></i>
                        </button>
                        <div class="menu-content">
                            <a href="/c/admin?redirect=/web/guest/intranet">Cổng thông tin nội bộ</a>
                            <a href="/c/admin">Quản trị hệ thống</a>
                        </div>
                    </div>
                </#if>
            </div>
        </div>
    </nav>
</aside>

<div id="modal" class="hidden fixed left-0 right-0 z-40 bg-black/50" style="top: -20px; bottom: 0; z-index: 1000;">
    <div class="absolute left-0 right-0 bg-white shadow-lg" style="top: 20px; height: 489px;">
        <div class="flex justify-end items-center pt-[20px] pr-[20px]">
            <button onclick="closeModal()" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 1L1 13M1 1L13 13" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>
        </div>

        <div class="text-center pt-[16px] pb-[10px] xl:pt-[64px] xl:pb-[40px]">
            <h5 class="!text-[#272727] !font-bold text-2xl xl:text-4xl pb-[6px] xl:pb-[24px]">Tìm kiếm</h5>
            <p class="!text-[#555555] text-sm xl:text-base">
                Tra cứu biểu phí, giao thông trực tuyến và các thông tin khác
            </p>
        </div>

        <div class="w-11/12 pl-[16px] xl:pl-[0px] xl:w-[1011px] mx-[32px] xl:mx-auto">
            <div class="relative">
                <input type="text" placeholder="Nhập từ khóa" id="searchInput" class="w-full h-[60px] pl-[18px] px-[5px] rounded-[6px] border-1 !border-[#E4E4E4] text-base !bg-[#F9F9F9]" />
                <button id="searchBtn" class="absolute inset-y-0 right-0 p-[5px] m-[5px] flex items-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_6507_5359)">
                            <path d="M15.9925 14.08C15.9259 14 15.8893 13.9067 15.8826 13.8C15.876 13.6933 15.8993 13.5933 15.9525 13.5C16.8714 12.0733 17.3308 10.5067 17.3308 8.79998C17.3308 7.22665 16.938 5.76665 16.1523 4.41998C15.3799 3.11332 14.3412 2.07332 13.0362 1.29998C11.7045 0.513317 10.253 0.119984 8.68161 0.119984C7.11025 0.119984 5.65207 0.513317 4.30708 1.29998C3.00205 2.07332 1.96335 3.11332 1.19098 4.41998C0.405293 5.76665 0.0124512 7.22665 0.0124512 8.79998C0.0124512 10.3733 0.405293 11.8333 1.19098 13.18C1.96335 14.4867 3.00205 15.5267 4.30708 16.3C5.65207 17.0867 7.11025 17.48 8.68161 17.48C9.58715 17.48 10.4727 17.34 11.3383 17.06C12.1772 16.78 12.9563 16.3867 13.6754 15.88C13.7553 15.8133 13.8518 15.7833 13.965 15.79C14.0782 15.7967 14.1681 15.84 14.2347 15.92L17.3907 19.08C17.404 19.0933 17.4573 19.14 17.5505 19.22L17.7303 19.38L18.0899 19.76C18.1564 19.8267 18.243 19.86 18.3495 19.86C18.4561 19.86 18.5426 19.8267 18.6092 19.76L19.8876 18.48C19.9542 18.4133 19.9875 18.3267 19.9875 18.22C19.9875 18.1133 19.9542 18.0267 19.8876 17.96L15.9925 14.08ZM13.9151 12.84C13.6354 13.2133 13.3158 13.5533 12.9563 13.86C12.3703 14.3667 11.7112 14.7567 10.9787 15.03C10.2463 15.3033 9.48062 15.44 8.68161 15.44C7.48311 15.44 6.37117 15.14 5.34578 14.54C4.33372 13.9533 3.53471 13.1533 2.94878 12.14C2.34953 11.1133 2.0499 9.99998 2.0499 8.79998C2.0499 7.59998 2.34953 6.48665 2.94878 5.45998C3.53471 4.44665 4.33372 3.64665 5.34578 3.05998C6.37117 2.45998 7.48311 2.15998 8.68161 2.15998C9.88012 2.15998 10.9921 2.45998 12.0174 3.05998C13.0162 3.64665 13.8085 4.44665 14.3945 5.45998C14.9937 6.48665 15.2933 7.59998 15.2933 8.79998C15.2933 9.54665 15.1735 10.2633 14.9338 10.95C14.6941 11.6367 14.3545 12.2667 13.9151 12.84Z" fill="#E31C2A" />
                        </g>
                        <defs>
                            <clipPath id="clip0_6507_5359">
                                <rect width="20" height="20" fill="white" transform="matrix(1 0 0 -1 0 20)" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>
            </div>

            <#-- Nội dung do renderMenu() trong header-script đổ vào từ /o/c/deeplinkheadersearches/ -->
            <div id="menu-container-deeplink" class="flex flex-wrap justify-between pt-[10px] xl:pt-[34px]"></div>
        </div>
    </div>
</div>

<div id="feeModal" class="fixed inset-0 z-[9999] hidden items-center justify-center bg-black bg-opacity-50 p-4" onclick="closeIfOutside(event)">
    <div class="bg-white w-full max-w-2xl rounded-[10px] shadow-lg overflow-hidden transform transition-all">
        <div class="flex justify-between items-center px-3 py-2 border-b border-sky-100" style="background-color: #E0F2FA;">
            <h2 class="text-[20px] font-semibold uppercase tracking-tight leading-none" style="color: #0090CF;">
                Biểu Phí
            </h2>
            <div class="flex items-center gap-2">
                <p class="text-[14px] italic leading-none" style="color: #0090CF;">
                    Đơn vị: <span class="font-bold uppercase">Vnd</span>
                </p>
                <button onclick="toggleModal(false)" class="p-2.5 bg-sky-200 hover:bg-sky-300 rounded-full transition-all">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 1L1 13M1 1L13 13" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="p-3">
            <div class="mb-4">
                <div class="mb-3">
                    <@feeSelect id="feeModalSelectRouteSpdv" placeholder="Chọn tuyến đường" wrapperClass="relative w-full overflow-hidden" />
                </div>

                <div class="flex items-center gap-2">
                    <@feeSelect id="feeModalSelectSpdvStation1" placeholder="Điểm đầu trạm" wrapperClass="relative flex-1" disabled=true />

                    <button id="feeModalSwapStations" class="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors" title="Đổi vị trí">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 17H4M4 17L8 13M4 17L8 21M4 7H20M20 7L16 3M20 7L16 11" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>

                    <@feeSelect id="feeModalSelectSpdvStation2" placeholder="Điểm cuối trạm" wrapperClass="relative flex-1" disabled=true />
                </div>
            </div>

            <div id="feeModalPriceTable" class="overflow-x-auto">
                <p id="feeModalEmptyMessageSpdv" class="text-center text-gray-500 italic py-4">Vui lòng chọn 2 trạm thu phí để xem bảng giá chi tiết</p>

                <#-- Tách thead và tbody thành 2 table để header dính khi cuộn -->
                <div class="overflow-x-auto">
                    <table id="feeModalTableSpdv" class="w-full text-left text-[14px] border-collapse hidden" style="table-layout: fixed;">
                        <colgroup>
                            <col style="width: 50%;">
                            <col style="width: 50%;">
                        </colgroup>
                        <thead class="sticky top-0 bg-white z-10">
                            <tr class="text-gray-900 font-semibold border-b-[2px]" style="border-color: #0090CF;">
                                <th class="py-3 pr-2 w-1/4 bg-white">Phương tiện</th>
                                <th class="py-3 px-2 text-center bg-white">Cước phí</th>
                            </tr>
                        </thead>
                    </table>
                </div>

                <div class="overflow-y-auto overflow-x-auto max-h-[30vh] sm:max-h-[85vh]">
                    <table style="table-layout: fixed;">
                        <colgroup>
                            <col style="width: 50%;">
                            <col style="width: 50%;">
                        </colgroup>
                        <tbody id="feeModalTableBodySpdv" class="divide-y divide-gray-100 text-gray-700"></tbody>
                    </table>
                </div>
            </div>

            <p id="feeModalVATNoteSpdv" class="text-xs text-gray-600 mt-2 hidden">Mức giá dịch vụ bao gồm 10% VAT</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 p-3 pt-3">
            <@feeAction href="/web/guest/trangchu/thongtintructuyen/thongtintuyenduong" color="#0090CF" label="Tra cứu tuyến đường" />
            <@feeAction href="/web/guest/trangchu/thongtintructuyen/cuocphituyenduong" color="#E31C2A" label="So sánh cước phí" />
        </div>
    </div>
</div>
