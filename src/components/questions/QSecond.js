import { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Checkbox } from "react-native-paper";

export default function QSecond() {
  return (
    <View>
      <Text style={styles.text}>Q2. 키와 몸무게</Text>
      <Text>키 (cm)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="키를 입력하세요"
      />
      <Text>몸무게 (kg)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="키를 입력하세요"
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
