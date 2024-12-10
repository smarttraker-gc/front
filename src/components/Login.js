import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";

export default function Login({ navigation }) {
  const [pwVisible, setPWVisible] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.appContainer}>
      <Text style={styles.text}>아이디</Text>
      <TextInput
        style={styles.textInput}
        placeholder="아이디를 입력하세요"
        onChangeText={setId}
      />
      <Text style={styles.text}>비밀번호</Text>
      <TextInput
        style={styles.textInput}
        placeholder="비밀번호를 입력하세요"
        secureTextEntry={!pwVisible}
        onChangeText={setPassword}
        right={
          <TextInput.Icon
            icon={pwVisible ? "eye" : "eye-off"}
            onPress={() => setPWVisible(!pwVisible)}
          />
        }
      />
      <TouchableOpacity style={styles.customLoginButton}>
        <Text
          style={styles.buttonLoginText}
          onPress={() => navigation.navigate("SignUp")}
        >
          회원가입
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.customButton,
          id && password ? styles.buttonDisabled : styles.buttonEnabled,
        ]}
        disabled={!(id.trim === "" && password.trim === "")}
      >
        <Text
          style={styles.buttonText}
          onPress={() => navigation.navigate("FirstData")}
        >
          로그인
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: 250,
    paddingHorizontal: 25,
    padding: 50,
    alignItems: "center",
  },
  textInput: {
    backgroundColor: "#D9D9D9",
    width: "100%",
    height: 40,
    marginBottom: 10,
    paddingLeft: 8,
    textAlign: "left",
    underlineColor: "transparent",
  },
  customButton: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    width: "50%",
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  customLoginButton: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "flex-end",
    width: "100%",
  },
  buttonLoginText: {
    fontSize: 11,
    paddingTop: 5,
    paddingBottom: 5,
  },
  text: {
    marginTop: 20,
    textAlign: "left",
    width: "100%",
  },
  buttonEnabled: {
    backgroundColor: "#D9D9D9",
  },
  buttonDisabled: {
    backgroundColor: "#A3B4FA",
  },
});
