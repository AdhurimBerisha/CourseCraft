import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Bar } from "react-native-progress";
import { db } from "../../config/firebaseConfig";
import Colors from "../../constants/Colors";
import Button from "./../../components/shared/Button";

export default function Quiz() {
  const { courseParams } = useLocalSearchParams();
  const course = JSON.parse(courseParams);
  const [currentPage, setCurrentPage] = useState(0);
  const quiz = course.quiz;
  const [selectedOption, setSelectedOption] = useState();
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const GetProgress = (currentPage) => {
    const perc = currentPage / quiz.length;
    return perc;
  };

  const OnOptionSelect = (selectedChoice) => {
    setResult((prev) => ({
      ...prev,
      [currentPage]: {
        userChoice: selectedChoice,
        isCorrect: quiz[currentPage].correctAns == selectedChoice,
        question: quiz[currentPage].question,
        correctAns: quiz[currentPage].correctAns,
      },
    }));
  };

  const onQuizFinish = async () => {
    setLoading(true);
    try {
      const docId = course.docId || course.id || course.documentId;

      if (!docId) {
        throw new Error("No document ID found in course data");
      }

      await updateDoc(doc(db, "Courses", docId), {
        quizResult: result,
      });
      setLoading(false);
    } catch (e) {
      try {
        await addDoc(collection(db, "QuizResults"), {
          courseId: course.docId,
          courseTitle: course.courseTitle,
          quizResult: result,
          completedAt: new Date(),
          userId: course.createdBy || "unknown",
        });
        setLoading(false);
      } catch (fallbackError) {
        setLoading(false);
      }
    }
  };

  return (
    <View>
      <Image
        source={require("./../../assets/images/wave.png")}
        style={{
          height: 800,
          width: "100%",
        }}
      />
      <View
        style={{
          position: "absolute",
          padding: 30,
          marginTop: 40,
          width: "100%",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Pressable>
            <Ionicons name="arrow-back" size={30} color="white" />
          </Pressable>
          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 25,
              color: Colors.WHITE,
            }}
          >
            {currentPage + 1} of {quiz.length}
          </Text>
        </View>

        <View
          style={{
            marginTop: 20,
          }}
        >
          <Bar
            progress={GetProgress(currentPage)}
            width={Dimensions.get("window").width * 0.85}
            color={Colors.WHITE}
            height={10}
          />
        </View>

        <View
          style={{
            padding: 25,
            backgroundColor: Colors.WHITE,
            marginTop: 30,
            height: Dimensions.get("screen").height * 0.65,
            elevation: 1,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              fontSize: 25,
              fontFamily: "outfit-bold",
              textAlign: "center",
            }}
          >
            {quiz[currentPage].question}
          </Text>
          {quiz[currentPage].options.map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedOption(index);
                OnOptionSelect(item);
              }}
              key={index}
              style={{
                padding: 20,
                borderWidth: 1,
                borderRadius: 15,
                marginTop: 10,
                backgroundColor:
                  selectedOption == index ? Colors.LIGHT_GREEN : null,
                borderColor: selectedOption == index ? Colors.GREEN : null,
              }}
            >
              <Text
                style={{
                  fontFamily: "outfit",
                  fontSize: 20,
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedOption?.toString() && quiz.length - 1 > currentPage && (
          <Button
            text={"Next"}
            onPress={() => {
              setCurrentPage(currentPage + 1);
              setSelectedOption(null);
            }}
          />
        )}
        {selectedOption?.toString() && quiz.length - 1 == currentPage && (
          <Button
            text="Finish"
            onPress={() => onQuizFinish()}
            loading={loading}
          />
        )}
      </View>
    </View>
  );
}
