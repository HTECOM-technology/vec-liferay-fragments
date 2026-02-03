import React, { useEffect, useState } from "react";
import {
  getVocabulariesBySite,
  getCategoriesByVocabulary,
} from "../services/taxonomyService";
import {
  getContentStructures,
  getStructuredContents,
} from "../services/contentService";
import "../styles/News.css";
import { getFieldValue } from "../utils/contentFieldUtils";

/**
 * News Component
 *
 * Displays news articles fetched from Liferay Headless APIs.
 * - Loads taxonomy categories for filtering
 * - Loads structured content based on a specific content structure
 * - Filters articles by selected taxonomy category
 *
 * @component
 * @returns {JSX.Element}
 */
const News = () => {
  /** List of taxonomy categories */
  const [categories, setCategories] = useState([]);

  /** Currently selected category ID */
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  /** All fetched news articles */
  const [articles, setArticles] = useState([]);

  /** Articles filtered by active category */
  const [filteredArticles, setFilteredArticles] = useState([]);

  /** Loading indicator state */
  const [loading, setLoading] = useState(true);

  /** Liferay site (group) ID */
  const SITE_ID = themeDisplay.getSiteGroupId();

  /** Target taxonomy vocabulary name */
  const VOCABULARY_NAME = "News Article Types";

  /** Target content structure name */
  const STRUCTURE_NAME = "NEWS_ARTICLES";

  /**
   * Load initial data on component mount:
   * - Categories
   * - Content structures
   * - Structured content (articles)
   */
  useEffect(() => {
    loadInitialData();
  }, []);

  /**
   * Filter articles whenever:
   * - Active category changes
   * - Articles list updates
   */
  useEffect(() => {
    if (activeCategoryId) {
      const filtered = articles.filter((item) =>
        item.taxonomyCategoryBriefs?.some(
          (cat) =>
            Number(cat.taxonomyCategoryId) === Number(activeCategoryId)
        )
      );
      setFilteredArticles(filtered);
    }
  }, [activeCategoryId, articles]);

  /**
   * Loads all required data for the News component.
   *
   * Steps:
   * 1. Fetch taxonomy vocabularies and categories
   * 2. Fetch content structures
   * 3. Fetch structured content (news articles)
   */
  const loadInitialData = async () => {
    try {
      /* 1 Load taxonomy categories */
      const vocabularies = await getVocabulariesBySite(SITE_ID);
      const targetVocabulary = vocabularies.find(
        (v) => v.name === VOCABULARY_NAME
      );

      const cats = await getCategoriesByVocabulary(targetVocabulary.id);
      setCategories(cats);
      setActiveCategoryId(cats[0]?.id);

      /* 2️ Load content structure */
      const structures = await getContentStructures(SITE_ID);
      const newsStructure = structures.find(
        (s) => s.name === STRUCTURE_NAME
      );

      /* 3️ Load structured content (articles) */
      const contents = await getStructuredContents(newsStructure.id);
      setArticles(contents);
    } catch (err) {
      console.error("Error loading news", err);
    } finally {
      setLoading(false);
    }
  };

  /** Show loading state */
  if (loading) return <div className="news-loading">Loading...</div>;

  return (
    <div className="news-container">
      {/* Header */}
      <div className="news-header">
        <span className="news-icon">📰</span>
        <span>Tin tức - Sự kiện</span>
      </div>

      {/* Category Tabs */}
      <ul className="news-tabs">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className={activeCategoryId === cat.id ? "active" : ""}
            onClick={() => setActiveCategoryId(cat.id)}
          >
            {cat.name}
          </li>
        ))}
      </ul>

      {/* News Articles */}
      <div className="news-list">
        {filteredArticles.map((item) => {
          const title = item.title;
          const fields = item.contentFields;

          /** Short description field */
          const shortDescription =
            getFieldValue(fields, "shortDescription")?.data;

          /** Publish date field */
          const date =
            getFieldValue(fields, "date")?.data?.split("T")[0];

          /** Image field URL */
          const image =
            getFieldValue(fields, "image")?.image?.contentUrl;

          return (
            <div key={item.id} className="news-item">
              <img
                src={`${window.location.origin}${image}`}
                alt={title}
              />
              <div className="news-info">
                <h3>{title}</h3>
                <p>{shortDescription}</p>
                <span className="news-date">{date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default News;
