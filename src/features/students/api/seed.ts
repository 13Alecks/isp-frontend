/**
 * Seed 20 realistic students into Firestore for the current user.
 * Only runs if the user has fewer than 20 students — prevents duplicates.
 */

import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/config/firebase";
import type { CreateStudentPayload } from "@/features/students/types";

const FIRST_NAMES = [
  "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael",
  "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan",
  "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
  "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez",
  "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
];

const CLASSES = ["JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"];
const GENDERS = ["Male", "Female"];

/** Deterministic PRNG for reproducible seed data. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Generate 20 realistic student records with varied performance. */
function generateSeedStudents(): CreateStudentPayload[] {
  const rand = mulberry32(42);
  const students: CreateStudentPayload[] = [];

  for (let i = 0; i < 20; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    const ability = rand(); // 0-1 — drives all scores

    const attendance = Math.round(
      Math.max(50, Math.min(100, 55 + ability * 40 + (rand() - 0.5) * 20))
    );
    const previousScore = Math.round(
      Math.max(20, Math.min(100, 30 + ability * 55 + (rand() - 0.5) * 20))
    );
    const caScore = Math.round(
      Math.max(20, Math.min(100, 25 + ability * 50 + (attendance / 100) * 15 + (rand() - 0.5) * 15))
    );
    const testScore = Math.round(
      Math.max(15, Math.min(100, 25 + ability * 60 + (rand() - 0.5) * 20))
    );
    const studyHours = Math.round(
      Math.max(0, Math.min(10, 1 + ability * 6 + (rand() - 0.5) * 3))
    );
    const assignmentScore = Math.round(
      Math.max(20, Math.min(100, 25 + ability * 50 + studyHours * 3 + (rand() - 0.5) * 15))
    );
    const finalScore = Math.round(
      Math.max(
        10,
        Math.min(
          100,
          previousScore * 0.2 +
            caScore * 0.2 +
            testScore * 0.3 +
            assignmentScore * 0.2 +
            studyHours * 2 +
            (rand() - 0.5) * 10
        )
      )
    );

    students.push({
      name: `${firstName} ${lastName}`,
      age: 12 + Math.floor(rand() * 6), // 12-17
      gender: GENDERS[i % 2],
      class: CLASSES[Math.floor(rand() * CLASSES.length)],
      attendance,
      previousScore,
      caScore,
      testScore,
      assignmentScore,
      studyHours,
      finalScore,
    });
  }

  return students;
}

/**
 * Seed 20 students for the current user if they don't have enough.
 * Returns the number of students created.
 */
export async function seedStudents(): Promise<number> {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error("You must be logged in to seed students.");
  }

  // Check how many students the user already has.
  const q = query(collection(db, "students"), where("userId", "==", uid));
  const existing = await getDocs(q);
  const currentCount = existing.size;

  if (currentCount >= 20) {
    return 0; // Already has enough students.
  }

  const needed = 20 - currentCount;
  const seedData = generateSeedStudents().slice(0, needed);

  for (const student of seedData) {
    await addDoc(collection(db, "students"), {
      ...student,
      lastPredictedPerformance: "Medium",
      userId: uid,
      createdAt: serverTimestamp(),
      seeded: true,
    });
  }

  return needed;
}
