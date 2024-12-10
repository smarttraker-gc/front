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

  const filteredOptions = searchText
    ? seoulName.filter((option) =>
        option.toLowerCase().includes(searchText.toLowerCase())
      )
    : seoulName;

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
        <Text style={styles.label}>Q3. 사는 곳</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={selectedLocation || "사는 곳을 선택하세요"}
            placeholderTextColor={selectedLocation ? "black" : "#ccc"}
            value={searchText}
            onFocus={() => setDropdownOpen(true)}
            onChangeText={(text) => {
              setSearchText(text);
              setDropdownOpen(true);
            }}
          />
        </View>

        {isDropdownOpen && (
          <View style={styles.dropdownContainer}>
            {filteredOptions.length > 0 ? (
              <FlatList
                data={filteredOptions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      item === selectedLocation && styles.selectedOption,
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View style={styles.noResultContainer}>
                <Text style={styles.noResultText}>결과가 없습니다</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
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
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 5,
    maxHeight: 200,
    backgroundColor: "#fff",
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedOption: {
    backgroundColor: "#A3B4FA",
  },
  optionText: {
    color: "black",
  },
  noResultContainer: {
    padding: 10,
    alignItems: "center",
  },
  noResultText: {
    color: "#999",
  },
});
