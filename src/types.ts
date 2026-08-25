export type SpeciesType = 'Perro' | 'Gato' | 'Conejo' | 'Ave' | 'Otro';
export type SexType = 'Macho' | 'Hembra';

export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  password?: string;
  avatar?: string;
  created_at: string;
}

export interface Pet {
  id: string;
  user_id: string;
  name: string;
  species: SpeciesType;
  breed: string;
  sex: SexType;
  birth_date: string;
  approximate_age: string;
  weight: number; // in kg
  color: string;
  adoption_date: string;
  photo: string;
  notes: string;
  allergies?: string;
  important_alert?: string;
  created_at: string;
}

export type HealthRecordType = 
  | 'Vacuna'
  | 'Consulta'
  | 'Examen'
  | 'Desparasitación'
  | 'Antipulgas'
  | 'Medicina'
  | 'Peso'
  | 'Cirugía';

export interface HealthRecord {
  id: string;
  pet_id: string;
  type: HealthRecordType;
  title: string;
  date: string;
  next_date?: string;
  description?: string;
  veterinarian?: string;
  clinic?: string;
  notes?: string;
  dose?: string;
  product?: string;
  attachment?: string;
  weight_value?: number;
  completed?: boolean;
}

export interface Vaccine {
  id: string;
  pet_id: string;
  name: string;
  application_date: string;
  next_date?: string;
  veterinarian?: string;
  notes?: string;
  completed?: boolean;
}

export interface Deworming {
  id: string;
  pet_id: string;
  product: string;
  date: string;
  next_date?: string;
  dose: string;
  notes?: string;
}

export interface FleaTreatment {
  id: string;
  pet_id: string;
  product: string;
  application_date: string;
  next_date?: string;
  notes?: string;
}

export interface Medication {
  id: string;
  pet_id: string;
  name: string;
  dose: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  instructions: string;
  status: 'active' | 'finished';
  notes?: string;
}

export type ReminderCategory = 
  | 'Vacunas'
  | 'Desparasitación'
  | 'Antipulgas'
  | 'Medicamentos'
  | 'Veterinario'
  | 'Baño'
  | 'Corte de uñas'
  | 'Alimentación'
  | 'Otros';

export interface Reminder {
  id: string;
  pet_id: string;
  category: ReminderCategory;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  recurrence?: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  completed: boolean;
  completed_at?: string;
}

export type AppetiteLevel = 'malo' | 'regular' | 'bueno';
export type EnergyLevel = 'baja' | 'media' | 'alta';
export type MoodLevel = 'triste' | 'molesto' | 'feliz' | 'relajado' | 'jugueton';

export interface DailyRecord {
  id: string;
  pet_id: string;
  date: string; // YYYY-MM-DD
  time: string;
  appetite: AppetiteLevel;
  water?: 'bajo' | 'normal' | 'alto';
  energy: EnergyLevel;
  stool_ok: boolean;
  vomiting: boolean;
  mood: MoodLevel;
  behavior?: string;
  notes?: string;
  last_walk?: string;
}

export interface DiaryEntry {
  id: string;
  pet_id: string;
  date: string; // YYYY-MM-DD
  photo: string;
  title: string;
  description: string;
  mood: string;
  tags?: string[];
  created_at: string;
}

export type ExpenseCategory = 
  | 'Alimento'
  | 'Veterinario'
  | 'Medicamentos'
  | 'Higiene'
  | 'Juguetes'
  | 'Accesorios'
  | 'Otros';

export interface Expense {
  id: string;
  pet_id: string;
  category: ExpenseCategory;
  description: string;
  amount: number; // in S/ (Soles)
  date: string; // YYYY-MM-DD
  created_at?: string;
}

export interface Veterinarian {
  id: string;
  user_id: string;
  name: string;
  clinic: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface BackupData {
  version: string;
  exported_at: string;
  pets: Pet[];
  healthRecords: HealthRecord[];
  medications: Medication[];
  reminders: Reminder[];
  dailyRecords: DailyRecord[];
  diaryEntries: DiaryEntry[];
  expenses: Expense[];
  veterinarian: Veterinarian;
  monthlyBudget?: number;
}

