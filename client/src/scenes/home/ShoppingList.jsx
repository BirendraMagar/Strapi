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
      "cd71ba0765966d1020d211536438c6396d92cfb18171a3f568770edd697eada53dbda23f887cf873536ce15ce415018a6410ea7374992eeec28cd384c594c10d696b00f031ddc579116504f2eb37d04a29d02f08231a14886e1679c94133ebbea32842886e48351427f6b2512e6a8508e068acefc5fe1f62fd35492f677b8f6b";
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
