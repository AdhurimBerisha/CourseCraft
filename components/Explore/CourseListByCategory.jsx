import { useRouter } from "expo-router";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { db } from "../../config/firebaseConfig";
import CourseList from "../Home/CourseList";
export default function CourseListByCategory({ category }) {
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    GetCourseLisByCategory();
  }, []);

  const route = useRouter();

  const GetCourseLisByCategory = async () => {
    setCourseList([]);
    setLoading(true);
    try {
      const q = query(
        collection(db, "Courses"),
        where("category", "==", category),
        orderBy("createdOn", "desc")
      );

      const querySnapshot = await getDocs(q);
      const courses = [];

      querySnapshot.forEach((doc) => {
        const courseData = {
          ...doc.data(),
          docId: doc.id,
        };
        courses.push(courseData);
      });

      setCourseList(courses);
    } catch (error) {
      console.error("Error fetching courses by category:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View>
      {courseList.length > 0 && (
        <CourseList courseList={courseList} heading={category} enroll={true} />
      )}
    </View>
  );
}
