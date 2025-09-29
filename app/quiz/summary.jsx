import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Button from "../../components/shared/Button";
import Colors from "../../constants/Colors";

export default function QuizSummary() {
  const { quizResult } = useLocalSearchParams();
  const router = useRouter();
  const result = quizResult;
  const [showDetails, setShowDetails] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const calculateScore = () => {
    const totalQuestions = Object.keys(result).length;
    const correctAnswers = Object.values(result).filter(
      (r) => r.isCorrect
    ).length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    return { correctAnswers, totalQuestions, percentage };
  };

  const score = calculateScore();

  const getScoreConfig = (percentage) => {
    const configs = [
      {
        threshold: 90,
        color: Colors.GREEN,
        icon: "trophy",
        message: "Excellent! Outstanding performance!",
        completion: "Outstanding!",
      },
      {
        threshold: 80,
        color: Colors.GREEN,
        icon: "trophy",
        message: "Great job! Well done!",
        completion: "Excellent!",
      },
      {
        threshold: 70,
        color: Colors.ORANGE,
        icon: "medal",
        message: "Good work! You passed!",
        completion: "Well Done!",
      },
      {
        threshold: 60,
        color: Colors.ORANGE,
        icon: "medal",
        message: "Not bad, but keep practicing!",
        completion: "Good Job!",
      },
      {
        threshold: 0,
        color: Colors.RED,
        icon: "school",
        message: "Keep studying and try again!",
        completion: "Keep Learning!",
      },
    ];

    return (
      configs.find((config) => percentage >= config.threshold) ||
      configs[configs.length - 1]
    );
  };

  const scoreConfig = getScoreConfig(score.percentage);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowDetails(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!showDetails) {
    return (
      <View style={{ flex: 1, backgroundColor: scoreConfig.color }}>
        <Image
          source={require("../../assets/images/wave.png")}
          style={{
            height: 800,
            width: "100%",
            opacity: 0.3,
          }}
        />

        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            padding: 30,
          }}
        >
          <View
            style={{
              backgroundColor: Colors.WHITE,
              borderRadius: 150,
              width: 300,
              height: 300,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 40,
              elevation: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
          >
            <Ionicons
              name={scoreConfig.icon}
              size={80}
              color={scoreConfig.color}
              style={{ marginBottom: 20 }}
            />

            <Text
              style={{
                fontFamily: "outfit-bold",
                fontSize: 48,
                color: scoreConfig.color,
                marginBottom: 10,
              }}
            >
              {score.percentage}%
            </Text>

            <Text
              style={{
                fontFamily: "outfit-bold",
                fontSize: 24,
                color: Colors.BLACK,
                marginBottom: 5,
              }}
            >
              {score.correctAnswers}/{score.totalQuestions}
            </Text>

            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 16,
                color: Colors.GRAY,
              }}
            >
              Correct Answers
            </Text>
          </View>

          <View
            style={{
              backgroundColor: Colors.WHITE,
              borderRadius: 20,
              padding: 30,
              alignItems: "center",
              marginBottom: 40,
              elevation: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            }}
          >
            <Text
              style={{
                fontFamily: "outfit-bold",
                fontSize: 32,
                color: Colors.BLACK,
                marginBottom: 15,
                textAlign: "center",
              }}
            >
              Quiz Complete!
            </Text>

            <Text
              style={{
                fontFamily: "outfit-bold",
                fontSize: 24,
                color: scoreConfig.color,
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              {scoreConfig.completion}
            </Text>

            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 16,
                color: Colors.GRAY,
                textAlign: "center",
                lineHeight: 24,
              }}
            >
              {score.percentage >= 70
                ? "Congratulations! You've successfully completed the quiz."
                : "Good effort! Review your answers to improve next time."}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: Colors.WHITE,
              borderRadius: 50,
              width: 100,
              height: 100,
              justifyContent: "center",
              alignItems: "center",
              elevation: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            }}
          >
            <Text
              style={{
                fontFamily: "outfit-bold",
                fontSize: 36,
                color: scoreConfig.color,
              }}
            >
              {countdown}
            </Text>

            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 12,
                color: Colors.GRAY,
              }}
            >
              Redirecting...
            </Text>
          </View>

          <View style={{ marginTop: 30 }}>
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 14,
                color: Colors.WHITE,
                textAlign: "center",
                opacity: 0.8,
              }}
            >
              Tap anywhere to skip countdown
            </Text>
          </View>
        </View>

        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            onTouchEnd={() => setShowDetails(true)}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require("../../assets/images/wave.png")}
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
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={30} color="white" />
          </Pressable>
          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 25,
              color: Colors.WHITE,
            }}
          >
            Quiz Summary
          </Text>
        </View>

        <ScrollView
          style={{
            backgroundColor: Colors.WHITE,
            marginTop: 30,
            borderRadius: 20,
            maxHeight: Dimensions.get("screen").height * 0.75,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Score Overview */}
          <View
            style={{
              padding: 25,
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: Colors.LIGHT_GRAY,
            }}
          >
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: scoreConfig.color,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "outfit-bold",
                  fontSize: 36,
                  color: Colors.WHITE,
                }}
              >
                {score.percentage}%
              </Text>
            </View>

            <Text
              style={{
                fontFamily: "outfit-bold",
                fontSize: 24,
                color: Colors.BLACK,
                marginBottom: 10,
              }}
            >
              {score.correctAnswers}/{score.totalQuestions} Correct
            </Text>

            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 18,
                color: scoreConfig.color,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              {scoreConfig.message}
            </Text>

            <View
              style={{
                width: "100%",
                height: 8,
                backgroundColor: Colors.LIGHT_GRAY,
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${score.percentage}%`,
                  height: "100%",
                  backgroundColor: scoreConfig.color,
                }}
              />
            </View>
          </View>

          <View style={{ padding: 25 }}>
            <Text
              style={{
                fontFamily: "outfit-bold",
                fontSize: 20,
                color: Colors.BLACK,
                marginBottom: 20,
              }}
            >
              Question Review
            </Text>

            {Object.entries(result).map(
              ([questionIndex, questionResult], index) => (
                <View
                  key={index}
                  style={{
                    marginBottom: 20,
                    padding: 15,
                    backgroundColor: questionResult.isCorrect
                      ? Colors.LIGHT_GREEN
                      : Colors.LIGHT_RED,
                    borderRadius: 10,
                    borderLeftWidth: 4,
                    borderLeftColor: questionResult.isCorrect
                      ? Colors.GREEN
                      : Colors.RED,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "outfit-bold",
                      fontSize: 16,
                      color: Colors.BLACK,
                      marginBottom: 10,
                    }}
                  >
                    Question {parseInt(questionIndex) + 1}
                  </Text>

                  <Text
                    style={{
                      fontFamily: "outfit",
                      fontSize: 14,
                      color: Colors.BLACK,
                      marginBottom: 10,
                    }}
                  >
                    {questionResult.question}
                  </Text>

                  <View style={{ marginBottom: 8 }}>
                    <Text
                      style={{
                        fontFamily: "outfit-bold",
                        fontSize: 12,
                        color: Colors.GRAY,
                      }}
                    >
                      Your Answer:
                    </Text>
                    <Text
                      style={{
                        fontFamily: "outfit",
                        fontSize: 14,
                        color: questionResult.isCorrect
                          ? Colors.GREEN
                          : Colors.RED,
                      }}
                    >
                      {questionResult.userChoice}
                    </Text>
                  </View>

                  {!questionResult.isCorrect && (
                    <View>
                      <Text
                        style={{
                          fontFamily: "outfit-bold",
                          fontSize: 12,
                          color: Colors.GRAY,
                        }}
                      >
                        Correct Answer:
                      </Text>
                      <Text
                        style={{
                          fontFamily: "outfit",
                          fontSize: 14,
                          color: Colors.GREEN,
                        }}
                      >
                        {questionResult.correctAns}
                      </Text>
                    </View>
                  )}

                  <View
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 15,
                    }}
                  >
                    <Ionicons
                      name={
                        questionResult.isCorrect
                          ? "checkmark-circle"
                          : "close-circle"
                      }
                      size={24}
                      color={
                        questionResult.isCorrect ? Colors.GREEN : Colors.RED
                      }
                    />
                  </View>
                </View>
              )
            )}
          </View>
        </ScrollView>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
            gap: 15,
          }}
        >
          <Button
            text="Retake Quiz"
            onPress={() => router.push("/practice/Quiz")}
            style={{
              flex: 1,
              backgroundColor: Colors.LIGHT_GRAY,
            }}
            textStyle={{
              color: Colors.BLACK,
            }}
          />
          <Button
            text="Back to Courses"
            onPress={() => router.push("/(tabs)/home")}
            style={{
              flex: 1,
            }}
          />
        </View>
      </View>
    </View>
  );
}
