import React from "react";

/**
 * Trang placeholder cho từng route. Sau này thay bằng component thật.
 */
function PlaceholderPage({ title }) {
  return (
    <div style={{ padding: 24 }}>
      <h1>{title}</h1>
      <p>Nội dung trang &quot;{title}&quot; sẽ được triển khai tại đây.</p>
    </div>
  );
}

export default PlaceholderPage;
