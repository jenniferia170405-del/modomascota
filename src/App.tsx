import React from 'react';
import { PetProvider, usePetContext } from './context/PetContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { EmergencyModal } from './components/EmergencyModal';
import { DailyCheckModal } from './components/DailyCheckModal';
import { AddEditPetModal } from './components/AddEditPetModal';
import { GeminiAssistantModal } from './components/GeminiAssistantModal';
import { PetCardExportModal } from './components/PetCardExportModal';
import { FoodCalculatorModal } from './components/FoodCalculatorModal';
import { BackupModal } from './components/BackupModal';

import { HomeView } from './views/HomeView';
import { HealthView } from './views/HealthView';
import { RemindersView } from './views/RemindersView';
import { DiaryView } from './views/DiaryView';
import { ProfileView } from './views/ProfileView';
import { ExpensesView } from './views/ExpensesView';
import { AllPetsView } from './views/AllPetsView';

const MainContent: React.FC = () => {
  const { currentView } = usePetContext();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'health':
        return <HealthView />;
      case 'reminders':
        return <RemindersView />;
      case 'diary':
        return <DiaryView />;
      case 'profile':
        return <ProfileView />;
      case 'expenses':
        return <ExpensesView />;
      case 'all-pets':
        return <AllPetsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F2] dark:bg-slate-950 text-[#374745] dark:text-slate-100 font-body flex flex-col md:pl-64 transition-colors">
      {/* Top Navbar */}
      <Navbar />

      {/* Main View Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-12">
        {renderView()}
      </main>

      {/* Bottom Nav for Mobile / Sidebar for Desktop */}
      <BottomNav />

      {/* Global Modals */}
      <EmergencyModal />
      <DailyCheckModal />
      <AddEditPetModal />
      <GeminiAssistantModal />
      <PetCardExportModal />
      <FoodCalculatorModal />
      <BackupModal />
    </div>
  );
};


export default function App() {
  return (
    <PetProvider>
      <MainContent />
    </PetProvider>
  );
}
