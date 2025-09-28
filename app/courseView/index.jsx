import { useLocalSearchParams } from "expo-router";
import { FlatList, View } from "react-native";
import Chapters from "../../components/CourseView/Chapters";
import Intro from "../../components/CourseView/Intro";
import Colors from "../../constants/Colors";
export default function CourseView() {
  const { courseParams } = useLocalSearchParams();
  const course = JSON.parse(courseParams);
  console.log(course);

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
