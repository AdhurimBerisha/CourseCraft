import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
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
    console.log("useEffect triggered, userDetail:", userDetail);
    if (userDetail && userDetail.email) {
      GetCourseList();
    }
  }, [userDetail]);

  const GetCourseList = async () => {
    console.log("GetCourseList called with userDetail:", userDetail);
    setLoading(true);
    setCourseList([]);
    try {
      const q = query(
        collection(db, "Courses"),
        where("createdBy", "==", userDetail.email)
        // Removed orderBy temporarily to avoid index issues
      );
      console.log("Query created, fetching docs...");
      const querySnapshot = await getDocs(q);
      console.log("Query snapshot size:", querySnapshot.size);
      
      const courses = [];
      querySnapshot.forEach((doc) => {
        console.log("Document data:", doc.data());
        courses.push(doc.data());
      });
      
      console.log("All courses:", courses);
      setCourseList(courses);
      setLoading(false);
    } catch (e) {
      console.log("Error fetching courses:", e);
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
