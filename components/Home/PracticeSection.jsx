import React from 'react'
import { FlatList, Image, Text, View } from 'react-native'
import Colors from '../../constants/Colors'
import { PraticeOption } from '../../constants/Option'

export default function PracticeSection() {
    return (
        <View style={{
            marginTop:10
        }}>
            <Text style={{
            fontFamily:'outfit-bold',
            fontSize: 25
        }}>Practice</Text>
        <View>
            <FlatList
            numColumns={3}
                data={PraticeOption}
                renderItem={({item, index}) => (
                    <View key={index} style={{
                        flex:1,
                        margin: 5,
                        aspectRatio:1
                        
                    }}>
                        <Image
                            style={{
                                width: "100%",
                                height: "100%",
                                maxHeight:160,
                                borderRadius: 15
                            }}
                            source={item.image} 
                        />
                        <Text style={{
                            position:'absolute',
                            padding:15,
                            fontFamily:'outfit',
                            fontSize:15,
                            color:Colors.WHITE
                        }}>{item.name}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
        </View>
    )
}