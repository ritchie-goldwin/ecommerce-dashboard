export function getPaginatedData<T>(rows: T[], pageNumber: number, pageSize: number) {
  const pages: T[][] = [];
  const totalData = rows.length;
  const totalPages = Math.ceil(totalData / pageSize);

  for (let page = 0; page < totalPages; page++) {
    pages.push(
      rows.slice(page * pageSize, Math.min((page + 1) * pageSize, totalData))
    );
  }

  return {
    data: pages[pageNumber] ?? [],
    totalPages,
    start: pageNumber * pageSize + 1,
    end: (pageNumber + 1) * pageSize,
    totalData,
  };
}
