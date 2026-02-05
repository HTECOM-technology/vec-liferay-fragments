import React, { useState, useMemo, useCallback } from "react";
import { Select, Input } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { SurveyCard, mockSurveyData, FILTER_TYPES, SORT_OPTIONS } from "./components";
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
        console.log("Vote for survey:", survey.id);
        // TODO: Implement voting logic
    }, []);

    const handleCreateSurvey = useCallback(() => {
        console.log("Create new survey");
        // TODO: Implement create survey modal/page
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
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_7464_17049)">
                <path d="M8.46087 1.71849L8.93015 2.66481C8.99414 2.79654 9.16479 2.92289 9.30877 2.94709L10.1593 3.08958C10.7033 3.18098 10.8313 3.57887 10.4393 3.97137L9.77805 4.6381C9.66607 4.75101 9.60474 4.96877 9.6394 5.1247L9.82871 5.95004C9.97803 6.60332 9.63407 6.85603 9.0608 6.51461L8.26355 6.03876C8.11957 5.95273 7.88226 5.95273 7.73561 6.03876L6.93837 6.51461C6.36776 6.85603 6.02114 6.60063 6.17045 5.95004L6.35976 5.1247C6.39443 4.96877 6.3331 4.75101 6.22111 4.6381L5.55985 3.97137C5.17056 3.57887 5.29588 3.18098 5.83982 3.08958L6.69039 2.94709C6.83171 2.92289 7.00236 2.79654 7.06635 2.66481L7.53563 1.71849C7.79161 1.205 8.20756 1.205 8.46087 1.71849Z" fill="#0090CF" />
                <path d="M2.3335 12C2.3335 11.0572 2.3335 10.5858 2.62639 10.2929C2.91928 10 3.39069 10 4.3335 10H4.66683C5.29537 10 5.60964 10 5.8049 10.1953C6.00016 10.3905 6.00016 10.7048 6.00016 11.3333V14.6667H2.3335V12Z" fill="#0090CF" />
                <path d="M10 12.6667C10 12.0382 10 11.7239 10.1953 11.5286C10.3905 11.3334 10.7048 11.3334 11.3333 11.3334H11.6667C12.6095 11.3334 13.0809 11.3334 13.3738 11.6263C13.6667 11.9192 13.6667 12.3906 13.6667 13.3334V14.6667H10V12.6667Z" fill="#0090CF" />
                <path d="M6 10.6667C6 9.72394 6 9.25253 6.29289 8.95964C6.58579 8.66675 7.05719 8.66675 8 8.66675C8.94281 8.66675 9.41421 8.66675 9.70711 8.95964C10 9.25253 10 9.72394 10 10.6667V14.6667H6V10.6667Z" fill="white" fill-opacity="0.2" />
                <path d="M2.3335 12C2.3335 11.0572 2.3335 10.5858 2.62639 10.2929C2.91928 10 3.39069 10 4.3335 10H4.66683C5.29537 10 5.60964 10 5.8049 10.1953C6.00016 10.3905 6.00016 10.7048 6.00016 11.3333V14.6667H2.3335V12Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M10 12.6667C10 12.0382 10 11.7239 10.1953 11.5286C10.3905 11.3334 10.7048 11.3334 11.3333 11.3334H11.6667C12.6095 11.3334 13.0809 11.3334 13.3738 11.6263C13.6667 11.9192 13.6667 12.3906 13.6667 13.3334V14.6667H10V12.6667Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M1.3335 14.6667H14.6668" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M6 10.6667C6 9.72394 6 9.25253 6.29289 8.95964C6.58579 8.66675 7.05719 8.66675 8 8.66675C8.94281 8.66675 9.41421 8.66675 9.70711 8.95964C10 9.25253 10 9.72394 10 10.6667V14.6667H6V10.6667Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8.46087 1.71849L8.93015 2.66481C8.99414 2.79654 9.16479 2.92289 9.30877 2.94709L10.1593 3.08958C10.7033 3.18098 10.8313 3.57887 10.4393 3.97137L9.77805 4.6381C9.66607 4.75101 9.60474 4.96877 9.6394 5.1247L9.82871 5.95004C9.97803 6.60332 9.63407 6.85603 9.0608 6.51461L8.26355 6.03876C8.11957 5.95273 7.88226 5.95273 7.73561 6.03876L6.93837 6.51461C6.36776 6.85603 6.02114 6.60063 6.17045 5.95004L6.35976 5.1247C6.39443 4.96877 6.3331 4.75101 6.22111 4.6381L5.55985 3.97137C5.17056 3.57887 5.29588 3.18098 5.83982 3.08958L6.69039 2.94709C6.83171 2.92289 7.00236 2.79654 7.06635 2.66481L7.53563 1.71849C7.79161 1.205 8.20756 1.205 8.46087 1.71849Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <defs>
                <clipPath id="clip0_7464_17049">
                    <rect width="16" height="16" fill="white" />
                </clipPath>
            </defs>
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
        </PageContainer>
    );
}

export default KhaoSatBieuQuyet;
