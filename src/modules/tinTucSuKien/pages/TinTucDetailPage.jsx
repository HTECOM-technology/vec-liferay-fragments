import { useParams } from "react-router-dom";

export default function TinTucDetailPage() {

  const { slug, id } = useParams();

  return (
    <div>

      <h1>Chi tiết bài viết</h1>

      <p>Category: {slug}</p>

      <p>Article ID: {id}</p>

    </div>
  );
}