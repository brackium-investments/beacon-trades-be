// signifies all the items paginated and provides a structure for their response.

/**
 * interface for the response on paginated queries
 */
export interface Paginated<T> {
  /**
   * the data to be returned
   */
  data: T[];

  /**
   * the metadata for the data
   */
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };

  /**
   * various links for the pages of the data
   */
  links: {
    first: string;
    last: string;
    current: string;
    next: string;
    previous: string;
  };
}
