import {
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationItem as ShacCNPaginationItem,
  Pagination as ShadCNPagination,
} from '#components/ui/pagination';

const FIRST_PAGE = 1;
const MAX_PAGE_COUNT_ON_SIDES = 1;
const MAX_PAGE_COUNT_AROUND_ACTIVE_PAGE = 1;

export type PaginationProps = {
  totalPage: number;
  activePage: number;
  onPageChange: (page: number) => void;
};

/**
 * Pagination component that follows the pattern:
 * 1 2 3 ... 10
 * 1 ... 3 4 5 ... 10
 * 1 ... 8 9 10
 */
export function Pagination({ totalPage, activePage, onPageChange }: PaginationProps) {
  function handlePreviousPage() {
    if (activePage === FIRST_PAGE) return;

    onPageChange(activePage - 1);
  }

  function handleNextPage() {
    if (activePage === totalPage) return;

    onPageChange(activePage + 1);
  }

  const allPages = [...new Array(totalPage)].map((_, i) => i + FIRST_PAGE);

  const isCloseToLeftSide = activePage < MAX_PAGE_COUNT_ON_SIDES + 1;

  const firstVisiblePages = allPages.slice(0, MAX_PAGE_COUNT_ON_SIDES);

  const middleVisiblePages = allPages.slice(
    Math.max(
      isCloseToLeftSide ? activePage : activePage - MAX_PAGE_COUNT_AROUND_ACTIVE_PAGE - 1,
      MAX_PAGE_COUNT_ON_SIDES,
    ),
    Math.min(activePage + MAX_PAGE_COUNT_AROUND_ACTIVE_PAGE, totalPage - MAX_PAGE_COUNT_ON_SIDES),
  );

  const lastVisiblePages = allPages.slice(totalPage - MAX_PAGE_COUNT_ON_SIDES);

  return (
    <ShadCNPagination className={totalPage === 1 ? 'invisible' : ''}>
      <PaginationContent>
        <ShacCNPaginationItem>
          <PaginationPrevious
            className={`cursor-pointer ${activePage === 1 ? 'invisible' : ''}`}
            onClick={handlePreviousPage}
          />
        </ShacCNPaginationItem>
        {firstVisiblePages.map((page) => (
          <PaginationItem
            key={page}
            page={page}
            activePage={activePage}
            onPageChange={onPageChange}
          />
        ))}
        {activePage > MAX_PAGE_COUNT_ON_SIDES + MAX_PAGE_COUNT_AROUND_ACTIVE_PAGE + 1 && (
          <ShacCNPaginationItem>
            <PaginationEllipsis />
          </ShacCNPaginationItem>
        )}
        {middleVisiblePages.map((page) => (
          <PaginationItem
            key={page}
            page={page}
            activePage={activePage}
            onPageChange={onPageChange}
          />
        ))}
        {activePage < totalPage - (MAX_PAGE_COUNT_ON_SIDES + MAX_PAGE_COUNT_AROUND_ACTIVE_PAGE) && (
          <ShacCNPaginationItem>
            <PaginationEllipsis />
          </ShacCNPaginationItem>
        )}
        {lastVisiblePages.map((page) => (
          <PaginationItem
            key={page}
            page={page}
            activePage={activePage}
            onPageChange={onPageChange}
          />
        ))}
        <ShacCNPaginationItem>
          <PaginationNext
            className={`cursor-pointer ${activePage === totalPage ? 'invisible' : ''}`}
            onClick={handleNextPage}
          />
        </ShacCNPaginationItem>
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
  return (
    <ShacCNPaginationItem className='cursor-pointer' onClick={() => onPageChange(page)}>
      <PaginationLink isActive={page === activePage}>{page}</PaginationLink>
    </ShacCNPaginationItem>
  );
}
