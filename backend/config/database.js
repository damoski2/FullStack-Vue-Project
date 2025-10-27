import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path
const DB_PATH =
  process.env.DB_PATH || path.join(__dirname, "database", "afterschool_hub.db");

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("📊 Connected to SQLite database");
  }
});

// Initialize database tables
export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'parent',
          phone TEXT,
          address TEXT,
          city TEXT,
          state TEXT,
          zip TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Teachers table
      db.run(`
        CREATE TABLE IF NOT EXISTS teachers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          title TEXT NOT NULL,
          avatar TEXT,
          bio TEXT,
          credentials TEXT,
          experience_years INTEGER,
          rating REAL DEFAULT 0,
          total_reviews INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Categories table
      db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          description TEXT,
          icon TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Lessons table
      db.run(`
        CREATE TABLE IF NOT EXISTS lessons (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          category_id INTEGER,
          teacher_id INTEGER,
          price REAL NOT NULL,
          price_unit TEXT NOT NULL,
          rating REAL DEFAULT 0,
          reviews INTEGER DEFAULT 0,
          duration TEXT NOT NULL,
          schedule TEXT NOT NULL,
          age_group TEXT NOT NULL,
          students_enrolled INTEGER DEFAULT 0,
          max_students INTEGER DEFAULT 20,
          description TEXT NOT NULL,
          image TEXT,
          features TEXT,
          featured BOOLEAN DEFAULT 0,
          available BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories (id),
          FOREIGN KEY (teacher_id) REFERENCES teachers (id)
        )
      `);

      // Cart items table
      db.run(`
        CREATE TABLE IF NOT EXISTS cart_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          lesson_id INTEGER NOT NULL,
          quantity INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (lesson_id) REFERENCES lessons (id),
          UNIQUE(user_id, lesson_id)
        )
      `);

      // Enrollments table
      db.run(`
        CREATE TABLE IF NOT EXISTS enrollments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          lesson_id INTEGER NOT NULL,
          student_name TEXT NOT NULL,
          student_age INTEGER NOT NULL,
          student_grade TEXT,
          special_notes TEXT,
          quantity INTEGER DEFAULT 1,
          total_amount REAL NOT NULL,
          status TEXT DEFAULT 'pending',
          payment_status TEXT DEFAULT 'pending',
          payment_method TEXT,
          payment_id TEXT,
          enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (lesson_id) REFERENCES lessons (id)
        )
      `);

      // Reviews table
      db.run(`
        CREATE TABLE IF NOT EXISTS reviews (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          lesson_id INTEGER NOT NULL,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (lesson_id) REFERENCES lessons (id),
          UNIQUE(user_id, lesson_id)
        )
      `);

      // Create indexes for better performance
      db.run(
        `CREATE INDEX IF NOT EXISTS idx_lessons_category ON lessons(category_id)`
      );
      db.run(
        `CREATE INDEX IF NOT EXISTS idx_lessons_teacher ON lessons(teacher_id)`
      );
      db.run(
        `CREATE INDEX IF NOT EXISTS idx_lessons_featured ON lessons(featured)`
      );
      db.run(`CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id)`);
      db.run(
        `CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id)`
      );
      db.run(
        `CREATE INDEX IF NOT EXISTS idx_reviews_lesson ON reviews(lesson_id)`
      );

      console.log("📋 Database tables initialized successfully");
      resolve();
    });
  });
};

// Helper function to run queries with promises
export const dbQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Helper function to run single queries
export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Helper function to run insert/update/delete queries
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

// Close database connection
export const closeDatabase = () => {
  return new Promise((resolve) => {
    db.close((err) => {
      if (err) {
        console.error("Error closing database:", err.message);
      } else {
        console.log("📊 Database connection closed");
      }
      resolve();
    });
  });
};

export default db;
