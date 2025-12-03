import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Decide page numbers to show (current ± 2)
  const visiblePages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      visiblePages.push(i);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      visiblePages.push("...");
    }
  }

  const renderPageButton = (page, idx) => {
    if (page === "...") return <span key={idx} className="px-2">...</span>;
    return (
      <button
        key={idx}
        onClick={() => onPageChange(page)}
        className={`btn btn-sm ${currentPage === page ? "btn-primary text-white" : "btn-outline"}`}
      >
        {page}
      </button>
    );
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 mt-4">
      {/* Prev */}
      <button
        className="btn btn-sm btn-outline flex items-center gap-1"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" /> Prev
      </button>

      {/* Pages */}
      {visiblePages.map((page, idx) => renderPageButton(page, idx))}

      {/* Next */}
      <button
        className="btn btn-sm btn-outline flex items-center gap-1"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
