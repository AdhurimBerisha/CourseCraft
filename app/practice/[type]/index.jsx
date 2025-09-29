import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import CourseList from "../../../components/PracticeScreen/CourseList";
import { db } from "../../../config/firebaseConfig";
import Colors from "../../../constants/Colors";
import { PraticeOption } from "../../../constants/Option";
import { UserDetailContext } from "../../../context/UserContext";

export default function PracticeTypeHomeScreen() {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const option = PraticeOption.find((item) => item.name == type);
  console.log("===================");
  console.log(option);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    if (userDetail && userDetail.email) {
      GetCourseList();
    }
  }, [userDetail]);

  // Refresh course list when screen comes into focus (e.g., after completing a quiz)
  useFocusEffect(
    useCallback(() => {
      if (userDetail && userDetail.email) {
        GetCourseList();
      }
    }, [userDetail])
  );

  const checkQuizResults = async (courseId) => {
    try {
      const quizQuery = query(
        collection(db, "QuizResults"),
        where("courseId", "==", courseId),
        where("userId", "==", userDetail.email)
      );
      const quizSnapshot = await getDocs(quizQuery);
      return !quizSnapshot.empty;
    } catch (e) {
      return false;
    }
  };

  const GetCourseList = async () => {
    setLoading(true);
    setCourseList([]);
    try {
      const q = query(
        collection(db, "Courses"),
        where("createdBy", "==", userDetail.email)
      );
      const querySnapshot = await getDocs(q);

      const courses = [];
      for (const doc of querySnapshot.docs) {
        // Check if user has completed quiz for this course
        const hasQuizResult = await checkQuizResults(doc.id);

        // Also check if quizResult exists in the course document itself
        const courseData = doc.data();
        const hasQuizResultInCourse = !!courseData.quizResult;

        courses.push({
          ...courseData,
          docId: doc.id,
          hasQuizResult: hasQuizResult || hasQuizResultInCourse,
        });
      }

      setCourseList(courses);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <View>
      <Image
        source={option.image}
        style={{
          height: 200,
          width: "100%",
        }}
      />
      <View
        style={{
          position: "absolute",
          padding: 30,
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            style={{
              backgroundColor: Colors.WHITE,
              padding: 8,
              borderRadius: 10,
            }}
          />
        </Pressable>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 35,
            color: Colors.WHITE,
          }}
        >
          {type}
        </Text>
      </View>

      {loading && (
        <ActivityIndicator
          size={"large"}
          color={Colors.PRIMARY}
          style={{
            marginTop: 150,
          }}
        />
      )}

      <CourseList courseList={courseList} option={option} />
    </View>
  );
}
