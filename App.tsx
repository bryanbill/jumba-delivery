import { StatusBar } from "expo-status-bar";
import { StyleSheet, Image, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import HomePage from "@/pages/HomePage";
import React, { useEffect } from "react";

const Stack = createNativeStackNavigator();

type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
};

const SplashScreen = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<RootStackParamList, "Splash">;
}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Home");
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://play-lh.googleusercontent.com/tl8lRRz3fmVrJ5AoyBCKIfnDZClx5qYkJDP_IMmEUTuke35MFvD6LlaEYuFlKDPoINQ",
        }}
        style={styles.logo}
      />
      <StatusBar style="auto" />
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(7 29 77)",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 200 / 4,
  },
});
