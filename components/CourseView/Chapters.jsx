import { Foundation, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/Colors";

export default function Chapters({ course }) {
  const router = useRouter();

  const isChapterCompleted = (index) => {
    console.log("Checking chapter completion:", {
      index,
      completedChapter: course.completedChapter,
      type: typeof course.completedChapter,
      isArray: Array.isArray(course.completedChapter)
    });
    
    if (!course.completedChapter || !Array.isArray(course.completedChapter)) {
      return false;
    }
    const isCompleted = course.completedChapter.find((item) => String(item) === String(index));
    console.log("Is completed:", isCompleted);
    return isCompleted ? true : false;
  };

  return (
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
        Chapters
      </Text>
      <FlatList
        data={course.chapters}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/chapterView",
                params: {
                  chapterParams: JSON.stringify(item),
                  docId: course.docId,
                  chapterIndex: index,
                  courseParams: JSON.stringify(course),
                },
              });
            }}
            style={{
              backgroundColor: Colors.BG_GRAY,
              padding: 15,
              marginVertical: 5,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "outfit-bold",
                  fontSize: 18,
                }}
              >
                Chapter {index + 1}: {item.chapterName}
              </Text>
              <Text
                style={{
                  fontFamily: "outfit",
                  fontSize: 14,
                  color: Colors.GRAY,
                  marginTop: 5,
                }}
              >
                {item.content.length} topics
              </Text>
            </View>
            {isChapterCompleted(index) ?
           <Ionicons name="checkmark-circle" size={24} color={Colors.GREEN} />
            :<Foundation name="play" size={28} color={Colors.PRIMARY} />}
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
