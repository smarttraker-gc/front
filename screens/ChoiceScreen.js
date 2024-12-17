import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChoiceScreen({ navigation, route }) {
  const [recommendations, setRecommendations] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);

  const fetchRecommendations = async () => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      const response = await fetch(
        "http://210.102.178.98:60032/api/survey/recommend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // body: JSON.stringify({
          //   latitude: route.params.latitude,
          //   longitude: route.params.longitude,
          //   distance: route.params.distance,
          // }),
        }
      );

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = await response.json();
      const parsedRecommendations = parseRecommendation(data.recommendation);
      setRecommendations(parsedRecommendations);
    } catch (error) {
      console.error("추천 경로를 가져오는 중 오류 발생:", error);
    }
  };

  const parseRecommendation = (recommendationText) => {
    const lines = recommendationText.split("\n").slice(3); // Skip first three lines
    return lines.map((line) => {
      const [id, category, name, distance] = line.trim().split(/\s{2,}/);
      return { id, category, name, distance: parseFloat(distance).toFixed(2) };
    });
  };

  const handlePathSelect = (path) => {
    setSelectedPath(path);
  };

  const confirmPathSelection = async () => {
    const token = await AsyncStorage.getItem("authToken");
    console.log("선택된 경로 ID:", selectedPath.category); // 선택된 ID 출력
    try {
      // 1단계: 선택한 경로 ID 서버로 전송
      const response = await fetch(
        "http://210.102.178.98:60032/api/survey/select-route",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            selected_trail_id: selectedPath.category, // 선택된 산책로 ID 전달
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      console.log("선택한 경로가 서버에 성공적으로 전송되었습니다.");

      // 2단계: GET 요청으로 상세 경로 정보 가져오기
      const guideResponse = await fetch(
        "http://210.102.178.98:60032/api/survey/route-guide",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!guideResponse.ok) {
        throw new Error(`경로 가이드 GET 오류: ${guideResponse.status}`);
      }

      const guideData = await guideResponse.json();
      console.log("경로 가이드 데이터:", guideData);

      // 3단계: WalkScreen으로 상세 정보 전달
      navigation.navigate("WalkScreen", { guideData });
    } catch (error) {
      console.error("경로 선택 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Text style={styles.header}>추천 경로 선택</Text>

      {recommendations.length > 0 ? (
        <FlatList
          data={recommendations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.pathItem,
                item.id === selectedPath?.id && styles.selectedPathItem,
              ]}
              onPress={() => handlePathSelect(item)}
            >
              <Text style={styles.pathName}>{item.name}</Text>
              <Text style={styles.pathDetails}>{item.distance} km</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.loadingText}>추천 경로를 불러오는 중...</Text>
      )}

      {selectedPath && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={confirmPathSelection}
        >
          <Text style={styles.buttonText}>선택 확인</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  pathItem: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedPathItem: {
    backgroundColor: "#d4e6f5",
    borderWidth: 2,
    borderColor: "#6a95f4",
  },
  pathName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  pathDetails: { fontSize: 14, color: "#666" },
  loadingText: { textAlign: "center", fontSize: 16, color: "#aaa" },
  confirmButton: {
    backgroundColor: "#a7b5f5",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
