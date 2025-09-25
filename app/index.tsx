import { Image, StyleSheet, Text, View } from "react-native";
import Colors from "./../constants/Colors";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.WHITE,
      }}
    >
      <Image
        source={require("./../assets/images/landing.png")}
        style={{
          width: "100%",
          height: 300,
          marginTop: 80,
        }}
      />

      <View
        style={{
          padding: 25,
          backgroundColor: Colors.PRIMARY,
          height: "100%",
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            textAlign: "center",
            color: Colors.WHITE,
          }}
        >
          Welcome to StudyBuddy
        </Text>
        <Text
          style={{
            fontSize: 20,
            color: Colors.WHITE,
            marginTop: 20,
            textAlign: "center",
          }}
        >
          Transform your ideas into engaging educational content, effortlessly
          with AI!📚🤖
        </Text>
        <View style={styles.button}>
          <Text style={[styles.buttonText, { color: Colors.PRIMARY }]}>
            Get Started
          </Text>
        </View>
        <View
          style={[
            styles.button,
            {
              backgroundColor: Colors.PRIMARY,
              borderWidth: 1,
              borderColor: Colors.WHITE,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: Colors.WHITE }]}>
            Already have an Account?
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    marginTop: 20,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
  },
});
