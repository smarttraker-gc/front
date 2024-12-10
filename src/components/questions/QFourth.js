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

export default function QFourth({ place, preferredPlace, setPreferredPlace }) {
  const [searchText, setSearchText] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const filteredOptions = searchText
    ? place.filter((option) =>
        option.toLowerCase().includes(searchText.toLowerCase())
      )
    : place;

  const handleSelect = (value) => {
    setPreferredPlace(value);
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
        <Text style={styles.label}>Q4. 좋아하는 장소</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={preferredPlace || "좋아하는 장소를 선택하세요"}
            placeholderTextColor={preferredPlace ? "black" : "#ccc"}
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
                      item === preferredPlace && styles.selectedOption,
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View style={styles.noResultContainer}>
                <Text style={styles.noResultText}>검색 결과가 없습니다</Text>
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
