import React from "react";
import { FlatList, Text, View } from "react-native";

import Colors from "../../constants/Colors";
import CourseProgressCard from "../shared/CourseProgressCard";

export default function CourseProgress({ courseList }) {
  return (
    <View
      style={{
        marginTop: 10,
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 25,
          color: Colors.WHITE,
        }}
      >
        Progress
      </Text>

      <FlatList
        data={courseList}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        renderItem={({ item, index }) => (
          <View key={index}>
            <CourseProgressCard item={item} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
