import { collection, query, where } from "firebase/firestore";
import { useContext, useState } from "react";
import { Platform, View } from "react-native";
import Header from "../../components/Home/Header";
import NoCourse from "../../components/Home/NoCourse";
import Colors from "../../constants/Colors";
import { UserDetailContext } from "../../context/UserContext";
import { db } from "./../../config/firebaseConfig";
export default function Home() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const [courseList, setCourseList] = useState();

  const GetCourseList = () => {
    const q = query(
      collection(db, "Courses"),
      where("createdBy", "==", userDetail?.email)
    );
  };

  return (
    <View
      style={{
        padding: 25,
        paddingTop: Platform.OS == "ios" ? 50 : 50,
        flex: 1,
        backgroundColor: Colors.WHITE,
      }}
    >
      <Header />
      <NoCourse />
    </View>
  );
}
