import React from "react";
import { Wrap, Grid, Card, CardLabel, SubLabel } from "./lienKetTraCuu/styled";
import { menuItems } from "./lienKetTraCuu/menuItems";

function LienKetTraCuuTab() {
  return (
    <Wrap>
      <Grid>
        {menuItems.map((item) => (
          <Card key={item.key} href="#">
            {item.icon}
            <CardLabel>{item.label}</CardLabel>
            {item.subLabel && <SubLabel>{item.subLabel}</SubLabel>}
          </Card>
        ))}
      </Grid>
    </Wrap>
  );
}

export default LienKetTraCuuTab;
