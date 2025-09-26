import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Button from "../../components/shared/Button";
import Colors from "../../constants/Colors";

export default function AddCourse() {
  const [loading, setLoading] = useState(false);
  const onGenerateTopic = () => {};

  return (
    <View
      style={{
        padding: 30,
        backgroundColor: Colors.WHITE,
        flex: 1,
        marginTop: 15,
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 30,
        }}
      >
        Create New Course
      </Text>
      <Text
        style={{
          fontFamily: "outfit",
          fontSize: 30,
        }}
      >
        What do you want to learn today?
      </Text>
      <Text
        style={{
          fontFamily: "outfit",
          fontSize: 20,
          marginTop: 8,
          color: Colors.GRAY,
        }}
      >
        Write what course you want to create, for example: React.Js, Digital
        Marketing Guide, Python etc...
      </Text>
      <TextInput
        placeholder="(Ex.Learn Python, Javascript)"
        style={styles.textInput}
        numberOfLines={3}
        multiline={true}
      />

      <Button
        text={"Generate Topic"}
        type="outline"
        onPress={() => onGenerateTopic()}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    height: 100,
    marginTop: 10,
    alignItems: "flex-start",
    fontSize: 18,
  },
});
