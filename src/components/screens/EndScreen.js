import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

const EndScreen = ({ route, navigation }) => {
  const { elapsedTime, distance, calories } = route.params;

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes === 0) {
      return { value: seconds, unit: "s" };
    }
    return { value: minutes, unit: "m" };
  };

  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnimation = useState(new Animated.Value(-width * 0.33))[0];

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

  const formatDistance = (dist) => {
    return {
      value: dist >= 10 ? Math.floor(dist) : dist.toFixed(1),
      unit: "km",
    };
  };

  const timeFormat = formatTime(elapsedTime);
  const distanceFormat = formatDistance(distance);

  const handleRecord = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    Alert.alert("기록이 저장되었습니다!");

    navigation.navigate("HomeScreen");
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
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>산책 시간</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.infoValueNumber}>{timeFormat.value}</Text>
              <Text style={styles.infoValueUnit}>{timeFormat.unit}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>거리</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.infoValueNumber}>{distanceFormat.value}</Text>
              <Text style={styles.infoValueUnit}>{distanceFormat.unit}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>칼로리</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.infoValueNumber}>{Math.round(calories)}</Text>
              <Text style={styles.infoValueUnit}>kcal</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.recordButton} onPress={handleRecord}>
          <Text style={styles.recordButtonText}>기 록</Text>
        </TouchableOpacity>
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
  infoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 40,
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
  infoValueUnit: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  divider: {
    width: 1,
    height: 70,
    backgroundColor: "#ccc",
    marginHorizontal: 10,
  },
  recordButton: {
    backgroundColor: "#a7b5f5",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  recordButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  logoutButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
});

export default EndScreen;
