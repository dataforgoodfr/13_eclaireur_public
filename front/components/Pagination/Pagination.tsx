import { Button } from '#components/ui/button';
import {
  PaginationContent,
  Pagination as ShadCNPagination,
  PaginationItem as ShadCNPaginationItem,
} from '#components/ui/pagination';
import { cn } from '#utils/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FIRST_PAGE = 1;

export type PaginationProps = {
  totalPage: number;
  activePage: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
};

/**
 * Pagination component with simple page numbers and arrow navigation
 */
export function Pagination({
  totalPage,
  activePage,
  onPageChange,
  maxVisiblePages = 5,
}: PaginationProps) {
  function handlePreviousPage() {
    if (activePage === FIRST_PAGE) return;
    onPageChange(activePage - 1);
  }

  function handleNextPage() {
    if (activePage === totalPage) return;
    onPageChange(activePage + 1);
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
    const end = Math.min(totalPage, start + availableSpaceForPages - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < availableSpaceForPages) {
      start = Math.max(FIRST_PAGE, end - availableSpaceForPages + 1);
    }

    return [...new Array(end - start + 1)].map((_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <ShadCNPagination className={totalPage === 1 ? 'invisible' : ''}>
      <PaginationContent className='flex items-center gap-2'>
        {/* Left Arrow */}
        {showLeftArrow && (
          <Button
            variant='default'
            size='icon'
            className='min-h-[36px] min-w-[36px] rounded-tl-br'
            onClick={handlePreviousPage}
            aria-label='Page précédente'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
        )}

        {/* Page Numbers */}
        <div className='flex items-center gap-2'>
          {visiblePages.map((page) => (
            <PaginationItem
              key={page}
              page={page}
              activePage={activePage}
              onPageChange={onPageChange}
            />
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <Button
            variant='default'
            size='icon'
            className='min-h-[36px] min-w-[36px] rounded-tl-br'
            onClick={handleNextPage}
            aria-label='Page suivante'
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
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
    <ShadCNPaginationItem className='cursor-pointer' onClick={() => onPageChange(page)}>
      <div
        className={cn(
          'flex min-h-[36px] min-w-[36px] items-center justify-center rounded-tl-br px-4 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary-light text-primary'
            : 'border border-gray-200 bg-white text-primary hover:bg-gray-50',
        )}
      >
        {page}
      </div>
    </ShadCNPaginationItem>
  );
}
