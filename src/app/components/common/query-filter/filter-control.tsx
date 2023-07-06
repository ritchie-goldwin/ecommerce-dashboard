import * as React from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { usePopper } from "react-popper";
import styles from "@styles/filter.module.css";

import FilterControlInput from "./filter-control-input";
import { queryFilterContext } from "./query-filter.context";
import { Box, Typography, useTheme } from "@mui/material";
import { Filter } from "src/types/filter.model";

interface FilterControlProps {
  name?: string;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  children: (
    ref: React.Dispatch<React.SetStateAction<HTMLElement | null>>,
    toggleFilter: () => void
  ) => React.ReactElement;
}

function FilterControlContent(props: {
  setIsOpen: (open: boolean) => void;
  initialName?: string;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { palette } = useTheme();
  const { filters } = React.useContext(queryFilterContext);

  const [selectedKey, selectKey] = React.useState<string | undefined>(
    props.initialName
  );

  const selectedFilter = React.useMemo<Filter | undefined>(
    () =>
      selectedKey ? filters.find((f) => f.name === selectedKey) : undefined,
    [filters, selectedKey]
  );

  return (
    <Box
      className={styles.container}
      sx={{ bgcolor: palette.background.default }}
    >
      <Typography className={styles.title}>
        {selectedFilter?.label || "Filter By"}
      </Typography>
      <div className={styles.content}>
        {selectedFilter ? (
          <FilterControlInput
            filter={selectedFilter}
            onRequestClose={() => props.setIsOpen(false)}
            setPage={props.setPage}
          />
        ) : (
          filters
            .filter((filter) => !filter.value)
            .map((filter) => (
              <Typography
                key={filter.name}
                className={styles.optionItem}
                onClick={() => {
                  selectKey(filter.name);
                }}
              >
                {filter.label}
              </Typography>
            ))
        )}
      </div>
    </Box>
  );
}

export default function FilterControl(props: FilterControlProps) {
  const { children } = props;

  const [actionElement, setActionElement] = React.useState<HTMLElement | null>(
    null
  );

  const [popperElement, setPopperElement] =
    React.useState<HTMLDivElement | null>(null);
  const [open, setIsOpen] = React.useState(false);
  const { styles: popperStyles, attributes } = usePopper(
    actionElement,
    popperElement,
    {
      placement: "bottom-start",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 3],
          },
        },
      ],
    }
  );

  function toggleOpen() {
    setIsOpen((prevOpen) => !prevOpen);
  }

  return (
    <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
      {children(setActionElement, toggleOpen)}
      {open && (
        <div
          ref={setPopperElement}
          style={popperStyles.popper}
          {...attributes.popper}
          className={styles.popperContainer}
        >
          <FilterControlContent
            setIsOpen={setIsOpen}
            initialName={props.name}
            setPage={props.setPage}
          />
        </div>
      )}
    </OutsideClickHandler>
  );
}
