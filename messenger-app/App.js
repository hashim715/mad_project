import { StyleSheet } from "react-native";
import StackNavigator from "./stackNavigator";
import { Provider } from "react-redux";
import store from "./store/store";
import { useDispatch } from "react-redux";
import { fetchToken } from "./store/reducers/auth-slice";
import { useEffect } from "react";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchToken());
  }, [dispatch]);

  return <StackNavigator></StackNavigator>;
};

export default function RootApp() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
