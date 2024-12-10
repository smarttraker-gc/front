import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

export default function QThird({
  setSelectedLocation,
  selectedLocation,
  seoulName,
}) {
  const [searchText, setSearchText] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const filteredOptions = seoulName.filter((option) =>
    option.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = (value) => {
    setSelectedLocation(value);
    setSearchText("");
    setDropdownOpen(false);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setDropdownOpen(false);
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View>
        <Text>Q3. 사는 곳</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.searchInput,
              selectedLocation ? styles.selectedLocation : null,
            ]}
            placeholder={selectedLocation || "사는 곳을 선택하세요"}
            placeholderTextColor={selectedLocation ? "black" : "#ccc"}
            value={searchText}
            onFocus={() => setDropdownOpen(true)}
            onChangeText={setSearchText}
          />
        </View>

        {isDropdownOpen && (
          <View style={styles.dropdownContainer}>
            <FlatList
              data={filteredOptions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginVertical: 10,
  },
  searchInput: {
    padding: 15,
    fontSize: 16,
  },
  selectedInput: {
    color: "black",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 5,
    maxHeight: 200,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
