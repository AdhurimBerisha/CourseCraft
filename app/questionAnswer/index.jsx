import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Bar } from "react-native-progress";
import Colors from "../../constants/Colors";

export default function QuestionAnswer() {
  const { courseParams } = useLocalSearchParams();
  const course = JSON.parse(courseParams);
  const questions =
    course.questions || course.quiz || course.questionAnswers || [];

  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();
  const width = Dimensions.get("screen").width;

  const currentQuestion = questions[currentPage];

  const handleAnswerChange = (text) => {
    setAnswers((prev) => ({
      ...prev,
      [currentPage]: text,
    }));
  };

  const checkAnswer = () => {
    const userAnswer = answers[currentPage]?.toLowerCase().trim();
    const correctAnswer = (
      currentQuestion?.answer ||
      currentQuestion?.correctAns ||
      currentQuestion?.correctAnswer
    )
      ?.toLowerCase()
      .trim();
    const isCorrect = userAnswer === correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setShowAnswer(true);
  };

  const nextQuestion = () => {
    if (currentPage < questions.length - 1) {
      setCurrentPage((prev) => prev + 1);
      setShowAnswer(false);
    } else {
      setCompleted(true);
    }
  };

  const previousQuestion = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      setShowAnswer(false);
    }
  };

  const resetQuiz = () => {
    setCurrentPage(0);
    setAnswers({});
    setShowAnswer(false);
    setScore(0);
    setCompleted(false);
  };

  const goBack = () => {
    router.back();
  };

  const getProgress = () => {
    if (questions.length === 0) return 0;
    return (currentPage + 1) / questions.length;
  };

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Image
          source={require("./../../assets/images/wave.png")}
          style={styles.backgroundImage}
        />
        <View style={styles.content}>
          <View style={styles.header}>
            <Pressable onPress={goBack}>
              <Ionicons name="arrow-back" size={30} color="white" />
            </Pressable>
            <Text style={styles.headerTitle}>No Questions</Text>
            <View style={{ width: 30 }} />
          </View>

          <View style={styles.completionCard}>
            <Ionicons name="help-circle" size={80} color={Colors.GRAY} />
            <Text style={styles.completionTitle}>No Questions Available</Text>
            <Text style={styles.scoreText}>
              This course doesn&apos;t have any questions yet.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (completed) {
    return (
      <View style={styles.container}>
        <Image
          source={require("./../../assets/images/wave.png")}
          style={styles.backgroundImage}
        />
        <View style={styles.content}>
          <View style={styles.header}>
            <Pressable onPress={goBack}>
              <Ionicons name="arrow-back" size={30} color="white" />
            </Pressable>
            <Text style={styles.headerTitle}>Q&A Complete!</Text>
            <View style={{ width: 30 }} />
          </View>

          <View style={styles.completionCard}>
            <Ionicons name="checkmark-circle" size={80} color={Colors.GREEN} />
            <Text style={styles.completionTitle}>Great Job!</Text>
            <Text style={styles.scoreText}>
              You scored {score} out of {questions.length}
            </Text>
            <Text style={styles.percentageText}>
              {questions.length > 0
                ? Math.round((score / questions.length) * 100)
                : 0}
              %
            </Text>

            <TouchableOpacity style={styles.resetButton} onPress={resetQuiz}>
              <Text style={styles.resetButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("./../../assets/images/wave.png")}
        style={styles.backgroundImage}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={goBack}>
            <Ionicons name="arrow-back" size={30} color="white" />
          </Pressable>
          <Text style={styles.headerTitle}>
            {currentPage + 1} of {questions.length}
          </Text>
          <View style={{ width: 30 }} />
        </View>

        <View style={styles.progressContainer}>
          <Bar
            progress={getProgress()}
            width={width * 0.85}
            color={Colors.WHITE}
            height={10}
          />
        </View>

        <ScrollView
          style={styles.questionContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{currentQuestion?.question}</Text>

            <View style={styles.answerSection}>
              <Text style={styles.answerLabel}>Your Answer:</Text>
              <TextInput
                style={styles.answerInput}
                value={answers[currentPage] || ""}
                onChangeText={handleAnswerChange}
                placeholder="Type your answer here..."
                placeholderTextColor={Colors.GRAY}
                multiline
                editable={!showAnswer}
              />
            </View>

            {showAnswer && (
              <View style={styles.correctAnswerSection}>
                <Text style={styles.correctAnswerLabel}>Correct Answer:</Text>
                <Text style={styles.correctAnswerText}>
                  {currentQuestion?.answer ||
                    currentQuestion?.correctAns ||
                    currentQuestion?.correctAnswer}
                </Text>

                <View style={styles.feedbackContainer}>
                  {answers[currentPage]?.toLowerCase().trim() ===
                  (
                    currentQuestion?.answer ||
                    currentQuestion?.correctAns ||
                    currentQuestion?.correctAnswer
                  )
                    ?.toLowerCase()
                    .trim() ? (
                    <View style={styles.correctFeedback}>
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={Colors.GREEN}
                      />
                      <Text style={styles.feedbackText}>Correct!</Text>
                    </View>
                  ) : (
                    <View style={styles.incorrectFeedback}>
                      <Ionicons
                        name="close-circle"
                        size={24}
                        color={Colors.RED}
                      />
                      <Text style={styles.feedbackText}>Incorrect</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          {!showAnswer ? (
            <TouchableOpacity style={styles.checkButton} onPress={checkAnswer}>
              <Text style={styles.checkButtonText}>Check Answer</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.navigationButtons}>
              {currentPage > 0 && (
                <TouchableOpacity
                  style={styles.navButton}
                  onPress={previousQuestion}
                >
                  <Ionicons
                    name="chevron-back"
                    size={20}
                    color={Colors.WHITE}
                  />
                  <Text style={styles.navButtonText}>Previous</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.nextButton}
                onPress={nextQuestion}
              >
                <Text style={styles.nextButtonText}>
                  {currentPage === questions.length - 1 ? "Finish" : "Next"}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={Colors.WHITE}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    height: 800,
    width: "100%",
    position: "absolute",
  },
  content: {
    position: "absolute",
    padding: 30,
    marginTop: 40,
    width: "100%",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: "outfit-bold",
    fontSize: 25,
    color: Colors.WHITE,
  },
  progressContainer: {
    marginBottom: 20,
  },
  questionContainer: {
    flex: 1,
    marginBottom: 20,
  },
  questionCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 25,
    minHeight: 400,
  },
  questionText: {
    fontFamily: "outfit-bold",
    fontSize: 22,
    color: Colors.BLACK,
    marginBottom: 25,
    lineHeight: 30,
  },
  answerSection: {
    marginBottom: 20,
  },
  answerLabel: {
    fontFamily: "outfit-bold",
    fontSize: 18,
    color: Colors.BLACK,
    marginBottom: 10,
  },
  answerInput: {
    borderWidth: 2,
    borderColor: Colors.BG_GRAY,
    borderRadius: 15,
    padding: 15,
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.BLACK,
    minHeight: 100,
    textAlignVertical: "top",
  },
  correctAnswerSection: {
    backgroundColor: Colors.BG_GRAY,
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
  },
  correctAnswerLabel: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    color: Colors.BLACK,
    marginBottom: 10,
  },
  correctAnswerText: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.BLACK,
    lineHeight: 24,
    marginBottom: 15,
  },
  feedbackContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  correctFeedback: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.LIGHT_GREEN,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  incorrectFeedback: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.LIGHT_RED,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  feedbackText: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    color: Colors.BLACK,
    marginLeft: 8,
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  checkButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: "center",
  },
  checkButtonText: {
    fontFamily: "outfit-bold",
    fontSize: 18,
    color: Colors.WHITE,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.GRAY,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
  },
  navButtonText: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    color: Colors.WHITE,
    marginLeft: 5,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 15,
  },
  nextButtonText: {
    fontFamily: "outfit-bold",
    fontSize: 18,
    color: Colors.WHITE,
    marginRight: 5,
  },
  completionCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    marginTop: 50,
  },
  completionTitle: {
    fontFamily: "outfit-bold",
    fontSize: 28,
    color: Colors.BLACK,
    marginTop: 20,
    marginBottom: 10,
  },
  scoreText: {
    fontFamily: "outfit",
    fontSize: 18,
    color: Colors.GRAY,
    marginBottom: 5,
  },
  percentageText: {
    fontFamily: "outfit-bold",
    fontSize: 32,
    color: Colors.PRIMARY,
    marginBottom: 30,
  },
  resetButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 15,
  },
  resetButtonText: {
    fontFamily: "outfit-bold",
    fontSize: 18,
    color: Colors.WHITE,
  },
});
