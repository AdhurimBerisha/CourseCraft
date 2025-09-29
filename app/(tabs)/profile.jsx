import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../config/firebaseConfig";
import Colors from "../../constants/Colors";
import { UserDetailContext } from "../../context/UserContext";

export default function Profile() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    studyStreak: 0,
  });
  const router = useRouter();
  const width = Dimensions.get("screen").width;

  const getChaptersLength = (chapters) => {
    if (!chapters) return 0;
    if (Array.isArray(chapters)) return chapters.length;
    return Object.keys(chapters).length;
  };

  const fetchUserStats = async () => {
    if (!userDetail?.email) return;

    try {
      const q = query(
        collection(db, "Courses"),
        where("createdBy", "==", userDetail.email)
      );
      const querySnapshot = await getDocs(q);
      const courses = [];

      querySnapshot.forEach((doc) => {
        const courseData = {
          ...doc.data(),
          docId: doc.id,
        };
        courses.push(courseData);
      });

      const totalCourses = courses.length;
      const completedCourses = courses.filter((course) => {
        const completedCount = course.completedChapter?.length || 0;
        const totalCount = getChaptersLength(course.chapters);
        return completedCount === totalCount && totalCount > 0;
      }).length;

      const studyStreak = Math.min(completedCourses * 2, 30); // Simplified calculation

      setStats({
        totalCourses,
        completedCourses,
        studyStreak,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  useEffect(() => {
    if (userDetail?.email) {
      fetchUserStats();
    }
  }, [userDetail]);

  // Debug logging
  console.log("Profile - userDetail:", userDetail);
  console.log("Profile - stats:", stats);

  // Show loading if user data is not available yet
  if (!userDetail) {
    return (
      <View style={styles.container}>
        <Image
          source={require("./../../assets/images/wave.png")}
          style={styles.backgroundImage}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await signOut(auth);
            setUserDetail(null);
            router.replace("/");
          } catch (error) {
            console.error("Sign out error:", error);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const ProfileItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showArrow = true,
  }) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress}>
      <View style={styles.profileItemLeft}>
        <View style={styles.profileItemIcon}>
          <Ionicons name={icon} size={24} color={Colors.PRIMARY} />
        </View>
        <View style={styles.profileItemText}>
          <Text style={styles.profileItemTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.profileItemSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color={Colors.GRAY} />
      )}
    </TouchableOpacity>
  );

  const StatCard = ({ title, value, icon, color = Colors.PRIMARY }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image
        source={require("./../../assets/images/wave.png")}
        style={styles.backgroundImage}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
            <Text style={styles.headerSubtitle}>Manage your account</Text>
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color={Colors.WHITE} />
              </View>
              <View style={styles.avatarBadge}>
                <Ionicons name="checkmark" size={16} color={Colors.WHITE} />
              </View>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {userDetail?.name || "User"}
              </Text>
              <Text style={styles.profileEmail}>
                {userDetail?.email || "user@example.com"}
              </Text>
              <View style={styles.memberStatus}>
                <Ionicons
                  name={userDetail?.member ? "star" : "star-outline"}
                  size={16}
                  color={userDetail?.member ? "#FFD700" : Colors.GRAY}
                />
                <Text
                  style={[
                    styles.memberText,
                    { color: userDetail?.member ? "#FFD700" : Colors.GRAY },
                  ]}
                >
                  {userDetail?.member ? "Premium Member" : "Free Member"}
                </Text>
              </View>
            </View>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <StatCard
              title="Courses"
              value={stats.totalCourses.toString()}
              icon="book"
              color={Colors.PRIMARY}
            />
            <StatCard
              title="Completed"
              value={stats.completedCourses.toString()}
              icon="checkmark-circle"
              color={Colors.GREEN}
            />
            <StatCard
              title="Streak"
              value={stats.studyStreak.toString()}
              icon="flame"
              color="#FF6B35"
            />
          </View>

          {/* Profile Options */}
          <View style={styles.optionsContainer}>
            <Text style={styles.sectionTitle}>Account Actions</Text>

            <ProfileItem
              icon="log-out-outline"
              title="Sign Out"
              subtitle="Sign out of your account"
              onPress={handleSignOut}
              showArrow={false}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: 700,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 25,
    paddingTop: Platform.OS === "ios" ? 50 : 50,
  },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontFamily: "outfit-bold",
    fontSize: 32,
    color: Colors.WHITE,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.WHITE,
    opacity: 0.8,
  },
  profileCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    elevation: 3,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.GREEN,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.WHITE,
  },
  profileInfo: {
    alignItems: "center",
  },
  profileName: {
    fontFamily: "outfit-bold",
    fontSize: 24,
    color: Colors.BLACK,
    marginBottom: 5,
  },
  profileEmail: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.GRAY,
    marginBottom: 10,
  },
  memberStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.BG_GRAY,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  memberText: {
    fontFamily: "outfit-bold",
    fontSize: 12,
    marginLeft: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 5,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statContent: {
    alignItems: "center",
  },
  statValue: {
    fontFamily: "outfit-bold",
    fontSize: 24,
    color: Colors.BLACK,
    marginTop: 8,
    marginBottom: 4,
  },
  statTitle: {
    fontFamily: "outfit",
    fontSize: 12,
    color: Colors.GRAY,
  },
  optionsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: "outfit-bold",
    fontSize: 18,
    color: Colors.WHITE,
    marginTop: 20,
    marginBottom: 15,
    marginLeft: 5,
  },
  profileItem: {
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  profileItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.BG_GRAY,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  profileItemText: {
    flex: 1,
  },
  profileItemTitle: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    color: Colors.BLACK,
    marginBottom: 2,
  },
  profileItemSubtitle: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.GRAY,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.WHITE,
    marginTop: 10,
  },
});
