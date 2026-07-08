import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';

// Firebase credentials from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyC_fi966iPaGIybf2XPue3TtutCmXgoQJg",
  authDomain: "my-first-project-494611.firebaseapp.com",
  projectId: "my-first-project-494611",
  storageBucket: "my-first-project-494611.firebasestorage.app",
  messagingSenderId: "27782445441",
  appId: "1:27782445441:web:4fe1df3f69f0b5bcc15080"
};

// Initialize Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Provider for Google Auth
export const googleProvider = new GoogleAuthProvider();

// Core Types
export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  avatar: string;
  joinedDate: string;
  streak: number;
  linkedPlatforms: string[];
}

export interface UserProgress {
  completedTerms: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
}

// 1. Listen to Auth state changes and sync
export function setupAuthListener(
  onUserChanged: (profile: UserProfile | null) => void,
  onProgressChanged: (progress: UserProgress | null) => void
) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // 1. Fetch profile from Firestore or local storage fallback
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      let profile: UserProfile;

      if (userSnap.exists()) {
        profile = { uid: user.uid, ...userSnap.data() } as UserProfile;
      } else {
        // Create new profile
        const joinedDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.email || user.uid)}`;
        const fullName = user.displayName || user.email?.split('@')[0].toUpperCase() || 'Explorer';
        
        profile = {
          uid: user.uid,
          email: user.email || '',
          fullName,
          avatar,
          joinedDate,
          streak: 1,
          linkedPlatforms: user.providerData.map(p => p.providerId === 'google.com' ? 'Google' : '').filter(Boolean)
        };
        
        await setDoc(userRef, {
          email: profile.email,
          fullName: profile.fullName,
          avatar: profile.avatar,
          joinedDate: profile.joinedDate,
          streak: profile.streak,
          linkedPlatforms: profile.linkedPlatforms
        });
      }

      // Save to local storage for quick cache
      localStorage.setItem('clay_user_profile', JSON.stringify(profile));
      onUserChanged(profile);

      // 2. Fetch Progress (bookmarks and completed terms)
      const progressRef = doc(db, 'progress', user.uid);
      const progressSnap = await getDoc(progressRef);
      
      let progress: UserProgress = { completedTerms: {}, bookmarks: {} };

      if (progressSnap.exists()) {
        const data = progressSnap.data();
        progress = {
          completedTerms: data.completedTerms || {},
          bookmarks: data.bookmarks || {}
        };
      } else {
        // Try importing from local storage if available to avoid data loss
        const localCompleted = localStorage.getItem('clay_completed_terms');
        const localBookmarks = localStorage.getItem('clay_bookmarks');
        
        progress = {
          completedTerms: localCompleted ? JSON.parse(localCompleted) : {},
          bookmarks: localBookmarks ? JSON.parse(localBookmarks) : {}
        };

        await setDoc(progressRef, {
          userId: user.uid,
          completedTerms: progress.completedTerms,
          bookmarks: progress.bookmarks,
          updatedAt: serverTimestamp()
        });
      }

      // Update local storage
      localStorage.setItem('clay_completed_terms', JSON.stringify(progress.completedTerms));
      localStorage.setItem('clay_bookmarks', JSON.stringify(progress.bookmarks));
      onProgressChanged(progress);

      // 3. Fetch Quiz Progress
      try {
        const quizRef = doc(db, 'quizProgress', user.uid);
        const quizSnap = await getDoc(quizRef);
        let quizScore = 0;
        let quizCompleted: Record<string, boolean> = {};
        let quizHighScores: Record<string, number> = {};

        let quizHistory: any[] = [];
        let streakCount = 0;
        let lastQuizDate = '';
        if (quizSnap.exists()) {
          const qData = quizSnap.data();
          quizScore = qData.score || 0;
          quizCompleted = qData.completedSections || {};
          quizHighScores = qData.highScores || {};
          quizHistory = qData.sessionHistory || [];
          streakCount = qData.streakCount || 0;
          lastQuizDate = qData.lastQuizDate || '';
        } else {
          const localScore = localStorage.getItem('clay_quiz_score');
          const localCompleted = localStorage.getItem('clay_quiz_completed');
          const localHighScores = localStorage.getItem('clay_quiz_high_scores');
          const localHistory = localStorage.getItem('clay_quiz_sessions');
          const localStreak = localStorage.getItem('clay_quiz_streak_count');
          const localLastDate = localStorage.getItem('clay_quiz_last_date');
          quizScore = localScore ? parseInt(localScore, 10) : 0;
          quizCompleted = localCompleted ? JSON.parse(localCompleted) : {};
          quizHighScores = localHighScores ? JSON.parse(localHighScores) : {};
          streakCount = localStreak ? parseInt(localStreak, 10) : 0;
          lastQuizDate = localLastDate || '';
          try {
            quizHistory = localHistory ? JSON.parse(localHistory) : [];
          } catch (_) {
            quizHistory = [];
          }

          await setDoc(quizRef, {
            userId: user.uid,
            score: quizScore,
            completedSections: quizCompleted,
            highScores: quizHighScores,
            sessionHistory: quizHistory,
            streakCount,
            lastQuizDate,
            updatedAt: serverTimestamp()
          });
        }

        localStorage.setItem('clay_quiz_score', quizScore.toString());
        localStorage.setItem('clay_quiz_completed', JSON.stringify(quizCompleted));
        localStorage.setItem('clay_quiz_high_scores', JSON.stringify(quizHighScores));
        localStorage.setItem('clay_quiz_sessions', JSON.stringify(quizHistory));
        localStorage.setItem('clay_quiz_streak_count', streakCount.toString());
        localStorage.setItem('clay_quiz_last_date', lastQuizDate);
      } catch (e) {
        console.error("Error loading quiz progress:", e);
      }

      // Trigger global state updates across elements
      window.dispatchEvent(new Event('clay_auth_state_changed'));
    } else {
      // Logged out
      localStorage.removeItem('clay_user_profile');
      onUserChanged(null);
      onProgressChanged(null);
      window.dispatchEvent(new Event('clay_auth_state_changed'));
    }
  });
}

// 2. Sync Progress updates to Firestore (with debouncing or instant updates)
export async function syncProgressToCloud(completedTerms: Record<string, boolean>, bookmarks: Record<string, boolean>) {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  try {
    const progressRef = doc(db, 'progress', currentUser.uid);
    await setDoc(progressRef, {
      userId: currentUser.uid,
      completedTerms,
      bookmarks,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("Failed to sync progress to Firebase Firestore:", error);
  }
}

// 3. Mark a learning term completed (with Firestore sync)
export async function toggleTermCompleted(termTitle: string, isCompleted: boolean) {
  // 1. Update local storage
  const saved = localStorage.getItem('clay_completed_terms');
  const current: Record<string, boolean> = saved ? JSON.parse(saved) : {};
  current[termTitle] = isCompleted;
  localStorage.setItem('clay_completed_terms', JSON.stringify(current));

  // 2. Sync to Firestore
  const savedBookmarks = localStorage.getItem('clay_bookmarks');
  const bookmarks: Record<string, boolean> = savedBookmarks ? JSON.parse(savedBookmarks) : {};
  await syncProgressToCloud(current, bookmarks);

  window.dispatchEvent(new Event('clay_auth_state_changed'));
}

// 4. Toggle bookmark of a section (with Firestore sync)
export async function toggleSectionBookmarked(sectionId: string, isBookmarked: boolean) {
  // 1. Update local storage
  const saved = localStorage.getItem('clay_bookmarks');
  const current: Record<string, boolean> = saved ? JSON.parse(saved) : {};
  current[sectionId] = isBookmarked;
  localStorage.setItem('clay_bookmarks', JSON.stringify(current));

  // 2. Sync to Firestore
  const savedTerms = localStorage.getItem('clay_completed_terms');
  const completedTerms: Record<string, boolean> = savedTerms ? JSON.parse(savedTerms) : {};
  await syncProgressToCloud(completedTerms, current);

  window.dispatchEvent(new Event('clay_auth_state_changed'));
}

// 5. Sync Quiz progress to Firestore
export async function syncQuizProgressToCloud(
  score: number, 
  completedSections: Record<string, boolean>, 
  highScores: Record<string, number>,
  sessionHistory?: any[],
  streakCount?: number,
  lastQuizDate?: string
) {
  const currentUser = auth.currentUser;
  
  // Save locally first
  localStorage.setItem('clay_quiz_score', score.toString());
  localStorage.setItem('clay_quiz_completed', JSON.stringify(completedSections));
  localStorage.setItem('clay_quiz_high_scores', JSON.stringify(highScores));
  if (sessionHistory) {
    localStorage.setItem('clay_quiz_sessions', JSON.stringify(sessionHistory));
  }
  if (streakCount !== undefined) {
    localStorage.setItem('clay_quiz_streak_count', streakCount.toString());
  }
  if (lastQuizDate !== undefined) {
    localStorage.setItem('clay_quiz_last_date', lastQuizDate);
  }
  
  window.dispatchEvent(new Event('clay_auth_state_changed'));

  if (!currentUser) return;

  try {
    const quizRef = doc(db, 'quizProgress', currentUser.uid);
    const updateData: any = {
      userId: currentUser.uid,
      score,
      completedSections,
      highScores,
      updatedAt: serverTimestamp()
    };
    if (sessionHistory) {
      updateData.sessionHistory = sessionHistory;
    }
    if (streakCount !== undefined) {
      updateData.streakCount = streakCount;
    }
    if (lastQuizDate !== undefined) {
      updateData.lastQuizDate = lastQuizDate;
    }
    await setDoc(quizRef, updateData, { merge: true });
  } catch (error) {
    console.error("Failed to sync quiz progress to Firebase Firestore:", error);
  }
}
