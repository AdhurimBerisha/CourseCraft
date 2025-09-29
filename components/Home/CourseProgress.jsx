import React from "react";
import { FlatList, Image, Text, View } from "react-native";

import { Bar } from "react-native-progress";
import Colors from "../../constants/Colors";
import { imageAssets } from "../../constants/Option";

export default function CourseProgress({ courseList }) {
  const GetCompletedChapter = (course) => {
    const completedChapter = course.completedChapter.length;
    const perc = completedChapter / course.chapters.length;
    return perc
  };

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
        }}
      >
        Progress
      </Text>

      <FlatList
        data={courseList}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        renderItem={({ item, index }) => (
          <View
            style={{
              margin: 7,
              padding: 15,
              backgroundColor: Colors.BG_GRAY,
              borderRadius: 15,
              width: 280,
            }}
            key={index}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 8,
              }}
            >
              <Image
                style={{
                  width: 100,
                  height: 80,
                  borderRadius: 8,
                }}
                source={imageAssets[item.banner_image]}
              />
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: "outfit-bold",
                    fontSize: 19,
                    flexWrap: "wrap",
                  }}
                >
                  {item.courseTitle}
                </Text>
                <Text
                  style={{
                    fontFamily: "outfit",
                    fontSize: 15,
                  }}
                >
                  {item.chapters.length} Chapters
                </Text>
              </View>
            </View>

            <View
              style={{
                marginTop: 10,
              }}
            >
              <Bar progress={GetCompletedChapter(item)} width={250} />
              <Text
                style={{
                  fontFamily: "outfit",
                  marginTop: 2,
                }}
              >
                {item.completedChapter.length ?? 0} Out of {item.chapters.length} Chapters Completed
              </Text>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
