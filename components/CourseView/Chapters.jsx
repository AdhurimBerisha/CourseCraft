import { Foundation } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/Colors";

export default function Chapters({course}){
    return (
        <View style={{
            padding:20
        }}>
            <Text style={{
                fontFamily:'outfit-bold',
                fontSize:25
            }}>Chapters</Text>
            <FlatList
                data={course.chapters}
                renderItem={({item, index})=>(
                    <TouchableOpacity style={{
                        backgroundColor: Colors.BG_GRAY,
                        padding: 15,
                        marginVertical: 5,
                        borderRadius: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontFamily: 'outfit-bold',
                                fontSize: 18
                            }}>
                                Chapter {index + 1}: {item.chapterName}
                            </Text>
                            <Text style={{
                                fontFamily: 'outfit',
                                fontSize: 14,
                                color: Colors.GRAY,
                                marginTop: 5
                            }}>
                                {item.content.length} topics
                            </Text>
                        </View>
                        <Foundation name="play" size={28} color={Colors.PRIMARY} />
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    )
}