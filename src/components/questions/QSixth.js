import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";

export default function QSixth({ distance, setDistance }) {
  const [checkboxs, setCheckBoxs] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const array = [1, 5, 10, 15, 20];

  const handleCheck = (index) => {
    const newCheckBoxs = [false, false, false, false, false]; // 모든 체크박스를 해제
    newCheckBoxs[index] = true; // 선택된 체크박스만 활성화
    setCheckBoxs(newCheckBoxs);
    setDistance(array[index]); // 거리 값을 설정 (1, 5, 10, 15, 20)
  };

  return (
    <View>
      <Text style={styles.questionText}>Q6. 산책로까지 거리(km)</Text>
      <View style={styles.checkboxRow}>
        <Checkbox
          status={checkboxs[0] ? "checked" : "unchecked"}
          onPress={() => handleCheck(0)}
          color="#A3B4FA"
          uncheckedColor="#C4C4C4"
        />
        <Text style={styles.optionText}>1</Text>
      </View>
      <View style={styles.checkboxRow}>
        <Checkbox
          status={checkboxs[1] ? "checked" : "unchecked"}
          onPress={() => handleCheck(1)}
          color="#A3B4FA"
          uncheckedColor="#C4C4C4"
        />
        <Text style={styles.optionText}>5</Text>
      </View>
      <View style={styles.checkboxRow}>
        <Checkbox
          status={checkboxs[2] ? "checked" : "unchecked"}
          onPress={() => handleCheck(2)}
          color="#A3B4FA"
          uncheckedColor="#C4C4C4"
        />
        <Text style={styles.optionText}>10</Text>
      </View>
      <View style={styles.checkboxRow}>
        <Checkbox
          status={checkboxs[3] ? "checked" : "unchecked"}
          onPress={() => handleCheck(3)}
          color="#A3B4FA"
          uncheckedColor="#C4C4C4"
        />
        <Text style={styles.optionText}>15</Text>
      </View>
      <View style={styles.checkboxRow}>
        <Checkbox
          status={checkboxs[4] ? "checked" : "unchecked"}
          onPress={() => handleCheck(4)}
          color="#A3B4FA"
          uncheckedColor="#C4C4C4"
        />
        <Text style={styles.optionText}>20</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },
});
