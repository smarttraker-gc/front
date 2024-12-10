import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage import

export default function Login({ navigation }) {
  const [pwVisible, setPWVisible] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "http://210.102.178.98:60032/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: id.trim(),
            password: password.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // 인증 토큰을 AsyncStorage에 저장
        await AsyncStorage.setItem("authToken", data.token);

        Alert.alert("로그인 성공", "환영합니다!", [
          {
            text: "확인",
            onPress: () => navigation.navigate("FirstData"),
          },
        ]);
      } else {
        Alert.alert(
          "로그인 실패",
          data.error || "아이디와 비밀번호를 확인하세요."
        );
      }
    } catch (error) {
      Alert.alert("오류", "서버와 연결할 수 없습니다.");
      console.error(error);
    }
  };

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
          id && password ? styles.buttonEnabled : styles.buttonDisabled,
        ]}
        disabled={id.trim() === "" || password.trim() === ""}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>로그인</Text>
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
    backgroundColor: "#A3B4FA",
  },
  buttonDisabled: {
    backgroundColor: "#D9D9D9",
  },
});
