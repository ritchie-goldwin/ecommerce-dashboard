import { Stack } from "@mui/material";
import React from "react";
import { generateColor } from "src/common/helper/string";
import { IProduct } from "src/types/product.model";
import { VictoryContainer, VictoryLegend, VictoryPie } from "victory";

interface Props {
  data: IProduct[];
}

export default function ProductChart({ data }: Props) {
  const occurenceData = data.reduce((res, cur) => {
    if (!res[cur.brand]) {
      res[cur.brand] = 1;
    } else {
      res[cur.brand]++;
    }
    return res;
  }, {});

  const productData = React.useMemo(() => {
    return Object.keys(occurenceData)?.map((cur) => ({
      x: cur,
      y: occurenceData[cur],
    }));
  }, []);

  const colorScale = React.useMemo(() => {
    return productData?.map(() => generateColor());
  }, [productData]);

  return (
    <Stack bgcolor={"white"} my={2}>
      <VictoryContainer width={700} height={330}>
        <g transform="translate(0, 0)">
          <VictoryPie
            name="pie"
            standalone={false}
            width={300}
            height={240}
            innerRadius={100}
            labels={({ datum }) => ""}
            colorScale={colorScale}
            data={productData}
          />
        </g>
        <g transform="translate(300, 0)">
          <VictoryLegend
            name="legend"
            standalone={false}
            width={300}
            orientation="horizontal"
            itemsPerRow={1}
            gutter={10}
            colorScale={colorScale}
            data={productData?.map((cur) => ({
              name: `${cur.x} (${cur.y})`,
            }))}
          />
        </g>
      </VictoryContainer>
    </Stack>
  );
}
