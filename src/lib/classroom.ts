import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

let cachedAccessToken: string | null = null;

// Initialize auth state listener to handle token cleanup
onAuthStateChanged(auth, (user) => {
  if (!user) {
    cachedAccessToken = null;
  }
});

export async function googleSignInForClassroom(): Promise<string> {
  if (cachedAccessToken) return cachedAccessToken;

  const provider = new GoogleAuthProvider();
  
  // Scopes requested by user
  const scopes = [
    'https://www.googleapis.com/auth/classroom.courses.readonly',
    'https://www.googleapis.com/auth/classroom.coursework.me',
    'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
    'https://www.googleapis.com/auth/classroom.courseworkmaterials',
    'https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly',
    'https://www.googleapis.com/auth/classroom.announcements',
    'https://www.googleapis.com/auth/classroom.announcements.readonly',
    'https://www.googleapis.com/auth/classroom.rosters.readonly',
    'https://www.googleapis.com/auth/classroom.profile.emails',
    'https://www.googleapis.com/auth/classroom.profile.photos'
  ];

  scopes.forEach(scope => provider.addScope(scope));

  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('No access token returned from Google Sign-In');
    }
    cachedAccessToken = credential.accessToken;
    
    // Dispatch event to notify application components about the Google Classroom connection
    window.dispatchEvent(new Event('classroom_connection_changed'));
    window.dispatchEvent(new Event('clay_auth_state_changed'));
    
    return cachedAccessToken;
  } catch (error) {
    console.error('Error in Google Classroom Sign-In:', error);
    throw error;
  }
}

export function getCachedClassroomToken(): string | null {
  return cachedAccessToken;
}

export function disconnectClassroom() {
  cachedAccessToken = null;
  window.dispatchEvent(new Event('classroom_connection_changed'));
  window.dispatchEvent(new Event('clay_auth_state_changed'));
}

export interface ClassroomCourse {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  description?: string;
  alternateLink?: string;
  courseState?: string;
}

export interface ClassroomCourseWork {
  id: string;
  title: string;
  description?: string;
  alternateLink?: string;
  maxPoints?: number;
  state?: string;
  creationTime?: string;
}

export async function fetchClassroomCourses(): Promise<ClassroomCourse[]> {
  const token = getCachedClassroomToken();
  if (!token) throw new Error('Not connected to Google Classroom');

  const res = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Failed to fetch Classroom courses');
  }

  const data = await res.json();
  return data.courses || [];
}

export async function fetchCourseWork(courseId: string): Promise<ClassroomCourseWork[]> {
  const token = getCachedClassroomToken();
  if (!token) throw new Error('Not connected to Google Classroom');

  const res = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Failed to fetch coursework');
  }

  const data = await res.json();
  return data.courseWork || [];
}

export async function postClassroomAnnouncement(courseId: string, text: string): Promise<any> {
  const token = getCachedClassroomToken();
  if (!token) throw new Error('Not connected to Google Classroom');

  const res = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/announcements`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text,
      state: 'PUBLISHED'
    })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Failed to create announcement');
  }

  return await res.json();
}

export async function postClassroomAssignment(
  courseId: string, 
  title: string, 
  description: string
): Promise<any> {
  const token = getCachedClassroomToken();
  if (!token) throw new Error('Not connected to Google Classroom');

  const res = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title,
      description,
      workType: 'ASSIGNMENT',
      state: 'PUBLISHED'
    })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Failed to create assignment');
  }

  return await res.json();
}
