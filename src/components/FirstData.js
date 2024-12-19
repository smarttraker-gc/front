import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import StepIndicator from "react-native-step-indicator";
import QThird from "./questions/QThird";
import QFourth from "./questions/QFourth";
import seoulDirectory from "./data/seoulDirectory.json";
import QFifth from "./questions/QFifth";
import QSixth from "./questions/QSixth";
import QFirst from "./questions/QFirst";
import QSecond from "./questions/QSecond";
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage 임포트

export default function FirstData({ navigation }) {
  const [place, setPlace] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [formData, setFormData] = useState({
    gender: "",
    height: "",
    weight: "",
    selectedLocation: "",
    preferredPlace: "",
    difficulty: "",
    distance: "",
  });

  const seoulName = Array.isArray(seoulDirectory)
    ? seoulDirectory.map((item) => item.name)
    : [];

  useEffect(() => {
    const selected = seoulDirectory.find(
      (item) => item.name === formData.selectedLocation
    );
    if (selected) {
      setPlace(selected.contents);
    } else {
      setPlace([]);
    }
  }, [formData.selectedLocation]);

  const array = [
    <QFirst
      gender={formData.gender}
      setGender={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
    />,
    <QSecond
      height={formData.height}
      weight={formData.weight}
      setHeight={(value) => setFormData((prev) => ({ ...prev, height: value }))}
      setWeight={(value) => setFormData((prev) => ({ ...prev, weight: value }))}
    />,
    <QThird
      selectedLocation={formData.selectedLocation}
      setSelectedLocation={(value) =>
        setFormData((prev) => ({ ...prev, selectedLocation: value }))
      }
      seoulName={seoulName}
    />,
    <QFourth
      place={place}
      preferredPlace={formData.preferredPlace}
      setPreferredPlace={(value) =>
        setFormData((prev) => ({ ...prev, preferredPlace: value }))
      }
    />,
    <QFifth
      difficulty={formData.difficulty}
      setDifficulty={(value) =>
        setFormData((prev) => ({ ...prev, difficulty: value }))
      }
    />,
    <QSixth
      distance={formData.distance}
      setDistance={(value) =>
        setFormData((prev) => ({
          ...prev,
          distance: parseInt(value, 10) || "", // 입력값을 정수로 변환, 실패하면 빈 문자열
        }))
      }
    />,
  ];

  const handleNext = () => {
    if (currentPosition < array.length - 1) {
      setCurrentPosition((prevPosition) => prevPosition + 1);
    }
  };

  const handleBack = () => {
    if (currentPosition > 0) {
      setCurrentPosition((prevPosition) => prevPosition - 1);
    }
  };

  const handleFinish = async () => {
    const token = await AsyncStorage.getItem("authToken");

    if (!token) {
      Alert.alert(
        "Error",
        "로그인 시간이 초과되었습니다. 다시 로그인해주세요."
      );
      return;
    }

    // distance 값이 양수인지 확인
    if (isNaN(formData.distance) || formData.distance <= 0) {
      Alert.alert("Error", "거리가 입력되지 않았습니다.");
      return;
    }

    const surveyData = {
      survey: {
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        location: formData.selectedLocation,
        preferred_spot: formData.preferredPlace,
        difficulty: formData.difficulty,
        distance: formData.distance.toString(), // 문자열 변환
      },
    };

    try {
      const response = await fetch(
        "http://210.102.178.98:60032/api/survey/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(surveyData),
        }
      );

      const data = await response.json();
      console.log("Response data:", data); // 응답 데이터 확인

      if (data.message === "Survey submitted successfully.") {
        Alert.alert("성공", "설문이 완료되었습니다!");
        navigation.navigate("HomeScreen");
      } else {
        Alert.alert("Error", "설문이 완료되지 않았습니다.");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    }
  };

  const submitSurvey = async (token, surveyData) => {
    try {
      const response = await fetch(
        "http://210.102.178.98:60032/api/survey/submit",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(surveyData),
        }
      );

      if (response.status === 401) {
        Alert.alert(
          "Unauthorized",
          "Token is invalid or expired. Please log in again."
        );
        // 토큰 갱신 또는 로그인을 유도하는 로직 추가
      } else if (response.ok) {
        const data = await response.json();
        Alert.alert("Success", "Survey submitted successfully!");
      } else {
        Alert.alert("Error", "There was an issue submitting the survey.");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    }
  };

  const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeWidth: 3,
    stepStrokeCurrentColor: "#c9c9c9",
    stepStrokeFinishedColor: "#A3B4FA",
    stepStrokeUnFinishedColor: "#c9c9c9",
    separatorFinishedColor: "#A3B4FA",
    separatorUnFinishedColor: "#aaaaaa",
    stepIndicatorFinishedColor: "#A3B4FA",
    stepIndicatorUnFinishedColor: "#ffffff",
    stepIndicatorCurrentColor: "#A3B4FA",
    stepIndicatorLabelFontSize: 15,
    currentStepIndicatorLabelFontSize: 15,
    stepIndicatorLabelCurrentColor: "#ffffff",
    stepIndicatorLabelFinishedColor: "#ffffff",
    stepIndicatorLabelUnFinishedColor: "#aaaaaa",
    labelColor: "#999999",
    labelSize: 13,
    currentStepLabelColor: "#A3B4FA",
  };

  return (
    <View style={styles.appContainer}>
      <StepIndicator
        key={currentPosition}
        customStyles={customStyles}
        currentPosition={currentPosition}
        stepCount={array.length}
      />

      <View style={styles.arrayContainer}>{array[currentPosition]}</View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: currentPosition === 0 ? "#ccc" : "#A3B4FA" },
          ]}
          onPress={handleBack}
          disabled={currentPosition === 0}
        >
          <Text style={styles.buttonText}>이전</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                currentPosition === array.length - 1 ? "#A3B4FA" : "#A3B4FA",
            },
          ]}
          onPress={
            currentPosition === array.length - 1 ? handleFinish : handleNext
          }
        >
          <Text style={styles.buttonText}>
            {currentPosition === array.length - 1 ? "종료" : "다음"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 25,
  },
  arrayContainer: {
    flex: 6,
    marginTop: 20,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "48%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
