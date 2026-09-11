import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  Pet, 
  HealthRecord, 
  Medication, 
  Reminder, 
  DailyRecord, 
  DiaryEntry, 
  Expense, 
  Veterinarian 
} from '../types';
import { 
  INITIAL_PETS, 
  INITIAL_HEALTH_RECORDS, 
  INITIAL_MEDICATIONS, 
  INITIAL_REMINDERS, 
  INITIAL_DAILY_RECORDS, 
  INITIAL_DIARY_ENTRIES, 
  INITIAL_EXPENSES, 
  INITIAL_VET 
} from '../data/initialData';

import { User } from '../types';
import { getDb, getFirebaseServices } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';

export type MainView = 'home' | 'health' | 'reminders' | 'diary' | 'profile' | 'expenses' | 'all-pets';

interface PetContextType {
  pets: Pet[];
  selectedPetId: string;
  selectedPet: Pet | undefined;
  setSelectedPetId: (id: string) => void;
  currentView: MainView;
  setCurrentView: (view: MainView) => void;
  
  // Auth & User Management
  currentUser: User | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  registerUser: (name: string, username: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }> | { success: boolean; user?: User; error?: string };
  loginUser: (username: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }> | { success: boolean; user?: User; error?: string };
  logoutUser: () => Promise<void> | void;

  // Modals state
  isEmergencyOpen: boolean;
  setIsEmergencyOpen: (open: boolean) => void;
  isDailyCheckOpen: boolean;
  setIsDailyCheckOpen: (open: boolean) => void;
  isAddPetOpen: boolean;
  setIsAddPetOpen: (open: boolean) => void;
  editingPet: Pet | null;
  setEditingPet: (pet: Pet | null) => void;
  isPetSwitcherOpen: boolean;
  setIsPetSwitcherOpen: (open: boolean) => void;

  // New Modals
  isGeminiAssistantOpen: boolean;
  setIsGeminiAssistantOpen: (open: boolean) => void;
  isPetCardExportOpen: boolean;
  setIsPetCardExportOpen: (open: boolean) => void;
  isFoodCalculatorOpen: boolean;
  setIsFoodCalculatorOpen: (open: boolean) => void;
  isBackupOpen: boolean;
  setIsBackupOpen: (open: boolean) => void;

  // App settings & features
  darkMode: boolean;
  setDarkMode: (value: boolean | ((prev: boolean) => boolean)) => void;
  monthlyBudget: number;
  setMonthlyBudget: (amount: number) => void;
  showAiAssistantInHeader: boolean;
  setShowAiAssistantInHeader: (show: boolean) => void;

  // Backup & Restore
  exportBackupData: () => void;
  importBackupData: (jsonString: string) => boolean;

  // Pet Actions
  addPet: (petData: Omit<Pet, 'id' | 'created_at'>) => Pet;
  updatePet: (id: string, updates: Partial<Pet>) => void;
  deletePet: (id: string) => void;

  // Health
  healthRecords: HealthRecord[];
  petHealthRecords: HealthRecord[];
  addHealthRecord: (record: Omit<HealthRecord, 'id'>) => HealthRecord;
  updateHealthRecord: (id: string, updates: Partial<HealthRecord>) => void;
  deleteHealthRecord: (id: string) => void;

  // Medications
  medications: Medication[];
  petMedications: Medication[];
  addMedication: (med: Omit<Medication, 'id'>) => Medication;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;

  // Reminders
  reminders: Reminder[];
  petReminders: Reminder[];
  addReminder: (rem: Omit<Reminder, 'id'>) => Reminder;
  toggleReminder: (id: string) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;

  // Daily Check
  dailyRecords: DailyRecord[];
  petDailyRecords: DailyRecord[];
  latestDailyRecord: DailyRecord | undefined;
  addDailyRecord: (record: Omit<DailyRecord, 'id'>) => DailyRecord;

  // Diary
  diaryEntries: DiaryEntry[];
  petDiaryEntries: DiaryEntry[];
  addDiaryEntry: (entry: Omit<DiaryEntry, 'id' | 'created_at'>) => DiaryEntry;
  deleteDiaryEntry: (id: string) => void;

  // Expenses
  expenses: Expense[];
  petExpenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'created_at'>) => Expense;
  deleteExpense: (id: string) => void;

  // Veterinarian
  veterinarian: Veterinarian;
  updateVeterinarian: (updates: Partial<Veterinarian>) => void;

  // Reset & Helpers
  resetToDemoData: () => void;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

function getPrefixForUser(user: User | null): string {
  return user ? `modo_mascota_u_${user.id}_` : 'modo_mascota_v1_';
}

function getStoredItemForUser<T>(prefix: string, key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(prefix + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function mapFirebaseUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
    username: firebaseUser.email || '',
    email: firebaseUser.email || undefined,
    created_at: firebaseUser.metadata.creationTime || new Date().toISOString(),
  };
}

function getFirebaseAuthError(error: unknown): string {
  const code = (error as { code?: string })?.code;
  switch (code) {
    case 'auth/email-already-in-use': return 'Ese correo ya está registrado.';
    case 'auth/invalid-email': return 'El correo electrónico no es válido.';
    case 'auth/weak-password': return 'La contraseña debe tener al menos 6 caracteres.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password': return 'Correo o contraseña incorrectos.';
    case 'auth/too-many-requests': return 'Demasiados intentos. Espera unos minutos y vuelve a intentarlo.';
    case 'auth/operation-not-allowed': return 'Activa el proveedor Email/Password en Firebase Authentication.';
    default: return 'No se pudo completar la autenticación con Firebase.';
  }
}

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth & User Management States
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [isHydrated, setIsHydrated] = useState(() => !currentUser);
  const lastPersistedPrefixRef = useRef<string>(getPrefixForUser(currentUser));

  const prefix = getPrefixForUser(currentUser);

  const [pets, setPets] = useState<Pet[]>(() => getStoredItemForUser(prefix, 'pets', INITIAL_PETS));
  const [selectedPetId, setSelectedPetId] = useState<string>(() => {
    const stored = getStoredItemForUser<string>(prefix, 'selected_pet_id', '');
    if (stored && pets.some(p => p.id === stored)) return stored;
    return pets[0]?.id || 'pet_drako_01';
  });

  const [currentView, setCurrentView] = useState<MainView>('home');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isDailyCheckOpen, setIsDailyCheckOpen] = useState(false);
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [isPetSwitcherOpen, setIsPetSwitcherOpen] = useState(false);

  // New Modals
  const [isGeminiAssistantOpen, setIsGeminiAssistantOpen] = useState(false);
  const [isPetCardExportOpen, setIsPetCardExportOpen] = useState(false);
  const [isFoodCalculatorOpen, setIsFoodCalculatorOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // App settings & features
  const [darkMode, setDarkMode] = useState<boolean>(() => getStoredItemForUser(prefix, 'dark_mode', false));
  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => getStoredItemForUser(prefix, 'monthly_budget', 500));
  const [showAiAssistantInHeader, setShowAiAssistantInHeader] = useState<boolean>(() => getStoredItemForUser(prefix, 'show_ai_in_header', true));

  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(() => 
    getStoredItemForUser(prefix, 'health_records', INITIAL_HEALTH_RECORDS)
  );
  const [medications, setMedications] = useState<Medication[]>(() => 
    getStoredItemForUser(prefix, 'medications', INITIAL_MEDICATIONS)
  );
  const [reminders, setReminders] = useState<Reminder[]>(() => 
    getStoredItemForUser(prefix, 'reminders', INITIAL_REMINDERS)
  );
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>(() => 
    getStoredItemForUser(prefix, 'daily_records', INITIAL_DAILY_RECORDS)
  );
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => 
    getStoredItemForUser(prefix, 'diary_entries', INITIAL_DIARY_ENTRIES)
  );
  const [expenses, setExpenses] = useState<Expense[]>(() => 
    getStoredItemForUser(prefix, 'expenses', INITIAL_EXPENSES)
  );
  const [veterinarian, setVeterinarian] = useState<Veterinarian>(() => 
    getStoredItemForUser(prefix, 'veterinarian', INITIAL_VET)
  );

  // Firebase Authentication is authoritative whenever Firebase is configured.
  useEffect(() => {
    const { auth } = getFirebaseServices();
    if (!auth) {
      // Remove credentials from the legacy local-only authentication flow.
      localStorage.removeItem('modo_mascota_users');
      localStorage.removeItem('modo_mascota_current_user');
      setAuthReady(true);
      return;
    }

    return onAuthStateChanged(auth, (firebaseUser) => {
      setCurrentUser(firebaseUser ? mapFirebaseUser(firebaseUser) : null);
      setAuthReady(true);
    });
  }, []);

  // Reload user-scoped data when currentUser changes and hydrate from Firebase.
  useEffect(() => {
    if (!authReady) return;
    const userPrefix = getPrefixForUser(currentUser);
    setIsHydrated(false);
    const loadedPets = getStoredItemForUser<Pet[]>(userPrefix, 'pets', currentUser ? [] : INITIAL_PETS);
    setPets(loadedPets);
    setSelectedPetId(loadedPets[0]?.id || '');
    setHealthRecords(getStoredItemForUser(userPrefix, 'health_records', currentUser ? [] : INITIAL_HEALTH_RECORDS));
    setMedications(getStoredItemForUser(userPrefix, 'medications', currentUser ? [] : INITIAL_MEDICATIONS));
    setReminders(getStoredItemForUser(userPrefix, 'reminders', currentUser ? [] : INITIAL_REMINDERS));
    setDailyRecords(getStoredItemForUser(userPrefix, 'daily_records', currentUser ? [] : INITIAL_DAILY_RECORDS));
    setDiaryEntries(getStoredItemForUser(userPrefix, 'diary_entries', currentUser ? [] : INITIAL_DIARY_ENTRIES));
    setExpenses(getStoredItemForUser(userPrefix, 'expenses', currentUser ? [] : INITIAL_EXPENSES));
    setVeterinarian(getStoredItemForUser(userPrefix, 'veterinarian', INITIAL_VET));
    setDarkMode(getStoredItemForUser(userPrefix, 'dark_mode', false));
    setMonthlyBudget(getStoredItemForUser(userPrefix, 'monthly_budget', 500));
    setShowAiAssistantInHeader(getStoredItemForUser(userPrefix, 'show_ai_in_header', true));

    // Fetch from Firebase Cloud Database if user is logged in
    const db = getDb();
    if (db && currentUser) {
      getDoc(doc(db, 'users', currentUser.id, 'data', 'user_store'))
        .then(docSnap => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (Array.isArray(data?.pets) && data.pets.length > 0) {
              setPets(data.pets);
              setSelectedPetId(data.pets[0].id);
              localStorage.setItem(userPrefix + 'pets', JSON.stringify(data.pets));
            }
            if (Array.isArray(data?.healthRecords)) setHealthRecords(data.healthRecords);
            if (Array.isArray(data?.medications)) setMedications(data.medications);
            if (Array.isArray(data?.reminders)) setReminders(data.reminders);
            if (Array.isArray(data?.dailyRecords)) setDailyRecords(data.dailyRecords);
            if (Array.isArray(data?.diaryEntries)) setDiaryEntries(data.diaryEntries);
            if (Array.isArray(data?.expenses)) setExpenses(data.expenses);
            if (data?.veterinarian) setVeterinarian(data.veterinarian);
            if (typeof data?.monthlyBudget === 'number') setMonthlyBudget(data.monthlyBudget);
            if (typeof data?.darkMode === 'boolean') setDarkMode(data.darkMode);
            if (typeof data?.showAiAssistantInHeader === 'boolean') setShowAiAssistantInHeader(data.showAiAssistantInHeader);
          }
        })
        .catch(err => console.warn('Firebase DB load info:', err))
        .finally(() => setIsHydrated(true));
    } else {
      setIsHydrated(true);
    }
  }, [authReady, currentUser]);

  // Sync to Firebase Helper
  const syncToFirebase = (updatedStore: Partial<{
    pets: Pet[];
    healthRecords: HealthRecord[];
    medications: Medication[];
    reminders: Reminder[];
    dailyRecords: DailyRecord[];
    diaryEntries: DiaryEntry[];
    expenses: Expense[];
    veterinarian: Veterinarian;
    monthlyBudget: number;
    darkMode: boolean;
    showAiAssistantInHeader: boolean;
  }>) => {
    const dbInstance = getDb();
    if (dbInstance && currentUser) {
      setDoc(doc(dbInstance, 'users', currentUser.id, 'data', 'user_store'), updatedStore, { merge: true })
        .catch(err => console.warn('Firebase sync error:', err));
    }
  };

  // Auth Methods
  const registerUser = async (name: string, username: string, password: string) => {
    const cleanUsername = username.toLowerCase().trim();

    const { auth, db } = getFirebaseServices();
    if (auth) {
      if (!cleanUsername.includes('@')) {
        return { success: false, error: 'Con Firebase debes registrarte con un correo electrónico.' };
      }

      try {
        const credential = await createUserWithEmailAndPassword(auth, cleanUsername, password);
        await updateProfile(credential.user, { displayName: name.trim() });
        const firebaseUser = mapFirebaseUser(credential.user);
        setCurrentUser(firebaseUser);

        if (db) {
          await setDoc(doc(db, 'users', firebaseUser.id), {
            id: firebaseUser.id,
            name: firebaseUser.name,
            username: firebaseUser.username,
            email: firebaseUser.email,
            created_at: firebaseUser.created_at,
          }, { merge: true });
        }

        return { success: true, user: firebaseUser };
      } catch (error) {
        return { success: false, error: getFirebaseAuthError(error) };
      }
    }

    return { success: false, error: 'Configura Firebase para crear una cuenta. Puedes continuar como invitado.' };
  };

  const loginUser = async (username: string, password: string) => {
    const cleanUsername = username.toLowerCase().trim();

    const { auth } = getFirebaseServices();
    if (auth) {
      if (!cleanUsername.includes('@')) {
        return { success: false, error: 'Ingresa el correo electrónico asociado a tu cuenta.' };
      }

      try {
        const credential = await signInWithEmailAndPassword(auth, cleanUsername, password);
        const firebaseUser = mapFirebaseUser(credential.user);
        setCurrentUser(firebaseUser);
        return { success: true, user: firebaseUser };
      } catch (error) {
        return { success: false, error: getFirebaseAuthError(error) };
      }
    }

    return { success: false, error: 'Configura Firebase para iniciar sesión. Puedes continuar como invitado.' };
  };

  const logoutUser = async () => {
    const { auth } = getFirebaseServices();
    if (auth) {
      await signOut(auth);
      return;
    }
    setCurrentUser(null);
  };

  // Apply the theme globally. Persistence is handled by the centralized store effect.
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Backup & Restore
  const exportBackupData = () => {
    const backup = {
      version: '1.0.0',
      exported_at: new Date().toISOString(),
      pets,
      healthRecords,
      medications,
      reminders,
      dailyRecords,
      diaryEntries,
      expenses,
      veterinarian,
      monthlyBudget,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `modo_mascota_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importBackupData = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.pets)) setPets(data.pets);
      if (Array.isArray(data.healthRecords)) setHealthRecords(data.healthRecords);
      if (Array.isArray(data.medications)) setMedications(data.medications);
      if (Array.isArray(data.reminders)) setReminders(data.reminders);
      if (Array.isArray(data.dailyRecords)) setDailyRecords(data.dailyRecords);
      if (Array.isArray(data.diaryEntries)) setDiaryEntries(data.diaryEntries);
      if (Array.isArray(data.expenses)) setExpenses(data.expenses);
      if (data.veterinarian) setVeterinarian(data.veterinarian);
      if (typeof data.monthlyBudget === 'number') setMonthlyBudget(data.monthlyBudget);
      return true;
    } catch (e) {
      console.error('Failed to import backup:', e);
      return false;
    }
  };


  // Persist the complete store in one place so every action is saved locally and in Firebase.
  useEffect(() => {
    // The first effect after a user switch still contains the previous user's state.
    if (lastPersistedPrefixRef.current !== prefix) {
      lastPersistedPrefixRef.current = prefix;
      return;
    }
    if (!authReady || !isHydrated) return;

    const store = {
      pets: pets || [],
      healthRecords: healthRecords || [],
      medications: medications || [],
      reminders: reminders || [],
      dailyRecords: dailyRecords || [],
      diaryEntries: diaryEntries || [],
      expenses: expenses || [],
      veterinarian: veterinarian || INITIAL_VET,
      monthlyBudget,
      darkMode,
      showAiAssistantInHeader,
    };

    localStorage.setItem(prefix + 'pets', JSON.stringify(store.pets));
    localStorage.setItem(prefix + 'selected_pet_id', JSON.stringify(selectedPetId || ''));
    localStorage.setItem(prefix + 'health_records', JSON.stringify(store.healthRecords));
    localStorage.setItem(prefix + 'medications', JSON.stringify(store.medications));
    localStorage.setItem(prefix + 'reminders', JSON.stringify(store.reminders));
    localStorage.setItem(prefix + 'daily_records', JSON.stringify(store.dailyRecords));
    localStorage.setItem(prefix + 'diary_entries', JSON.stringify(store.diaryEntries));
    localStorage.setItem(prefix + 'expenses', JSON.stringify(store.expenses));
    localStorage.setItem(prefix + 'veterinarian', JSON.stringify(store.veterinarian));
    localStorage.setItem(prefix + 'monthly_budget', JSON.stringify(monthlyBudget));
    localStorage.setItem(prefix + 'dark_mode', JSON.stringify(darkMode));
    localStorage.setItem(prefix + 'show_ai_in_header', JSON.stringify(showAiAssistantInHeader));

    syncToFirebase(store);
  }, [
    prefix,
    authReady,
    isHydrated,
    pets,
    selectedPetId,
    healthRecords,
    medications,
    reminders,
    dailyRecords,
    diaryEntries,
    expenses,
    veterinarian,
    monthlyBudget,
    darkMode,
    showAiAssistantInHeader,
  ]);

  // Safe Array Computations
  const safePets = Array.isArray(pets) ? pets : [];
  const selectedPet = safePets.find(p => p && p.id === selectedPetId) || safePets[0];

  const safeHealth = Array.isArray(healthRecords) ? healthRecords : [];
  const petHealthRecords = safeHealth
    .filter(r => r && r.pet_id === selectedPet?.id)
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

  const safeMeds = Array.isArray(medications) ? medications : [];
  const petMedications = safeMeds.filter(m => m && m.pet_id === selectedPet?.id);

  const safeReminders = Array.isArray(reminders) ? reminders : [];
  const petReminders = safeReminders
    .filter(r => r && r.pet_id === selectedPet?.id)
    .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));

  const safeDaily = Array.isArray(dailyRecords) ? dailyRecords : [];
  const petDailyRecords = safeDaily
    .filter(d => d && d.pet_id === selectedPet?.id)
    .sort((a, b) => {
      const timeA = new Date((a.date || '') + 'T' + (a.time || '00:00')).getTime() || 0;
      const timeB = new Date((b.date || '') + 'T' + (b.time || '00:00')).getTime() || 0;
      return timeB - timeA;
    });

  const latestDailyRecord = petDailyRecords[0];

  const safeDiary = Array.isArray(diaryEntries) ? diaryEntries : [];
  const petDiaryEntries = safeDiary
    .filter(d => d && d.pet_id === selectedPet?.id)
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const petExpenses = safeExpenses
    .filter(e => e && e.pet_id === selectedPet?.id)
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

  // Pet Actions
  const addPet = (petData: Omit<Pet, 'id' | 'created_at'>): Pet => {
    const newPet: Pet = {
      ...petData,
      id: `pet_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
    };
    setPets(prev => {
      const updated = [...prev, newPet];
      return updated;
    });
    setSelectedPetId(newPet.id);
    return newPet;
  };

  const updatePet = (id: string, updates: Partial<Pet>) => {
    setPets(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePet = (id: string) => {
    setPets(prev => {
      const remaining = prev.filter(p => p.id !== id);
      if (selectedPetId === id) {
        setSelectedPetId(remaining[0]?.id || '');
      }
      return remaining;
    });

    // Clean up sub-entities
    setHealthRecords(prev => prev.filter(r => r.pet_id !== id));
    setMedications(prev => prev.filter(m => m.pet_id !== id));
    setReminders(prev => prev.filter(r => r.pet_id !== id));
    setDailyRecords(prev => prev.filter(d => d.pet_id !== id));
    setDiaryEntries(prev => prev.filter(d => d.pet_id !== id));
    setExpenses(prev => prev.filter(e => e.pet_id !== id));
  };

  // Health Actions
  const addHealthRecord = (recordData: Omit<HealthRecord, 'id'>): HealthRecord => {
    const newRecord: HealthRecord = {
      ...recordData,
      id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setHealthRecords(prev => [newRecord, ...prev]);
    return newRecord;
  };

  const updateHealthRecord = (id: string, updates: Partial<HealthRecord>) => {
    setHealthRecords(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteHealthRecord = (id: string) => {
    setHealthRecords(prev => prev.filter(r => r.id !== id));
  };

  // Medication Actions
  const addMedication = (medData: Omit<Medication, 'id'>): Medication => {
    const newMed: Medication = {
      ...medData,
      id: `med_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setMedications(prev => [newMed, ...prev]);
    return newMed;
  };

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    setMedications(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteMedication = (id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id));
  };

  // Reminder Actions
  const addReminder = (remData: Omit<Reminder, 'id'>): Reminder => {
    const newRem: Reminder = {
      ...remData,
      id: `rem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setReminders(prev => [newRem, ...prev]);
    return newRem;
  };

  const toggleReminder = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setReminders(prev =>
      prev.map(r => {
        if (r.id === id) {
          const completedToday = r.recurrence === 'daily'
            ? r.completed_date === today
            : r.completed;
          const completed = !completedToday;
          return {
            ...r,
            // Daily reminders are evaluated by completed_date, so they become
            // available again automatically on the next calendar day.
            completed: r.recurrence === 'daily' ? true : completed,
            completed_at: completed ? new Date().toISOString() : undefined,
            completed_date: r.recurrence === 'daily'
              ? (completed ? today : undefined)
              : undefined,
          };
        }
        return r;
      })
    );
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  // Daily Check Actions
  const addDailyRecord = (recData: Omit<DailyRecord, 'id'>): DailyRecord => {
    const newRec: DailyRecord = {
      ...recData,
      id: `daily_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setDailyRecords(prev => [newRec, ...prev]);
    return newRec;
  };

  // Diary Actions
  const addDiaryEntry = (entryData: Omit<DiaryEntry, 'id' | 'created_at'>): DiaryEntry => {
    const newEntry: DiaryEntry = {
      ...entryData,
      id: `diary_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    setDiaryEntries(prev => [newEntry, ...prev]);
    return newEntry;
  };

  const deleteDiaryEntry = (id: string) => {
    setDiaryEntries(prev => prev.filter(d => d.id !== id));
  };

  // Expense Actions
  const addExpense = (expenseData: Omit<Expense, 'id' | 'created_at'>): Expense => {
    const newExp: Expense = {
      ...expenseData,
      id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    setExpenses(prev => [newExp, ...prev]);
    return newExp;
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Veterinarian
  const updateVeterinarian = (updates: Partial<Veterinarian>) => {
    setVeterinarian(prev => ({ ...prev, ...updates }));
  };

  // Reset to Demo Data
  const resetToDemoData = () => {
    setPets(INITIAL_PETS);
    setSelectedPetId(INITIAL_PETS[0].id);
    setHealthRecords(INITIAL_HEALTH_RECORDS);
    setMedications(INITIAL_MEDICATIONS);
    setReminders(INITIAL_REMINDERS);
    setDailyRecords(INITIAL_DAILY_RECORDS);
    setDiaryEntries(INITIAL_DIARY_ENTRIES);
    setExpenses(INITIAL_EXPENSES);
    setVeterinarian(INITIAL_VET);
    setMonthlyBudget(500);
    setDarkMode(false);
    setShowAiAssistantInHeader(true);
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        selectedPet,
        setSelectedPetId,
        currentView,
        setCurrentView,
        
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        registerUser,
        loginUser,
        logoutUser,

        isEmergencyOpen,
        setIsEmergencyOpen,
        isDailyCheckOpen,
        setIsDailyCheckOpen,
        isAddPetOpen,
        setIsAddPetOpen,
        editingPet,
        setEditingPet,
        isPetSwitcherOpen,
        setIsPetSwitcherOpen,

        isGeminiAssistantOpen,
        setIsGeminiAssistantOpen,
        isPetCardExportOpen,
        setIsPetCardExportOpen,
        isFoodCalculatorOpen,
        setIsFoodCalculatorOpen,
        isBackupOpen,
        setIsBackupOpen,

        darkMode,
        setDarkMode,
        monthlyBudget,
        setMonthlyBudget,
        showAiAssistantInHeader,
        setShowAiAssistantInHeader,

        exportBackupData,
        importBackupData,


        addPet,
        updatePet,
        deletePet,

        healthRecords,
        petHealthRecords,
        addHealthRecord,
        updateHealthRecord,
        deleteHealthRecord,

        medications,
        petMedications,
        addMedication,
        updateMedication,
        deleteMedication,

        reminders,
        petReminders,
        addReminder,
        toggleReminder,
        updateReminder,
        deleteReminder,

        dailyRecords,
        petDailyRecords,
        latestDailyRecord,
        addDailyRecord,

        diaryEntries,
        petDiaryEntries,
        addDiaryEntry,
        deleteDiaryEntry,

        expenses,
        petExpenses,
        addExpense,
        deleteExpense,

        veterinarian,
        updateVeterinarian,

        resetToDemoData,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

export const usePetContext = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePetContext must be used within a PetProvider');
  }
  return context;
};
