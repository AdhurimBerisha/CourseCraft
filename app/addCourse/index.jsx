import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Button from "../../components/shared/Button";
import { generateCourse, generateTopic } from "../../config/AIModel";
import { db } from "../../config/firebaseConfig";
import Colors from "../../constants/Colors";
import Prompt from "./../../constants/Prompt";
import { UserDetailContext } from "./../../context/UserContext";

export default function AddCourse() {
  const [loading, setLoading] = useState(false);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [userInput, setUserInput] = useState();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopics] = useState([]);

  const router = useRouter();

  const onGenerateTopic = async () => {
    setLoading(true);
    try {
      const PROMPT = (userInput || "") + " " + Prompt.IDEA;
      const result = await generateTopic(PROMPT);
      console.log("Generated topics (raw):", result);

      if (Array.isArray(result)) {
        setTopics(result);
      } else if (typeof result === "string") {
        try {
          const parsed = JSON.parse(result);
          if (Array.isArray(parsed)) setTopics(parsed);
          else
            setTopics(
              result
                .split(/\r?\n/)
                .map((s) => s.trim())
                .filter(Boolean)
            );
        } catch (_e) {
          const byLines = result
            .split(/\r?\n/)
            .map((s) => s.trim())
            .filter(Boolean);
          if (byLines.length) setTopics(byLines);
          else
            setTopics(
              result
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            );
        }
      } else if (result && typeof result === "object") {
        const arr = Object.values(result).find((v) => Array.isArray(v));
        if (Array.isArray(arr)) setTopics(arr);
        else setTopics([]);
      } else {
        setTopics([]);
      }
    } catch (err) {
      console.error("AI error:", err);
    } finally {
      setLoading(false);
    }
  };

  const onTopicSelect = (topic) => {
    const isAlreadyExist = selectedTopic.find((item) => item === topic);
    if (!isAlreadyExist) {
      setSelectedTopics((prev) => [...prev, topic]);
    } else {
      const topics = selectedTopic.filter((item) => item !== topic);
      setSelectedTopics(topics);
    }
  };

  const isTopicSelected = (topic) => {
    const selection = selectedTopic.find((item) => item === topic);
    return selection ? true : false;
  };

  const onGenerateCourse = async () => {
    if (!selectedTopic || selectedTopic.length === 0) {
      console.warn(
        "No topics selected - select at least one topic to generate a course"
      );
      return;
    }
    setLoading(true);
    try {
      console.log("Generating course for topics:", selectedTopic);
      console.log("Current userDetail:", userDetail);
      console.log("User email:", userDetail?.email);
      const result = await generateCourse(selectedTopic);
      console.log("Generated course result:", result);

      let coursesToSave = [];

      if (Array.isArray(result)) {
        coursesToSave = result;
      } else if (result && typeof result === "object" && !result.error) {
        coursesToSave = [result];
      } else {
        console.log("Skipping non-object result");
        return;
      }

      for (let i = 0; i < coursesToSave.length; i++) {
        const course = coursesToSave[i];
        if (course && typeof course === "object") {
          const courseId = `${Date.now()}_${i}`;
          const createdByEmail = userDetail?.email || "anonymous";
          console.log("Saving course with createdBy:", createdByEmail);
          await setDoc(doc(db, "Courses", courseId), {
            ...course,
            docId: courseId,
            createdOn: new Date(),
            createdBy: createdByEmail,
          });
        }
      }

      router.push("/(tabs)/home");
    } catch (err) {
      console.error("generateCourse error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{
        padding: 30,
        backgroundColor: Colors.WHITE,
        flex: 1,
        marginTop: 15,
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 30,
        }}
      >
        Create New Course
      </Text>
      <Text
        style={{
          fontFamily: "outfit",
          fontSize: 30,
        }}
      >
        What do you want to learn today?
      </Text>
      <Text
        style={{
          fontFamily: "outfit",
          fontSize: 20,
          marginTop: 8,
          color: Colors.GRAY,
        }}
      >
        Write what course you want to create, for example: React.Js, Digital
        Marketing Guide, Python etc...
      </Text>
      <TextInput
        placeholder="(Ex.Learn Python, Javascript)"
        style={styles.textInput}
        numberOfLines={3}
        multiline={true}
        onChangeText={(value) => setUserInput(value)}
      />

      <Button
        text={"Generate Topic"}
        type="outline"
        onPress={() => onGenerateTopic()}
        loading={loading}
      />

      <View
        style={{
          marginTop: 15,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 20,
          }}
        >
          Select all topics which you want to add in the course
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 6,
          }}
        >
          {Array.isArray(topics) && topics.length > 0 ? (
            topics.map((item, index) => (
              <Pressable key={index} onPress={() => onTopicSelect(item)}>
                <Text
                  style={{
                    padding: 7,
                    borderWidth: 0.4,
                    borderRadius: 99,
                    paddingHorizontal: 15,
                    backgroundColor: isTopicSelected(item)
                      ? Colors.PRIMARY
                      : null,
                    color: isTopicSelected(item)
                      ? Colors.WHITE
                      : Colors.PRIMARY,
                  }}
                >
                  {item}
                </Text>
              </Pressable>
            ))
          ) : (
            <Text style={{ color: Colors.GRAY, marginTop: 8 }}>
              No topics yet. Generate one to see suggestions.
            </Text>
          )}
        </View>
      </View>
      {selectedTopic && selectedTopic.length > 0 ? (
        <Button
          text="Generate Course"
          onPress={() => onGenerateCourse()}
          loading={loading}
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    height: 100,
    marginTop: 10,
    alignItems: "flex-start",
    fontSize: 18,
  },
});
