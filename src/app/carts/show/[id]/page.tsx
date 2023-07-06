"use client";

import { Box, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useShow } from "@refinedev/core";
import { Show } from "@refinedev/mui";
import React from "react";
import { ICart } from "src/types/cart.model";

export default function CartShow() {
  const {
    queryResult: { data, isLoading },
  } = useShow<ICart>();

  const cartData = data?.data;

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 25,
    page: 0,
  });

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
        minWidth: 300,
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
        field: "quantity",
        headerName: "Quantity",
        type: "number",
        minWidth: 200,
        sortable: false,
      },
      {
        field: "discountPercentage",
        headerName: "Discount Percentage",
        type: "number",
        minWidth: 200,
        sortable: false,
      },
      {
        field: "discountedPrice",
        headerName: "Discounted Price",
        type: "number",
        minWidth: 200,
        sortable: false,
      },
      {
        field: "total",
        headerName: "Total",
        type: "number",
        minWidth: 200,
        sortable: false,
      },
    ],
    []
  );

  return (
    <Show isLoading={isLoading}>
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <Stack gap={4}>
          <Stack gap={1}>
            <Typography variant="body1" fontWeight="bold">
              Details
            </Typography>

            <Stack direction="row">
              <Stack flex={1}>
                <Typography variant="body1">{`User Id: ${cartData?.userId}`}</Typography>
                <Typography variant="body1">{`Total Discount: ${cartData?.discountedTotal}`}</Typography>
              </Stack>
              <Stack flex={1}>
                <Typography variant="body1">{`# of Items: ${cartData?.totalProducts}`}</Typography>
                <Typography variant="body1">{`Total Amount: ${cartData?.total}`}</Typography>
              </Stack>
            </Stack>
          </Stack>

          <Stack>
            <Typography variant="body1" fontWeight="bold">
              Products
            </Typography>

            <Box mt={2} sx={{ height: 400 }}>
              <DataGrid
                rows={cartData?.products ?? []}
                rowCount={cartData?.totalProducts}
                columns={columns}
                disableColumnFilter
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
              />
            </Box>
          </Stack>
        </Stack>
      )}
    </Show>
  );
}
