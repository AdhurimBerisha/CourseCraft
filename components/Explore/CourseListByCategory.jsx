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
    const q = query(
      collection(db, "Courses"),
      where("category", "==", category),
      orderBy("createdOn", "desc")
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      setCourseList((prev) => [...prev, doc.data()]);
    });
    setLoading(false);
  };
  return (
    <View>
      {courseList.length > 0 && (
        <CourseList courseList={courseList} heading={category} />
      )}
    </View>
  );
}
