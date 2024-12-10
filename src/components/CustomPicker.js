import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const CustomPicker = ({
  visible,
  onClose,
  value,
  onChange,
  onConfirm,
  options,
  maxValue,
  title,
}) => {
  // Android에서는 기본 Picker를, iOS에서는 모달 Picker를 사용
  if (Platform.OS === "android") {
    return (
      <View style={styles.androidPickerContainer}>
        <Text style={styles.androidLabel}>{title}</Text>
        <View style={styles.androidPicker}>
          <Picker
            selectedValue={options ? value : value.toString()}
            onValueChange={(itemValue) => {
              const newValue = options ? itemValue : parseInt(itemValue);
              onChange(newValue);
              // Android에서는 선택 즉시 값 적용
              onConfirm(newValue);
            }}
            mode="dropdown"
          >
            {options
              ? options.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    color="#000000"
                  />
                ))
              : [...Array(maxValue + 1).keys()].map((num) => (
                  <Picker.Item
                    key={num.toString()}
                    label={num.toString()}
                    value={num.toString()}
                    color="#000000"
                  />
                ))}
          </Picker>
        </View>
      </View>
    );
  }

  // iOS용 모달 Picker
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackground} onPress={onClose} />
        <View style={styles.modalContent}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
            <TouchableOpacity
              onPress={() => {
                // 먼저 값을 업데이트하고 나서 모달을 닫습니다
                onConfirm(value);
                onClose();
              }}
            >
              <Text style={styles.confirmText}>확인</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={options ? value : value.toString()}
              onValueChange={(itemValue) => {
                const newValue = options ? itemValue : parseInt(itemValue);
                onChange(newValue);
              }}
            >
              {options
                ? options.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                      color="#000000"
                    />
                  ))
                : [...Array(maxValue + 1).keys()].map((num) => (
                    <Picker.Item
                      key={num.toString()}
                      label={num.toString()}
                      value={num.toString()}
                      color="#000000"
                    />
                  ))}
            </Picker>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  androidPickerContainer: {
    marginBottom: 10,
  },
  androidLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: "#666",
  },
  androidPicker: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: Platform.OS === "ios" ? 40 : 0,
    zIndex: 1,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  cancelText: {
    fontSize: 16,
    color: "#666",
  },
  confirmText: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "600",
  },
  pickerContainer: {
    backgroundColor: "#fff",
  },
});

export default CustomPicker;
