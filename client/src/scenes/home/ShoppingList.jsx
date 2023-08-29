import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Item from "../../components/Item";
import { Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "../../state";

const ShoppingList = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState("all");
  const items = useSelector((state) => state.cart.items);
  const breakPoint = useMediaQuery("(min-width:600px)");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  async function getItems() {
    const token =
      "862ffd6934aebdd2df6594d94c1f336e15e78c7c3d90a654f4e6d3592ab137fe16d3c801c72721775cb55f71bfb2c4b76c8d9bf06870651b03a8cebbc5b4e36909a6549235690436ceb7776b6a7ef2eec647b958109e2d59f84c903e58c9c178052e969799c473f00490c97b636532fe726120ecfcc03def2eebe04d00d98f34";
    const response = await fetch(
      "http://localhost:1337/api/items?populate=image",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const itemsJson = await response.json();
    dispatch(setItems(itemsJson.data));
  }

  useEffect(() => {
    getItems();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredItems = items
    ? value === "all"
      ? items
      : value === "newArrivals"
      ? items.filter((item) => item.attributes.category === "newArrivals")
      : value === "bestSellers"
      ? items.filter((item) => item.attributes.category === "bestSellers")
      : value === "topRated"
      ? items.filter((item) => item.attributes.category === "topRated")
      : []
    : [];

  return (
    <Box width="80%" margin="80px auto">
      <Typography variant="h3" textAlign="center">
        Our Featured <b>Products</b>
      </Typography>
      <Tabs
        textColor="primary"
        indicatorColor="primary"
        value={value}
        onChange={handleChange}
        centered
        TabIndicatorProps={{ sx: { display: breakPoint ? "block" : "none" } }}
        sx={{
          m: "25px",
          "& .MuiTabs-flexContainer": {
            flexWrap: "wrap",
          },
        }}
      >
        <Tab label="ALL" value="all" />
        <Tab label="NEW ARRIVALS" value="newArrivals" />
        <Tab label="BEST SELLERS" value="bestSellers" />
        <Tab label="TOP RATED" value="topRated" />
      </Tabs>
      <Box
        margin="0 auto"
        display="grid"
        gridTemplateColumns="repeat(auto-fill, 300px)"
        justifyContent="space-around"
        rowGap="20px"
        columnGap="1.33%"
      >
        {filteredItems.map((item) => (
          <Item item={item} key={`${item.name}-${item.id}`} />
        ))}
      </Box>
    </Box>
  );
};

export default ShoppingList;
