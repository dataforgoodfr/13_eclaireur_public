/**
 * page starts at 1
 */
export type Pagination = {
  /**
   * Starts at 1
   */
  page: number;
  limit: number;
};

export type Direction = 'ASC' | 'DESC';

export type Order<By extends string> = {
  by: By;
  direction: Direction;
};
