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
  registerUser: (name: string, username: string, password: string) => { success: boolean; user?: User; error?: string };
  loginUser: (username: string, password: string) => { success: boolean; user?: User; error?: string };
  logoutUser: () => void;

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

  // Reload user-scoped data when currentUser changes
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
  }, [currentUser]);

  // Auth Methods
  const registerUser = (name: string, username: string, password: string) => {
    const cleanUsername = username.toLowerCase().trim();
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

  const loginUser = (username: string, password: string) => {
    const cleanUsername = username.toLowerCase().trim();
    const foundUser = users.find(u => u.username.toLowerCase() === cleanUsername && u.password === password);
    if (!foundUser) {
      return { success: false, error: 'Usuario o contraseña incorrectos.' };
    }
    setCurrentUser(foundUser);
    return { success: true, user: foundUser };
  };

  const logoutUser = () => {
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
    localStorage.setItem(STORAGE_PREFIX + 'pets', JSON.stringify(pets));
  }, [pets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'selected_pet_id', JSON.stringify(selectedPetId));
  }, [selectedPetId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'health_records', JSON.stringify(healthRecords));
  }, [healthRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'daily_records', JSON.stringify(dailyRecords));
  }, [dailyRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'diary_entries', JSON.stringify(diaryEntries));
  }, [diaryEntries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'veterinarian', JSON.stringify(veterinarian));
  }, [veterinarian]);

  // Selected Pet Computation
  const selectedPet = pets.find(p => p.id === selectedPetId) || pets[0];

  // Scoped Data by pet_id
  const petHealthRecords = healthRecords
    .filter(r => r.pet_id === selectedPetId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const petMedications = medications.filter(m => m.pet_id === selectedPetId);

  const petReminders = reminders
    .filter(r => r.pet_id === selectedPetId)
    .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));

  const petDailyRecords = dailyRecords
    .filter(d => d.pet_id === selectedPetId)
    .sort((a, b) => new Date(b.date + 'T' + (b.time || '00:00')).getTime() - new Date(a.date + 'T' + (a.time || '00:00')).getTime());

  const latestDailyRecord = petDailyRecords[0];

  const petDiaryEntries = diaryEntries
    .filter(d => d.pet_id === selectedPetId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const petExpenses = expenses
    .filter(e => e.pet_id === selectedPetId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Pet Actions
  const addPet = (petData: Omit<Pet, 'id' | 'created_at'>): Pet => {
    const newPet: Pet = {
      ...petData,
      id: `pet_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
    };
    setPets(prev => [...prev, newPet]);
    setSelectedPetId(newPet.id);
    return newPet;
  };

  const updatePet = (id: string, updates: Partial<Pet>) => {
    setPets(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePet = (id: string) => {
    setPets(prev => {
      const remaining = prev.filter(p => p.id !== id);
      if (selectedPetId === id && remaining.length > 0) {
        setSelectedPetId(remaining[0].id);
      }
      return remaining;
    });
    // Also clean up sub-entities
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
