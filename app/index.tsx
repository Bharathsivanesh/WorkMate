import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function App() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [loading, setLoading] = useState(true); // <-- track webview load
  const webviewRef = useRef<WebView>(null);

  useEffect(() => {
    (async () => {
      try {
        console.log("Requesting location permissions...");
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          console.log("Location permission denied");
          Alert.alert("Permission Denied", "Location permission is required.");
          return;
        }

        console.log("Permission granted!");

        const loc = await Location.getCurrentPositionAsync({});
        console.log(
          "Location fetched:",
          loc.coords.latitude,
          loc.coords.longitude
        );

        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        if (webviewRef.current) {
          const jsCode = `
            window.userLocation = {
              latitude: ${loc.coords.latitude},
              longitude: ${loc.coords.longitude}
            };
          `;
          webviewRef.current.injectJavaScript(jsCode);
          console.log("Location injected into WebView");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading && (
        <View style={styles.loaderContainer}>
          <Image
            source={require("../assets/images/error.png")}
            style={styles.loaderImage}
            resizeMode="contain"
          />
        </View>
      )}
      <View style={styles.background}>
        <View style={styles.topHalf} />
        <WebView
          ref={webviewRef}
          source={{ uri: "http://192.168.0.17:5173" }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          originWhitelist={["*"]}
          geolocationEnabled={true}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
        <View style={styles.bottomHalf} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  topHalf: {
    height: 36,
    backgroundColor: "rgba(240, 209, 86, 0.3)",
  },
  bottomHalf: {
    height: 36,
    backgroundColor: "#ffffff",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    zIndex: 1,
  },
  loaderImage: {
    width: 700,
    height: 700,
  },
});
