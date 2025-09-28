import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { FlatList, Platform, View } from "react-native";
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

  const GetCourseList = async () => {
    const q = query(
      collection(db, "Courses"),
      where("createdBy", "==", userDetail?.email)
    );
    const querySnapshot = await getDocs(q);
    const courses = [];
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      courses.push({
        ...doc.data(),
        docId: doc.id
      });
    });
    setCourseList(courses);
  };

  useEffect(()=>{
    userDetail && GetCourseList()
  },[userDetail])

  return (
    <FlatList
    data={[]}
    ListHeaderComponent={
    <View
      style={{
        padding: 25,
        paddingTop: Platform.OS == "ios" ? 50 : 50,
        flex: 1,
        backgroundColor: Colors.WHITE,
      }}
    >
      <Header />
      {courseList.length == 0 ?
      <NoCourse /> :
      <View>
        <CourseProgress courseList={courseList}/>
        <PracticeSection />
        <CourseList courseList={courseList} /> 
      </View> 
        }
    </View>
    }/>
  );
}
