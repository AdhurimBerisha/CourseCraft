import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Button from "../../components/shared/Button";
import { generateTopic } from "../../config/AIModel";
import Colors from "../../constants/Colors";
import Prompt from "./../../constants/Prompt";

export default function AddCourse() {
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopics] = useState([]);
  const onGenerateTopic = async () => {
    setLoading(true);
    try {
      const PROMPT = (userInput || "") + " " + Prompt.IDEA;
      const result = await generateTopic(PROMPT);
      console.log("Generated topics (raw):", result);

      // Normalize whatever the AI returned into an array of strings.
      if (Array.isArray(result)) {
        setTopics(result);
      } else if (typeof result === "string") {
        // Try to parse a JSON array string if the model returned a JSON blob.
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
          // Fallback: split lines or comma-separated
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
        // If an object was returned, try to find a first array property
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
    const isAlreadyExist = selectedTopic.find((item) => item == topic);
    if (!isAlreadyExist) {
      setSelectedTopics((prev) => [...prev, topic]);
    } else {
      const topics = selectedTopic.filter((item) => item !== topic);
      setSelectedTopics(topics);
    }
  };

  const isTopicSelected = (topic) => {
    const selection = selectedTopic.find((item) => item == topic);
    return selection ? true : false;
  };

  return (
    <View
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
    </View>
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
