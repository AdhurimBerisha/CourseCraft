import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import Chapters from "../../../components/CourseView/Chapters";
import Intro from "../../../components/CourseView/Intro";
import { db } from "../../../config/firebaseConfig";
import Colors from "../../../constants/Colors";
export default function CourseView() {
  const { courseParams, courseId } = useLocalSearchParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const GetCourseById = async () => {
      try {
        const docRef = await getDoc(doc(db, "Courses", courseId));
        if (docRef.exists()) {
          const courseData = docRef.data();
          setCourse(courseData);
        } else {
          setError("Course not found");
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    if (courseParams) {
      try {
        const parsedCourse = JSON.parse(courseParams);
        setCourse(parsedCourse);
        setLoading(false);
      } catch (err) {
        console.error("Error parsing courseParams:", err);
        setError("Invalid course data");
        setLoading(false);
      }
    } else if (courseId) {
      GetCourseById();
    } else {
      setError("No course ID provided");
      setLoading(false);
    }
  }, [courseId, courseParams]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading course...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No course data available</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={[]}
      ListHeaderComponent={() => (
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.WHITE,
          }}
        >
          <Intro course={course} />
          <Chapters course={course} />
        </View>
      )}
      renderItem={() => null}
      keyExtractor={() => "header"}
    />
  );
}
