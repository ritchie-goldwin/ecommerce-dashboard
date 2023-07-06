import * as React from "react";
import styles from "@styles/filter.module.css";

import { queryFilterContext } from "./query-filter.context";
import { Filter, FilterBehaviour, FilterType } from "src/types/filter.model";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { produce } from "immer";

export function isEmpty(value: any): boolean {
  return value === undefined || value === null || value === "";
}

function FilterControlOptionInput(props: FilterControlOptionInputProps) {
  const { filter, value, onChange } = props;
  const [search, setSearch] = React.useState("");

  switch (filter.behaviour) {
    case FilterBehaviour.Multiple:
      // eslint-disable-next-line no-case-declarations
      const setsValue = new Set(value ? value.split(Delimiter) : []);
      return (
        <Stack>
          {filter.options!.map((option) => (
            <FormControlLabel
              control={
                <Checkbox
                  key={option.value}
                  checked={setsValue.has(option.value)}
                  onChange={(_e, checked) => {
                    if (checked) {
                      setsValue.add(option.value);
                    } else {
                      setsValue.delete(option.value);
                    }
                    onChange(Array.from(setsValue).join(Delimiter));
                  }}
                />
              }
              label={option.label}
            />
          ))}
        </Stack>
      );
    case FilterBehaviour.Single:
    default:
      return <></>;
  }
}

export default function FilterControlInput(props: {
  filter: Filter;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  onRequestClose: () => void;
}) {
  const { filter, onRequestClose, setPage } = props;
  const { setFilters } = React.useContext(queryFilterContext);
  const initialValue =
    filter.value ||
    (filter.type === FilterType.Date ? new Date().toISOString() : undefined);

  const [value, setValue] = React.useState<string | undefined>(initialValue);
  const [minPrice, setMinPrice] = React.useState<string | undefined>(
    initialValue?.split(Delimiter)?.[0]
  );
  const [maxPrice, setMaxPrice] = React.useState<string | undefined>(
    initialValue?.split(Delimiter)?.[1]
  );

  React.useEffect(() => {
    if (minPrice?.length && maxPrice?.length) {
      setValue(`${minPrice}${Delimiter}${maxPrice}`);
    } else {
      setValue(undefined);
    }
  }, [minPrice, maxPrice]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onRequestClose();
        if (value !== undefined && value !== null) {
          setFilters((prevFilters) =>
            produce(prevFilters, (draft) => {
              const matchedFilter = draft?.find((f) => f.name === filter.name);
              if (matchedFilter) {
                matchedFilter.value = value;
              }
            })
          );
          setPage(1);
        }
      }}
      className={styles.form}
    >
      <div className={styles.formContent}>
        {(() => {
          switch (filter.type) {
            case FilterType.Text:
              return (
                <TextField
                  value={value}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setValue(event.target.value);
                  }}
                  placeholder="Filter ..."
                />
              );
            case FilterType.Option:
              return (
                <FilterControlOptionInput
                  filter={filter}
                  value={value}
                  onChange={setValue}
                />
              );
            case FilterType.Number:
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <TextField
                    type="number"
                    value={minPrice}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setMinPrice(event.target.value);
                    }}
                  />
                  <Typography>to</Typography>
                  <TextField
                    type="number"
                    value={maxPrice}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setMaxPrice(event.target.value);
                    }}
                    placeholder="Max"
                  />
                </div>
              );
            default:
              return null;
          }
        })()}
      </div>
      <Button
        disabled={isEmpty(value)}
        className={styles.submitButton}
        type="submit"
      >
        Apply
      </Button>
    </form>
  );
}

interface FilterControlOptionInputProps {
  filter: Filter;
  value?: string;
  onChange: (value: string) => void;
}

export const Delimiter = "|";
