import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";

export default function QFifth({ difficulty, setDifficulty }) {
  const [checkboxs, setCheckBoxs] = useState([false, false, false]);

  const handleCheck = (index) => {
    const newCheckBoxs = [false, false, false];
    newCheckBoxs[index] = true;
    setCheckBoxs(newCheckBoxs);
    setDifficulty(index + 1); // difficulty 값 설정 (1, 2, 3)
  };

  return (
    <View>
      <Text style={styles.questionText}>Q5. 트래킹 난이도</Text>
      <View style={styles.checkboxRow}>
        <Checkbox
          status={checkboxs[0] ? "checked" : "unchecked"}
          onPress={() => handleCheck(0)}
          color="#A3B4FA"
          uncheckedColor="#C4C4C4"
        />
        <Text style={styles.optionText}>1 (가벼운 산책)</Text>
      </View>
      <View style={styles.checkboxRow}>
        <Checkbox
          status={checkboxs[1] ? "checked" : "unchecked"}
          onPress={() => handleCheck(1)}
          color="#A3B4FA"
          uncheckedColor="#C4C4C4"
        />
        <Text style={styles.optionText}>2</Text>
      </View>
      <View style={styles.checkboxRow}>
        <Checkbox
          status={checkboxs[2] ? "checked" : "unchecked"}
          onPress={() => handleCheck(2)}
          color="#A3B4FA"
          uncheckedColor="#C4C4C4"
        />
        <Text style={styles.optionText}>3 (격한 운동)</Text>
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
