import { Box, TextField, Typography } from "@mui/material";
import React from "react";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  text: string;
  setSearch?: React.Dispatch<React.SetStateAction<string>>;
}

export default function Title(props: Props) {
  const { text, setSearch } = props;
  const [query, setQuery] = React.useState("");

  const debounced = useDebouncedCallback((value) => {
    setSearch && setSearch(value);
  }, 1500);

  return (
    <Box
      sx={{
        flexDirection: "row",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h5">{text}</Typography>
      {!!setSearch && (
        <TextField
          id="search"
          label={`Search ${text}`}
          variant="outlined"
          // value={query}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            debounced(event.target.value);
            // setQuery(event.target.value);
          }}
        />
      )}
    </Box>
  );
}
