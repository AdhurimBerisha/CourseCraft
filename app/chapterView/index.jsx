import { useLocalSearchParams, useRouter } from "expo-router";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Bar } from "react-native-progress";
import { db } from "../../config/firebaseConfig";
import Colors from "../../constants/Colors";
import Button from "./../../components/shared/Button";

export default function ChapterView() {
  const { chapterParams, docId, chapterIndex } = useLocalSearchParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  
  
  if (!chapterParams) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading chapter...</Text>
      </View>
    );
  }
  
  let chapter;
  try {
    if (typeof chapterParams === 'string') {
      chapter = JSON.parse(chapterParams);
    } else if (typeof chapterParams === 'object' && chapterParams !== null) {
      chapter = chapterParams;
    } else {
      throw new Error('Invalid chapterParams type: ' + typeof chapterParams);
    }
  } catch (error) {
    console.error("JSON parse error:", error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error loading chapter data</Text>
      </View>
    );
  }
  const GetProgress = (currentPage) => {
    const perc = currentPage / chapter.content.length;
    return perc;
  };

  const onChapterComplete = async () => {
    try {
      setLoader(true);
      await updateDoc(doc(db, "Courses", docId), {
        completedChapter: arrayUnion(parseInt(chapterIndex)),
      });
      setLoader(false);
      
      router.replace({
        pathname: "/courseView/[courseId]",
        params: {
          courseId: docId
        }
      });
    } catch (error) {
      console.error("Error completing chapter:", error);
      setLoader(false);
      router.replace({
        pathname: "/courseView/[courseId]",
        params: {
          courseId: docId
        }
      });
    }
  };

  return (
    <View
      style={{
        padding: 25,
        marginTop: 40,
        backgroundColor: Colors.WHITE,
        flex: 1,
      }}
    >
      <Bar
        progress={GetProgress(currentPage)}
        width={Dimensions.get("screen").width * 0.85}
      />

      <View
        style={{
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 25,
          }}
        >
          {chapter.content[currentPage].topic}
        </Text>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 20,
            marginTop: 7,
          }}
        >
          {chapter.content[currentPage].explain}
        </Text>

        {chapter.content[currentPage].code && (
          <Text
            style={[
              styles.codeExampleText,
              { backgroundColor: Colors.BLACK, color: Colors.WHITE },
            ]}
          >
            {chapter.content[currentPage].code}
          </Text>
        )}
        {chapter.content[currentPage].example && (
          <Text style={styles.codeExampleText}>
            {chapter.content[currentPage].example}
          </Text>
        )}
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 25,
          width: "100%",
          left: 25,
        }}
      >
        {chapter.content.length - 1 !== currentPage ? (
          <Button
            text={"Next"}
            onPress={() => setCurrentPage(currentPage + 1)}
          />
        ) : (
          <Button
            text={"Finish"}
            onPress={() => onChapterComplete()}
            loading={loader}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  codeExampleText: {
    padding: 15,
    backgroundColor: Colors.BG_GRAY,
    borderRadius: 15,
    fontFamily: "outfit",
    fontSize: 18,
    marginTop: 15,
  },
});
