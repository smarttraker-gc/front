import { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

export default function QSecond({ height, weight, setHeight, setWeight }) {
  const handleHeightChange = (text) => {
    // 숫자가 아닌 값을 입력하려 할 경우, 빈 문자열은 null로 처리
    const heightValue = text === "" ? "" : parseFloat(text);
    setHeight(heightValue);
  };

  const handleWeightChange = (text) => {
    // 숫자가 아닌 값을 입력하려 할 경우, 빈 문자열은 null로 처리
    const weightValue = text === "" ? "" : parseFloat(text);
    setWeight(weightValue);
  };

  return (
    <View>
      <Text style={styles.text}>Q2. 키와 몸무게</Text>
      <Text>키 (cm)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="키를 입력하세요"
        value={height ? height.toString() : ""}
        onChangeText={handleHeightChange}
      />
      <Text>몸무게 (kg)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="몸무게를 입력하세요"
        value={weight ? weight.toString() : ""}
        onChangeText={handleWeightChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "#c9c9c9",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
    marginTop: 10,
  },
  text: {
    marginBottom: 10,
  },
});
