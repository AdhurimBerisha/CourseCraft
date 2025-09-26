import { useRouter } from "expo-router";
import { Image, Text, View } from "react-native";
import Button from "../shared/Button";

export default function NoCourse() {
  const router = useRouter();
  return (
    <View
      style={{
        marginTop: 40,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Image
        source={require("./../../assets/images/book.png")}
        style={{
          height: 200,
          width: 200,
        }}
      />
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 25,
          textAlign: "center",
        }}
      >
        You don&#39;t have any courses
      </Text>

      <Button
        text={"+ Create New Course"}
        onPress={() => router.push("/addCourse")}
      />
      <Button text={"Explore Existing Courses"} type="outline" />
    </View>
  );
}
