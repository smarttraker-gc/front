import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";

export default function QFifth() {
  const [checkboxs, setCheckBoxs] = useState([false, false, false]);

  const handleCheck = (index) => {
    const newCheckBoxs = [false, false, false];
    newCheckBoxs[index] = true;
    setCheckBoxs(newCheckBoxs);
  };

  return (
    <View>
      <Text>Q5. 트래킹 난이도</Text>
      <View style={styles.checkboxRow}>
        <Checkbox
          status={checkboxs[0] ? "checked" : "unchecked"}
          onPress={() => {
            handleCheck(0);
          }}
          color="#A3B4FA"
          uncheckedColor="#C4C4C4"
        />
        <Text style={styles.text}>1 (가벼운 산책)</Text>
      </View>
      <View style={styles.checkboxRow}>
        <Checkbox
          status={checkboxs[1] ? "checked" : "unchecked"}
          onPress={() => {
            handleCheck(1);
          }}
          color="#A3B4FA"
          uncheckedColor="#C4C4C4"
        />
        <Text style={styles.text}>2</Text>
      </View>
      <View style={styles.checkboxRow}>
        <Checkbox
          status={checkboxs[2] ? "checked" : "unchecked"}
          onPress={() => {
            handleCheck(2);
          }}
          color="#A3B4FA"
          uncheckedColor="#C4C4C4"
        />
        <Text style={styles.text}>3 (격한 운동)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  text: {
    marginLeft: 10,
  },
});
