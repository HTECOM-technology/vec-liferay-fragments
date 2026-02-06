import React, { useState, useMemo, useCallback } from "react";
import { Select, Input } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { SurveyCard, CreateVoteModal, VoteSurveyModal, mockSurveyData, FILTER_TYPES, SORT_OPTIONS } from "./components";
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

// Icons for filter tags
const InvitedIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_7471_5661)">
            <path d="M14.6668 8.00008C14.6668 4.31818 11.6821 1.33342 8.00016 1.33342C4.31826 1.33342 1.3335 4.31818 1.3335 8.00008C1.3335 11.682 4.31826 14.6667 8.00016 14.6667C11.6821 14.6667 14.6668 11.682 14.6668 8.00008Z" fill="currentColor" fill-opacity="0.2" />
            <path d="M14.6668 8.00008C14.6668 4.31818 11.6821 1.33342 8.00016 1.33342C4.31826 1.33342 1.3335 4.31818 1.3335 8.00008C1.3335 11.682 4.31826 14.6667 8.00016 14.6667C11.6821 14.6667 14.6668 11.682 14.6668 8.00008Z" stroke="currentColor" stroke-width="1.5" />
            <path d="M5.3335 8.50004C5.3335 8.50004 6.40016 9.10839 6.9335 10C6.9335 10 8.5335 6.50004 10.6668 5.33337" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </g>
        <defs>
            <clipPath id="clip0_7471_5661">
                <rect width="16" height="16" fill="currentColor" />
            </clipPath>
        </defs>
    </svg>
);

const MyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 3.33337C10 4.43794 9.10457 5.33337 8 5.33337C6.89543 5.33337 6 4.43794 6 3.33337C6 2.2288 6.89543 1.33337 8 1.33337C9.10457 1.33337 10 2.2288 10 3.33337Z" fill="currentColor" />
        <path d="M8.79849 5.33337H7.20151C4.90557 5.33337 3.35761 7.72045 4.26202 9.86628C4.38801 10.1652 4.67707 10.359 4.9969 10.359H5.55928C5.74884 10.359 5.91407 10.4902 5.96005 10.6772L6.68404 13.6219C6.83501 14.236 7.37757 14.6667 8 14.6667C8.62244 14.6667 9.165 14.236 9.31596 13.6219L10.04 10.6772C10.0859 10.4902 10.2512 10.359 10.4407 10.359H11.0031C11.3229 10.359 11.612 10.1652 11.738 9.86628C12.6424 7.72045 11.0944 5.33337 8.79849 5.33337Z" fill="currentColor" fill-opacity="0.2" />
        <path d="M8.79849 5.33337H7.20151C4.90557 5.33337 3.35761 7.72045 4.26202 9.86628C4.38801 10.1652 4.67707 10.359 4.9969 10.359H5.55928C5.74884 10.359 5.91407 10.4902 5.96005 10.6772L6.68404 13.6219C6.83501 14.236 7.37757 14.6667 8 14.6667C8.62244 14.6667 9.165 14.236 9.31596 13.6219L10.04 10.6772C10.0859 10.4902 10.2512 10.359 10.4407 10.359H11.0031C11.3229 10.359 11.612 10.1652 11.738 9.86628C12.6424 7.72045 11.0944 5.33337 8.79849 5.33337Z" stroke="currentColor" stroke-width="1.5" />
        <circle cx="8" cy="3.33337" r="2" stroke="currentColor" stroke-width="1.5" />
    </svg>
);

const FILTER_TAGS = [
    { key: FILTER_TYPES.INVITED, label: "Được mời", icon: InvitedIcon },
    { key: FILTER_TYPES.MY_SURVEYS, label: "Của tôi", icon: MyIcon },
];

const DEFAULT_PAGE_SIZE = 12;

function KhaoSatBieuQuyet() {
    // State for filters
    const [activeFilter, setActiveFilter] = useState(FILTER_TYPES.INVITED);
    const [sortOrder, setSortOrder] = useState("newest");

    // State for pagination
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: DEFAULT_PAGE_SIZE,
    });

    // State for modals
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isVoteModalVisible, setIsVoteModalVisible] = useState(false);
    const [selectedSurvey, setSelectedSurvey] = useState(null);

    // Filter and sort data
    const filteredData = useMemo(() => {
        let result = [...mockSurveyData];

        // Sort
        if (sortOrder === "oldest") {
            result.sort((a, b) => a.createdAt - b.createdAt);
        } else {
            result.sort((a, b) => b.createdAt - a.createdAt);
        }

        return result;
    }, [sortOrder]);

    // Paginated data
    const paginatedData = useMemo(() => {
        const { current, pageSize } = pagination;
        const startIndex = (current - 1) * pageSize;
        return filteredData.slice(startIndex, startIndex + pageSize);
    }, [filteredData, pagination]);

    const totalPages = Math.ceil(filteredData.length / pagination.pageSize);

    // Handlers
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

    const handleSubmitVote = useCallback((voteData) => {
        console.log("Submit vote:", voteData);
        // TODO: Implement API call to submit vote
        setIsVoteModalVisible(false);
        setSelectedSurvey(null);
    }, []);

    const handleCreateSurvey = useCallback(() => {
        setIsCreateModalVisible(true);
    }, []);

    const handleCloseCreateModal = useCallback(() => {
        setIsCreateModalVisible(false);
    }, []);

    const handleSubmitCreateModal = useCallback((formData) => {
        console.log("Create new survey with data:", formData);
        // TODO: Implement API call to create survey
        setIsCreateModalVisible(false);
    }, []);

    // Render pagination numbers
    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 6;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (pagination.current <= 4) {
                for (let i = 1; i <= 6; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            } else if (pagination.current >= totalPages - 3) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 5; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push("...");
                for (let i = pagination.current - 1; i <= pagination.current + 1; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const AddIcon = () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.63686 13.3564C6.47836 13.3351 6.2499 13.3333 5.8335 13.3333H5.41684C4.80402 13.3333 4.42824 13.3351 4.15629 13.3717C3.91725 13.4038 3.87733 13.4495 3.8726 13.4549C3.87242 13.4551 3.8723 13.4553 3.87221 13.4554C3.87212 13.4555 3.87197 13.4556 3.87177 13.4558C3.86635 13.4605 3.82064 13.5004 3.7885 13.7395C3.75194 14.0114 3.75017 14.3872 3.75017 15V17.5H6.66684V14.1667C6.66684 13.7503 6.66507 13.5218 6.64376 13.3633C6.64348 13.3612 6.6432 13.3592 6.64292 13.3572C6.64094 13.357 6.63892 13.3567 6.63686 13.3564ZM6.85894 11.7046C7.17827 11.7475 7.54267 11.8521 7.84535 12.1548C8.14803 12.4575 8.25263 12.8219 8.29556 13.1412C8.33365 13.4245 8.33358 13.7679 8.33351 14.1213C8.33351 14.1364 8.3335 14.1515 8.3335 14.1667V18.3333C8.3335 18.7936 7.96041 19.1667 7.50017 19.1667H2.91684C2.4566 19.1667 2.0835 18.7936 2.0835 18.3333V15C2.0835 14.9828 2.0835 14.9657 2.0835 14.9487C2.08345 14.4036 2.0834 13.9138 2.1367 13.5174C2.19489 13.0846 2.33 12.6406 2.6937 12.2769C3.0574 11.9132 3.50141 11.7781 3.93421 11.7199C4.33063 11.6666 4.82039 11.6666 5.3655 11.6667C5.38256 11.6667 5.39967 11.6667 5.41684 11.6667H5.8335C5.84863 11.6667 5.86375 11.6667 5.87884 11.6667C6.23223 11.6666 6.57567 11.6665 6.85894 11.7046Z" fill="white" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.1212 13.3333C14.1363 13.3333 14.1514 13.3333 14.1665 13.3333H14.5832C14.6003 13.3333 14.6175 13.3333 14.6345 13.3333C15.1796 13.3333 15.6694 13.3332 16.0658 13.3865C16.4986 13.4447 16.9426 13.5798 17.3063 13.9435C17.67 14.3072 17.8051 14.7512 17.8633 15.184C17.9166 15.5805 17.9166 16.0702 17.9165 16.6153C17.9165 16.6324 17.9165 16.6495 17.9165 16.6667V18.3333C17.9165 18.7936 17.5434 19.1667 17.0832 19.1667H12.4998C12.0396 19.1667 11.6665 18.7936 11.6665 18.3333V15.8333C11.6665 15.8182 11.6665 15.8031 11.6665 15.788C11.6664 15.4346 11.6664 15.0912 11.7045 14.8079C11.7474 14.4886 11.852 14.1242 12.1547 13.8215C12.4574 13.5188 12.8217 13.4142 13.1411 13.3713C13.4243 13.3332 13.7678 13.3333 14.1212 13.3333ZM13.3571 15.0239C13.3568 15.0259 13.3565 15.0279 13.3563 15.03C13.335 15.1885 13.3332 15.4169 13.3332 15.8333V17.5H16.2498V16.6667C16.2498 16.0539 16.2481 15.6781 16.2115 15.4061C16.1794 15.1671 16.1337 15.1272 16.1282 15.1224C16.128 15.1223 16.1279 15.1221 16.1278 15.122C16.1277 15.122 16.1276 15.1218 16.1274 15.1216C16.1227 15.1162 16.0828 15.0705 15.8437 15.0383C15.5718 15.0018 15.196 15 14.5832 15H14.1665C13.7501 15 13.5217 15.0018 13.3632 15.0231C13.3611 15.0234 13.3591 15.0236 13.3571 15.0239Z" fill="white" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.833496 18.3333C0.833496 17.8731 1.20659 17.5 1.66683 17.5H18.3335C18.7937 17.5 19.1668 17.8731 19.1668 18.3333C19.1668 18.7936 18.7937 19.1667 18.3335 19.1667H1.66683C1.20659 19.1667 0.833496 18.7936 0.833496 18.3333Z" fill="white" />
            <path d="M10.0518 10C10.5966 9.99995 11.0861 9.99949 11.4824 10.0527C11.9152 10.1109 12.3599 10.2467 12.7236 10.6104C13.0871 10.974 13.2221 11.4179 13.2803 11.8506C13.3336 12.247 13.3331 12.7371 13.333 13.2822V18.333C13.333 18.7932 12.9602 19.167 12.5 19.167H7.5C7.03977 19.167 6.66699 18.7932 6.66699 18.333V13.2822C6.66694 12.7371 6.66643 12.247 6.71973 11.8506C6.77792 11.4178 6.91367 10.974 7.27734 10.6104C7.64101 10.2468 8.08484 10.1109 8.51758 10.0527C8.91385 9.99949 9.40343 9.99995 9.94824 10H10.0518Z" fill="white" />
            <path d="M9.99846 1.04167C10.5584 1.04167 10.9334 1.46122 11.1357 1.87099L11.7156 3.04036L11.7204 3.04497C11.7244 3.0486 11.7291 3.05249 11.7343 3.05635C11.7395 3.06021 11.7446 3.06362 11.7493 3.06647L11.7562 3.07036L12.8022 3.24557C13.2523 3.32121 13.7421 3.56249 13.9077 4.08207C14.0731 4.60079 13.8146 5.08112 13.4916 5.40496L13.4908 5.4058L12.6776 6.22567C12.6748 6.23155 12.6711 6.24065 12.6678 6.25224C12.6641 6.26513 12.6624 6.27616 12.6618 6.28345L12.8946 7.29824C12.9996 7.75776 13.0097 8.39605 12.5142 8.76022C12.0162 9.1263 11.4094 8.92071 11.0051 8.67989L10.0245 8.09461L10.0183 8.09374C10.0129 8.09313 10.0067 8.09275 10.0001 8.09275C9.99353 8.09275 9.98724 8.09313 9.98157 8.09377C9.97787 8.09419 9.97478 8.09469 9.97234 8.09516L8.99308 8.67964C8.58733 8.92238 7.98197 9.12474 7.48457 8.7588C6.99029 8.39516 6.99747 7.75887 7.1033 7.2977L7.33594 6.28345C7.33534 6.27616 7.33361 6.26513 7.32995 6.25224C7.32666 6.24065 7.32294 6.23155 7.3201 6.22567L6.50546 5.40429C6.18441 5.08059 5.92695 4.6009 6.09091 4.0832C6.25563 3.56312 6.74511 3.32127 7.19591 3.24551L8.23825 3.0709L8.24418 3.0675C8.24895 3.06461 8.25412 3.06115 8.25938 3.05722C8.26464 3.05329 8.2694 3.04932 8.27348 3.0456L8.27871 3.04057L8.85901 1.87039L8.85959 1.86923C9.06348 1.46021 9.43941 1.04167 9.99846 1.04167Z" fill="white" />
        </svg>
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
                            <AddIcon />
                            Tạo cuộc bình chọn
                        </CreateButton>
                    </HeaderActions>
                </PageHeader>

                <FilterTagsContainer>
                    {FILTER_TAGS.map((tag) => {
                        const IconComponent = tag.icon;
                        return (
                            <FilterTag
                                key={tag.key}
                                $active={activeFilter === tag.key}
                                onClick={() => handleFilterChange(tag.key)}
                                style={{ height: 28 }}
                            >
                                <IconComponent />
                                {tag.label}
                            </FilterTag>
                        );
                    })}
                </FilterTagsContainer>

                <CardsGrid>
                    {paginatedData.map((survey) => (
                        <SurveyCard
                            key={survey.id}
                            data={survey}
                            onVote={handleVote}
                        />
                    ))}
                </CardsGrid>

                <PaginationContainer>
                    <PaginationInfo>
                        <span>Hiển thị</span>
                        <Select
                            value={pagination.pageSize}
                            onChange={handlePageSizeChange}
                            options={[
                                { value: 8, label: `8 / ${filteredData.length}` },
                                { value: 12, label: `12 / ${filteredData.length}` },
                                { value: 16, label: `16 / ${filteredData.length}` },
                                { value: 20, label: `20 / ${filteredData.length}` },
                            ]}
                            style={{ width: 100 }}
                        />
                    </PaginationInfo>

                    <PaginationNav>
                        <button
                            className="page-btn"
                            onClick={() => handlePaginationChange(pagination.current - 1)}
                            disabled={pagination.current === 1}
                        >
                            <LeftOutlined />
                        </button>

                        {renderPageNumbers().map((page, index) =>
                            page === "..." ? (
                                <span key={`ellipsis-${index}`} className="page-ellipsis">
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={page}
                                    className={`page-btn ${pagination.current === page ? "active" : ""}`}
                                    onClick={() => handlePaginationChange(page)}
                                >
                                    {page}
                                </button>
                            )
                        )}

                        <button
                            className="page-btn"
                            onClick={() => handlePaginationChange(pagination.current + 1)}
                            disabled={pagination.current === totalPages}
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

            {/* Create Vote Modal */}
            <CreateVoteModal
                visible={isCreateModalVisible}
                onClose={handleCloseCreateModal}
                onSubmit={handleSubmitCreateModal}
            />

            {/* Vote Survey Modal */}
            <VoteSurveyModal
                visible={isVoteModalVisible}
                survey={selectedSurvey}
                onClose={handleCloseVoteModal}
                onSubmit={handleSubmitVote}
                allowMultiple={true}
            />
        </PageContainer>
    );
}

export default KhaoSatBieuQuyet;
