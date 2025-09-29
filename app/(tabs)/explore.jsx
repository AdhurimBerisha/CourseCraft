import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CourseListByCategory from "../../components/Explore/CourseListByCategory";
import Colors from "../../constants/Colors";
import { CourseCategory } from "../../constants/Option";
export default function Explore() {
  const router = useRouter();

  const GenerateCourseCard = () => (
    <View style={styles.generateCard}>
      <View style={styles.generateContent}>
        <View style={styles.generateIcon}>
          <Ionicons name="add-circle" size={40} color={Colors.PRIMARY} />
        </View>
        <View style={styles.generateText}>
          <Text style={styles.generateTitle}>Create Your Own Course</Text>
          <Text style={styles.generateDescription}>
            Generate personalized courses with AI on any topic you want to learn
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.generateButton}
        onPress={() => router.push("/addCourse")}
      >
        <Ionicons name="sparkles" size={20} color={Colors.WHITE} />
        <Text style={styles.generateButtonText}>Generate Course</Text>
      </TouchableOpacity>
    </View>
  );

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

          <GenerateCourseCard />

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

const styles = StyleSheet.create({
  generateCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    marginBottom: 10,
    elevation: 3,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    borderStyle: "dashed",
  },
  generateContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  generateIcon: {
    marginRight: 15,
  },
  generateText: {
    flex: 1,
  },
  generateTitle: {
    fontFamily: "outfit-bold",
    fontSize: 18,
    color: Colors.BLACK,
    marginBottom: 5,
  },
  generateDescription: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.GRAY,
    lineHeight: 20,
  },
  generateButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  generateButtonText: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    color: Colors.WHITE,
    marginLeft: 8,
  },
});
