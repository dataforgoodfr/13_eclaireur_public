import {
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationItem as ShacCNPaginationItem,
  Pagination as ShadCNPagination,
} from '#components/ui/pagination';
import { cn } from '#utils/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FIRST_PAGE = 1;
const MAX_PAGE_COUNT_ON_SIDES = 1;
const MAX_PAGE_COUNT_AROUND_ACTIVE_PAGE = 1;
const STEP_SIZE = 5;

export type PaginationProps = {
  totalPage: number;
  activePage: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
};

/**
 * Pagination component with simple page numbers and arrow navigation
 */
export function Pagination({ totalPage, activePage, onPageChange, maxVisiblePages = 5 }: PaginationProps) {
  function handlePreviousPage() {
    if (activePage === FIRST_PAGE) return;
    onPageChange(activePage - 1);
  }

  function handleNextPage() {
    if (activePage === totalPage) return;
    onPageChange(activePage + 1);
  }

  function handleStepBackward() {
    const newPage = Math.max(FIRST_PAGE, activePage - STEP_SIZE);
    onPageChange(newPage);
  }

  function handleStepForward() {
    const newPage = Math.min(totalPage, activePage + STEP_SIZE);
    onPageChange(newPage);
  }

  // Calculate visible pages based on maxVisiblePages parameter (including arrows)
  const showLeftArrow = activePage > FIRST_PAGE;
  const showRightArrow = activePage < totalPage;
  
  const getVisiblePages = () => {
    // Calculate available space for page numbers (total - arrows)
    const arrowCount = (showLeftArrow ? 1 : 0) + (showRightArrow ? 1 : 0);
    const availableSpaceForPages = maxVisiblePages - arrowCount;
    
    // If we have more space than total pages, show all
    if (totalPage <= availableSpaceForPages) {
      return [...new Array(totalPage)].map((_, i) => i + FIRST_PAGE);
    }

    // Center the active page in the available space
    const half = Math.floor(availableSpaceForPages / 2);
    let start = Math.max(FIRST_PAGE, activePage - half);
    let end = Math.min(totalPage, start + availableSpaceForPages - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < availableSpaceForPages) {
      start = Math.max(FIRST_PAGE, end - availableSpaceForPages + 1);
    }

    return [...new Array(end - start + 1)].map((_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <ShadCNPagination className={totalPage === 1 ? 'invisible' : ''}>
      <PaginationContent className="flex items-center gap-2">
        {/* Left Arrow - Desktop */}
        {showLeftArrow && (
          <div className="hidden sm:flex items-center">
            <button
              className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-tl-br bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer"
              onClick={handlePreviousPage}
              aria-label="Page précédente"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Left Arrow - Mobile (step by 5) */}
        {activePage > STEP_SIZE && (
          <div className="sm:hidden">
            <button
              className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-tl-br bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer"
              onClick={handleStepBackward}
              aria-label="Reculer de 5 pages"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Page Numbers - Desktop only */}
        <div className="hidden sm:flex items-center gap-2">
          {visiblePages.map((page) => (
            <PaginationItem
              key={page}
              page={page}
              activePage={activePage}
              onPageChange={onPageChange}
            />
          ))}
        </div>

        {/* Current page display for mobile */}
        <div className="sm:hidden">
          <span className="px-3 py-1 text-sm text-primary font-medium">
            {activePage} / {totalPage}
          </span>
        </div>

        {/* Right Arrow - Desktop */}
        {showRightArrow && (
          <div className="hidden sm:flex items-center">
            <button
              className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-tl-br bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer"
              onClick={handleNextPage}
              aria-label="Page suivante"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Right Arrow - Mobile (step by 5) */}
        {activePage < totalPage - STEP_SIZE + 1 && (
          <div className="sm:hidden">
            <button
              className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-tl-br bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer"
              onClick={handleStepForward}
              aria-label="Avancer de 5 pages"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </PaginationContent>
    </ShadCNPagination>
  );
}

type PaginationItemProps = {
  page: number;
  activePage: number;
  onPageChange: (page: number) => void;
};

function PaginationItem({ page, activePage, onPageChange }: PaginationItemProps) {
  const isActive = page === activePage;
  
  return (
    <ShacCNPaginationItem className='cursor-pointer' onClick={() => onPageChange(page)}>
      <div
        className={cn(
          "flex items-center justify-center min-w-[36px] min-h-[36px] px-4 rounded-tl-br transition-colors text-sm font-medium",
          isActive 
            ? "bg-primary-light text-primary" 
            : "bg-white text-primary hover:bg-gray-50 border border-gray-200"
        )}
      >
        {page}
      </div>
    </ShacCNPaginationItem>
  );
}
