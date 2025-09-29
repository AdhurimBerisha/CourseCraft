import { useRouter } from 'expo-router'
import React from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import Colors from '../../constants/Colors'
import { PraticeOption } from '../../constants/Option'

export default function PracticeSection() {
    const router = useRouter()
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
                    <TouchableOpacity onPress={()=>router.push('/practice/' + item.name)} key={index} style={{
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
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
        </View>
    )
}