import Ionicons from "@expo/vector-icons/Ionicons";
import { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/Colors";
import { UserDetailContext } from "../../context/UserContext";
export default function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 25,
            color:Colors.WHITE
          }}
        >
          Hello, {userDetail?.name}
        </Text>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 17,
            color:Colors.WHITE

          }}
        >
          Let&#39;s Get Started!
        </Text>
      </View>

      <TouchableOpacity>
        <Ionicons name="settings-outline" size={32} color="black" />
      </TouchableOpacity>
    </View>
  );
}
