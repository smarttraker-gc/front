import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import CustomPicker from "../src/components/CustomPicker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnimation = useState(new Animated.Value(-width * 0.33))[0];
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

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

  const [goal, setGoal] = useState("diet");
  const [time, setTime] = useState(30);
  const [distance, setDistance] = useState(5);

  const [showDistancePicker, setShowDistancePicker] = useState(false);
  const [tempDistance, setTempDistance] = useState(5);

  const handlePickerConfirm = (type) => {
    if (type === "distance") {
      setDistance(tempDistance);
      setShowDistancePicker(false);
    }
  };

  const sendDistanceToServer = async (distance) => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      const response = await fetch(
        "http://210.102.178.98:60032/api/survey/update-survey",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ distance: String(distance) }),
        }
      );

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = await response.json();
      console.log("서버 응답:", data);
      if (data.message === "Location updated successfully.") {
        Alert.alert("성공", "위치 정보가 성공적으로 업데이트되었습니다.");
      } else {
        Alert.alert("실패", "위치 정보 업데이트에 실패했습니다.");
      }
    } catch (error) {
      console.error("POST 요청 중 오류 발생:", error);
      Alert.alert("오류", "서버와의 연결에 문제가 발생했습니다.");
    }
  };

  const sendLocationToServer = async (latitude, longitude) => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      const response = await fetch(
        "http://210.102.178.98:60032/api/survey/update-location",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ latitude, longitude }),
        }
      );

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = await response.json();
      console.log("서버 응답:", data);
      if (data.message === "Location updated successfully.") {
        Alert.alert("성공", "위치 정보가 서버에 성공적으로 전송되었습니다.");
      } else {
        Alert.alert("실패", "위치 정보 업데이트에 실패했습니다.");
      }
    } catch (error) {
      console.error("POST 요청 중 오류 발생:", error);
      Alert.alert("오류", "서버와의 연결에 문제가 발생했습니다.");
    }
  };

  const handlePickerCancel = (type) => {
    if (type === "distance") {
      setTempDistance(distance);
      setShowDistancePicker(false);
    }
  };

  const getCurrentLocation = async () => {
    setLoading(true); // 위치 정보 요청 전 로딩 시작
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("위치 권한이 거부되었습니다.");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      console.log("===== 운동 시작 정보 =====");
      console.log(`  - 목표 거리: ${distance}km`);
      console.log(`  - 위도: ${location.coords.latitude}`);
      console.log(`  - 경도: ${location.coords.longitude}`);

      await sendDistanceToServer(distance);
      await sendLocationToServer(
        location.coords.latitude,
        location.coords.longitude
      );

      navigation.navigate("ChoiceScreen");
    } catch (error) {
      console.error("위치 정보를 가져오는 중 오류 발생:", error);
      Alert.alert("오류", "위치 정보를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false); // 위치 정보 요청 후 로딩 종료
    }
  };

  const renderPickerSection = (
    label,
    value,
    type,
    showPicker,
    tempValue,
    setTempValue,
    options = null,
    maxValue = null
  ) => {
    return (
      <>
        <CustomPicker
          visible={showPicker}
          onClose={() => handlePickerCancel(type)}
          value={tempValue}
          onChange={setTempValue}
          onConfirm={() => handlePickerConfirm(type)}
          onCancel={() => handlePickerCancel(type)}
          options={options}
          maxValue={maxValue}
          title={label}
        />
      </>
    );
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
          <TouchableOpacity
            style={styles.closeIconContainer}
            onPress={toggleMenu}
          >
            <Icon name="close" size={30} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("FirstData")}>
            <Text style={styles.menuItem}>다시 설문하기</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <View style={styles.content}>
        {renderPickerSection(
          "거리 (km)",
          distance,
          "distance",
          showDistancePicker,
          tempDistance,
          setTempDistance,
          null,
          100
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={getCurrentLocation}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>시 작</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
  },
  iconContainer: { position: "absolute", left: 10 },
  headerText: { fontSize: 24, fontWeight: "bold", color: "#000" },
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
  },
  menuItem: { fontSize: 15, paddingVertical: 10, color: "#333" },
  content: { flex: 1, paddingTop: 180, paddingHorizontal: 20 },
  label: { fontSize: 18, marginBottom: 10, color: "#000" },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  pickerButtonText: { fontSize: 16, color: "#000" },
  button: {
    backgroundColor: "#a7b5f5",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: "center",
    marginTop: 20,
  },
  buttonText: { fontSize: 16, color: "white", fontWeight: "bold" },
});

export default HomeScreen;
