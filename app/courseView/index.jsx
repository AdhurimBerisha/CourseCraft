import { useLocalSearchParams } from "expo-router";
import { FlatList, Text, View } from "react-native";
import Chapters from "../../components/CourseView/Chapters";
import Intro from "../../components/CourseView/Intro";
import Colors from "../../constants/Colors";
export default function CourseView() {
  const { courseParams } = useLocalSearchParams();
  
  if (!courseParams) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading course...</Text>
      </View>
    );
  }
  
  let course;
  try {
    course = JSON.parse(courseParams);
  } catch (error) {
    console.error("Error parsing courseParams:", error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error loading course data</Text>
      </View>
    );
  }

  return (
    <FlatList 
      data={[]}
      ListHeaderComponent={() => (
        <View style={{
          flex:1,
          backgroundColor:Colors.WHITE
        }}>
          <Intro course={course} />
          <Chapters course={course} />
        </View>
      )}
      renderItem={() => null}
      keyExtractor={() => 'header'}
    />
  );
}
