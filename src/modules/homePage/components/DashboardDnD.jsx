import React, { useState, useEffect, useRef } from "react";
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
import { fetchLayoutFromFirebase, saveLayoutToFirebase } from "../services/firebaseLayoutService";

const DEFAULT_LAYOUT = {
  row1: ["cong-van-vb", "cong-viec", "nhiem-vu", "giao-thong", "quick-links"],
  row2: ["van-ban-moi", "lich-co-quan", "sinh-nhat", "nhan-su", "bieu-mau"],
  row3: ["tin-tuc", "camera"],
};

const LS_KEY = "dashboard-layout";

// Số cột mà mỗi card chiếm trong grid 5 cột
const CARD_SPAN = { "tin-tuc": 3, "camera": 2 };
function getSpan(id) { return CARD_SPAN[id] ?? 1; }

function loadLayout() {
  try {
    const saved = localStorage.getItem(LS_KEY);
    if (!saved) return DEFAULT_LAYOUT;
    const parsed = JSON.parse(saved);
    const allIds = Object.values(DEFAULT_LAYOUT).flat();
    const savedIds = Object.values(parsed).flat();
    const missing = allIds.filter((id) => !savedIds.includes(id));
    if (missing.length > 0) return DEFAULT_LAYOUT;
    return parsed;
  } catch {
    return DEFAULT_LAYOUT;
  }
}

function getIsSignedIn() {
  try {
    return window.Liferay?.ThemeDisplay?.isSignedIn?.() ?? false;
  } catch {
    return false;
  }
}

function OverlayCard({ id }) {
  const CardComponent = CARD_REGISTRY[id];
  if (!CardComponent) return null;
  return (
    <div className="dashboard-upper-card overlay-dragging">
      <CardComponent dragHandleProps={{}} />
    </div>
  );
}

function getContainerClass(id) {
  const span = getSpan(id);
  return span > 1 ? `dashboard-upper-card grid-col-span-${span}` : "dashboard-upper-card";
}

function SortableCard({ id, canDrag }) {
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
      }}
    >
      <CardComponent dragHandleProps={dragHandleProps} canDrag={canDrag} />
    </div>
  );
}

function DroppableRow({ rowId, items, className, children }) {
  return (
    <div id={`droppable-${rowId}`} className={className}>
      <SortableContext items={items} strategy={horizontalListSortingStrategy}>
        {children}
      </SortableContext>
    </div>
  );
}

/**
 * Group swap cross-row, giữ tổng span mỗi hàng = 5.
 *
 * spanA > spanO (wide → narrow row):
 *   activeId thay thế spanA card span-1 liên tiếp tại toIndex trong target.
 *   Các card bị đẩy ra lấp chỗ activeId trong source.
 *
 * spanA < spanO (narrow → wide card):
 *   spanO card span-1 liên tiếp từ fromIndex trong source lấp chỗ overId.
 *   overId thay thế spanO card đó trong source.
 *
 * spanA === spanO: swap trực tiếp 1-1.
 */
function crossRowSwap(prev, activeId, overId) {
  const sourceRow = Object.keys(prev).find((k) => prev[k].includes(activeId));
  const targetRow = Object.keys(prev).find((k) => prev[k].includes(overId));

  if (!sourceRow || !targetRow || sourceRow === targetRow) return prev;

  const source = [...prev[sourceRow]];
  const target = [...prev[targetRow]];
  const fromIndex = source.indexOf(activeId);
  const toIndex = target.indexOf(overId);
  const spanA = getSpan(activeId);
  const spanO = getSpan(overId);

  if (fromIndex === -1 || toIndex === -1) return prev;

  if (spanA === spanO) {
    source[fromIndex] = overId;
    target[toIndex] = activeId;
    return { ...prev, [sourceRow]: source, [targetRow]: target };
  }

  if (spanA > spanO) {
    // Wide card → cần spanA card span-1 liên tiếp từ toIndex trong target
    const displaced = target.slice(toIndex, toIndex + spanA);
    if (displaced.length < spanA || displaced.some((id) => getSpan(id) !== 1))
      return prev;
    target.splice(toIndex, spanA, activeId);
    source.splice(fromIndex, 1, ...displaced);
    return { ...prev, [sourceRow]: source, [targetRow]: target };
  }

  // spanA < spanO: narrow card → cần spanO card span-1 liên tiếp từ fromIndex trong source
  const displaced = source.slice(fromIndex, fromIndex + spanO);
  if (displaced.length < spanO || displaced.some((id) => getSpan(id) !== 1))
    return prev;
  source.splice(fromIndex, spanO, overId);
  target.splice(toIndex, 1, ...displaced);
  return { ...prev, [sourceRow]: source, [targetRow]: target };
}

const DEBOUNCE_MS = 5000;

export default function DashboardDnD() {
  const canDrag = getIsSignedIn();

  const [layout, setLayout] = useState(loadLayout);
  const [activeId, setActiveId] = useState(null);

  // Ref để skip save khi vừa load từ Firebase (tránh ghi lại ngay lập tức)
  const skipNextSaveRef = useRef(false);
  const debounceTimerRef = useRef(null);

  // Lần đầu mount: fetch từ Firebase, dùng làm source of truth
  useEffect(() => {
    fetchLayoutFromFirebase().then((data) => {
      if (!data) return;
      const allIds = Object.values(DEFAULT_LAYOUT).flat();
      const savedIds = Object.values(data).flat();
      const missing = allIds.filter((id) => !savedIds.includes(id));
      if (missing.length > 0) return; // layout cũ/lỗi, giữ nguyên local
      skipNextSaveRef.current = true;
      setLayout(data);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Mỗi khi layout thay đổi: update localStorage + debounce 5s ghi Firebase
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(layout));

    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      saveLayoutToFirebase(layout);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [layout]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleDragStart({ active }) {
    setActiveId(active.id);
  }

  function handleDragOver({ active, over }) {
    if (!over || active.id === over.id) return;
    setLayout((prev) => crossRowSwap(prev, active.id, over.id));
  }

  function handleDragEnd({ active, over }) {
    setActiveId(null);
    if (!over || active.id === over.id) return;

    setLayout((prev) => {
      const activeRow = Object.keys(prev).find((k) => prev[k].includes(active.id));
      const overRow = Object.keys(prev).find((k) => prev[k].includes(over.id));

      if (!activeRow || !overRow || activeRow !== overRow) return prev;

      // Same-row reorder
      const items = [...prev[activeRow]];
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      if (oldIndex === newIndex) return prev;
      return { ...prev, [activeRow]: arrayMove(items, oldIndex, newIndex) };
    });
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <DroppableRow rowId="row1" items={layout.row1} className="dashboard-upper-cards">
          {layout.row1.map((id) => (
            <SortableCard key={id} id={id} canDrag={canDrag} />
          ))}
        </DroppableRow>

        <DroppableRow rowId="row2" items={layout.row2} className="dashboard-upper-cards">
          {layout.row2.map((id) => (
            <SortableCard key={id} id={id} canDrag={canDrag} />
          ))}
        </DroppableRow>

        <DroppableRow rowId="row3" items={layout.row3} className="dashboard-upper-cards bottom-area">
          {layout.row3.map((id) => (
            <SortableCard key={id} id={id} canDrag={canDrag} />
          ))}
        </DroppableRow>
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
        {activeId ? <OverlayCard id={activeId} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
