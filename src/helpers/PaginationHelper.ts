import { Ref } from "vue";

export default class PaginationHelper {
  static setPage(page: number, itemsPerPage:  number, allValues: any[]): { totalPages: number, valuesToDisplay: any[] } {
    let totalPages = Math.floor(allValues.length / itemsPerPage);

    if (allValues.length % itemsPerPage > 0) {
      totalPages = totalPages + 1;
    }

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + (itemsPerPage);

    return { totalPages, valuesToDisplay: allValues.slice(startIndex, endIndex) } ;
  }
}