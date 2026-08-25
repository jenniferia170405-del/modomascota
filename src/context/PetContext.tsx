import React, { createContext, useContext, useState, useEffect } from 'react';
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
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Helper to format email for Supabase Auth
function getFormattedEmail(usernameOrEmail: string): string {
  const clean = usernameOrEmail.trim().toLowerCase();
  return clean.includes('@') ? clean : `${clean}@modomascota.app`;
}

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

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth & User Management States
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem('modo_mascota_users');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('modo_mascota_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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

  // Sync users & current user to localStorage
  useEffect(() => {
    localStorage.setItem('modo_mascota_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('modo_mascota_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('modo_mascota_current_user');
    }
  }, [currentUser]);

  // Reload user-scoped data when currentUser changes & sync with Supabase DB
  useEffect(() => {
    const userPrefix = getPrefixForUser(currentUser);
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

    // Fetch from Supabase Cloud Database if user is logged in
    if (supabase && currentUser) {
      supabase
        .from('pets')
        .select('*')
        .eq('user_id', currentUser.id)
        .then(({ data, error }) => {
          if (!error && Array.isArray(data) && data.length > 0) {
            setPets(data as Pet[]);
            setSelectedPetId(data[0].id);
            localStorage.setItem(userPrefix + 'pets', JSON.stringify(data));
          }
        })
        .catch(err => console.warn('Cloud DB load info:', err));
    }
  }, [currentUser]);

  // Auth Methods
  const registerUser = async (name: string, username: string, password: string) => {
    const cleanUsername = username.toLowerCase().trim();
    const email = getFormattedEmail(cleanUsername);

    // If Supabase Cloud is configured
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, username: cleanUsername },
          },
        });

        if (error) {
          if (error.message?.toLowerCase().includes('rate limit') || error.message?.toLowerCase().includes('email')) {
            console.warn('Supabase email rate limit exceeded. Falling back to instant account creation:', error.message);
            // Fallback to local instant creation so user is never blocked!
          } else {
            return { success: false, error: error.message };
          }
        } else {
          const newUser: User = {
            id: data.user?.id || `u_${Date.now()}`,
            name,
            username: cleanUsername,
            email,
            created_at: new Date().toISOString(),
          };

          setUsers(prev => [...prev.filter(u => u.username !== cleanUsername), newUser]);
          setCurrentUser(newUser);
          return { success: true, user: newUser };
        }
      } catch (err: any) {
        console.warn('Supabase register fallback to local:', err);
      }
    }

    // Local Fallback
    if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, error: 'El nombre de usuario o correo ya está registrado.' };
    }
    const newUser: User = {
      id: `u_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      username: cleanUsername,
      password,
      created_at: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const loginUser = async (username: string, password: string) => {
    const cleanUsername = username.toLowerCase().trim();
    const email = getFormattedEmail(cleanUsername);

    // If Supabase Cloud is configured
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Check local fallback
          const localUser = users.find(u => u.username.toLowerCase() === cleanUsername && u.password === password);
          if (localUser) {
            setCurrentUser(localUser);
            return { success: true, user: localUser };
          }
          return { success: false, error: 'Usuario o contraseña incorrectos en la nube.' };
        }

        const userMeta = data.user?.user_metadata || {};
        const loggedUser: User = {
          id: data.user?.id || `u_${Date.now()}`,
          name: userMeta.name || cleanUsername,
          username: userMeta.username || cleanUsername,
          email: data.user?.email,
          created_at: new Date().toISOString(),
        };

        setCurrentUser(loggedUser);
        return { success: true, user: loggedUser };
      } catch (err: any) {
        console.warn('Supabase login fallback:', err);
      }
    }

    // Local Fallback
    const foundUser = users.find(u => u.username.toLowerCase() === cleanUsername && u.password === password);
    if (!foundUser) {
      return { success: false, error: 'Usuario o contraseña incorrectos.' };
    }
    setCurrentUser(foundUser);
    return { success: true, user: foundUser };
  };

  const logoutUser = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // ignore
      }
    }
    setCurrentUser(null);
  };

  // Dark Mode & Budget Sync
  useEffect(() => {
    localStorage.setItem(prefix + 'dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode, prefix]);

  useEffect(() => {
    localStorage.setItem(prefix + 'monthly_budget', JSON.stringify(monthlyBudget));
  }, [monthlyBudget, prefix]);

  useEffect(() => {
    localStorage.setItem(prefix + 'show_ai_in_header', JSON.stringify(showAiAssistantInHeader));
  }, [showAiAssistantInHeader, prefix]);

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


  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(prefix + 'pets', JSON.stringify(pets || []));
  }, [pets, prefix]);

  useEffect(() => {
    localStorage.setItem(prefix + 'selected_pet_id', JSON.stringify(selectedPetId || ''));
  }, [selectedPetId, prefix]);

  useEffect(() => {
    localStorage.setItem(prefix + 'health_records', JSON.stringify(healthRecords || []));
  }, [healthRecords, prefix]);

  useEffect(() => {
    localStorage.setItem(prefix + 'medications', JSON.stringify(medications || []));
  }, [medications, prefix]);

  useEffect(() => {
    localStorage.setItem(prefix + 'reminders', JSON.stringify(reminders || []));
  }, [reminders, prefix]);

  useEffect(() => {
    localStorage.setItem(prefix + 'daily_records', JSON.stringify(dailyRecords || []));
  }, [dailyRecords, prefix]);

  useEffect(() => {
    localStorage.setItem(prefix + 'diary_entries', JSON.stringify(diaryEntries || []));
  }, [diaryEntries, prefix]);

  useEffect(() => {
    localStorage.setItem(prefix + 'expenses', JSON.stringify(expenses || []));
  }, [expenses, prefix]);

  useEffect(() => {
    localStorage.setItem(prefix + 'veterinarian', JSON.stringify(veterinarian || INITIAL_VET));
  }, [veterinarian, prefix]);

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
      localStorage.setItem(prefix + 'pets', JSON.stringify(updated));
      return updated;
    });
    setSelectedPetId(newPet.id);
    localStorage.setItem(prefix + 'selected_pet_id', JSON.stringify(newPet.id));

    // Async push to Supabase Cloud DB if logged in
    if (supabase && currentUser) {
      supabase
        .from('pets')
        .insert({
          id: newPet.id,
          user_id: currentUser.id,
          name: newPet.name,
          species: newPet.species,
          breed: newPet.breed || '',
          sex: newPet.sex || 'Macho',
          birth_date: newPet.birth_date || '',
          approximate_age: newPet.approximate_age || '',
          weight: newPet.weight || 0,
          color: newPet.color || '',
          adoption_date: newPet.adoption_date || '',
          photo: newPet.photo || '',
          notes: newPet.notes || '',
          allergies: newPet.allergies || '',
          important_alert: newPet.important_alert || '',
        })
        .then(({ error }) => {
          if (error) console.warn('Supabase DB save error:', error.message);
        });
    }

    return newPet;
  };

  const updatePet = (id: string, updates: Partial<Pet>) => {
    setPets(prev => {
      const updated = prev.map(p => (p.id === id ? { ...p, ...updates } : p));
      localStorage.setItem(prefix + 'pets', JSON.stringify(updated));
      return updated;
    });

    if (supabase && currentUser) {
      supabase
        .from('pets')
        .update(updates)
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.warn('Supabase DB update error:', error.message);
        });
    }
  };

  const deletePet = (id: string) => {
    setPets(prev => {
      const remaining = prev.filter(p => p.id !== id);
      if (selectedPetId === id && remaining.length > 0) {
        setSelectedPetId(remaining[0].id);
      }
      localStorage.setItem(prefix + 'pets', JSON.stringify(remaining));
      return remaining;
    });

    if (supabase && currentUser) {
      supabase
        .from('pets')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.warn('Supabase DB delete error:', error.message);
        });
    }

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
    setReminders(prev =>
      prev.map(r => {
        if (r.id === id) {
          const completed = !r.completed;
          return {
            ...r,
            completed,
            completed_at: completed ? new Date().toISOString() : undefined,
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
    localStorage.clear();
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
