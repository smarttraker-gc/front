import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";

export default function QSixth() {
  const [checkboxs, setCheckBoxs] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const handleCheck = (index) => {
    const newCheckBoxs = [false, false, false, false];
    newCheckBoxs[index] = true;
    setCheckBoxs(newCheckBoxs);
  };

  return (
    <View>
      <Text>Q6. 산책로까지 거리(km)</Text>
      <View style={styles.checkboxRow}>
        <Checkbox
          status={checkboxs[0] ? "checked" : "unchecked"}
          onPress={() => {
            handleCheck(0);
          }}
          color="#A3B4FA"
          uncheckedColor="#C4C4C4"
        />
        <Text style={styles.text}>1</Text>
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
        <Text style={styles.text}>5</Text>
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
        <Text style={styles.text}>10</Text>
      </View>
      <View style={styles.checkboxRow}>
        <Checkbox
          status={checkboxs[3] ? "checked" : "unchecked"}
          onPress={() => {
            handleCheck(3);
          }}
          color="#A3B4FA"
          uncheckedColor="#C4C4C4"
        />
        <Text style={styles.text}>15</Text>
      </View>
      <View style={styles.checkboxRow}>
        <Checkbox
          status={checkboxs[4] ? "checked" : "unchecked"}
          onPress={() => {
            handleCheck(4);
          }}
          color="#A3B4FA"
          uncheckedColor="#C4C4C4"
        />
        <Text style={styles.text}>20</Text>
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
