import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  Linking,
  Dimensions,
  Animated,
} from "react-native";
import { WebView } from "react-native-webview";
import Icon from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const WalkScreen = ({ route }) => {
  const { guideData } = route.params;
  const slideAnimation = useState(new Animated.Value(-width * 0.33))[0];
  const navigation = useNavigation();
  const [elapsedTime, setElapsedTime] = useState(0); // 경과 시간 (초)
  const [distance, setDistance] = useState(0); // 이동 거리 (km)
  const [lastPosition, setLastPosition] = useState(null); // 마지막 위치 정보
  const [isPaused, setIsPaused] = useState(false);
  const webViewRef = useRef(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnimation, {
        toValue: -width * 0.33,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const HTML_CONTENT = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
            <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=ee3f182cf65977ba6cc1122393d2ea85"></script>
            <style>
                body { margin: 0; padding: 0; height: 100vh; }
                #map { width: 100%; height: 100%; }
            </style>
        </head>
        <body>
            <div id="map"></div>
            <script>
                function initializeMap() {
                    if (typeof kakao === 'undefined') {
                        console.error('Kakao Maps SDK not loaded');
                        setTimeout(initializeMap, 500);
                        return;
                    }

                    window.initMap = function(lat, lng) {
                        try {
                            const container = document.getElementById('map');
                            const options = {
                                center: new kakao.maps.LatLng(lat, lng),
                                level: 3
                            };
                            window.map = new kakao.maps.Map(container, options);
                            
                            window.polyline = new kakao.maps.Polyline({
                                path: [new kakao.maps.LatLng(lat, lng),
                            new kakao.maps.LatLng(${guideData.trail.latitude}, ${guideData.trail.longitude})],
                                strokeWeight: 5,
                                strokeColor: '#a7b5f5',
                                strokeOpacity: 0.7,
                                strokeStyle: 'solid'
                            });
                            window.polyline.setMap(window.map);

                            window.setRecommendedPath = function(pathCoordinates) {
                                const path = pathCoordinates.map(coord => 
                                    new kakao.maps.LatLng(coord.lat, coord.lng)
                                );
                                window.recommendedPath.setPath(path);
                            };
                            
                            window.ReactNativeWebView.postMessage('MAP_INITIALIZED');
                        } catch (error) {
                            console.error('Map initialization error:', error);
                            window.ReactNativeWebView.postMessage('MAP_INIT_ERROR: ' + error.message);
                        }
                    };
 window.updatePosition = function(lat, lng) {
    try {
        if (!window.map || !window.polyline) {
            console.error('Map not initialized');
            return;
        }
        
        const position = new kakao.maps.LatLng(lat, lng);
        const position1 = new kakao.maps.LatLng(${guideData.trail.latitude}, ${guideData.trail.longitude});
        
        const path = window.polyline.getPath();
        path.push(position);
        path.push(position1);
        window.polyline.setPath(path);
        
        if (!window.currentMarker) {
            window.currentMarker = new kakao.maps.Marker({
                position: position,
                map: window.map,
                title: "현재 위치", 
            });
        } else {
            window.currentMarker.setPosition(position);
        }
        
        if (!window.fixedMarker) {
            window.fixedMarker = new kakao.maps.Marker({
                position: position1,
                map: window.map,
                title: "고정 위치", 
            });

            kakao.maps.event.addListener(window.fixedMarker, 'click', function() {
                window.ReactNativeWebView.postMessage("openUrl");
            });
        } else {
            window.fixedMarker.setPosition(position1);
        }
        
        const centerLat = (lat + guideData.trail.latitude) / 2;
        const centerLng = (lng + guideData.trail.longitude) / 2;
        const centerPosition = new kakao.maps.LatLng(centerLat, centerLng);
        window.map.setCenter(centerPosition);
        
    } catch (error) {
        console.error('Position update error:', error);
    }
};
                }

                initializeMap();
            </script>
        </body>
        </html>
    `;

  const onMessage = (event) => {
    const message = event.nativeEvent.data;

    if (message === "openUrl" && guideData.kakao_map_url) {
      Linking.openURL(guideData.kakao_map_url).catch((err) =>
        console.error("Failed to open URL: ", err)
      );
    }
  };

  useEffect(() => {
    let locationSubscription = null;

    const setupLocation = async () => {
      try {
        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
          Alert.alert(
            "위치 서비스 비활성화",
            "기기의 위치 서비스를 켜주세요.",
            [{ text: "확인", onPress: () => navigation.goBack() }]
          );
          return;
        }

        const { status: foregroundStatus } =
          await Location.getForegroundPermissionsAsync();

        if (foregroundStatus !== "granted") {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "위치 권한 필요",
              "산책 거리를 측정하기 위해 위치 권한이 필요합니다.",
              [{ text: "확인", onPress: () => navigation.goBack() }]
            );
            return;
          }
        }

        const initialPosition = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });

        setLastPosition({
          latitude: initialPosition.coords.latitude,
          longitude: initialPosition.coords.longitude,
        });

        const initScript = `initMap(${initialPosition.coords.latitude}, ${initialPosition.coords.longitude});`;
        webViewRef.current?.injectJavaScript(initScript);

        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (location) => {
            const { latitude, longitude } = location.coords;

            if (!isPaused) {
              const updateScript = `updatePosition(${latitude}, ${longitude});`;
              webViewRef.current?.injectJavaScript(updateScript);

              if (lastPosition) {
                const newDistance = calculateDistance(
                  lastPosition.latitude,
                  lastPosition.longitude,
                  latitude,
                  longitude
                );
                setDistance((prev) => prev + newDistance);
              }
            }

            setLastPosition({ latitude, longitude });
          }
        );
      } catch (err) {
        console.warn("위치 설정 오류:", err);
        Alert.alert("위치 서비스 오류", `상세 오류: ${err.message}`, [
          { text: "확인", onPress: () => navigation.goBack() },
        ]);
      }
    };

    setupLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [isPaused]);

  useEffect(() => {
    let timer;
    if (!isPaused) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isPaused]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatDistance = (distance) => {
    return distance >= 10 ? Math.floor(distance) : distance.toFixed(1);
  };

  const calculateCalories = (distance, elapsedTime) => {
    const MET = 3.5;
    const weight = 70;
    return ((MET * 3.5 * weight) / 200) * (elapsedTime / 60);
  };

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);
  const handleStop = () => {
    const calories = calculateCalories(distance, elapsedTime);
    navigation.navigate("EndScreen", {
      elapsedTime,
      distance,
      calories: Math.round(calories),
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconContainer} onPress={toggleMenu}>
          <Icon name="menu" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>SmartTracker</Text>
      </View>

      {menuVisible && (
        <Animated.View
          style={[
            styles.menuContainer,
            { transform: [{ translateX: slideAnimation }] },
          ]}
        >
          <View>
            <TouchableOpacity
              style={styles.closeIconContainer}
              onPress={toggleMenu}
            >
              <Icon name="close" size={30} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("FirstData")}>
              <Text style={styles.menuItem}>다시 설문하기</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.menuItem}>로그아웃</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: HTML_CONTENT }}
          style={styles.map}
          javaScriptEnabled={true}
          onMessage={onMessage}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn("WebView error: ", nativeEvent);
          }}
        />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>산책 시간</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.infoValueNumber}>
                {elapsedTime < 60 ? elapsedTime : Math.floor(elapsedTime / 60)}
              </Text>
              <Text style={styles.infoValueUnit}>
                {elapsedTime < 60 ? "s" : "m"}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>거리</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.infoValueNumber}>
                {formatDistance(distance)}
              </Text>
              <Text style={styles.infoValueUnit}>km</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>칼로리</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.infoValueNumber}>
                {calculateCalories(distance, elapsedTime).toFixed(0)}
              </Text>
              <Text style={styles.infoValueUnit}>kcal</Text>
            </View>
          </View>
        </View>

        {isPaused ? (
          <>
            <TouchableOpacity style={styles.button} onPress={handleResume}>
              <Text style={styles.buttonText}>재시작</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleStop}>
              <Text style={styles.buttonText}>종 료</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handlePause}>
            <Text style={styles.buttonText}>중 단</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
  },
  iconContainer: {
    position: "absolute",
    left: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  mapContainer: {
    width: "100%",
    height: "50%",
    marginBottom: 0,
    backgroundColor: "red",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  infoColumn: {
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 15,
    color: "#555",
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  infoValueNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginRight: 2,
  },
  infoValueUnit: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  divider: {
    width: 1,
    height: 70,
    backgroundColor: "#d3d3d3",
  },
  button: {
    backgroundColor: "#a7b5f5",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: "center",
    marginTop: 20,
  },
  logoutButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  menuContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    height: height,
    width: width * 0.33,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderColor: "#ddd",
    zIndex: 10,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    justifyContent: "space-between",
  },
  menuItem: {
    fontSize: 15,
    color: "#000",
    marginVertical: 10,
  },
  buttonText: { fontSize: 16, color: "white", fontWeight: "bold" },
});

export default WalkScreen;
