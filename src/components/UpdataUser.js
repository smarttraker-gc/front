import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Checkbox, TextInput } from "react-native-paper";

export default function UpdateUser() {
  const [selectedGender, setSelectedGender] = useState(null);

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.label}>Q4. 성별을 선택하세요</Text>

        <View style={styles.checkboxRow}>
          <Checkbox
            status={selectedGender === "남" ? "checked" : "unchecked"}
            onPress={() => handleGenderSelect("남")}
          />
          <Text style={styles.optionText}>남</Text>
        </View>

        <View style={styles.checkboxRow}>
          <Checkbox
            status={selectedGender === "여" ? "checked" : "unchecked"}
            onPress={() => handleGenderSelect("여")}
          />
          <Text style={styles.optionText}>여</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 18,
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
