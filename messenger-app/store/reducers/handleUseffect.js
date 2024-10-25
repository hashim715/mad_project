import { createSlice } from "@reduxjs/toolkit";

const handleUseffect = createSlice({
  name: "handleUseffect",
  initialState: {
    refreshChats: true,
    refreshProfileScreen: true,
    refreshEventsScreen: true,
    refreshSettingsScreen: true,
    refreshGroupsScreen: true,
    refreshDiscoverScreen: true,
  },
  reducers: {
    setRefreshChats(state, action) {
      const { reload } = action.payload;
      state.refreshChats = reload;
    },
    setRefreshProfileScreen(state, action) {
      const { reload } = action.payload;
      state.refreshProfileScreen = reload;
    },
    setRefreshEventsScreen(state, action) {
      const { reload } = action.payload;
      state.refreshEventsScreen = reload;
    },
    setRefreshSettingsScreen(state, action) {
      const { reload } = action.payload;
      state.refreshSettingsScreen = reload;
    },
    setRefreshGroupsScreen(state, action) {
      const { reload } = action.payload;
      state.refreshGroupsScreen = reload;
    },
    setRefreshDiscoverScreen(state, action) {
      const { reload } = action.payload;
      state.refreshDiscoverScreen = reload;
    },
  },
});

export const handleUseffectActions = handleUseffect.actions;
export default handleUseffect;
