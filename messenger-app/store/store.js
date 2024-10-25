import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth-slice";
import getbaseUrlReducer from "./reducers/getbaseUrlReducer";
import notificationSlice from "./reducers/notification-slice";
import handleUseffect from "./reducers/handleUseffect";
import handleImageLoading from "./reducers/handleImageLoading";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    notification: notificationSlice.reducer,
    baseUrl: getbaseUrlReducer.reducer,
    handleUseffect: handleUseffect.reducer,
    handleImageLoading: handleImageLoading.reducer,
  },
});

export default store;
