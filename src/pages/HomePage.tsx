import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import React, { useEffect, useState, useCallback } from "react";
import * as Location from "expo-location";
import io from "socket.io-client";
import { Driver } from "common/interface";

const SOCKET_URL = "http://192.168.1.137:8000";

export default function HomePage() {
  const [drivers, setDrivers] = useState([] as Driver[]);
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Handles fetching and updating driver data
  const handleSocketEvents = useCallback(() => {
    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("Connected to the server");
      socket.emit("get_drivers");
    });

    socket.on("drivers", (data: Driver[]) => {
      console.log("Initial drivers:", data);
      setDrivers(data);
    });

    socket.on("driver_location_update", (data: Driver) => {
      updateDriverLocation(data);
    });

    return () => socket.disconnect();
  }, []);

  // Updates location for a specific driver
  const updateDriverLocation = useCallback((updatedDriver: Driver) => {
    setDrivers((prevDrivers) =>
      prevDrivers.map((driver) => {
        if (driver.id === updatedDriver.id) {
          return {
            ...driver,
            // Ensure updates array exists
            updates: driver.updates
              ? [
                  ...driver.updates,
                  {
                    latitude: updatedDriver.latitude,
                    longitude: updatedDriver.longitude,
                  },
                ]
              : [
                  {
                    latitude: updatedDriver.latitude,
                    longitude: updatedDriver.longitude,
                  },
                ],
          };
        }
        return driver;
      })
    );
  }, []);

  useEffect(() => {
    const init = async () => {
      const locationResult = await Location.requestForegroundPermissionsAsync();

      if (locationResult.status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
    };

    init();
    handleSocketEvents();
  }, [handleSocketEvents]); // Ensure socket logic reruns if dependencies change

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {(currentLocation?.coords && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          mapType={"hybrid"}
        >
          {drivers.map((driver) => {
            const lastUpdate = driver.updates[driver.updates.length - 1];

            return (
              <>
                <Marker
                  key={driver.id}
                  coordinate={{
                    latitude: lastUpdate.latitude,
                    longitude: lastUpdate.longitude,
                  }}
                  title={driver.name}
                ></Marker>
              </>
            );
          })}
          {drivers.map((driver) => {
            return (
              <Polyline
                key={driver.id}
                coordinates={driver.updates.map((update) => {
                  return {
                    latitude: update.latitude,
                    longitude: update.longitude,
                  };
                })}
                strokeColor={"blue"}
                strokeWidth={10}
              />
            );
          })}
        </MapView>
      )) || (
        <View>
          <Text>{errorMsg}</Text>
        </View>
      )}
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
