import { View, Text, StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";

export default function QFirst({ gender, setGender }) {
  return (
    <View>
      <Text>Q1. 성별</Text>
      <View style={styles.checkboxRow}>
        <Checkbox
          status={gender === "남" ? "checked" : "unchecked"}
          onPress={() => setGender("남")}
          color="#A3B4FA"
          uncheckedColor="#C4C4C4"
        />
        <Text style={styles.text}>남</Text>
      </View>
      <View style={styles.checkboxRow}>
        <Checkbox
          status={gender === "여" ? "checked" : "unchecked"}
          onPress={() => setGender("여")}
          color="#A3B4FA"
          uncheckedColor="#C4C4C4"
        />
        <Text style={styles.text}>여</Text>
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
