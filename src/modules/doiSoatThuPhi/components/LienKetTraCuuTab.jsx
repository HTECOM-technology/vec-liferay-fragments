import React from "react";
import { Wrap, Grid, Card, CardLabel } from "../../vanPhongDienTu/components/lienKetTraCuu/styled";
import { menuItems } from "./lienKetTraCuu/menuItems";

function LienKetTraCuuTab() {
  return (
    <Wrap>
      <Grid>
        {menuItems.map((item) => (
          <Card key={item.key} href="#">
            {item.icon}
            <CardLabel>{item.label}</CardLabel>
          </Card>
        ))}
      </Grid>
    </Wrap>
  );
}

export default LienKetTraCuuTab;
