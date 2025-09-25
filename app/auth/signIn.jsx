import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

import { auth, db } from "../../config/firebaseConfig";
import Colors from "../../constants/Colors";
import { UserDetailContext } from "./../../context/UserContext";
export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const onSignIn = async () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (res) => {
        // Signed in
        const user = res.user;
        console.log(user);
        await getUserDetail();
        setLoading(false);
        // ...
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage = error.message;
        ToastAndroid.show("Incorrect Email & Password", ToastAndroid.BOTTOM);
        console.log(errorMessage);
      });
  };

  const getUserDetail = async () => {
    const result = await getDoc(doc(db, "users", email));
    console.log(result.data);
    setUserDetail(result.data());
  };

  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        paddingTop: 100,
        flex: 1,
        padding: 25,
        backgroundColor: Colors.WHITE,
      }}
    >
      <Image
        source={require("./../../assets/images/logo.png")}
        style={{
          width: 180,
          height: 180,
        }}
      />
      <Text
        style={{
          fontSize: 30,
          fontFamily: "outfit-bold",
        }}
      >
        Welcome Back
      </Text>

      <TextInput
        placeholder="Email"
        onChangeText={(value) => setEmail(value)}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.textInput}
      />
      <TextInput
        onChangeText={(value) => setPassword(value)}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
        style={styles.textInput}
      />
      <TouchableOpacity
        onPress={onSignIn}
        disabled={loading}
        style={{
          padding: 15,
          backgroundColor: Colors.PRIMARY,
          width: "100%",
          marginTop: 25,
          borderRadius: 10,
        }}
      >
        {!loading ? (
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 20,
              color: Colors.WHITE,
              textAlign: "center",
            }}
          >
            Sign In
          </Text>
        ) : (
          <ActivityIndicator size={"large"} />
        )}
      </TouchableOpacity>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit",
          }}
        >
          Don&#39;t have an account?
        </Text>
        <Pressable onPress={() => router.push("auth/signUp")}>
          <Text
            style={{
              color: Colors.PRIMARY,
              fontFamily: "outfit-bold",
            }}
          >
            Sign Up Here
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    width: "100%",
    padding: 15,
    fontSize: 18,
    marginTop: 20,
    borderRadius: 8,
  },
});
