import Ionicons from '@expo/vector-icons/Ionicons';
import React from "react";
import { FlatList, Image, Text, View } from "react-native";
import Colors from "../../constants/Colors";

export default function CourseList({ courseList, option }) {
  return (
    <View>
      <FlatList
        data={courseList}
        numColumns={2}
        style={{
          padding: 20,
        }}
        renderItem={({ item, index }) => (
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: 10,
              padding: 15,
              backgroundColor: Colors.WHITE,
              borderRadius: 15,
              elevation: 1,
            }}
            key={index}
          >
            <Ionicons name="checkmark-circle" size={24} color={Colors.GRAY} style={{
                position:'absolute',
                top:10,
                right:20
            }} />
            <Image
              source={option.icon}
              style={{
                width: "100%",
                height: 100,
                objectFit: "contain",
              }}
            />
            <Text style={{
                fontFamily:'outfit',
                textAlign: 'center',
                fontSize:18,
                marginTop:7
            }}>{item.courseTitle}</Text>
          </View>
        )}
      />
    </View>
  );
}
