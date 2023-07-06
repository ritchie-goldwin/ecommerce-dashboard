"use client";

import QueryFilter from "@components/common/query-filter";
import Title from "@components/content/title";
import { Box, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigation } from "@refinedev/core";
import { List, useDataGrid } from "@refinedev/mui";
import React from "react";
import { getFilteredData } from "src/common/helper/filter";
import { getPaginatedData } from "src/common/helper/pagination";
import useFilter from "src/hooks/use-filter";
import { ICart } from "src/types/cart.model";
import { Filter, FilterBehaviour, FilterType } from "src/types/filter.model";

const cartFilters: Filter[] = [
  {
    name: "total",
    label: "Total",
    type: FilterType.Number,
    behaviour: FilterBehaviour.Range,
  },
  {
    name: "discountedTotal",
    label: "Discounted Total",
    type: FilterType.Number,
    behaviour: FilterBehaviour.Range,
  },
  {
    name: "totalProducts",
    label: "Total Products",
    type: FilterType.Number,
    behaviour: FilterBehaviour.Range,
  },
  {
    name: "totalQuantity",
    label: "Total Quantity",
    type: FilterType.Number,
    behaviour: FilterBehaviour.Range,
  },
];

export default function CartList() {
  const { push } = useNavigation();

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 25,
    page: 0,
  });

  const { filters, setFilters } = useFilter(cartFilters);

  const { dataGridProps } = useDataGrid({
    resource: "carts",
    pagination: {},
    filters: {
      permanent: [
        {
          field: "limit",
          operator: "eq",
          value: 0,
        },
      ],
    },
  });

  const rows: ICart[] = (dataGridProps?.rows as any)?.carts ?? [];

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
        field: "action",
        headerName: "",
        type: "actions",
        minWidth: 50,
        sortable: false,
        valueGetter: ({ row }) => {
          return row.id;
        },
        renderCell: function render({ value }) {
          return (
            <Button
              variant="outlined"
              onClick={() => {
                push(`carts/show/${value}`);
              }}
            >
              Detail
            </Button>
          );
        },
      },
      {
        field: "userId",
        headerName: "User Id",
        type: "number",
        minWidth: 150,
        sortable: false,
      },
      {
        field: "total",
        headerName: "Total",
        type: "number",
        minWidth: 150,
        sortable: false,
      },
      {
        field: "discountedTotal",
        headerName: "Discounted Total",
        type: "number",
        minWidth: 150,
        sortable: false,
      },
      {
        field: "totalProducts",
        headerName: "Total Products",
        type: "number",
        minWidth: 150,
        sortable: false,
      },
      {
        field: "totalQuantity",
        headerName: "Total Quantity",
        type: "number",
        minWidth: 150,
        sortable: false,
      },
    ],
    []
  );

  return (
    <List title={<Title text="Carts" />}>
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
