(function () {
  const root = window.fragmentElement || document;
  const section = root.querySelector(".highway-section-2");

  if (!section) return;

  const statsWrapper = section.querySelector(".stats-wrapper");
  const statElements = {
    namHoatDong: section.querySelector('[data-stat="namHoatDong"]'),
    vonDieuLe: section.querySelector('[data-stat="vonDieuLe"]'),
    soTuyenCaoToc: section.querySelector('[data-stat="soTuyenCaoToc"]'),
    soPhuongTien: section.querySelector('[data-stat="soPhuongTien"]'),
    doanhThu: section.querySelector('[data-stat="doanhThu"]'),
  };
  const API_URL = `${window.location.origin}/o/c/cacconsothongkes/`;

  function setStatContent(statKey, value, unit) {
    const statElement = statElements[statKey];

    if (!statElement) return;

    const valueElement = statElement.querySelector("[data-stat-value]");
    const unitElement = statElement.querySelector("[data-stat-unit]");

    if (valueElement && value !== undefined && value !== null) {
      valueElement.textContent = String(value).trim();
    }

    if (unitElement) {
      unitElement.textContent = unit ? String(unit).trim() : "";
    }
  }

  function normalizeHighwayCount(value) {
    const count = Number(value);

    if (!Number.isFinite(count)) {
      return value;
    }

    return count < 10 ? String(count).padStart(2, "0") : String(count);
  }

  async function fetchStats() {
    const headers = {
      accept: "application/json",
    };
    const authToken = window.Liferay?.authToken;

    if (authToken) {
      headers["x-csrf-token"] = authToken;
    }

    const response = await fetch(API_URL, {
      method: "GET",
      cache: "no-store",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Fetch stats failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.items) || !data.items.length) {
      return null;
    }

    return data.items
      .slice()
      .sort((firstItem, secondItem) => {
        const firstDate = new Date(firstItem.dateModified || firstItem.dateCreated || 0).getTime();
        const secondDate = new Date(secondItem.dateModified || secondItem.dateCreated || 0).getTime();

        return secondDate - firstDate;
      })[0];
  }

  async function applyStatsFromApi() {
    try {
      const stats = await fetchStats();

      if (!stats) return;

      setStatContent("namHoatDong", stats.namHoatDong);
      setStatContent("vonDieuLe", stats.vonDieuLe, stats.nVCaVniuL);
      setStatContent("soTuyenCaoToc", normalizeHighwayCount(stats.soTuyenCaoToc));
      setStatContent("soPhuongTien", stats.soPhuongTien, stats.nVCaPhngTin);
      setStatContent("doanhThu", stats.doanhThu, stats.nVCaDoanhThu);
    } catch (error) {
      console.error("Khong the tai du lieu thong ke:", error);
    }
  }

  function initSlideAnimation() {
    if (!statsWrapper) return;

    statsWrapper.style.opacity = "0";
    statsWrapper.style.transform = "translateX(100px)";
    statsWrapper.style.transition = "opacity 0.8s ease, transform 0.8s ease";

    const slideObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            statsWrapper.style.opacity = "1";
            statsWrapper.style.transform = "translateX(0)";
          }, 800);
        } else {
          statsWrapper.style.opacity = "0";
          statsWrapper.style.transform = "translateX(100px)";
        }
      });
    }, { threshold: 0.3 });

    slideObserver.observe(statsWrapper);
  }

  applyStatsFromApi();
  initSlideAnimation();
})();
