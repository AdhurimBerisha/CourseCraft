import { Image, Text, View } from "react-native";
import { Bar } from "react-native-progress";
import Colors from "../../constants/Colors";
import { imageAssets } from "../../constants/Option";

export default function CourseProgressCard({ course, item }) {
  const getChaptersLength = (chapters) => {
    if (!chapters) return 0;
    if (Array.isArray(chapters)) return chapters.length;
    return Object.keys(chapters).length;
  };

  const GetCompletedChapter = (course) => {
    const completedChapter = course.completedChapter?.length || 0;
    const totalChapters = getChaptersLength(course.chapters);
    if (totalChapters === 0) return 0;
    const perc = completedChapter / totalChapters;
    return perc;
  };
  return (
    <View
      style={{
        margin: 7,
        padding: 15,
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        width: 280,
      }}
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
            {getChaptersLength(item.chapters)} Chapters
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
          {item.completedChapter?.length ?? 0} Out of{" "}
          {getChaptersLength(item.chapters)} Chapters Completed
        </Text>
      </View>
    </View>
  );
}
