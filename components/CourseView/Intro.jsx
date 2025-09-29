import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Button from "../../components/shared/Button";
import { db } from "../../config/firebaseConfig";
import Colors from "../../constants/Colors";
import { imageAssets } from "../../constants/Option";
import { UserDetailContext } from "../../context/UserContext";

export default function Intro({ course, enroll }) {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const route = useRouter();
  const getChaptersLength = (chapters) => {
    if (!chapters) return 0;
    if (Array.isArray(chapters)) return chapters.length;
    return Object.keys(chapters).length;
  };

  const onEnrollCourse = async () => {
    setLoading(true);
    const data = {
      ...course,
      createdBy: userDetail.email,
      createdOn: new Date(),
      enrolled: true,
    };
    const docId = Date.now().toString();

    await setDoc(doc(db, "Courses", docId), data);
    route.push({
      pathname: "/courseView/[courseId]",
      params: {
        courseId: docId,
        courseParams: JSON.stringify(data),
        enroll: false,
      },
    });
    setLoading(false);
  };

  return (
    <View>
      <Image
        source={imageAssets[course.banner_image]}
        style={{
          width: "100%",
          height: 280,
        }}
      />
      <View
        style={{
          padding: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 25,
          }}
        >
          {course.courseTitle}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginTop: 5,
          }}
        >
          <Ionicons name="book-outline" size={20} color="black" />

          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 18,
            }}
          >
            {getChaptersLength(course.chapters)} Chapters{" "}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 20,
            marginTop: 10,
          }}
        >
          Description:
        </Text>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 18,
            color: Colors.GRAY,
          }}
        >
          {course.description}
        </Text>
        {enroll == "true" ? (
          <Button
            loading={loading}
            text="Enroll Now"
            onPress={() => onEnrollCourse()}
          />
        ) : (
          <Button
            text={"Start Now"}
            onPress={() => {
              router.push({
                pathname: "/courseView/[courseId]",
                params: {
                  courseId: course.docId || course.id,
                  courseParams: JSON.stringify(course),
                  enroll: false,
                },
              });
            }}
          />
        )}
      </View>
      <Pressable
        style={{
          position: "absolute",
          padding: 10,
          marginTop: 30,
        }}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={34} color="black" />
      </Pressable>
    </View>
  );
}
