import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./HomeScreen"; // 홈 화면
import FirstData from "./FirstData"; // FirstData 화면

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="FirstData" component={FirstData} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
