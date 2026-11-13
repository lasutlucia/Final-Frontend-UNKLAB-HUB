import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import demoSeed from '../db.json';

const config = {
  apiKey: "AIzaSyCdAV2EfaZgrDcgFWaYIFXCS7FEFM-_7SU",
  authDomain: "final-frontend-36388.firebaseapp.com",
  projectId: "final-frontend-36388",
  storageBucket: "final-frontend-36388.firebasestorage.app",
  messagingSenderId: "238877915093",
  appId: "1:238877915093:web:00348c7bae4bfb7e67af5c",
  measurementId: "G-Q04K4VM4SK"
};

export const firebaseEnabled = Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
const app = firebaseEnabled ? (getApps()[0] || initializeApp(config)) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

export async function readCollection(name, user) {
  if (name === 'users') return [];
  let ref = collection(db, name);
  if (name === 'bookmarks' || name === 'mySchedule') ref = query(ref, where('userId', '==', user?.id || ''));
  if (name === 'events' && user?.role === 'organisasi') ref = query(ref, where('organizerId', '==', user.id));
  if (name === 'events' && user?.role !== 'admin' && user?.role !== 'organisasi') ref = query(ref, where('status', '==', 'approved'));
  let snapshot;
  try { snapshot = await getDocs(ref); }
  catch (error) {
    if (name === 'events' || name === 'categories') return demoSeed[name] || [];
    throw error;
  }
  if (snapshot.empty && (name === 'events' || name === 'categories')) return demoSeed[name] || [];
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function writeRecord(name, method, data) {
  const ref = doc(db, name, String(data.id));
  if (method === 'DELETE') return deleteDoc(ref);
  return setDoc(ref, data, { merge: method === 'PATCH' });
}

export async function loginWithFirebase(email, password) {
  const credential = await withTimeout(
    signInWithEmailAndPassword(auth, email.trim(), password),
    15000,
    'Firebase Authentication tidak merespons. Periksa koneksi internet dan Authorized domains.'
  );
  const fallbackProfile = {
    id: credential.user.uid,
    name: credential.user.displayName || credential.user.email?.split('@')[0] || 'Mahasiswa',
    email: credential.user.email,
    role: 'mahasiswa',
    profileCompleted: false,
    profilePending: true,
  };
  try {
    return await withTimeout(ensureUserProfile(credential.user), 3500, 'Firestore profile timeout');
  } catch {
    return fallbackProfile;
  }
}

function withTimeout(promise, milliseconds, message) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(message)), milliseconds); }),
  ]).finally(() => clearTimeout(timer));
}

async function ensureUserProfile(firebaseUser) {
  const profileRef = doc(db, 'users', firebaseUser.uid);
  const profile = {
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Mahasiswa',
    email: firebaseUser.email,
    role: 'mahasiswa',
    profileCompleted: false,
  };
  try {
    const profileDoc = await getDoc(profileRef);
    if (profileDoc.exists()) {
      const savedProfile = profileDoc.data();
      const role = savedProfile.role || 'mahasiswa';
      if (!savedProfile.role) {
        try { await setDoc(profileRef, { role, email: savedProfile.email || firebaseUser.email }, { merge: true }); } catch {}
      }
      return { ...profile, ...savedProfile, role, id: firebaseUser.uid, email: firebaseUser.email };
    }
    await setDoc(profileRef, profile);
    return { ...profile, id: firebaseUser.uid, profileCreated: true };
  } catch {
    // A valid Firebase Auth account can still enter as a student if the profile
    // is not readable/writable yet; deploy firestore.rules to persist the profile.
    return { ...profile, id: firebaseUser.uid, profilePending: true };
  }
}

export function logoutFromFirebase() {
  return auth ? signOut(auth) : Promise.resolve();
}

