import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/Colors";

export default function CourseList({ courseList, option }) {
  const router = useRouter();

  const onPress = (course) => {
    if (option.name == "Quiz") {
      router.push({
        pathname: "/quiz",
        params: {
          courseParams: JSON.stringify(course),
        },
      });
    }
  };

  return (
    <View>
      <FlatList
        data={courseList}
        numColumns={2}
        style={{
          padding: 20,
        }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => onPress(item)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: 10,
              padding: 15,
              backgroundColor: Colors.WHITE,
              borderRadius: 15,
              elevation: 1,
            }}
            key={index}
          >
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={item.hasQuizResult ? Colors.GREEN : Colors.GRAY}
              style={{
                position: "absolute",
                top: 10,
                right: 20,
              }}
            />
            <Image
              source={option.icon}
              style={{
                width: "100%",
                height: 100,
                objectFit: "contain",
              }}
            />
            <Text
              style={{
                fontFamily: "outfit",
                textAlign: "center",
                fontSize: 18,
                marginTop: 7,
              }}
            >
              {item.courseTitle}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
