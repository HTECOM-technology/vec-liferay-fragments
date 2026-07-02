import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CARD_REGISTRY } from "./cards/CardRegistry";
import { fetchLayoutFromApi, saveLayoutToApi } from "../services/dashboardLayoutService";
import { BtnChangeDragOverlay, DragBtnWrap } from "../style";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const DEFAULT_FLAT_ORDER = [
  "cong-van-vb", "cong-viec", "nhiem-vu", "giao-thong", "quick-links",
  "van-ban-moi", "lich-co-quan", "sinh-nhat", "nhan-su", "bieu-mau",
  "tin-tuc", "camera",
];

const CARD_NAMES = {
  "cong-van-vb": "Công văn - Văn bản",
  "cong-viec": "Công việc",
  "nhiem-vu": "Nhiệm vụ",
  // "giao-thong":   "Tình trạng giao thông",
  "quick-links": "Liên kết nhanh",
  "van-ban-moi": "Văn bản mới",
  "lich-co-quan": "Lịch cơ quan",
  "sinh-nhat": "Sinh nhật công ty",
  "nhan-su": "Hoạt động nhân sự",
  "bieu-mau": "Biểu mẫu",
  "tin-tuc": "Tin tức - Sự kiện",
  "camera": "Camera giao thông",
};

const LS_KEY = "dashboard-layout-v2";
const MAX_SPAN = 5;
const DEBOUNCE_MS = 5000;

const CARD_SPAN = { "tin-tuc": 3, "camera": 2 };
function getSpan(id) { return CARD_SPAN[id] ?? 1; }

// ─── LAYOUT HELPERS ───────────────────────────────────────────────────────────

/**
 * Greedy bucket: lấy các card visible, nhét vào hàng tối đa MAX_SPAN span.
 * Card không đủ chỗ ở hàng hiện tại → mở hàng mới.
 * Đây là cơ chế tự động "dồn lên nếu đủ chỗ".
 */
function computeLayout(flatOrder, hiddenIds) {
  const visible = flatOrder.filter((id) => !hiddenIds.has(id));
  const rows = [];
  let currentRow = [];
  let currentSpan = 0;

  for (const id of visible) {
    const span = getSpan(id);
    if (currentSpan + span > MAX_SPAN) {
      if (currentRow.length > 0) rows.push(currentRow);
      currentRow = [id];
      currentSpan = span;
    } else {
      currentRow.push(id);
      currentSpan += span;
    }
  }
  if (currentRow.length > 0) rows.push(currentRow);
  return rows;
}

/**
 * Áp dụng thứ tự visible mới vào flatOrder, giữ nguyên slot của hidden cards.
 */
function applyVisibleReorder(flatOrder, hiddenIds, newVisibleFlat) {
  const result = [...flatOrder];
  const visiblePositions = result
    .map((id, i) => ({ id, i }))
    .filter(({ id }) => !hiddenIds.has(id))
    .map(({ i }) => i);
  newVisibleFlat.forEach((id, j) => {
    result[visiblePositions[j]] = id;
  });
  return result;
}

/**
 * Cross-row swap trên visibleLayout (array of arrays).
 * Trả về null nếu không swap được.
 */
function crossRowSwap(visibleLayout, activeId, overId) {
  const sourceRowIdx = visibleLayout.findIndex((row) => row.includes(activeId));
  const targetRowIdx = visibleLayout.findIndex((row) => row.includes(overId));

  if (sourceRowIdx === -1 || targetRowIdx === -1 || sourceRowIdx === targetRowIdx) return null;

  const source = [...visibleLayout[sourceRowIdx]];
  const target = [...visibleLayout[targetRowIdx]];
  const fromIndex = source.indexOf(activeId);
  const toIndex = target.indexOf(overId);
  const spanA = getSpan(activeId);
  const spanO = getSpan(overId);

  if (fromIndex === -1 || toIndex === -1) return null;

  if (spanA === spanO) {
    source[fromIndex] = overId;
    target[toIndex] = activeId;
  } else if (spanA > spanO) {
    const displaced = target.slice(toIndex, toIndex + spanA);
    if (displaced.length < spanA || displaced.some((id) => getSpan(id) !== 1)) return null;
    target.splice(toIndex, spanA, activeId);
    source.splice(fromIndex, 1, ...displaced);
  } else {
    const displaced = source.slice(fromIndex, fromIndex + spanO);
    if (displaced.length < spanO || displaced.some((id) => getSpan(id) !== 1)) return null;
    source.splice(fromIndex, spanO, overId);
    target.splice(toIndex, 1, ...displaced);
  }

  const newLayout = [...visibleLayout];
  newLayout[sourceRowIdx] = source;
  newLayout[targetRowIdx] = target;
  return newLayout;
}

// ─── PERSISTENCE ──────────────────────────────────────────────────────────────

function loadState() {
  try {
    const saved = localStorage.getItem(LS_KEY);
    if (!saved) {
      // Migrate từ format cũ (row-based)
      const oldSaved = localStorage.getItem("dashboard-layout");
      if (oldSaved) {
        const parsed = JSON.parse(oldSaved);
        if (parsed.row1) {
          const flatOrder = [
            ...(parsed.row1 || []),
            ...(parsed.row2 || []),
            ...(parsed.row3 || []),
          ];
          const missing = DEFAULT_FLAT_ORDER.filter((id) => !flatOrder.includes(id));
          if (missing.length === 0) return { flatOrder, hiddenIds: new Set() };
        }
      }
      return { flatOrder: DEFAULT_FLAT_ORDER, hiddenIds: new Set() };
    }

    const parsed = JSON.parse(saved);
    const flatOrder = parsed.flatOrder || DEFAULT_FLAT_ORDER;
    const hiddenIds = new Set(parsed.hiddenIds || []);
    const missing = DEFAULT_FLAT_ORDER.filter((id) => !flatOrder.includes(id));
    if (missing.length > 0) return { flatOrder: DEFAULT_FLAT_ORDER, hiddenIds: new Set() };
    return { flatOrder, hiddenIds };
  } catch {
    return { flatOrder: DEFAULT_FLAT_ORDER, hiddenIds: new Set() };
  }
}

function normalizeLayoutData(data) {
  if (!data) return null;
  // Format cũ: { row1, row2, row3 }
  if (data.row1) {
    const flatOrder = [
      ...(data.row1 || []),
      ...(data.row2 || []),
      ...(data.row3 || []),
    ];
    const missing = DEFAULT_FLAT_ORDER.filter((id) => !flatOrder.includes(id));
    if (missing.length > 0) return null;
    return { flatOrder, hiddenIds: new Set() };
  }
  // Format mới: { flatOrder, hiddenIds }
  if (data.flatOrder) {
    const missing = DEFAULT_FLAT_ORDER.filter((id) => !data.flatOrder.includes(id));
    if (missing.length > 0) return null;
    return {
      flatOrder: data.flatOrder,
      hiddenIds: new Set(data.hiddenIds || []),
    };
  }
  return null;
}

// ─── UTILS ────────────────────────────────────────────────────────────────────

function getIsSignedIn() {
  if (process.env.REACT_APP_FORCE_ADMIN === "true") return true;
  try {
    return window.Liferay?.ThemeDisplay?.isSignedIn?.() ?? false;
  } catch {
    return false;
  }
}

function getContainerClass(id) {
  const span = getSpan(id);
  return span > 1
    ? `dashboard-upper-card dashboard-card-${id} grid-col-span-${span}`
    : `dashboard-upper-card dashboard-card-${id}`;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function OverlayCard({ id }) {
  const CardComponent = CARD_REGISTRY[id];
  if (!CardComponent) return null;
  return (
    <div className="dashboard-upper-card overlay-dragging">
      <CardComponent dragHandleProps={{}} />
    </div>
  );
}

function SortableCard({ id, canDrag, onHide }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !canDrag });

  const CardComponent = CARD_REGISTRY[id];
  const dragHandleProps = canDrag
    ? { ...listeners, ...attributes, style: { cursor: "grab" } }
    : {};

  if (!CardComponent) return null;

  return (
    <div
      ref={setNodeRef}
      className={getContainerClass(id)}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        position: "relative",
      }}
    >
      <CardComponent dragHandleProps={dragHandleProps} canDrag={canDrag} />
      {canDrag && (
        <button
          className="card-hide-btn"
          title="Ẩn card"
          onClick={() => onHide(id)}
          onPointerDown={(e) => e.stopPropagation()}
        >
          ✕
        </button>
      )}
    </div>
  );
}

function DroppableRow({ rowKey, items, className, children }) {
  return (
    <div id={`droppable-${rowKey}`} className={className}>
      <SortableContext items={items} strategy={horizontalListSortingStrategy}>
        {children}
      </SortableContext>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function DashboardDnD() {
  const canDrag = getIsSignedIn();

  const [flatOrder, setFlatOrder] = useState(() => loadState().flatOrder);
  const [hiddenIds, setHiddenIds] = useState(() => loadState().hiddenIds);
  const [activeId, setActiveId] = useState(null);
  const [isDragEnabled, setIsDragEnabled] = useState(false);

  // Tự tắt drag mode khi màn < 1200px và không cho bật lại
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1199px)");
    const handleChange = (e) => {
      if (e.matches) setIsDragEnabled(false);
    };
    if (mq.matches) setIsDragEnabled(false);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  // Ref để dùng hiddenIds bên trong setFlatOrder callbacks (tránh stale closure)
  const hiddenIdsRef = useRef(hiddenIds);
  useEffect(() => { hiddenIdsRef.current = hiddenIds; }, [hiddenIds]);

  const skipNextSaveRef = useRef(false);
  const debounceTimerRef = useRef(null);

  // visibleLayout là derived state — tính lại mỗi khi flatOrder hoặc hiddenIds thay đổi
  const visibleLayout = useMemo(
    () => computeLayout(flatOrder, hiddenIds),
    [flatOrder, hiddenIds]
  );

  // Fetch saved layout once on mount.
  useEffect(() => {
    fetchLayoutFromApi().then((data) => {
      const normalized = normalizeLayoutData(data);
      if (!normalized) return;
      skipNextSaveRef.current = true;
      setFlatOrder(normalized.flatOrder);
      setHiddenIds(normalized.hiddenIds);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Mỗi khi state thay đổi: update localStorage + debounce ghi API
  useEffect(() => {
    const toSave = { flatOrder, hiddenIds: [...hiddenIds] };
    localStorage.setItem(LS_KEY, JSON.stringify(toSave));

    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      saveLayoutToApi(toSave);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [flatOrder, hiddenIds]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // ─── DnD HANDLERS ───────────────────────────────────────────────────────────

  function handleDragStart({ active }) {
    setActiveId(active.id);
  }

  function handleDragOver({ active, over }) {
    if (!over || active.id === over.id) return;
    setFlatOrder((prev) => {
      const currentVisible = computeLayout(prev, hiddenIdsRef.current);
      const newVisible = crossRowSwap(currentVisible, active.id, over.id);
      if (!newVisible) return prev;
      return applyVisibleReorder(prev, hiddenIdsRef.current, newVisible.flat());
    });
  }

  function handleDragEnd({ active, over }) {
    setActiveId(null);
    if (!over || active.id === over.id) return;

    setFlatOrder((prev) => {
      const currentVisible = computeLayout(prev, hiddenIdsRef.current);
      const activeRowIdx = currentVisible.findIndex((row) => row.includes(active.id));
      const overRowIdx = currentVisible.findIndex((row) => row.includes(over.id));

      if (activeRowIdx === -1 || overRowIdx === -1 || activeRowIdx !== overRowIdx) return prev;

      const items = [...currentVisible[activeRowIdx]];
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      if (oldIndex === newIndex) return prev;

      const newItems = arrayMove(items, oldIndex, newIndex);
      const newVisible = [...currentVisible];
      newVisible[activeRowIdx] = newItems;
      return applyVisibleReorder(prev, hiddenIdsRef.current, newVisible.flat());
    });
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  function toggleDragMode() {
    setIsDragEnabled((prev) => !prev);
  }

  // ─── HIDE / SHOW ────────────────────────────────────────────────────────────

  function toggleHide(id) {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // ─── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <style>{`
        .drag-handle-bar {
          display: ${isDragEnabled ? 'flex' : 'none'} !important;
        }
      `}</style>
      <DragBtnWrap>
        <BtnChangeDragOverlay
          onClick={toggleDragMode}
          style={{
            opacity: isDragEnabled ? 1 : 1,
            backgroundColor: isDragEnabled ? undefined : "rgba(0, 144, 207, 1)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title={isDragEnabled ? "Click để khóa bố cục" : "Click để mở khóa bố cục"}
        >
          {isDragEnabled ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, display: "inline-block" }}>
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
              Hoàn thành
            </>
          ) :
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, display: "inline-block" }}>
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
              Sắp xếp bố cục
            </>
          }
        </BtnChangeDragOverlay>
      </DragBtnWrap>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {visibleLayout.map((rowItems, idx) => (
          <DroppableRow
            key={`row-${idx}`}
            rowKey={`row-${idx}`}
            items={rowItems}
            className={
              idx === visibleLayout.length - 1
                ? "dashboard-upper-cards bottom-area"
                : "dashboard-upper-cards column-area-4"
            }
          >
            {rowItems.map((id) => (
              <SortableCard key={id} id={id} canDrag={canDrag && isDragEnabled} onHide={toggleHide} />
            ))}
          </DroppableRow>
        ))}
      </div>

      {/* Panel hiển thị các card đã ẩn — chỉ admin thấy */}
      {canDrag && isDragEnabled && hiddenIds.size > 0 && (
        <div className="hidden-cards-panel">
          <span className="hidden-cards-label">Card đã ẩn:</span>
          <div className="hidden-cards-list">
            {[...hiddenIds].map((id) => (
              <button
                key={id}
                className="hidden-card-restore-btn"
                onClick={() => toggleHide(id)}
                title="Nhấn để hiện lại"
              >
                {CARD_NAMES[id] ?? id}
                <span className="restore-icon">+</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
        {activeId ? <OverlayCard id={activeId} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
