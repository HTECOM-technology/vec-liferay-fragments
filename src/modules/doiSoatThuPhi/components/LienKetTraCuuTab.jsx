import React from "react";
import { Wrap, Grid, Card, CardLabel } from "../../vanPhongDienTu/components/lienKetTraCuu/styled";
import useLienKetTraCuu from "./lienKetTraCuu/useLienKetTraCuu";

function LienKetTraCuuTab() {
  const { items } = useLienKetTraCuu();

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
