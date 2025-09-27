import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import { imageAssets } from '../../constants/Option';

export default function CourseList({courseList}) {
  return (
    <View style={{
      marginTop:15
    }}>
      <Text style={{
          fontFamily:'outfit-bold',
          fontSize: 25
      }}>Courses</Text>

      <FlatList 
      horizontal={true}
      showsHorizontalScrollIndicator={false}
          data={courseList}
          renderItem={({item, index}) => (
              <View key={index} style={styles.courseContainer}>
                <Image style={{
                    width:"100%",
                    height:150,
                    borderRadius:15
                }} source={imageAssets[item.banner_image]} />
                  <Text style={{
                    fontFamily:'outfit-bold',
                    fontSize: 18,
                    marginTop: 10
                  }}>{item.courseTitle}</Text>
                  <View style={{
                    display:'flex',
                    flexDirection:'row',
                    alignItems:'center',
                    gap: 5,
                    marginTop: 5
                  }}>

                    <Ionicons name="book-outline" size={20} color="black" />

                  <Text style={{
                      fontFamily:'outfit',
                    }}>
                    {item.chapters.length} Chapters </Text>
                  
              </View>
                      </View>
          )}
          keyExtractor={(item, index) => index.toString()}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  courseContainer: {
    padding:10,
    backgroundColor: Colors.BG_GRAY,
    margin:6,
    borderRadius: 15,
    width:250
  }
})

