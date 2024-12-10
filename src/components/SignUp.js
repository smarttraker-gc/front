import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";

export default function SignUp() {
  const [pwVisible, setPWVisible] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(null); // 아이디 중복 상태

  const handleDuplicateCheck = async () => {
    if (id.trim() === "") {
      Alert.alert("아이디를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(
        "http://210.102.178.98:60032/api/auth/check-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: id.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.exists === false) {
        setIsDuplicate(false);
        Alert.alert("사용 가능한 아이디입니다.");
      } else if (data.exists === true) {
        setIsDuplicate(true);
        Alert.alert("이미 사용 중인 아이디입니다.");
      } else {
        Alert.alert(
          "중복 확인 실패",
          data.message || "서버 오류가 발생했습니다."
        );
      }
    } catch (error) {
      Alert.alert("오류", "아이디 중복 확인에 실패했습니다.");
      console.error(error);
    }
  };

  const handleSignUp = async () => {
    if (isDuplicate !== false) {
      Alert.alert("아이디 중복 확인을 완료해주세요.");
      return;
    }

    if (password !== passwordCheck) {
      Alert.alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const payload = {
      name: name.trim(),
      email: id.trim(),
      password: password.trim(),
    };

    try {
      const response = await fetch(
        "http://210.102.178.98:60032/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("회원가입 성공!", "환영합니다!");
      } else {
        Alert.alert("회원가입 실패", data.error || "다시 시도해주세요.");
      }
    } catch (error) {
      Alert.alert("오류", "서버와 연결할 수 없습니다.");
      console.error(error);
    }
  };

  return (
    <View style={styles.appContainer}>
      <Text>이름</Text>
      <TextInput style={styles.textInput} onChangeText={setName} />

      <Text>아이디</Text>
      <View style={styles.rowContainer}>
        <TextInput
          style={[styles.textInput, styles.flexInput]}
          onChangeText={(text) => {
            setId(text);
            setIsDuplicate(null); // 아이디 변경 시 중복 상태 초기화
          }}
        />
        <TouchableOpacity
          style={[
            styles.customButton,
            id.trim() ? styles.buttonEnabled : styles.buttonDisabled,
          ]}
          onPress={handleDuplicateCheck}
          disabled={id.trim() === ""}
        >
          <Text style={styles.buttonText}>중복 확인</Text>
        </TouchableOpacity>
      </View>
      {isDuplicate === true && (
        <Text style={styles.duplicateText}>이미 사용 중인 아이디입니다.</Text>
      )}
      {isDuplicate === false && (
        <Text style={styles.availableText}>사용 가능한 아이디입니다.</Text>
      )}

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
          id && password && passwordCheck && name && isDuplicate === false
            ? styles.buttonEnabled
            : styles.buttonDisabled,
        ]}
        onPress={handleSignUp}
        disabled={
          id.trim() === "" ||
          password.trim() === "" ||
          passwordCheck.trim() === "" ||
          name.trim() === "" ||
          isDuplicate !== false
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
    backgroundColor: "#A3B4FA",
  },
  buttonDisabled: {
    backgroundColor: "#D9D9D9",
  },
  checkText: {
    fontSize: 11,
    color: "red",
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 10,
  },
  duplicateText: {
    fontSize: 12,
    color: "red",
    marginBottom: 10,
  },
  availableText: {
    fontSize: 12,
    color: "green",
    marginBottom: 10,
  },
});
