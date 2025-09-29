import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import FlipCard from "react-native-flip-card";
import { Bar } from "react-native-progress";
import Colors from "../../constants/Colors";

export default function Flashcard() {
  const { courseParams } = useLocalSearchParams();
  const course = JSON.parse(courseParams);
  const flashcard = course.flashcards;
  const [currentPage, setCurrentPage] = useState(0);
  const width = Dimensions.get("screen").width;
  const onMomentumScrollEnd = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPage(index);
  };
  const router = useRouter();

  const GetProgress = (currentPage) => {
    const perc = currentPage / flashcard.length;
    return perc;
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
            <Ionicons
              name="arrow-back"
              size={30}
              color="white"
              onPress={() => router.back()}
            />
          </Pressable>
          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 25,
              color: Colors.WHITE,
            }}
          >
            {currentPage + 1} of {flashcard.length}
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
        <FlatList
          data={flashcard}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          pagingEnabled={true}
          snapToAlignment="center"
          decelerationRate="fast"
          renderItem={({ item, index }) => (
            <View
              style={{
                height: 500,
                width: width,
                marginTop: 50,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 20,
              }}
            >
              <FlipCard style={styles.flipCard}>
                {/* Face Side */}
                <View style={styles.frontCard}>
                  <Text
                    style={{
                      fontFamily: "outfit-bold",
                      fontSize: 24,
                      textAlign: "center",
                      color: Colors.BLACK,
                    }}
                  >
                    {item.front}
                  </Text>
                </View>
                {/* Back Side */}
                <View style={styles.backCard}>
                  <Text
                    style={{
                      fontFamily: "outfit",
                      fontSize: 24,
                      textAlign: "center",
                      color: Colors.WHITE,
                    }}
                  >
                    {item.back}
                  </Text>
                </View>
              </FlipCard>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flipCard: {
    width: Dimensions.get("screen").width * 0.85,
    height: 400,
    backgroundColor: Colors.WHITE,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  frontCard: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    height: "100%",
    padding: 20,
  },
  backCard: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    borderRadius: 20,
    backgroundColor: Colors.PRIMARY,
    padding: 20,
  },
});
