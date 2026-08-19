/* Counter lượt xem bài viết (module OSGi vn.vec.custom.counter) */
(function () {
  const API_BASE = `${window.location.origin}/o/vec-counter`;
  const VISITOR_KEY_STORAGE_KEY = "vec_counter_visitor_key";
  const ARTICLE_ID_POLL_INTERVAL_MS = 10;
  const ARTICLE_ID_POLL_MAX_TRIES = 100;

  // fragmentElement do Liferay truyền vào; dùng nó để chỉ tìm trong phạm vi
  // fragment, tránh đụng instance khác của cùng fragment trên một trang.
  const rootEl =
    typeof fragmentElement !== "undefined" && fragmentElement ? fragmentElement : document;

  const viewsEl = rootEl.querySelector("[data-article-view-counter]");
  if (!viewsEl) return;

  // Dùng chung khoá với các fragment counter khác để server đếm cùng một visitor.
  function getVisitorKey() {
    try {
      let visitorKey = localStorage.getItem(VISITOR_KEY_STORAGE_KEY);
      if (visitorKey) return visitorKey;

      visitorKey =
        window.crypto?.randomUUID?.() ??
        `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

      localStorage.setItem(VISITOR_KEY_STORAGE_KEY, visitorKey);
      return visitorKey;
    } catch (error) {
      // Trình duyệt chặn localStorage: để server nhận diện theo session.
      return null;
    }
  }

  function render(totalReads) {
    if (typeof totalReads !== "number") return;

    viewsEl.textContent = `${new Intl.NumberFormat("vi-VN").format(totalReads)} lượt xem`;
    viewsEl.removeAttribute("hidden");
  }

  async function load(articleId) {
    const visitorKey = getVisitorKey();
    const url = new URL(`${API_BASE}/articles/${encodeURIComponent(articleId)}/reads`);
    if (visitorKey) url.searchParams.set("visitorKey", visitorKey);

    const headers = { accept: "application/json", "X-Requested-With": "XMLHttpRequest" };
    const authToken = window.Liferay?.authToken;
    if (authToken) headers["x-csrf-token"] = authToken;

    try {
      // Server chặn tăng ảo 30 phút/visitor/bài, nên POST ở đây không làm sai số
      // dù trang còn fragment banner cũng ghi nhận lượt đọc.
      const response = await fetch(url.toString(), {
        method: "POST",
        credentials: "include",
        headers
      });
      if (!response.ok) throw new Error(`Counter API error: ${response.status}`);

      render((await response.json()).totalReads);
    } catch (error) {
      // Counter lỗi thì giữ nguyên trạng thái ẩn, không hiện dòng trống.
      console.error("Article view counter failed", error);
    }
  }

  // window.articleId do trang bài viết đặt, có thể sẵn sàng sau script fragment.
  let tries = 0;
  const interval = setInterval(function () {
    if (typeof window.articleId !== "undefined" && window.articleId) {
      clearInterval(interval);
      load(window.articleId);
      return;
    }

    if (++tries > ARTICLE_ID_POLL_MAX_TRIES) clearInterval(interval);
  }, ARTICLE_ID_POLL_INTERVAL_MS);
})();
