import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./src/components/Login";
import SignUp from "./src/components/SignUp";
import FirstData from "./src/components/FirstData";
import HomeScreen from "./src/components/screens/HomeScreen";
import WalkScreen from "./src/components/screens/WalkScreen";
import EndScreen from "./src/components/screens/EndScreen";
import ChoiceScreen from "./src/components/screens/ChoiceScreen";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FirstData"
          component={FirstData}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WalkScreen"
          component={WalkScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EndScreen"
          component={EndScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChoiceScreen"
          component={ChoiceScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
