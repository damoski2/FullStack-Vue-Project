import { initDatabase, dbRun, dbQuery } from "../config/database.js";
import bcrypt from "bcryptjs";

// Sample data
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

const teachers = [
  {
    name: "Sarah Johnson",
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
    title: "Professional Tennis Coach",
    avatar: "https://i.pravatar.cc/150?img=47",
    bio: "Professional tennis coach with ATP certification and competitive experience.",
    credentials: "ATP Certified Coach, USPTA Professional",
    experience_years: 16,
    rating: 4.8,
    total_reviews: 121,
  },
];

const lessons = [
  {
    title: "Piano Lessons for Beginners",
    category_id: 1,
    teacher_id: 1,
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
    features: JSON.stringify([
      "Individual attention",
      "Music theory basics",
      "Performance skills",
      "Practice materials included",
    ]),
    featured: true,
    available: true,
  },
  {
    title: "Advanced Math & Problem Solving",
    category_id: 2,
    teacher_id: 2,
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
    features: JSON.stringify([
      "Competition preparation",
      "Advanced problem solving",
      "Small group sessions",
      "Weekly homework support",
    ]),
    featured: false,
    available: true,
  },
  {
    title: "Creative Art & Drawing",
    category_id: 5,
    teacher_id: 3,
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
    features: JSON.stringify([
      "All materials included",
      "Various art techniques",
      "Portfolio development",
      "Art history exploration",
    ]),
    featured: true,
    available: true,
  },
  {
    title: "Soccer Skills Academy",
    category_id: 4,
    teacher_id: 4,
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
    features: JSON.stringify([
      "Professional coaching",
      "Team building activities",
      "Match preparation",
      "Fitness training",
    ]),
    featured: false,
    available: true,
  },
  {
    title: "Spanish for Kids",
    category_id: 7,
    teacher_id: 5,
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
    features: JSON.stringify([
      "Interactive learning",
      "Cultural activities",
      "Conversational practice",
      "Fun learning games",
    ]),
    featured: false,
    available: true,
  },
  {
    title: "Science Explorers Lab",
    category_id: 3,
    teacher_id: 6,
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
    features: JSON.stringify([
      "Hands-on experiments",
      "Safety equipment provided",
      "Science fair preparation",
      "Lab report writing",
    ]),
    featured: true,
    available: true,
  },
  {
    title: "Coding & Game Development",
    category_id: 6,
    teacher_id: 7,
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
    features: JSON.stringify([
      "Python & Scratch",
      "Game design fundamentals",
      "Portfolio projects",
      "Computer science concepts",
    ]),
    featured: false,
    available: true,
  },
  {
    title: "Ballet & Contemporary Dance",
    category_id: 8,
    teacher_id: 8,
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
    features: JSON.stringify([
      "Classical technique",
      "Performance opportunities",
      "Flexibility training",
      "Recital preparation",
    ]),
    featured: false,
    available: true,
  },
  {
    title: "Guitar Masterclass",
    category_id: 1,
    teacher_id: 9,
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
    features: JSON.stringify([
      "Multiple music styles",
      "Songwriting basics",
      "Music reading",
      "Performance techniques",
    ]),
    featured: false,
    available: true,
  },
  {
    title: "Creative Writing Workshop",
    category_id: 7,
    teacher_id: 10,
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
    features: JSON.stringify([
      "Story development",
      "Character building",
      "Publishing guidance",
      "Peer feedback sessions",
    ]),
    featured: false,
    available: true,
  },
  {
    title: "Robotics & Engineering",
    category_id: 6,
    teacher_id: 11,
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
    features: JSON.stringify([
      "Robot building",
      "Programming basics",
      "Competition prep",
      "Engineering concepts",
    ]),
    featured: true,
    available: true,
  },
  {
    title: "Tennis Academy",
    category_id: 4,
    teacher_id: 12,
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
    features: JSON.stringify([
      "Professional coaching",
      "Match strategy",
      "Fitness conditioning",
      "Tournament preparation",
    ]),
    featured: false,
    available: true,
  },
];

const users = [
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
    name: "Sarah Johnson",
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
    console.log("🌱 Starting database seeding...");

    // Initialize database
    await initDatabase();

    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await dbRun("DELETE FROM reviews");
    await dbRun("DELETE FROM enrollments");
    await dbRun("DELETE FROM cart_items");
    await dbRun("DELETE FROM lessons");
    await dbRun("DELETE FROM teachers");
    await dbRun("DELETE FROM categories");
    await dbRun("DELETE FROM users");

    // Reset auto-increment counters
    await dbRun("DELETE FROM sqlite_sequence");

    // Insert categories
    console.log("📚 Inserting categories...");
    for (const category of categories) {
      await dbRun(
        "INSERT INTO categories (name, description, icon) VALUES (?, ?, ?)",
        [category.name, category.description, category.icon]
      );
    }

    // Insert teachers
    console.log("👨‍🏫 Inserting teachers...");
    for (const teacher of teachers) {
      await dbRun(
        "INSERT INTO teachers (name, title, avatar, bio, credentials, experience_years, rating, total_reviews) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          teacher.name,
          teacher.title,
          teacher.avatar,
          teacher.bio,
          teacher.credentials,
          teacher.experience_years,
          teacher.rating,
          teacher.total_reviews,
        ]
      );
    }

    // Insert users
    console.log("👥 Inserting users...");
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 12);
      await dbRun(
        "INSERT INTO users (name, email, password, role, phone, address, city, state, zip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          user.name,
          user.email,
          hashedPassword,
          user.role,
          user.phone,
          user.address,
          user.city,
          user.state,
          user.zip,
        ]
      );
    }

    // Insert lessons
    console.log("📖 Inserting lessons...");
    for (const lesson of lessons) {
      await dbRun(
        "INSERT INTO lessons (title, category_id, teacher_id, price, price_unit, rating, reviews, duration, schedule, age_group, students_enrolled, max_students, description, image, features, featured, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          lesson.title,
          lesson.category_id,
          lesson.teacher_id,
          lesson.price,
          lesson.price_unit,
          lesson.rating,
          lesson.reviews,
          lesson.duration,
          lesson.schedule,
          lesson.age_group,
          lesson.students_enrolled,
          lesson.max_students,
          lesson.description,
          lesson.image,
          lesson.features,
          lesson.featured ? 1 : 0,
          lesson.available ? 1 : 0,
        ]
      );
    }

    console.log("✅ Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`- ${categories.length} categories`);
    console.log(`- ${teachers.length} teachers`);
    console.log(`- ${lessons.length} lessons`);
    console.log(`- ${users.length} users`);

    console.log("\n🔑 Test Accounts:");
    console.log("Parent: john@example.com / password123");
    console.log("Admin: admin@afterschoolhub.com / admin123");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

// Run seeding if this file is executed directly
seedDatabase()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
