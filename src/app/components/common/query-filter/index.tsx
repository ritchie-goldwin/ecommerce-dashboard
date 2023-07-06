import { format } from "date-fns";
import * as React from "react";
import styles from "@styles/filter.module.css";

import FilterControl from "./filter-control";
import { queryFilterContext } from "./query-filter.context";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Add, Clear } from "@mui/icons-material";
import { Filter, FilterType } from "src/types/filter.model";
import { produce } from "immer";

const { Provider } = queryFilterContext;

export interface QueryFilterProps {
  filters?: Filter[] | null;
  setFilters: React.Dispatch<React.SetStateAction<Filter[] | undefined>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function QueryFilter(props: QueryFilterProps) {
  const { filters, setFilters, setPage } = props;

  return (
    <Stack>
      {!!filters && (
        <>
          <Provider value={{ ...props, filters }}>
            <Stack
              gap={1}
              direction="row"
              useFlexGap
              flexWrap="wrap"
              alignItems="center"
            >
              {filters.map((filter) =>
                filter.value ? (
                  <FilterControl
                    key={filter.name}
                    name={filter.name}
                    setPage={setPage}
                  >
                    {(ref, toggleFilter) => (
                      <div className={styles.filterItemContainer}>
                        <Button
                          variant="outlined"
                          type="button"
                          ref={ref}
                          onClick={toggleFilter}
                          className={styles.filterItemContent}
                          sx={{ textTransform: "none" }}
                          endIcon={
                            <IconButton
                              color="inherit"
                              onClick={() => {
                                setFilters((prevFilters) =>
                                  produce(prevFilters, (draft) => {
                                    const matchedFilter = draft?.find(
                                      (f) => f.name === filter.name
                                    );
                                    if (matchedFilter) {
                                      matchedFilter.value = undefined;
                                    }
                                  })
                                );
                              }}
                              sx={{ padding: 0 }}
                            >
                              <Clear color="error" />
                            </IconButton>
                          }
                        >
                          <Typography
                            variant="body1"
                            component="span"
                            sx={{ display: "inline-block" }}
                          >{`${filter.label}: `}</Typography>
                          <Typography
                            variant="body1"
                            component="span"
                            className={styles.value}
                            sx={{ display: "inline-block" }}
                          >
                            {filter.type === FilterType.Date
                              ? format(new Date(filter.value!), "dd MMMM yyyy")
                              : filter.type === FilterType.Option
                              ? filter.options?.find(
                                  (curr) => curr.value === filter.value
                                )?.label || ""
                              : filter.value}
                          </Typography>
                        </Button>
                      </div>
                    )}
                  </FilterControl>
                ) : null
              )}
              <FilterControl setPage={setPage}>
                {(ref, toggleFilter) => (
                  <div ref={ref}>
                    <Button
                      variant="contained"
                      endIcon={<Add />}
                      onClick={toggleFilter}
                    >
                      Add Filter
                    </Button>
                  </div>
                )}
              </FilterControl>
            </Stack>
          </Provider>
        </>
      )}
    </Stack>
  );
}
