import { useState, useEffect, useCallback, useMemo } from "react";
import { Select, Input, message } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { SurveyCard, CreateVoteModal, VoteSurveyModal, FILTER_TYPES, SORT_OPTIONS } from "./components";
import { getSurveys, createSurvey, submitVote } from "./services/surveyService";
import { IconInvited } from "assets/icon/IconInvited";
import { IconMySurveys } from "assets/icon/IconMySurveys";
import { IconCreateSurvey } from "assets/icon/IconCreateSurvey";
import {
  PageContainer,
  ContentContainer,
  PageHeader,
  PageTitle,
  HeaderActions,
  FilterSelect,
  CreateButton,
  FilterTagsContainer,
  FilterTag,
  CardsGrid,
  PaginationContainer,
  PaginationInfo,
  PaginationNav,
  GoToPage,
} from "./style";

const FILTER_TAGS = [
  { key: FILTER_TYPES.INVITED, label: "Được mời", icon: IconInvited },
  { key: FILTER_TYPES.MY_SURVEYS, label: "Của tôi", icon: IconMySurveys },
];

const DEFAULT_PAGE_SIZE = 12;

export default function KhaoSatBieuQuyet() {
  const [activeFilter, setActiveFilter] = useState(FILTER_TYPES.INVITED);
  const [sortOrder, setSortOrder] = useState("newest");
  const [pagination, setPagination] = useState({ current: 1, pageSize: DEFAULT_PAGE_SIZE });
  const { current: currentPage, pageSize } = pagination;

  const [surveys, setSurveys] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isVoteModalVisible, setIsVoteModalVisible] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const totalPages = useMemo(() => Math.ceil(total / pageSize), [total, pageSize]);

  const pageSizeOptions = useMemo(
    () => [
      { value: 8, label: `8 / ${total}` },
      { value: 12, label: `12 / ${total}` },
      { value: 16, label: `16 / ${total}` },
      { value: 20, label: `20 / ${total}` },
    ],
    [total]
  );

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 6;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 4) {
      for (let i = 1; i <= 6; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 5; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, currentPage]);

  // Fetch surveys whenever filter / sort / page changes
  useEffect(() => {
    setLoading(true);
    getSurveys({ filter: activeFilter, sort: sortOrder, page: currentPage, pageSize })
      .then(({ items, total: t }) => {
        setSurveys(items ?? []);
        setTotal(t ?? 0);
      })
      .catch((err) => console.error("[KhaoSatBieuQuyet] fetch error:", err))
      .finally(() => setLoading(false));
  }, [activeFilter, sortOrder, currentPage, pageSize]);

  const handleFilterChange = useCallback((filterType) => {
    setActiveFilter(filterType);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleSortChange = useCallback((value) => {
    setSortOrder(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handlePaginationChange = useCallback((page) => {
    setPagination((prev) => ({ ...prev, current: page }));
  }, []);

  const handlePageSizeChange = useCallback((size) => {
    setPagination({ current: 1, pageSize: size });
  }, []);

  const handleVote = useCallback((survey) => {
    setSelectedSurvey(survey);
    setIsVoteModalVisible(true);
  }, []);

  const handleCloseVoteModal = useCallback(() => {
    setIsVoteModalVisible(false);
    setSelectedSurvey(null);
  }, []);

  const handleSubmitVote = useCallback(
    async (voteData) => {
      if (!selectedSurvey) return;
      setIsVoting(true);
      try {
        await submitVote(selectedSurvey.id, voteData.selectedOptions);
        const { items, total: t } = await getSurveys({
          filter: activeFilter,
          sort: sortOrder,
          page: currentPage,
          pageSize,
        });
        setSurveys(items ?? []);
        setTotal(t ?? 0);
        message.success("Bình chọn thành công!");
        setIsVoteModalVisible(false);
        setSelectedSurvey(null);
      } catch (err) {
        console.error("[KhaoSatBieuQuyet] submitVote error:", err);
        message.error("Bình chọn thất bại. Vui lòng thử lại!");
      } finally {
        setIsVoting(false);
      }
    },
    [selectedSurvey, activeFilter, sortOrder, currentPage, pageSize]
  );

  const handleCreateSurvey = useCallback(() => {
    setIsCreateModalVisible(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalVisible(false);
  }, []);

  const handleSubmitCreateModal = useCallback(
    async (formData) => {
      setIsCreating(true);
      try {
        await createSurvey(formData);
        const { items, total: t } = await getSurveys({
          filter: activeFilter,
          sort: sortOrder,
          page: 1,
          pageSize,
        });
        setSurveys(items ?? []);
        setTotal(t ?? 0);
        setPagination((prev) => ({ ...prev, current: 1 }));
        message.success("Tạo cuộc bình chọn thành công!");
        setIsCreateModalVisible(false);
      } catch (err) {
        console.error("[KhaoSatBieuQuyet] createSurvey error:", err);
        message.error("Tạo cuộc bình chọn thất bại. Vui lòng thử lại!");
      } finally {
        setIsCreating(false);
      }
    },
    [activeFilter, sortOrder, pageSize]
  );

  return (
    <PageContainer>
      <ContentContainer>
        <PageHeader>
          <PageTitle>Danh sách khảo sát</PageTitle>
          <HeaderActions>
            <FilterSelect>
              <Select
                value={sortOrder}
                onChange={handleSortChange}
                options={SORT_OPTIONS}
                style={{ width: 130, height: 38 }}
              />
            </FilterSelect>
            <CreateButton onClick={handleCreateSurvey} style={{ width: 190, height: 38 }}>
              <IconCreateSurvey />
              Tạo cuộc bình chọn
            </CreateButton>
          </HeaderActions>
        </PageHeader>

        <FilterTagsContainer>
          {FILTER_TAGS.map(({ key, label, icon: Icon }) => (
            <FilterTag
              key={key}
              $active={activeFilter === key}
              onClick={() => handleFilterChange(key)}
              style={{ height: 28 }}
            >
              <Icon />
              {label}
            </FilterTag>
          ))}
        </FilterTagsContainer>

        <CardsGrid>
          {!loading && surveys.map((survey) => (
            <SurveyCard key={survey.id} data={survey} onVote={handleVote} />
          ))}
        </CardsGrid>
        {!loading && surveys.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(107, 114, 128, 1)", fontSize: 14 }}>
            Không có bình chọn nào có sẵn
          </div>
        )}

        <PaginationContainer>
          <PaginationInfo>
            <span>Hiển thị</span>
            <Select
              value={pageSize}
              onChange={handlePageSizeChange}
              options={pageSizeOptions}
              style={{ width: 100 }}
            />
          </PaginationInfo>

          <PaginationNav>
            <button
              className="page-btn"
              onClick={() => handlePaginationChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <LeftOutlined />
            </button>

            {pageNumbers.map((page, index) =>
              page === "..." ? (
                <span key={`ellipsis-${index}`} className="page-ellipsis">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  className={`page-btn ${currentPage === page ? "active" : ""}`}
                  onClick={() => handlePaginationChange(page)}
                >
                  {page}
                </button>
              )
            )}

            <button
              className="page-btn"
              onClick={() => handlePaginationChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <RightOutlined />
            </button>
          </PaginationNav>

          <GoToPage>
            <span>Tới trang</span>
            <Input
              type="number"
              min={1}
              max={totalPages}
              onPressEnter={(e) => {
                const page = parseInt(e.target.value, 10);
                if (page >= 1 && page <= totalPages) {
                  handlePaginationChange(page);
                }
              }}
            />
          </GoToPage>
        </PaginationContainer>
      </ContentContainer>

      <CreateVoteModal
        visible={isCreateModalVisible}
        onClose={handleCloseCreateModal}
        onSubmit={handleSubmitCreateModal}
        submitting={isCreating}
      />

      <VoteSurveyModal
        visible={isVoteModalVisible}
        survey={selectedSurvey}
        onClose={handleCloseVoteModal}
        onSubmit={handleSubmitVote}
        allowMultiple={selectedSurvey?.allowMultiple ?? false}
        submitting={isVoting}
      />
    </PageContainer>
  );
}
