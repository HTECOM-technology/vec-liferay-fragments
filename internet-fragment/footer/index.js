(function () {
  const MOBILE_BREAKPOINT = 1023;
  const SCROLL_SHOW_THRESHOLD = 10;

  const ICON_HAMBURGER =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M3 7H21" stroke="white" stroke-width="1.5" stroke-linecap="round" />' +
    '<path d="M3 12H21" stroke="white" stroke-width="1.5" stroke-linecap="round" />' +
    '<path d="M3 17H21" stroke="white" stroke-width="1.5" stroke-linecap="round" />' +
    "</svg>";

  const ICON_CLOSE =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M17 7L7 17M7 7L17 17" stroke="white" stroke-width="2" stroke-linecap="round" />' +
    "</svg>";

  const SUB_MENU_ITEMS = [
    {
      img: "https://res.cloudinary.com/wfnguyen/image/upload/v1767882406/Live_zx5bqe.png",
      title: "Camera trực tuyến"
    },
    {
      img: "https://res.cloudinary.com/wfnguyen/image/upload/v1767882407/Tra_c%E1%BB%A9u_tuy%E1%BA%BFn_%C4%91%C6%B0%E1%BB%9Dng_htdn1u.png",
      url: "/web/guest/san-pham-dich-vu",
      title: "DỊCH VỤ VEC"
    },
    {
      img: "https://res.cloudinary.com/wfnguyen/image/upload/v1767882407/Tra_c%E1%BB%A9u_tuy%E1%BA%BFn_%C4%91%C6%B0%E1%BB%9Dng-1_j4xf9v.png",
      url: "/web/guest/trangchu/thongtintructuyen/thongtintuyenduong",
      title: "TRA CỨU TUYẾN ĐƯỜNG"
    },
    {
      img: "https://res.cloudinary.com/wfnguyen/image/upload/v1767882406/Tra_c%E1%BB%A9u_c%C6%B0%E1%BB%9Bc_ph%C3%AD_zfuaxi.png",
      url: "/web/guest/trangchu/thongtintructuyen/cuocphituyenduong",
      title: "TRA CỨU CƯỚC PHÍ"
    }
  ];

  const LABEL_CLASS =
    "pointer-events-none absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-white text-black " +
    "text-[16px] px-2 py-1 rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-150";

  const btnScrollTop = document.getElementById("btn-scroll-toll");
  const btnMenu = document.getElementById("btn-menu");
  const subMenu = document.getElementById("list-item");
  const liveModal = document.getElementById("liveModal");
  const liveIframe = document.getElementById("iframeLive");
  const btnCloseLiveModal = document.getElementById("closeLiveModal");

  let isMenuOpen = false;

  function isMobileView() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function buildSubMenuItem(item, index, total) {
    // Rải các icon trên cung tròn từ 270° đến 390° (hướng 12h sang 8h)
    const angle = (index / (total - 1)) * 120 + 270;
    const radius = isMobileView() ? 70 : 90;
    const xOffset = -35;
    const yOffset = isMobileView() ? -9 : -12;

    const x = radius * Math.cos((angle * Math.PI) / 180) + xOffset;
    const y = radius * Math.sin((angle * Math.PI) / 180) + yOffset;

    const icon = item.url
      ? '<a href="' + item.url + '" class="sub-menu__item block"><img src="' + item.img + '" alt="' + item.title + '"></a>'
      : '<img id="iconLive" class="sub-menu__item cursor-pointer" src="' + item.img + '" alt="' + item.title + '">';

    return (
      '<div class="absolute group z-10 hover:z-[999]" style="right: ' + (50 + x) + "%; bottom: " + (50 - y) + '%">' +
      icon +
      '<div class="' + LABEL_CLASS + '">' + item.title + "</div>" +
      "</div>"
    );
  }

  function closeSubMenu() {
    subMenu.innerHTML = "";
    btnMenu.innerHTML = ICON_HAMBURGER;
    isMenuOpen = false;
  }

  function openSubMenu() {
    subMenu.innerHTML = SUB_MENU_ITEMS.map(function (item, index) {
      return buildSubMenuItem(item, index, SUB_MENU_ITEMS.length);
    }).join("");

    btnMenu.innerHTML = ICON_CLOSE;
    isMenuOpen = true;

    const iconLive = document.getElementById("iconLive");
    if (iconLive) {
      iconLive.addEventListener("click", function () {
        if (window.ftrCamOpenModal) window.ftrCamOpenModal();
      });
    }
  }

  function closeLiveModal() {
    if (!liveModal) return;
    liveModal.classList.add("hidden");
    document.body.style.overflow = "";
    if (liveIframe) liveIframe.src = "";
  }

  if (btnScrollTop) {
    btnScrollTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (btnMenu && subMenu) {
    btnMenu.addEventListener("click", function () {
      if (isMenuOpen) closeSubMenu();
      else openSubMenu();
    });
  }

  if (btnCloseLiveModal) {
    btnCloseLiveModal.addEventListener("click", closeLiveModal);
  }

  if (btnScrollTop && btnMenu) {
    let isScrolled = null;

    const syncFloatingButtons = function () {
      const scrolled = window.scrollY >= SCROLL_SHOW_THRESHOLD;
      if (scrolled === isScrolled) return; // chỉ đụng DOM khi trạng thái thật sự đổi
      isScrolled = scrolled;

      btnScrollTop.classList.toggle("hidden-btn-scroll-toll", !scrolled);
      btnMenu.classList.toggle("btn-menu--raised", scrolled);
    };

    window.addEventListener("scroll", syncFloatingButtons, { passive: true });
    syncFloatingButtons();
  }
})();

/* Nạp cấu hình giao diện (ảnh nền header/footer/section) từ Headless API */
(function () {
  function getFileUrl(fileField) {
    if (!fileField) return null;
    if (typeof fileField === "string") return fileField;
    if (fileField.link?.href) return `${window.location.origin}${fileField.link.href}`;
    return null;
  }

  function setBackgroundVar(name, fileField) {
    const url = getFileUrl(fileField);
    if (url) document.documentElement.style.setProperty(name, `url("${url}")`);
  }

  function applyTheme(banner) {
    const root = document.documentElement;

    if (banner.colortext1) root.style.setProperty("--theme-color-1", banner.colortext1);
    if (banner.colortext2) root.style.setProperty("--theme-color-2", banner.colortext2);

    setBackgroundVar("--theme-header-bg", banner.backgroundheader);
    setBackgroundVar("--theme-footer-bg", banner.backgroundfooter);
    setBackgroundVar("--theme-section-bg", banner.background);
  }

  async function fetchThemeConfig() {
    try {
      const headers = { accept: "application/json" };
      const authToken = window.Liferay?.authToken;
      if (authToken) headers["x-csrf-token"] = authToken;

      const systemResponse = await fetch(`${window.location.origin}/o/c/systemkeys/`, { method: "GET", headers });
      const systemData = await systemResponse.json();

      const themeConfig = systemData.items?.find((item) => item.key === "THEME");
      if (!themeConfig?.value) return;

      const bannerResponse = await fetch(`${window.location.origin}/o/c/banners/`, { method: "GET", headers });
      const bannerData = await bannerResponse.json();

      const banner = bannerData.items?.find((item) => item.keybanner === themeConfig.value);
      if (banner) applyTheme(banner);
    } catch (error) {
      console.error("Load theme failed", error);
    }
  }

  fetchThemeConfig();
})();

/* Modal 2 cột camera trực tuyến + xem trực tiếp 1 camera qua HLS */
(function () {
  const FTR_CAMERA_HIGHWAY_CONFIGS = {
    42753: { apiBasePath: "/o/its-hld" }, // Cao tốc TP. Hồ Chí Minh - Long Thành - Dầu Giây
    44147: { apiBasePath: "/o/its" } // Cao tốc Cầu Giẽ - Ninh Bình
  };
  const FTR_CAMERA_API_ORIGIN = "https://portal.tctvec.vn";
  const FTR_HLS_JS_URL = "https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js";
  const FTR_CAMERA_SHOW_STATE_API_URL = `${window.location.origin}/o/vec-setting-camera-show-state`;
  const FTR_HLS_ATTACH_RETRY_COUNT = 3;
  const FTR_HLS_ATTACH_RETRY_DELAY_MS = 1200;
  const FTR_STARTUP_MIN_DURATION_MS = 8000;
  const FTR_HEARTBEAT_INTERVAL_MS = 30000;
  const FTR_THUMB_FALLBACK =
    "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original";

  let ftrCamHlsScriptPromise = null;
  let ftrCamActiveSession = null;
  let ftrCamModalReqId = 0;
  let ftrCamCacheBust = 0;
  let ftrCamModalLoaded = false;
  let ftrCamCurrentList = [];
  const ftrCamListCache = new Map();
  const ftrCamShowStateCache = new Map();

  function ftrCamEscapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function ftrCamDelay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function ftrCamWithCacheBust(url) {
    const value = `${Date.now()}-${ftrCamCacheBust++}`;
    try {
      const parsedUrl = new URL(url, window.location.href);
      parsedUrl.searchParams.set("_", value);
      return parsedUrl.href;
    } catch (error) {
      const separator = url.includes("?") ? "&" : "?";
      return `${url}${separator}_=${encodeURIComponent(value)}`;
    }
  }

  // Tên camera từ API hay kèm IP, bỏ đi trước khi hiển thị
  function ftrCamNormalizeName(name) {
    const rawName = typeof name === "string" ? name : String(name ?? "");
    if (!rawName) return "";

    const ipv4Segment = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)";
    const ipv4Pattern = new RegExp(`\\b${ipv4Segment}(?:\\.${ipv4Segment}){3}\\b`, "g");
    const parenthesizedIpv4Pattern = new RegExp(`\\([^()]*\\b${ipv4Segment}(?:\\.${ipv4Segment}){3}\\b[^()]*\\)`, "g");

    return rawName
      .replace(parenthesizedIpv4Pattern, " ")
      .replace(ipv4Pattern, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function ftrCamGetApiUrl(highwayId) {
    const config = FTR_CAMERA_HIGHWAY_CONFIGS[Number(highwayId)];
    if (!config?.apiBasePath) return null;
    return `${FTR_CAMERA_API_ORIGIN}${config.apiBasePath}/api/cameras`;
  }

  async function ftrCamFetchCameras(highwayId) {
    const apiUrl = ftrCamGetApiUrl(highwayId);
    if (!apiUrl) return [];
    if (ftrCamListCache.has(apiUrl)) return ftrCamListCache.get(apiUrl);

    const response = await fetch(ftrCamWithCacheBust(apiUrl), {
      method: "GET",
      cache: "no-store",
      headers: { accept: "application/json" }
    });
    if (!response.ok) throw new Error(`Camera API error: ${response.status}`);

    const data = await response.json();
    const cameras = Array.isArray(data.items)
      ? data.items.map((camera) => ({
          ...camera,
          name: ftrCamNormalizeName(camera.name) || "Camera",
          __apiUrl: apiUrl,
          __highwayId: Number(highwayId)
        }))
      : [];

    ftrCamListCache.set(apiUrl, cameras);
    return cameras;
  }

  async function ftrCamFetchShowState(highwayId) {
    const id = Number(highwayId);
    if (!id) return [];
    if (ftrCamShowStateCache.has(id)) return ftrCamShowStateCache.get(id);

    try {
      const response = await fetch(`${FTR_CAMERA_SHOW_STATE_API_URL}?highwayId=${encodeURIComponent(id)}`, {
        method: "GET",
        credentials: "include",
        headers: { accept: "application/json", "X-Requested-With": "XMLHttpRequest" }
      });
      if (!response.ok) throw new Error(`Show state API error: ${response.status}`);

      const data = await response.json();
      const items = Array.isArray(data?.items) ? data.items : [];
      ftrCamShowStateCache.set(id, items);
      return items;
    } catch (error) {
      console.error("ftrCam show state error", error);
      return [];
    }
  }

  function ftrCamFilterByShowState(cameras, items) {
    const visibilityById = new Map(
      (items || [])
        .filter((item) => item && item.cameraId)
        .map((item) => [String(item.cameraId), item.internetVisible !== false])
    );

    return (cameras || []).filter((camera) => {
      const id = String(camera?.camera_id ?? "").trim();
      if (!id) return false;
      if (!visibilityById.has(id)) return true;
      return visibilityById.get(id) !== false;
    });
  }

  function ftrCamMessage(text, colorClass) {
    return `<div class="col-span-full text-center ${colorClass} text-sm py-6">${text}</div>`;
  }

  async function ftrCamRenderList(containerEl, highwayId) {
    if (!containerEl) return;
    containerEl.innerHTML = ftrCamMessage("Đang tải camera...", "text-gray-400");

    let cameras = [];
    try {
      const [list, showState] = await Promise.all([
        ftrCamFetchCameras(highwayId),
        ftrCamFetchShowState(highwayId)
      ]);
      cameras = ftrCamFilterByShowState(list, showState);
    } catch (error) {
      console.error("ftrCam render list error", error);
      containerEl.innerHTML = ftrCamMessage("Không tải được danh sách camera", "text-red-500");
      return;
    }

    if (!cameras.length) {
      containerEl.innerHTML = ftrCamMessage("Không có camera trực tuyến", "text-gray-400");
      return;
    }

    ftrCamCurrentList = ftrCamCurrentList
      .filter((camera) => camera.__highwayId !== Number(highwayId))
      .concat(cameras);

    containerEl.innerHTML = cameras
      .map((camera) => {
        const name = ftrCamEscapeHtml(camera.name || "Camera");
        return (
          `<div class="ftr-cam-box relative rounded-lg overflow-hidden cursor-pointer group border border-gray-200" data-camera-id="${ftrCamEscapeHtml(camera.camera_id)}" data-highway-id="${Number(highwayId)}">` +
          `<img class="w-full h-[70px] object-cover" src="${ftrCamEscapeHtml(camera.thumbnail_url || FTR_THUMB_FALLBACK)}" alt="${name}" />` +
          '<div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">' +
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>' +
          "</div>" +
          `<div class="text-[11px] text-center py-1 px-1 truncate bg-white">${name}</div>` +
          "</div>"
        );
      })
      .join("");

    containerEl.querySelectorAll(".ftr-cam-box img").forEach((img) => {
      img.addEventListener("error", () => { img.src = FTR_THUMB_FALLBACK; }, { once: true });
    });

    containerEl.querySelectorAll(".ftr-cam-box").forEach((box) => {
      box.addEventListener("click", () => {
        const cameraId = box.getAttribute("data-camera-id");
        const camera = ftrCamCurrentList.find((item) => item.camera_id === cameraId);
        if (camera) ftrCamOpenWatch(camera);
      });
    });
  }

  function ftrCamLoadHlsScript() {
    if (window.Hls) return Promise.resolve();
    if (ftrCamHlsScriptPromise) return ftrCamHlsScriptPromise;

    ftrCamHlsScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = FTR_HLS_JS_URL;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => {
        ftrCamHlsScriptPromise = null; // cho phép thử lại ở lần mở sau
        reject(new Error("Không tải được HLS.js"));
      };
      document.head.appendChild(script);
    });

    return ftrCamHlsScriptPromise;
  }

  function ftrCamCreateHlsLoader() {
    const BaseLoader = window.Hls?.DefaultConfig?.loader;
    if (!BaseLoader) return undefined;

    return class FtrCacheBustingLoader extends BaseLoader {
      load(context, config, callbacks) {
        if (context && (context.type === "manifest" || context.type === "level")) {
          context.url = ftrCamWithCacheBust(context.url);
        }
        super.load(context, config, callbacks);
      }
    };
  }

  async function ftrCamAttachHls(video, hlsUrl) {
    await ftrCamLoadHlsScript();

    if (window.Hls?.isSupported()) {
      const hls = new window.Hls({
        loader: ftrCamCreateHlsLoader(),
        lowLatencyMode: true,
        liveSyncDurationCount: 2,
        manifestLoadingMaxRetry: 6,
        manifestLoadingRetryDelay: 500,
        levelLoadingMaxRetry: 6,
        levelLoadingRetryDelay: 500,
        fragLoadingMaxRetry: 6,
        fragLoadingRetryDelay: 500,
        xhrSetup(xhr) {
          xhr.setRequestHeader("Cache-Control", "no-cache");
          xhr.setRequestHeader("Pragma", "no-cache");
        }
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.ERROR, (_, data) => {
        if (!data.fatal) return;
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) { hls.startLoad(); return; }
        if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) { hls.recoverMediaError(); return; }
        hls.destroy();
      });

      return hls;
    }

    video.src = ftrCamWithCacheBust(hlsUrl);
    return null;
  }

  async function ftrCamAttachHlsWithRetry(video, hlsUrl) {
    let lastError;

    for (let attempt = 1; attempt <= FTR_HLS_ATTACH_RETRY_COUNT; attempt += 1) {
      try {
        return await ftrCamAttachHls(video, hlsUrl);
      } catch (error) {
        lastError = error;
        video.pause();
        video.removeAttribute("src");
        video.load();
        if (attempt < FTR_HLS_ATTACH_RETRY_COUNT) await ftrCamDelay(FTR_HLS_ATTACH_RETRY_DELAY_MS);
      }
    }

    throw lastError;
  }

  async function ftrCamStartWatch(camera) {
    const apiUrl = camera?.__apiUrl || ftrCamGetApiUrl(camera?.__highwayId);
    if (!apiUrl) throw new Error("Không tìm thấy cấu hình camera cho tuyến này");

    const response = await fetch(
      ftrCamWithCacheBust(`${apiUrl}/${encodeURIComponent(camera.camera_id)}/watch/start`),
      {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      }
    );
    if (!response.ok) throw new Error(`Watch start error: ${response.status}`);

    const data = await response.json();
    if (!data.hls_url) throw new Error("Camera chưa có luồng HLS");
    return data;
  }

  function ftrCamReleaseSession() {
    if (!ftrCamActiveSession) return;

    const session = ftrCamActiveSession;
    ftrCamActiveSession = null;
    if (session.heartbeatTimer) clearInterval(session.heartbeatTimer);
    if (session.hls) session.hls.destroy();
  }

  function ftrCamStartHeartbeat(cameraId, sessionId) {
    return setInterval(() => {
      const camera = ftrCamCurrentList.find((item) => item.camera_id === cameraId);
      const apiUrl = camera?.__apiUrl || ftrCamGetApiUrl(camera?.__highwayId);
      if (!apiUrl) return;

      fetch(`${apiUrl}/${encodeURIComponent(cameraId)}/watch/heartbeat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId })
      }).catch((error) => console.error("ftrCam heartbeat failed", error));
    }, FTR_HEARTBEAT_INTERVAL_MS);
  }

  async function ftrCamOpenWatch(camera) {
    const reqId = ++ftrCamModalReqId;
    const modal = document.getElementById("ftrCamWatchModal");
    const video = document.getElementById("ftrCamWatchVideo");
    const status = document.getElementById("ftrCamWatchStatus");
    const titleEl = document.getElementById("ftrCamWatchTitle");
    if (!modal || !video || !status || !titleEl) return;

    ftrCamReleaseSession();
    titleEl.textContent = camera.name || "Camera";
    video.pause();
    video.removeAttribute("src");
    video.load();
    status.textContent = "Đang khởi động camera...";
    status.style.display = "flex";
    modal.classList.remove("hidden");

    const startedAt = Date.now();
    const waitMinimum = async () => {
      const remaining = FTR_STARTUP_MIN_DURATION_MS - (Date.now() - startedAt);
      if (remaining > 0) await ftrCamDelay(remaining);
    };

    try {
      const watchData = await ftrCamStartWatch(camera);
      if (reqId !== ftrCamModalReqId) return;

      const hls = await ftrCamAttachHlsWithRetry(video, watchData.hls_url);
      if (reqId !== ftrCamModalReqId) {
        if (hls) hls.destroy();
        return;
      }

      ftrCamActiveSession = {
        cameraId: camera.camera_id,
        sessionId: watchData.session_id,
        heartbeatTimer: ftrCamStartHeartbeat(camera.camera_id, watchData.session_id),
        hls
      };

      await waitMinimum();
      if (reqId !== ftrCamModalReqId) return;

      status.style.display = "none";
      video.play().catch(() => {});
    } catch (error) {
      console.error("ftrCam open watch error", error);
      await waitMinimum();
      if (reqId !== ftrCamModalReqId) return;
      status.textContent = "Không mở được luồng camera";
    }
  }

  function ftrCamCloseWatch() {
    ftrCamModalReqId += 1;
    ftrCamReleaseSession();

    const video = document.getElementById("ftrCamWatchVideo");
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }

    document.getElementById("ftrCamWatchModal")?.classList.add("hidden");
  }

  function ftrCamOpenModal() {
    const modal = document.getElementById("ftrCamerasModal");
    if (!modal) return;

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    if (ftrCamModalLoaded) return;
    ftrCamModalLoaded = true;
    ftrCamRenderList(document.getElementById("ftrCamLeftList"), 42753);
    ftrCamRenderList(document.getElementById("ftrCamRightList"), 44147);
  }

  function ftrCamCloseModal() {
    document.getElementById("ftrCamerasModal")?.classList.add("hidden");
    document.body.style.overflow = "";
    ftrCamCloseWatch();
  }

  window.ftrCamOpenModal = ftrCamOpenModal;

  document.getElementById("ftrCamerasCloseBtn")?.addEventListener("click", ftrCamCloseModal);
  document.getElementById("ftrCamerasBackdrop")?.addEventListener("click", ftrCamCloseModal);
  document.getElementById("ftrCamWatchCloseBtn")?.addEventListener("click", ftrCamCloseWatch);
  document.getElementById("ftrCamWatchBackdrop")?.addEventListener("click", ftrCamCloseWatch);
})();

/* ?_reset=1 -> xoá cache cấu hình form rồi tải lại trang không kèm tham số */
(function () {
  const url = new URL(window.location.href);
  if (url.searchParams.get("_reset") !== "1") return;

  localStorage.removeItem("vec_webcontent_form_mapping_settings_cache");
  url.searchParams.delete("_reset");
  window.location.replace(url.toString());
})();
