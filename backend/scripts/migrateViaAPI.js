/**
 * API Migration Script
 *
 * This script migrates static data from the frontend store to the database
 * by making HTTP requests to the API endpoints. This ensures all data goes
 * through proper validation and business logic.
 */

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080/api";

// Static data from frontend store
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

const teachersData = [
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@afterschoolhub.com",
    password: "teacher123",
    title: "Concert Pianist",
    avatar: "https://i.pravatar.cc/150?img=5",
    bio: "Professional pianist with 15 years of teaching experience. Graduated from Juilliard School of Music.",
    credentials: "Master of Music, Juilliard School",
    experience_years: 15,
  },
  {
    name: "Dr. Michael Chen",
    email: "michael.chen@afterschoolhub.com",
    password: "teacher123",
    title: "PhD Mathematics",
    avatar: "https://i.pravatar.cc/150?img=12",
    bio: "Mathematics professor specializing in problem-solving techniques and competition preparation.",
    credentials: "PhD Mathematics, MIT",
    experience_years: 12,
  },
  {
    name: "Emma Rodriguez",
    email: "emma.rodriguez@afterschoolhub.com",
    password: "teacher123",
    title: "Professional Artist",
    avatar: "https://i.pravatar.cc/150?img=9",
    bio: "Professional artist and art educator with exhibitions in major galleries.",
    credentials: "MFA Fine Arts, Art Institute of Chicago",
    experience_years: 10,
  },
  {
    name: "Coach David Martinez",
    email: "david.martinez@afterschoolhub.com",
    password: "teacher123",
    title: "UEFA Licensed Coach",
    avatar: "https://i.pravatar.cc/150?img=14",
    bio: "Professional soccer coach with UEFA coaching license and 20 years of experience.",
    credentials: "UEFA Pro License, FIFA Certified",
    experience_years: 20,
  },
  {
    name: "Isabella Garcia",
    email: "isabella.garcia@afterschoolhub.com",
    password: "teacher123",
    title: "Native Speaker & Educator",
    avatar: "https://i.pravatar.cc/150?img=20",
    bio: "Native Spanish speaker with extensive experience in language education for children.",
    credentials: "MA Spanish Literature, Universidad de Madrid",
    experience_years: 8,
  },
  {
    name: "Dr. Amanda White",
    email: "amanda.white@afterschoolhub.com",
    password: "teacher123",
    title: "PhD Chemistry",
    avatar: "https://i.pravatar.cc/150?img=16",
    bio: "Chemistry professor passionate about making science fun and accessible for young learners.",
    credentials: "PhD Chemistry, Stanford University",
    experience_years: 14,
  },
  {
    name: "Alex Thompson",
    email: "alex.thompson@afterschoolhub.com",
    password: "teacher123",
    title: "Software Engineer",
    avatar: "https://i.pravatar.cc/150?img=33",
    bio: "Software engineer at Google with passion for teaching coding to the next generation.",
    credentials: "MS Computer Science, Carnegie Mellon",
    experience_years: 8,
  },
  {
    name: "Sophia Anderson",
    email: "sophia.anderson@afterschoolhub.com",
    password: "teacher123",
    title: "Professional Dancer",
    avatar: "https://i.pravatar.cc/150?img=23",
    bio: "Professional dancer with Broadway experience and extensive teaching background.",
    credentials: "BFA Dance, NYU Tisch School",
    experience_years: 12,
  },
  {
    name: "Jake Morrison",
    email: "jake.morrison@afterschoolhub.com",
    password: "teacher123",
    title: "Professional Guitarist",
    avatar: "https://i.pravatar.cc/150?img=52",
    bio: "Professional guitarist and music producer with touring experience.",
    credentials: "BM Music Performance, Berklee College",
    experience_years: 10,
  },
  {
    name: "Rachel Brooks",
    email: "rachel.brooks@afterschoolhub.com",
    password: "teacher123",
    title: "Published Author",
    avatar: "https://i.pravatar.cc/150?img=26",
    bio: "Published children's book author and creative writing instructor.",
    credentials: "MFA Creative Writing, Iowa Writers' Workshop",
    experience_years: 9,
  },
  {
    name: "Dr. Kevin Park",
    email: "kevin.park@afterschoolhub.com",
    password: "teacher123",
    title: "Robotics Engineer",
    avatar: "https://i.pravatar.cc/150?img=60",
    bio: "Robotics engineer and STEM educator with expertise in hands-on learning.",
    credentials: "PhD Robotics Engineering, MIT",
    experience_years: 11,
  },
  {
    name: "Coach Maria Santos",
    email: "maria.santos@afterschoolhub.com",
    password: "teacher123",
    title: "Professional Tennis Coach",
    avatar: "https://i.pravatar.cc/150?img=47",
    bio: "Professional tennis coach with ATP certification and competitive experience.",
    credentials: "ATP Certified Coach, USPTA Professional",
    experience_years: 16,
  },
];

const lessonsData = [
  {
    title: "Piano Lessons for Beginners",
    category: "Music",
    teacherName: "Sarah Johnson",
    price: 45,
    price_unit: "hour",
    duration: "1 hour",
    schedule: "Mon & Wed, 4:00 PM",
    age_group: "8-16",
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
  },
  {
    title: "Advanced Math & Problem Solving",
    category: "Math",
    teacherName: "Dr. Michael Chen",
    price: 55,
    price_unit: "hour",
    duration: "1.5 hours",
    schedule: "Tue & Thu, 5:00 PM",
    age_group: "11-16",
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
  },
  {
    title: "Creative Art & Drawing",
    category: "Art",
    teacherName: "Emma Rodriguez",
    price: 40,
    price_unit: "session",
    duration: "2 hours",
    schedule: "Saturdays, 10:00 AM",
    age_group: "5-13",
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
  },
  {
    title: "Soccer Skills Academy",
    category: "Sports",
    teacherName: "Coach David Martinez",
    price: 35,
    price_unit: "session",
    duration: "1.5 hours",
    schedule: "Mon, Wed & Fri, 4:30 PM",
    age_group: "7-14",
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
  },
  {
    title: "Spanish for Kids",
    category: "Language",
    teacherName: "Isabella Garcia",
    price: 38,
    price_unit: "hour",
    duration: "1 hour",
    schedule: "Tue & Thu, 4:00 PM",
    age_group: "5-12",
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
  },
  {
    title: "Science Explorers Lab",
    category: "Science",
    teacherName: "Dr. Amanda White",
    price: 50,
    price_unit: "session",
    duration: "2 hours",
    schedule: "Fridays, 4:00 PM",
    age_group: "8-14",
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
  },
  {
    title: "Coding & Game Development",
    category: "Technology",
    teacherName: "Alex Thompson",
    price: 60,
    price_unit: "hour",
    duration: "1.5 hours",
    schedule: "Wed & Sat, 3:00 PM",
    age_group: "10-17",
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
  },
  {
    title: "Ballet & Contemporary Dance",
    category: "Dance",
    teacherName: "Sophia Anderson",
    price: 42,
    price_unit: "session",
    duration: "1.5 hours",
    schedule: "Mon & Wed, 5:30 PM",
    age_group: "6-14",
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
  },
  {
    title: "Guitar Masterclass",
    category: "Music",
    teacherName: "Jake Morrison",
    price: 48,
    price_unit: "hour",
    duration: "1 hour",
    schedule: "Tue & Thu, 6:00 PM",
    age_group: "10-17",
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
  },
  {
    title: "Creative Writing Workshop",
    category: "Language",
    teacherName: "Rachel Brooks",
    price: 44,
    price_unit: "session",
    duration: "2 hours",
    schedule: "Saturdays, 2:00 PM",
    age_group: "11-16",
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
  },
  {
    title: "Robotics & Engineering",
    category: "Technology",
    teacherName: "Dr. Kevin Park",
    price: 65,
    price_unit: "session",
    duration: "2 hours",
    schedule: "Thursdays, 4:00 PM",
    age_group: "12-17",
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
  },
  {
    title: "Tennis Academy",
    category: "Sports",
    teacherName: "Coach Maria Santos",
    price: 52,
    price_unit: "hour",
    duration: "1 hour",
    schedule: "Mon, Wed & Fri, 5:00 PM",
    age_group: "8-16",
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
  },
];

const parentUsers = [
  {
    name: "John Smith",
    email: "john@example.com",
    password: "password123",
    role: "parent",
  },
  {
    name: "Sarah Carlson",
    email: "sarah@example.com",
    password: "password123",
    role: "parent",
  },
  {
    name: "Mike Chen",
    email: "mike@example.com",
    password: "password123",
    role: "parent",
  },
];

// Helper function to make API requests
async function apiRequest(endpoint, method = "GET", body = null, token = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    let data;
    try {
      data = await response.json();
    } catch (e) {
      // If response is not JSON, return text
      const text = await response.text();
      return {
        response,
        data: { message: text || "Invalid response" },
        ok: response.ok,
        error: "Response is not JSON",
      };
    }
    return { response, data, ok: response.ok };
  } catch (error) {
    return {
      error: error.message,
      ok: false,
      data: { message: error.message },
    };
  }
}

// Check if server is running
async function checkServerHealth() {
  try {
    const healthUrl = API_BASE_URL.replace("/api", "/health");
    const response = await fetch(healthUrl);
    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

// Login function
async function login(email, password) {
  const result = await apiRequest("/auth/login", "POST", { email, password });
  if (result.ok && result.data && result.data.success) {
    return result.data.data.token;
  }
  if (result.data && result.data.message) {
    console.log(`    Login error: ${result.data.message}`);
  }
  return null;
}

// Register function
async function register(userData) {
  const result = await apiRequest("/auth/register", "POST", userData);
  if (result.ok && result.data && result.data.success) {
    return true;
  }
  if (result.data && result.data.message) {
    console.log(`    Registration error: ${result.data.message}`);
  }
  if (result.error) {
    console.log(`    Request error: ${result.error}`);
  }
  return false;
}

// Main migration function
async function migrateData() {
  console.log("🚀 Starting API-based data migration...\n");

  // Check if server is running
  console.log("🔍 Checking if backend server is running...");
  const serverRunning = await checkServerHealth();
  if (!serverRunning) {
    console.error("  ✗ Backend server is not running or not accessible");
    console.error(
      `  Please ensure the server is running at ${API_BASE_URL.replace(
        "/api",
        ""
      )}`
    );
    console.error("  Start the server with: npm run dev");
    throw new Error("Backend server is not accessible");
  }
  console.log("  ✓ Backend server is running\n");

  const categoryMap = {};
  const teacherMap = {};
  const lessonMap = {};
  const parentTokens = {};

  // Admin credentials
  const adminEmail = "akogunoyindamola42@gmail.com";
  const adminPassword = "damodami43";

  try {
    // Step 1: Create or login as admin
    console.log("👤 Step 1: Setting up admin account...");

    let adminToken = await login(adminEmail, adminPassword);

    if (!adminToken) {
      console.log("  Creating admin account...");
      const adminCreated = await register({
        name: "Admin User",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });

      if (adminCreated) {
        // Small delay to ensure user is saved
        await new Promise((resolve) => setTimeout(resolve, 500));
        adminToken = await login(adminEmail, adminPassword);

        if (!adminToken) {
          console.log("  ⚠️  Admin created but login failed. Trying again...");
          await new Promise((resolve) => setTimeout(resolve, 1000));
          adminToken = await login(adminEmail, adminPassword);
        }
      } else {
        console.log(
          "  ⚠️  Admin registration failed or user already exists. Trying login again..."
        );
        adminToken = await login(adminEmail, adminPassword);
      }
    }

    if (!adminToken) {
      console.error("  ✗ Failed to authenticate admin");
      console.error("  Please ensure:");
      console.error("    1. Backend server is running on port 8080");
      console.error("    2. API is accessible at", API_BASE_URL);
      console.error("    3. Database is connected and working");
      throw new Error(
        "Failed to get admin token. Check server logs for details."
      );
    }
    console.log("  ✓ Admin authenticated\n");

    // Step 2: Create categories
    console.log("📚 Step 2: Creating categories...");
    for (const category of categories) {
      const result = await apiRequest(
        "/categories",
        "POST",
        category,
        adminToken
      );

      if (result.ok && result.data.success) {
        categoryMap[category.name] = result.data.data.category.id;
        console.log(`  ✓ Created category: ${category.name}`);
      } else {
        // Try to get existing category
        const getResult = await apiRequest(
          "/categories",
          "GET",
          null,
          adminToken
        );
        if (getResult.ok && getResult.data.success) {
          const existing = getResult.data.data.categories.find(
            (c) => c.name === category.name
          );
          if (existing) {
            categoryMap[category.name] = existing.id;
            console.log(`  → Using existing category: ${category.name}`);
          }
        }
      }
    }
    console.log("");

    // Step 3: Register teacher users
    console.log("👨‍🏫 Step 3: Registering teacher users...");
    for (const teacher of teachersData) {
      const registered = await register({
        name: teacher.name,
        email: teacher.email,
        password: teacher.password,
        role: "teacher",
      });

      if (registered) {
        console.log(`  ✓ Registered teacher: ${teacher.name}`);
      } else {
        console.log(`  → Teacher may already exist: ${teacher.name}`);
      }
    }
    console.log("");

    // Step 4: Create teacher profiles
    console.log("📝 Step 4: Creating teacher profiles...");
    for (const teacher of teachersData) {
      const token = await login(teacher.email, teacher.password);
      if (!token) {
        console.log(`  ✗ Failed to login teacher: ${teacher.name}`);
        continue;
      }

      const profileResult = await apiRequest(
        "/users/teacher-profile",
        "POST",
        {
          title: teacher.title,
          bio: teacher.bio,
          credentials: teacher.credentials,
          experience_years: teacher.experience_years,
          avatar: teacher.avatar,
        },
        token
      );

      if (profileResult.ok && profileResult.data.success) {
        teacherMap[teacher.name] = {
          token,
          teacherId: profileResult.data.data.teacher.id,
        };
        console.log(`  ✓ Created profile for: ${teacher.name}`);
      } else {
        // Try to get existing profile
        const getResult = await apiRequest(
          "/users/teacher-profile",
          "GET",
          null,
          token
        );
        if (
          getResult.ok &&
          getResult.data.success &&
          getResult.data.data.teacher
        ) {
          teacherMap[teacher.name] = {
            token,
            teacherId: getResult.data.data.teacher.id,
          };
          console.log(`  → Using existing profile: ${teacher.name}`);
        } else {
          console.log(`  ✗ Failed to create profile for: ${teacher.name}`);
        }
      }
    }
    console.log("");

    // Step 5: Create lessons
    console.log("📖 Step 5: Creating lessons...");
    for (const lesson of lessonsData) {
      const teacher = teacherMap[lesson.teacherName];
      const categoryId = categoryMap[lesson.category];

      if (!teacher || !categoryId) {
        console.log(
          `  ✗ Skipping "${lesson.title}" - missing teacher or category`
        );
        continue;
      }

      const lessonResult = await apiRequest(
        "/lessons",
        "POST",
        {
          title: lesson.title,
          category_id: categoryId,
          teacher_id: teacher.teacherId,
          price: lesson.price,
          price_unit: lesson.price_unit,
          duration: lesson.duration,
          schedule: lesson.schedule,
          age_group: lesson.age_group,
          max_students: lesson.max_students,
          description: lesson.description,
          image: lesson.image,
          features: JSON.stringify(lesson.features),
          featured: lesson.featured,
        },
        teacher.token
      );

      if (lessonResult.ok && lessonResult.data.success) {
        lessonMap[lesson.title] = lessonResult.data.data.lesson.id;
        console.log(`  ✓ Created lesson: ${lesson.title}`);
      } else {
        console.log(`  ✗ Failed to create lesson: ${lesson.title}`);
        if (lessonResult.data) {
          console.log(`    Error: ${lessonResult.data.message}`);
        }
      }
    }
    console.log("");

    // Step 6: Register parent users
    console.log("👥 Step 6: Registering parent users...");
    for (const parent of parentUsers) {
      const registered = await register(parent);
      if (registered) {
        console.log(`  ✓ Registered parent: ${parent.name}`);
      } else {
        console.log(`  → Parent may already exist: ${parent.name}`);
      }
    }
    console.log("");

    // Step 7: Create enrollments and reviews
    console.log("📝 Step 7: Creating sample enrollments and reviews...");
    const lessonIds = Object.values(lessonMap);
    const studentNames = ["Emma", "Liam", "Olivia", "Noah", "Ava"];

    for (const parent of parentUsers) {
      const token = await login(parent.email, parent.password);
      if (!token) continue;

      parentTokens[parent.email] = token;

      // Create 2-3 enrollments per parent
      const numEnrollments = Math.floor(Math.random() * 2) + 2;
      for (let i = 0; i < numEnrollments && lessonIds.length > 0; i++) {
        const randomLessonId =
          lessonIds[Math.floor(Math.random() * lessonIds.length)];
        const randomStudent =
          studentNames[Math.floor(Math.random() * studentNames.length)];
        const randomAge = Math.floor(Math.random() * 10) + 8;

        const enrollmentResult = await apiRequest(
          "/enrollments/checkout",
          "POST",
          {
            lesson_id: randomLessonId,
            student_name: randomStudent,
            student_age: randomAge,
            student_grade: "5th",
            payment_method: "card",
            card_number: "4111111111111111",
            card_expiry: "12/25",
            card_cvv: "123",
            cardholder_name: parent.name,
          },
          token
        );

        if (enrollmentResult.ok && enrollmentResult.data.success) {
          // Create a review for this enrollment
          const reviewResult = await apiRequest(
            "/users/reviews",
            "POST",
            {
              lesson_id: randomLessonId,
              rating: Math.floor(Math.random() * 2) + 4, // 4 or 5
              comment: "Great class! My child loves it.",
            },
            token
          );

          if (reviewResult.ok) {
            console.log(`  ✓ Created enrollment and review for ${parent.name}`);
          } else {
            console.log(`  ✓ Created enrollment for ${parent.name}`);
          }
        }
      }
    }
    console.log("");

    console.log("✅ Migration completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`- ${Object.keys(categoryMap).length} categories`);
    console.log(`- ${Object.keys(teacherMap).length} teachers`);
    console.log(`- ${Object.keys(lessonMap).length} lessons`);
    console.log(`- ${parentUsers.length} parent users`);
    console.log("\n🔑 Test Accounts:");
    console.log(`Admin: ${adminEmail} / ${adminPassword}`);
    console.log(
      "Parents: john@example.com, sarah@example.com, mike@example.com / password123"
    );
    console.log("Teachers: [name]@afterschoolhub.com / teacher123");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

// Run migration
migrateData()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
