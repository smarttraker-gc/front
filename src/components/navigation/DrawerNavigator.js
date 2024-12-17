import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../../../screens/HomeScreen";
import FirstData from "../FirstData";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="HomeScreen">
      {/* 홈 화면 */}
      <Drawer.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: "홈" }}
      />
      {/* 다시 설문하기 */}
      <Drawer.Screen
        name="FirstData"
        component={FirstData}
        options={{ title: "다시 설문하기" }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
