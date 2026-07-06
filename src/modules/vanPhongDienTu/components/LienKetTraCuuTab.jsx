import React from "react";
import { Wrap, Grid, Card, CardLabel } from "./lienKetTraCuu/styled";
import useLienKetTraCuu from "./lienKetTraCuu/useLienKetTraCuu";

function LienKetTraCuuTab() {
  const { items } = useLienKetTraCuu();
  console.log(items);

  return (
    <Wrap>
      <Grid>
        {items.map((item) => (
          <Card key={item.id} href={item.uRL || "#"}>
            {item.icon}
            <CardLabel>{item.title}</CardLabel>
          </Card>
        ))}
      </Grid>
    </Wrap>
  );
}

export default LienKetTraCuuTab;
