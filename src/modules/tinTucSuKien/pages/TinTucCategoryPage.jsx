import { useParams } from "react-router-dom";
import News from "../components/News";

export default function TinTucCategoryPage() {

  const { slug } = useParams();

  return (
    <News />
  );

}