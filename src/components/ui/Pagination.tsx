'use client';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({
    totalPages,
    currentPage,
    onPageChange,
}: PaginationProps) => {
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(
            1,
            currentPage - Math.floor(maxVisiblePages / 2)
        );
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            pages.push(
                <button
                    key="first"
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-1 sm:px-4 sm:py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors text-sm sm:text-base"
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(
                    <span
                        key="ellipsis-start"
                        className="px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base"
                    >
                        ...
                    </span>
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 sm:px-4 sm:py-2 ${
                        currentPage === i
                            ? 'bg-indigo-100 text-white'
                            : 'bg-indigo-400 text-white hover:bg-indigo-600'
                    } rounded-md transition-colors text-sm sm:text-base`}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <span
                        key="ellipsis-end"
                        className="px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base"
                    >
                        ...
                    </span>
                );
            }
            pages.push(
                <button
                    key="last"
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-1 sm:px-4 sm:py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors text-sm sm:text-base"
                >
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
            {/* Previous Button */}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 sm:px-4 sm:py-2 bg-indigo-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors text-sm sm:text-base"
                aria-label="Previous"
            >
                <FaChevronLeft className="w-4 h-5 sm:h-6" />
            </button>

            {/* Page Numbers */}
            {renderPageNumbers()}

            {/* Next Button */}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 sm:px-4 sm:py-2 bg-indigo-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors text-sm sm:text-base"
                aria-label="Next"
            >
                <FaChevronRight className="w-4 h-5 sm:h-6" />
            </button>
        </div>
    );
};

export default Pagination;
