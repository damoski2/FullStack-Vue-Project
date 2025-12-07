import { connectMongo, disconnectMongo } from "../config/mongo.js";
import Category from "../models/Category.js";
import Teacher from "../models/Teacher.js";
import Lesson from "../models/Lesson.js";
import User from "../models/User.js";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import bcrypt from "bcryptjs";

// Sample data extracted from frontend store
const categories = [
  {
    name: "Music",
    description: "Musical instruments and vocal training",
    icon: "🎵",
  },
  { name: "Math", description: "Mathematics and problem solving", icon: "🧮" },
  {
    name: "Science",
    description: "Science experiments and exploration",
    icon: "🔬",
  },
  {
    name: "Sports",
    description: "Physical activities and team sports",
    icon: "⚽",
  },
  { name: "Art", description: "Creative arts and crafts", icon: "🎨" },
  { name: "Technology", description: "Coding and digital skills", icon: "💻" },
  {
    name: "Language",
    description: "Language learning and communication",
    icon: "🗣️",
  },
  { name: "Dance", description: "Dance styles and movement", icon: "💃" },
];

// Teacher data with user info
const teachersData = [
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@afterschoolhub.com",
    title: "Concert Pianist",
    avatar: "https://i.pravatar.cc/150?img=5",
    bio: "Professional pianist with 15 years of teaching experience. Graduated from Juilliard School of Music.",
    credentials: "Master of Music, Juilliard School",
    experience_years: 15,
    rating: 4.9,
    total_reviews: 127,
  },
  {
    name: "Dr. Michael Chen",
    email: "michael.chen@afterschoolhub.com",
    title: "PhD Mathematics",
    avatar: "https://i.pravatar.cc/150?img=12",
    bio: "Mathematics professor specializing in problem-solving techniques and competition preparation.",
    credentials: "PhD Mathematics, MIT",
    experience_years: 12,
    rating: 4.8,
    total_reviews: 203,
  },
  {
    name: "Emma Rodriguez",
    email: "emma.rodriguez@afterschoolhub.com",
    title: "Professional Artist",
    avatar: "https://i.pravatar.cc/150?img=9",
    bio: "Professional artist and art educator with exhibitions in major galleries.",
    credentials: "MFA Fine Arts, Art Institute of Chicago",
    experience_years: 10,
    rating: 4.7,
    total_reviews: 89,
  },
  {
    name: "Coach David Martinez",
    email: "david.martinez@afterschoolhub.com",
    title: "UEFA Licensed Coach",
    avatar: "https://i.pravatar.cc/150?img=14",
    bio: "Professional soccer coach with UEFA coaching license and 20 years of experience.",
    credentials: "UEFA Pro License, FIFA Certified",
    experience_years: 20,
    rating: 4.9,
    total_reviews: 156,
  },
  {
    name: "Isabella Garcia",
    email: "isabella.garcia@afterschoolhub.com",
    title: "Native Speaker & Educator",
    avatar: "https://i.pravatar.cc/150?img=20",
    bio: "Native Spanish speaker with extensive experience in language education for children.",
    credentials: "MA Spanish Literature, Universidad de Madrid",
    experience_years: 8,
    rating: 4.8,
    total_reviews: 94,
  },
  {
    name: "Dr. Amanda White",
    email: "amanda.white@afterschoolhub.com",
    title: "PhD Chemistry",
    avatar: "https://i.pravatar.cc/150?img=16",
    bio: "Chemistry professor passionate about making science fun and accessible for young learners.",
    credentials: "PhD Chemistry, Stanford University",
    experience_years: 14,
    rating: 4.9,
    total_reviews: 178,
  },
  {
    name: "Alex Thompson",
    email: "alex.thompson@afterschoolhub.com",
    title: "Software Engineer",
    avatar: "https://i.pravatar.cc/150?img=33",
    bio: "Software engineer at Google with passion for teaching coding to the next generation.",
    credentials: "MS Computer Science, Carnegie Mellon",
    experience_years: 8,
    rating: 5.0,
    total_reviews: 142,
  },
  {
    name: "Sophia Anderson",
    email: "sophia.anderson@afterschoolhub.com",
    title: "Professional Dancer",
    avatar: "https://i.pravatar.cc/150?img=23",
    bio: "Professional dancer with Broadway experience and extensive teaching background.",
    credentials: "BFA Dance, NYU Tisch School",
    experience_years: 12,
    rating: 4.8,
    total_reviews: 116,
  },
  {
    name: "Jake Morrison",
    email: "jake.morrison@afterschoolhub.com",
    title: "Professional Guitarist",
    avatar: "https://i.pravatar.cc/150?img=52",
    bio: "Professional guitarist and music producer with touring experience.",
    credentials: "BM Music Performance, Berklee College",
    experience_years: 10,
    rating: 4.7,
    total_reviews: 98,
  },
  {
    name: "Rachel Brooks",
    email: "rachel.brooks@afterschoolhub.com",
    title: "Published Author",
    avatar: "https://i.pravatar.cc/150?img=26",
    bio: "Published children's book author and creative writing instructor.",
    credentials: "MFA Creative Writing, Iowa Writers' Workshop",
    experience_years: 9,
    rating: 4.9,
    total_reviews: 87,
  },
  {
    name: "Dr. Kevin Park",
    email: "kevin.park@afterschoolhub.com",
    title: "Robotics Engineer",
    avatar: "https://i.pravatar.cc/150?img=60",
    bio: "Robotics engineer and STEM educator with expertise in hands-on learning.",
    credentials: "PhD Robotics Engineering, MIT",
    experience_years: 11,
    rating: 5.0,
    total_reviews: 134,
  },
  {
    name: "Coach Maria Santos",
    email: "maria.santos@afterschoolhub.com",
    title: "Professional Tennis Coach",
    avatar: "https://i.pravatar.cc/150?img=47",
    bio: "Professional tennis coach with ATP certification and competitive experience.",
    credentials: "ATP Certified Coach, USPTA Professional",
    experience_years: 16,
    rating: 4.8,
    total_reviews: 121,
  },
];

// Lessons data
const lessonsData = [
  {
    title: "Piano Lessons for Beginners",
    category: "Music",
    teacherName: "Sarah Johnson",
    price: 45,
    price_unit: "hour",
    rating: 4.9,
    reviews: 127,
    duration: "1 hour",
    schedule: "Mon & Wed, 4:00 PM",
    age_group: "8-16",
    students_enrolled: 34,
    max_students: 20,
    description:
      "Learn piano from scratch with fun, engaging lessons tailored to your pace. Perfect for beginners who want to develop strong fundamentals.",
    image:
      "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500&q=80",
    features: [
      "Individual attention",
      "Music theory basics",
      "Performance skills",
      "Practice materials included",
    ],
    featured: true,
    available: true,
  },
  {
    title: "Advanced Math & Problem Solving",
    category: "Math",
    teacherName: "Dr. Michael Chen",
    price: 55,
    price_unit: "hour",
    rating: 4.8,
    reviews: 203,
    duration: "1.5 hours",
    schedule: "Tue & Thu, 5:00 PM",
    age_group: "11-16",
    students_enrolled: 56,
    max_students: 15,
    description:
      "Boost your math skills with challenging problems and advanced concepts. Prepare for competitions and excel in school mathematics.",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&q=80",
    features: [
      "Competition preparation",
      "Advanced problem solving",
      "Small group sessions",
      "Weekly homework support",
    ],
    featured: false,
    available: true,
  },
  {
    title: "Creative Art & Drawing",
    category: "Art",
    teacherName: "Emma Rodriguez",
    price: 40,
    price_unit: "session",
    rating: 4.7,
    reviews: 89,
    duration: "2 hours",
    schedule: "Saturdays, 10:00 AM",
    age_group: "5-13",
    students_enrolled: 28,
    max_students: 12,
    description:
      "Unleash your creativity with various art techniques including drawing, painting, and mixed media. All materials provided!",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80",
    features: [
      "All materials included",
      "Various art techniques",
      "Portfolio development",
      "Art history exploration",
    ],
    featured: true,
    available: true,
  },
  {
    title: "Soccer Skills Academy",
    category: "Sports",
    teacherName: "Coach David Martinez",
    price: 35,
    price_unit: "session",
    rating: 4.9,
    reviews: 156,
    duration: "1.5 hours",
    schedule: "Mon, Wed & Fri, 4:30 PM",
    age_group: "7-14",
    students_enrolled: 67,
    max_students: 25,
    description:
      "Develop soccer skills, teamwork, and fitness in a fun and supportive environment. All skill levels welcome!",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&q=80",
    features: [
      "Professional coaching",
      "Team building activities",
      "Match preparation",
      "Fitness training",
    ],
    featured: false,
    available: true,
  },
  {
    title: "Spanish for Kids",
    category: "Language",
    teacherName: "Isabella Garcia",
    price: 38,
    price_unit: "hour",
    rating: 4.8,
    reviews: 94,
    duration: "1 hour",
    schedule: "Tue & Thu, 4:00 PM",
    age_group: "5-12",
    students_enrolled: 42,
    max_students: 15,
    description:
      "Learn Spanish through games, songs, and interactive activities. Build confidence in speaking and understanding Spanish!",
    image:
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500&q=80",
    features: [
      "Interactive learning",
      "Cultural activities",
      "Conversational practice",
      "Fun learning games",
    ],
    featured: false,
    available: true,
  },
  {
    title: "Science Explorers Lab",
    category: "Science",
    teacherName: "Dr. Amanda White",
    price: 50,
    price_unit: "session",
    rating: 4.9,
    reviews: 178,
    duration: "2 hours",
    schedule: "Fridays, 4:00 PM",
    age_group: "8-14",
    students_enrolled: 51,
    max_students: 16,
    description:
      "Hands-on science experiments exploring physics, chemistry, and biology. Spark curiosity and love for science!",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&q=80",
    features: [
      "Hands-on experiments",
      "Safety equipment provided",
      "Science fair preparation",
      "Lab report writing",
    ],
    featured: true,
    available: true,
  },
  {
    title: "Coding & Game Development",
    category: "Technology",
    teacherName: "Alex Thompson",
    price: 60,
    price_unit: "hour",
    rating: 5.0,
    reviews: 142,
    duration: "1.5 hours",
    schedule: "Wed & Sat, 3:00 PM",
    age_group: "10-17",
    students_enrolled: 73,
    max_students: 12,
    description:
      "Learn to code and create your own games using Python and Scratch. Perfect for future programmers and game designers!",
    image:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&q=80",
    features: [
      "Python & Scratch",
      "Game design fundamentals",
      "Portfolio projects",
      "Computer science concepts",
    ],
    featured: false,
    available: true,
  },
  {
    title: "Ballet & Contemporary Dance",
    category: "Dance",
    teacherName: "Sophia Anderson",
    price: 42,
    price_unit: "session",
    rating: 4.8,
    reviews: 116,
    duration: "1.5 hours",
    schedule: "Mon & Wed, 5:30 PM",
    age_group: "6-14",
    students_enrolled: 39,
    max_students: 18,
    description:
      "Develop grace, strength, and expression through classical ballet and contemporary dance techniques.",
    image:
      "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=500&q=80",
    features: [
      "Classical technique",
      "Performance opportunities",
      "Flexibility training",
      "Recital preparation",
    ],
    featured: false,
    available: true,
  },
  {
    title: "Guitar Masterclass",
    category: "Music",
    teacherName: "Jake Morrison",
    price: 48,
    price_unit: "hour",
    rating: 4.7,
    reviews: 98,
    duration: "1 hour",
    schedule: "Tue & Thu, 6:00 PM",
    age_group: "10-17",
    students_enrolled: 45,
    max_students: 15,
    description:
      "Master the guitar with lessons in rock, blues, and classical styles. Learn chords, solos, and songwriting!",
    image:
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&q=80",
    features: [
      "Multiple music styles",
      "Songwriting basics",
      "Music reading",
      "Performance techniques",
    ],
    featured: false,
    available: true,
  },
  {
    title: "Creative Writing Workshop",
    category: "Language",
    teacherName: "Rachel Brooks",
    price: 44,
    price_unit: "session",
    rating: 4.9,
    reviews: 87,
    duration: "2 hours",
    schedule: "Saturdays, 2:00 PM",
    age_group: "11-16",
    students_enrolled: 31,
    max_students: 12,
    description:
      "Develop storytelling skills, creative expression, and writing techniques. Perfect for aspiring young authors!",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&q=80",
    features: [
      "Story development",
      "Character building",
      "Publishing guidance",
      "Peer feedback sessions",
    ],
    featured: false,
    available: true,
  },
  {
    title: "Robotics & Engineering",
    category: "Technology",
    teacherName: "Dr. Kevin Park",
    price: 65,
    price_unit: "session",
    rating: 5.0,
    reviews: 134,
    duration: "2 hours",
    schedule: "Thursdays, 4:00 PM",
    age_group: "12-17",
    students_enrolled: 48,
    max_students: 14,
    description:
      "Build and program robots! Learn engineering principles, coding, and problem-solving with hands-on projects.",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&q=80",
    features: [
      "Robot building",
      "Programming basics",
      "Competition prep",
      "Engineering concepts",
    ],
    featured: true,
    available: true,
  },
  {
    title: "Tennis Academy",
    category: "Sports",
    teacherName: "Coach Maria Santos",
    price: 52,
    price_unit: "hour",
    rating: 4.8,
    reviews: 121,
    duration: "1 hour",
    schedule: "Mon, Wed & Fri, 5:00 PM",
    age_group: "8-16",
    students_enrolled: 58,
    max_students: 20,
    description:
      "Improve your tennis game with professional coaching. Learn technique, strategy, and sportsmanship!",
    image:
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500&q=80",
    features: [
      "Professional coaching",
      "Match strategy",
      "Fitness conditioning",
      "Tournament preparation",
    ],
    featured: false,
    available: true,
  },
];

// Sample parent users
const parentUsers = [
  {
    name: "John Smith",
    email: "john@example.com",
    password: "password123",
    role: "parent",
    phone: "+1-555-0123",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
  },
  {
    name: "Sarah Carlson",
    email: "sarah@example.com",
    password: "password123",
    role: "parent",
    phone: "+1-555-0124",
    address: "456 Oak Ave",
    city: "Los Angeles",
    state: "CA",
    zip: "90210",
  },
  {
    name: "Mike Chen",
    email: "mike@example.com",
    password: "password123",
    role: "parent",
    phone: "+1-555-0125",
    address: "789 Pine St",
    city: "Chicago",
    state: "IL",
    zip: "60601",
  },
  {
    name: "Admin User",
    email: "admin@afterschoolhub.com",
    password: "admin123",
    role: "admin",
    phone: "+1-555-0000",
    address: "100 Admin Blvd",
    city: "San Francisco",
    state: "CA",
    zip: "94102",
  },
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting MongoDB database seeding...");

    // Connect to MongoDB
    await connectMongo();

    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await Review.deleteMany({});
    await Order.deleteMany({});
    await Lesson.deleteMany({});
    await Teacher.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});

    // Insert categories
    console.log("📚 Inserting categories...");
    const categoryMap = {};
    for (const categoryData of categories) {
      const category = await Category.create(categoryData);
      categoryMap[categoryData.name] = category._id;
      console.log(`  ✓ Created category: ${category.name}`);
    }

    // Create teacher users and teacher profiles
    console.log("👨‍🏫 Creating teacher users and profiles...");
    const teacherMap = {};
    const hashedPassword = await bcrypt.hash("teacher123", 12);

    for (const teacherData of teachersData) {
      // Create user account for teacher
      const teacherUser = await User.create({
        name: teacherData.name,
        email: teacherData.email,
        password: hashedPassword,
        role: "teacher",
      });

      // Create teacher profile
      const teacher = await Teacher.create({
        user_id: teacherUser._id,
        name: teacherData.name,
        title: teacherData.title,
        avatar: teacherData.avatar,
        bio: teacherData.bio,
        credentials: teacherData.credentials,
        experience_years: teacherData.experience_years,
        rating: teacherData.rating,
        total_reviews: teacherData.total_reviews,
      });

      teacherMap[teacherData.name] = {
        teacherId: teacher._id,
        userId: teacherUser._id,
      };
      console.log(`  ✓ Created teacher: ${teacherData.name}`);
    }

    // Create parent users
    console.log("👥 Creating parent users...");
    const parentUserMap = {};
    for (const userData of parentUsers) {
      const hashedPwd = await bcrypt.hash(userData.password, 12);
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPwd,
        role: userData.role,
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        zip: userData.zip,
      });
      parentUserMap[userData.email] = user._id;
      console.log(`  ✓ Created user: ${userData.name} (${userData.role})`);
    }

    // Insert lessons
    console.log("📖 Inserting lessons...");
    const lessonMap = {};
    for (const lessonData of lessonsData) {
      const categoryId = categoryMap[lessonData.category];
      const teacherInfo = teacherMap[lessonData.teacherName];

      if (!categoryId || !teacherInfo) {
        console.error(
          `  ✗ Skipping lesson "${lessonData.title}" - missing category or teacher`
        );
        continue;
      }

      const lesson = await Lesson.create({
        title: lessonData.title,
        category_id: categoryId,
        teacher_id: teacherInfo.teacherId,
        price: lessonData.price,
        price_unit: lessonData.price_unit,
        rating: lessonData.rating,
        reviews: lessonData.reviews,
        duration: lessonData.duration,
        schedule: lessonData.schedule,
        age_group: lessonData.age_group,
        students_enrolled: lessonData.students_enrolled,
        max_students: lessonData.max_students,
        description: lessonData.description,
        image: lessonData.image,
        features: lessonData.features,
        featured: lessonData.featured,
        available: lessonData.available,
      });

      lessonMap[lessonData.title] = lesson._id;
      console.log(`  ✓ Created lesson: ${lessonData.title}`);
    }

    // Create sample reviews
    console.log("⭐ Creating sample reviews...");
    const reviewComments = [
      "Excellent teacher! My child loves these lessons.",
      "Very professional and patient. Highly recommend!",
      "Great learning experience. Worth every penny.",
      "Amazing instructor with lots of experience.",
      "My child has improved so much!",
      "Well-structured lessons and engaging content.",
      "Perfect for beginners. Very supportive environment.",
      "Outstanding quality. Exceeded expectations.",
    ];

    const lessonIds = Object.values(lessonMap);
    const parentUserIds = Object.values(parentUserMap);

    for (let i = 0; i < 30; i++) {
      const randomLessonId =
        lessonIds[Math.floor(Math.random() * lessonIds.length)];
      const randomUserId =
        parentUserIds[Math.floor(Math.random() * parentUserIds.length)];
      const randomRating = Math.floor(Math.random() * 2) + 4; // 4 or 5
      const randomComment =
        reviewComments[Math.floor(Math.random() * reviewComments.length)];

      try {
        await Review.create({
          user_id: randomUserId,
          lesson_id: randomLessonId,
          rating: randomRating,
          comment: randomComment,
        });
      } catch (error) {
        // Skip if duplicate (one review per user per lesson)
        if (error.code !== 11000) {
          console.error(`  ✗ Error creating review: ${error.message}`);
        }
      }
    }
    console.log(`  ✓ Created sample reviews`);

    // Create sample enrollments
    console.log("📝 Creating sample enrollments...");
    const studentNames = [
      "Emma",
      "Liam",
      "Olivia",
      "Noah",
      "Ava",
      "Ethan",
      "Sophia",
      "Mason",
      "Isabella",
      "James",
    ];

    for (let i = 0; i < 20; i++) {
      const randomLessonId =
        lessonIds[Math.floor(Math.random() * lessonIds.length)];
      const randomUserId =
        parentUserIds[Math.floor(Math.random() * parentUserIds.length)];
      const randomStudentName =
        studentNames[Math.floor(Math.random() * studentNames.length)];
      const randomAge = Math.floor(Math.random() * 10) + 8; // 8-17
      const randomGrade = ["3rd", "4th", "5th", "6th", "7th", "8th"][
        Math.floor(Math.random() * 6)
      ];

      // Get lesson to calculate total amount
      const lesson = await Lesson.findById(randomLessonId);
      if (!lesson) continue;

      const totalAmount = lesson.price * (Math.floor(Math.random() * 3) + 1); // 1-3 sessions

      await Order.create({
        user_id: randomUserId,
        lesson_id: randomLessonId,
        student_name: randomStudentName,
        student_age: randomAge,
        student_grade: randomGrade,
        quantity: 1,
        total_amount: totalAmount,
        status: ["pending", "confirmed", "confirmed", "confirmed"][
          Math.floor(Math.random() * 4)
        ],
        payment_status: ["pending", "paid", "paid", "paid"][
          Math.floor(Math.random() * 4)
        ],
        payment_method: ["card", "paypal", "card"][
          Math.floor(Math.random() * 3)
        ],
      });
    }
    console.log(`  ✓ Created sample enrollments`);

    console.log("\n✅ Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`- ${categories.length} categories`);
    console.log(`- ${teachersData.length} teachers (with user accounts)`);
    console.log(`- ${lessonsData.length} lessons`);
    console.log(`- ${parentUsers.length} parent/admin users`);
    console.log(`- ~30 sample reviews`);
    console.log(`- ~20 sample enrollments`);

    console.log("\n🔑 Test Accounts:");
    console.log("Parent: john@example.com / password123");
    console.log("Parent: sarah@example.com / password123");
    console.log("Admin: admin@afterschoolhub.com / admin123");
    console.log("Teachers: [teacher-email]@afterschoolhub.com / teacher123");

    await disconnectMongo();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    await disconnectMongo();
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
