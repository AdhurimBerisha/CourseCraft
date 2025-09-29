import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import Button from "../../components/shared/Button";
import Colors from "../../constants/Colors";
import { imageAssets } from "../../constants/Option";

export default function Intro({ course }) {
  const router = useRouter();

  const getChaptersLength = (chapters) => {
    if (!chapters) return 0;
    if (Array.isArray(chapters)) return chapters.length;
    return Object.keys(chapters).length;
  };

  return (
    <View>
      <Image
        source={imageAssets[course.banner_image]}
        style={{
          width: "100%",
          height: 280,
        }}
      />
      <View
        style={{
          padding: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 25,
          }}
        >
          {course.courseTitle}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginTop: 5,
          }}
        >
          <Ionicons name="book-outline" size={20} color="black" />

          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 18,
            }}
          >
            {getChaptersLength(course.chapters)} Chapters{" "}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 20,
            marginTop: 10,
          }}
        >
          Description:
        </Text>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 18,
            color: Colors.GRAY,
          }}
        >
          {course.description}
        </Text>
        <Button text={"Start Now"} onPress={() => console.log("")} />
      </View>
      <Pressable
        style={{
          position: "absolute",
          padding: 10,
          marginTop: 30,
        }}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={34} color="black" />
      </Pressable>
    </View>
  );
}
