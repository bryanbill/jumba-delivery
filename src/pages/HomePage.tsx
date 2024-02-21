import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

interface Driver {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export default function HomePage() {
  const region = {
    latitude: -1.2921,
    longitude: 36.8219,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const socket = io("http://localhost:3000", {
    autoConnect: false,
  });

  const [drivers, setDrivers] = useState([] as Driver[]);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("location_update", (data) => {
      setDrivers(data);
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <MapView style={styles.map} initialRegion={region} mapType={"hybrid"}>
        {drivers.map((driver) => (
          <Marker
            coordinate={{
              latitude: driver.location.latitude,
              longitude: driver.location.longitude,
            }}
            title={driver.name}
          ></Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
