import { createSlice } from "@reduxjs/toolkit";

const getbaseUrlReducer = createSlice({
  name: "baseUrl",
  initialState: { url: "http://192.168.10.20:5000" },
});

export default getbaseUrlReducer;

// "http://10.11.216.51:5000"
//
// "http://20.83.42.56"
// "http://51.8.73.83"
