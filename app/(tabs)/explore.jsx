import { FlatList, Text, View } from "react-native";
import CourseListByCategory from "../../components/Explore/CourseListByCategory";
import Colors from "../../constants/Colors";
import { CourseCategory } from "../../constants/Option";
export default function Explore() {
  return (
    <FlatList
      data={[]}
      style={{
        flex: 1,
        backgroundColor: Colors.WHITE,
      }}
      ListHeaderComponent={
        <View
          style={{
            padding: 25,
            backgroundColor: Colors.WHITE,
            flex: 1,
          }}
        >
          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 30,
              marginTop: 25,
            }}
          >
            Explore More Courses
          </Text>

          {CourseCategory.map((item, index) => (
            <View
              key={index}
              style={{
                marginTop: 10,
              }}
            >
              <CourseListByCategory category={item} />
            </View>
          ))}
        </View>
      }
    />
  );
}
