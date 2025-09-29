import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { FlatList, Image, Platform, View } from "react-native";
import CourseList from "../../components/Home/CourseList";
import CourseProgress from "../../components/Home/CourseProgress";
import Header from "../../components/Home/Header";
import NoCourse from "../../components/Home/NoCourse";
import PracticeSection from "../../components/Home/PracticeSection";
import Colors from "../../constants/Colors";
import { UserDetailContext } from "../../context/UserContext";
import { db } from "./../../config/firebaseConfig";
export default function Home() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);

  const GetCourseList = async () => {
    setLoading(true);
    const q = query(
      collection(db, "Courses"),
      where("createdBy", "==", userDetail?.email)
    );
    const querySnapshot = await getDocs(q);
    const courses = [];
    querySnapshot.forEach((doc) => {
      courses.push({
        ...doc.data(),
        docId: doc.id,
      });
    });
    setCourseList(courses);
    setLoading(false);
  };

  useEffect(() => {
    userDetail && GetCourseList();
  }, [userDetail]);

  return (
    <FlatList
      data={[]}
      onRefresh={GetCourseList}
      refreshing={loading}
      ListHeaderComponent={
        <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
          <Image
            style={{
              position: "absolute",
              width: "100%",
              height: 700,
            }}
            source={require("./../../assets/images/wave.png")}
          />
          <View
            style={{
              padding: 25,
              paddingTop: Platform.OS == "ios" ? 50 : 50,
            }}
          >
            <Header />
            {courseList.length == 0 ? (
              <NoCourse />
            ) : (
              <View>
                <CourseProgress courseList={courseList} />
                <PracticeSection />
                <CourseList courseList={courseList} />
              </View>
            )}
          </View>
        </View>
      }
    />
  );
}
