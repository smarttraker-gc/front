import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import StepIndicator from "react-native-step-indicator";
import QThird from "./questions/QThird";
import QFourth from "./questions/QFourth";
import seoulDirectory from "./data/seoulDirectory.json";
import QFifth from "./questions/QFifth";
import QSixth from "./questions/QSixth";
import QFirst from "./questions/QFirst";
import QSecond from "./questions/QSecond";

export default function FirstData({ navigation }) {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [place, setPlace] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const seoulName = Array.isArray(seoulDirectory)
    ? seoulDirectory.map((item) => item.name)
    : [];

  useEffect(() => {
    const selected = seoulDirectory.find(
      (item) => item.name === selectedLocation
    );
    if (selected) {
      setPlace(selected.contents);
    } else {
      setPlace([]);
    }
  }, [selectedLocation]);

  const array = [
    <QFirst />,
    <QSecond />,
    <QThird
      setSelectedLocation={setSelectedLocation}
      selectedLocation={selectedLocation}
      seoulName={seoulName}
    />,
    <QFourth place={place} />,
    <QFifth />,
    <QSixth />,
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

  const customStyles = {
    stepIndicatorSize: 30, // 기본 동그라미 크기
    currentStepIndicatorSize: 40, // 현재 동그라미 크기
    separatorStrokeWidth: 2, // 연결선 두께
    currentStepStrokeWidth: 3, // 현재 동그라미 테두리 두께
    stepStrokeWidth: 3,
    stepStrokeCurrentColor: "#c9c9c9",
    stepStrokeFinishedColor: "#A3B4FA", // 완료된 동그라미 테두리 색상
    stepStrokeUnFinishedColor: "#c9c9c9", // 미완료 동그라미 테두리 색상
    separatorFinishedColor: "#A3B4FA", // 완료된 연결선 색상
    separatorUnFinishedColor: "#aaaaaa", // 미완료 연결선 색상
    stepIndicatorFinishedColor: "#A3B4FA", // 완료된 동그라미 배경색
    stepIndicatorUnFinishedColor: "#ffffff", // 미완료 동그라미 배경색
    stepIndicatorCurrentColor: "#A3B4FA", // 현재 동그라미 배경색
    stepIndicatorLabelFontSize: 15, // 동그라미 내부 글자 크기
    currentStepIndicatorLabelFontSize: 15, // 현재 동그라미 내부 글자 크기
    stepIndicatorLabelCurrentColor: "#ffffff", // 현재 동그라미 내부 글자 색상
    stepIndicatorLabelFinishedColor: "#ffffff", // 완료된 동그라미 내부 글자 색상
    stepIndicatorLabelUnFinishedColor: "#aaaaaa", // 미완료 동그라미 내부 글자 색상
    labelColor: "#999999", // 동그라미 아래 텍스트 색상
    labelSize: 13,
    currentStepLabelColor: "#A3B4FA", // 현재 단계 아래 텍스트 색상
  };

  return (
    <View style={styles.appContainer}>
      <StepIndicator
        key={currentPosition} // 렌더링 강제 업데이트
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

        {currentPosition === array.length - 1 ? (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#A3B4FA" }]}
          >
            <Text
              style={styles.buttonText}
              onPress={() => navigation.navigate("HomeSreen")}
            >
              종료
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  currentPosition === array.length - 1 ? "#ccc" : "#A3B4FA",
              },
            ]}
            onPress={handleNext}
            disabled={currentPosition === array.length - 1}
          >
            <Text style={styles.buttonText}>다음</Text>
          </TouchableOpacity>
        )}
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
