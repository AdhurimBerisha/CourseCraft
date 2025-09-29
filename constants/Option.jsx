export const PraticeOption = [
  {
    name: "Quiz",
    image: require("./../assets/images/quizz.png"),
    icon: require("./../assets/images/quiz.png"),
    path: "/quiz",
  },
  {
    name: "Flashcards",
    image: require("./../assets/images/flashcard.png"),
    icon: require("./../assets/images/layers.png"),
    path: "/flashcard",
  },
  {
    name: "Question & Ans",
    image: require("./../assets/images/notes.png"),
    icon: require("./../assets/images/qa.png"),
    path: "/questionAnswer",
  },
];

export const imageAssets = {
  "/banner1.png": require("./../assets/images/banner1.png"),
  "/banner2.png": require("./../assets/images/banner2.png"),
  "/banner3.png": require("./../assets/images/banner3.png"),
  "/banner4.png": require("./../assets/images/banner4.png"),
  "/banner5.png": require("./../assets/images/banner5.png"),
};

export const CourseCategory = [
  "Tech & Coding",
  "Business & Finance",
  "Health & Fitness",
  "Science & Engineering",
  "Arts & Creativity",
];

export const ProfileMenu = [
  {
    name: "Add Course",
    icon: "add-outline",
    path: "/addCourse",
  },
  {
    name: "My Course",
    icon: "book",
    path: "/(tabs)/home",
  },
  {
    name: "Course Progress",
    icon: "analytics-outline",
    path: "/(tabs)/progress",
  },
  {
    name: "My Subscription",
    icon: "shield-checkmark",
    path: "",
  },
  {
    name: "Logout",
    icon: "log-out",
    path: "/login",
  },
];
