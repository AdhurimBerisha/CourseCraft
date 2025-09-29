import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Bar } from "react-native-progress";
import CourseProgressCard from "../../components/shared/CourseProgressCard";
import { db } from "../../config/firebaseConfig";
import Colors from "../../constants/Colors";
import { UserDetailContext } from "../../context/UserContext";

export default function Progress() {
  const { userDetail } = useContext(UserDetailContext);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalChapters: 0,
    completedChapters: 0,
    totalQuizzes: 0,
    completedQuizzes: 0,
    studyStreak: 0,
  });
  const [filter, setFilter] = useState("all");
  const width = Dimensions.get("screen").width;

  const GetCourseList = async () => {
    if (!userDetail?.email) return;

    setLoading(true);
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

      setCourseList(courses);
      calculateStats(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (courses) => {
    const totalCourses = courses.length;
    const completedCourses = courses.filter(
      (course) => course.completedChapter?.length === course.chapters?.length
    ).length;

    const totalChapters = courses.reduce(
      (sum, course) => sum + (course.chapters?.length || 0),
      0
    );

    const completedChapters = courses.reduce(
      (sum, course) => sum + (course.completedChapter?.length || 0),
      0
    );

    const totalQuizzes = courses.reduce(
      (sum, course) => sum + (course.quiz?.length || 0),
      0
    );

    const completedQuizzes = courses.reduce(
      (sum, course) => sum + (course.completedQuiz?.length || 0),
      0
    );

    const studyStreak = Math.min(completedCourses * 2, 30);

    setStats({
      totalCourses,
      completedCourses,
      totalChapters,
      completedChapters,
      totalQuizzes,
      completedQuizzes,
      studyStreak,
    });
  };

  useEffect(() => {
    if (userDetail?.email) {
      GetCourseList();
    }
  }, [userDetail]);

  useFocusEffect(
    useCallback(() => {
      if (userDetail?.email) {
        GetCourseList();
      }
    }, [userDetail])
  );

  const getFilteredCourses = () => {
    switch (filter) {
      case "completed":
        return courseList.filter(
          (course) =>
            course.completedChapter?.length === course.chapters?.length
        );
      case "in-progress":
        return courseList.filter(
          (course) =>
            course.completedChapter?.length > 0 &&
            course.completedChapter?.length < course.chapters?.length
        );
      default:
        return courseList;
    }
  };

  const getOverallProgress = () => {
    if (stats.totalChapters === 0) return 0;
    return stats.completedChapters / stats.totalChapters;
  };

  const StatCard = ({ title, value, total, color = Colors.PRIMARY, icon }) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {total && <Text style={styles.statTotal}>of {total}</Text>}
    </View>
  );

  const FilterButton = ({ label, value, isActive }) => (
    <TouchableOpacity
      style={[styles.filterButton, isActive && styles.activeFilterButton]}
      onPress={() => setFilter(value)}
    >
      <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Image
          source={require("./../../assets/images/wave.png")}
          style={styles.backgroundImage}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
          <Text style={styles.loadingText}>Loading your progress...</Text>
        </View>
      </View>
    );
  }

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
            <Text style={styles.headerTitle}>Your Progress</Text>
            <Text style={styles.headerSubtitle}>
              Track your learning journey
            </Text>
          </View>

          {/* Overall Progress */}
          <View style={styles.overallProgressCard}>
            <Text style={styles.overallProgressTitle}>Overall Progress</Text>
            <View style={styles.progressBarContainer}>
              <Bar
                progress={getOverallProgress()}
                width={width - 80}
                color={Colors.PRIMARY}
                height={12}
                borderRadius={6}
              />
              <Text style={styles.progressPercentage}>
                {Math.round(getOverallProgress() * 100)}%
              </Text>
            </View>
            <Text style={styles.progressDescription}>
              {stats.completedChapters} of {stats.totalChapters} chapters
              completed
            </Text>
          </View>

          {/* Statistics Grid */}
          <View style={styles.statsGrid}>
            <StatCard
              title="Courses"
              value={stats.completedCourses}
              total={stats.totalCourses}
              icon="book"
              color={Colors.PRIMARY}
            />
            <StatCard
              title="Chapters"
              value={stats.completedChapters}
              total={stats.totalChapters}
              icon="list"
              color={Colors.GREEN}
            />
            <StatCard
              title="Quizzes"
              value={stats.completedQuizzes}
              total={stats.totalQuizzes}
              icon="help-circle"
              color={Colors.RED}
            />
            <StatCard
              title="Study Streak"
              value={stats.studyStreak}
              total={30}
              icon="flame"
              color="#FF6B35"
            />
          </View>

          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            <FilterButton label="All" value="all" isActive={filter === "all"} />
            <FilterButton
              label="In Progress"
              value="in-progress"
              isActive={filter === "in-progress"}
            />
            <FilterButton
              label="Completed"
              value="completed"
              isActive={filter === "completed"}
            />
          </View>

          {/* Course Progress List */}
          <View style={styles.courseSection}>
            <Text style={styles.sectionTitle}>
              {filter === "all"
                ? "All Courses"
                : filter === "completed"
                ? "Completed Courses"
                : "In Progress"}
            </Text>

            {getFilteredCourses().length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="book-outline" size={60} color={Colors.GRAY} />
                <Text style={styles.emptyTitle}>No courses found</Text>
                <Text style={styles.emptyDescription}>
                  {filter === "completed"
                    ? "Complete some courses to see them here"
                    : filter === "in-progress"
                    ? "Start a course to see your progress"
                    : "Create or enroll in courses to track your progress"}
                </Text>
              </View>
            ) : (
              <FlatList
                data={getFilteredCourses()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <View key={index} style={styles.courseCardContainer}>
                    <CourseProgressCard course={item} item={item} />
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.courseList}
              />
            )}
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
  header: {
    marginBottom: 25,
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
  overallProgressCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    elevation: 3,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  overallProgressTitle: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    color: Colors.BLACK,
    marginBottom: 15,
  },
  progressBarContainer: {
    marginBottom: 10,
  },
  progressPercentage: {
    fontFamily: "outfit-bold",
    fontSize: 18,
    color: Colors.PRIMARY,
    textAlign: "right",
    marginTop: 5,
  },
  progressDescription: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.GRAY,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    padding: 20,
    width: "48%",
    marginBottom: 15,
    elevation: 2,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statTitle: {
    fontFamily: "outfit-bold",
    fontSize: 14,
    color: Colors.BLACK,
    marginLeft: 8,
  },
  statValue: {
    fontFamily: "outfit-bold",
    fontSize: 24,
    color: Colors.BLACK,
    marginBottom: 2,
  },
  statTotal: {
    fontFamily: "outfit",
    fontSize: 12,
    color: Colors.GRAY,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 25,
    backgroundColor: Colors.BG_GRAY,
    borderRadius: 15,
    padding: 5,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  activeFilterButton: {
    backgroundColor: Colors.PRIMARY,
  },
  filterText: {
    fontFamily: "outfit-bold",
    fontSize: 14,
    color: Colors.GRAY,
  },
  activeFilterText: {
    color: Colors.WHITE,
  },
  courseSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    color: Colors.WHITE,
    marginBottom: 15,
  },
  courseCardContainer: {
    marginRight: 15,
  },
  courseList: {
    paddingRight: 15,
  },
  emptyState: {
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    elevation: 2,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emptyTitle: {
    fontFamily: "outfit-bold",
    fontSize: 18,
    color: Colors.BLACK,
    marginTop: 15,
    marginBottom: 8,
  },
  emptyDescription: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.GRAY,
    textAlign: "center",
    lineHeight: 20,
  },
});
