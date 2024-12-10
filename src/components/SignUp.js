import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";

export default function SignUp() {
  const [pwVisible, setPWVisible] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const handleDuplicateCheck = () => {
    if (id.trim() === "") {
      Alert.alert("아이디를 입력해주세요.");
    } else {
      Alert.alert(`중복 확인 버튼이 클릭되었습니다! 아이디: ${id}`);
      console.log(id);
    }
  };

  const handleSignUp = () => Alert.alert("회원 가입 버튼이 클릭되었습니다!");

  return (
    <View style={styles.appContainer}>
      <Text>이름</Text>
      <TextInput style={styles.textInput} onChangeText={setName} />

      <Text>아이디</Text>
      <View style={styles.rowContainer}>
        <TextInput
          style={[styles.textInput, styles.flexInput]}
          onChangeText={setId}
        />
        <TouchableOpacity
          style={[
            styles.customButton,
            id ? styles.buttonDisabled : styles.buttonEnabled,
          ]}
          onPress={handleDuplicateCheck}
          disabled={id.trim() === ""}
        >
          <Text style={styles.buttonText}>중복 확인</Text>
        </TouchableOpacity>
      </View>

      <Text>비밀번호</Text>
      <TextInput
        style={styles.textInput}
        secureTextEntry={!pwVisible}
        onChangeText={setPassword}
        right={
          <TextInput.Icon
            icon={pwVisible ? "eye" : "eye-off"}
            onPress={() => setPWVisible(!pwVisible)}
          />
        }
      />

      <Text>비밀번호 확인</Text>
      <TextInput
        style={styles.textInput}
        secureTextEntry
        onChangeText={setPasswordCheck}
      />

      {password !== passwordCheck && passwordCheck && (
        <Text style={styles.checkText}>비밀번호가 일치하지 않습니다.</Text>
      )}

      <TouchableOpacity
        style={[
          styles.customButton,
          id && password && passwordCheck && name
            ? styles.buttonDisabled
            : styles.buttonEnabled,
        ]}
        onPress={handleSignUp}
        disabled={
          id.trim() === "" ||
          password.trim() === "" ||
          passwordCheck.trim() === "" ||
          name.trim() === ""
        }
      >
        <Text style={styles.buttonText}>회원 가입</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: 200,
    paddingHorizontal: 25,
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
    backgroundColor: "transparent",
    marginBottom: 20,
  },
  flexInput: {
    flex: 1,
    marginRight: 10,
  },
  rowContainer: {
    flexDirection: "row",
  },
  customButton: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  buttonEnabled: {
    backgroundColor: "#D9D9D9",
  },
  buttonDisabled: {
    backgroundColor: "#A3B4FA",
  },
  checkText: {
    fontSize: 11,
    color: "red",
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 10,
  },
});
