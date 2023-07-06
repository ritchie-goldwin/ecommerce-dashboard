"use client";

import ProductChart from "@components/chart/product-chart";
import QueryFilter from "@components/common/query-filter";
import Title from "@components/content/title";
import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { List, useDataGrid } from "@refinedev/mui";
import React from "react";
import { getFilteredData } from "src/common/helper/filter";
import { getPaginatedData } from "src/common/helper/pagination";
import useFilter from "src/hooks/use-filter";
import { Filter, FilterBehaviour, FilterType } from "src/types/filter.model";
import { IProduct } from "src/types/product.model";

const productFilters: Filter[] = [
  {
    name: "brand",
    label: "Brand",
    type: FilterType.Text,
    behaviour: FilterBehaviour.Partial,
  },
  {
    name: "price",
    label: "Price",
    type: FilterType.Number,
    behaviour: FilterBehaviour.Range,
  },
  {
    name: "stock",
    label: "Stock",
    type: FilterType.Number,
    behaviour: FilterBehaviour.Range,
  },
  {
    name: "category",
    label: "Category",
    type: FilterType.Text,
    behaviour: FilterBehaviour.Partial,
  },
];

export default function ProductList() {
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 25,
    page: 0,
  });
  const [search, setSearch] = React.useState("");

  const { filters, setFilters } = useFilter(productFilters);

  // NOTE: Because of the API limitation, I fetch all products (by using limit = 0), then filter on client side. There is an alternative by using Next.js route handler (by creating custom API endpoint, then do the filtering logic there), but I think there is not so much difference between these two options. The purpose of this is to do filtering based on Brand, Price Range, Category.
  const { dataGridProps, tableQueryResult } = useDataGrid({
    resource: "products" + (!!search ? `/search` : ""),
    pagination: {},
    filters: {
      permanent: [
        {
          field: "limit",
          operator: "eq",
          value: 0,
        },
        {
          field: "q",
          operator: "contains",
          value: search,
        },
      ],
    },
  });

  const rows: IProduct[] = (dataGridProps?.rows as any)?.products ?? [];

  const filteredData = getFilteredData(rows, filters ?? []);
  const { data, totalData } = getPaginatedData(
    filteredData,
    paginationModel.page,
    paginationModel.pageSize
  );

  const columns = React.useMemo<GridColDef<any>[]>(
    () => [
      {
        field: "id",
        headerName: "Id",
        type: "number",
        minWidth: 50,
        sortable: false,
      },
      {
        field: "title",
        headerName: "Product Name",
        minWidth: 200,
        sortable: false,
      },
      {
        field: "brand",
        headerName: "Brand",
        minWidth: 200,
        sortable: false,
      },
      {
        field: "price",
        headerName: "Price",
        type: "number",
        minWidth: 200,
        sortable: false,
      },
      {
        field: "stock",
        headerName: "Stock",
        type: "number",
        minWidth: 200,
        sortable: false,
      },
      {
        field: "category",
        headerName: "Category",
        minWidth: 200,
        sortable: false,
      },
    ],
    []
  );

  return (
    <List title={<Title text="Products" setSearch={setSearch} />}>
      {!!rows.length && <ProductChart data={rows} />}
      <QueryFilter
        filters={filters}
        setFilters={setFilters}
        setPage={() => {}}
      />
      <Box mt={2} sx={{ height: 400 }}>
        <DataGrid
          {...dataGridProps}
          disableColumnFilter
          rows={data}
          rowCount={totalData}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </Box>
    </List>
  );
}
