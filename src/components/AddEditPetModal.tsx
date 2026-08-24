import React, { useState, useEffect } from 'react';
import { usePetContext } from '../context/PetContext';
import { SpeciesType, SexType, Pet } from '../types';
import { X, Upload, Camera, Sparkles, Trash2, AlertCircle } from 'lucide-react';

const PRESET_AVATARS = [
  { name: 'Golden Dog', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80', species: 'Perro' },
  { name: 'Husky / Spitz', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80', species: 'Perro' },
  { name: 'Puppy Cute', url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80', species: 'Perro' },
  { name: 'Siamese Cat', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80', species: 'Gato' },
  { name: 'Tabby Cat', url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80', species: 'Gato' },
  { name: 'Ginger Cat', url: 'https://images.unsplash.com/photo-1513360309081-38f076278fef?auto=format&fit=crop&w=600&q=80', species: 'Gato' },
  { name: 'Bunny Rabbit', url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80', species: 'Conejo' },
  { name: 'Parrot / Bird', url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80', species: 'Ave' },
];

export const AddEditPetModal: React.FC = () => {
  const { 
    isAddPetOpen, 
    setIsAddPetOpen, 
    editingPet, 
    setEditingPet, 
    addPet, 
    updatePet, 
    deletePet,
    setCurrentView 
  } = usePetContext();

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<SpeciesType>('Perro');
  const [breed, setBreed] = useState('');
  const [sex, setSex] = useState<SexType>('Macho');
  const [birthDate, setBirthDate] = useState('');
  const [approxAge, setApproxAge] = useState('');
  const [weight, setWeight] = useState<number | ''>('');
  const [color, setColor] = useState('');
  const [adoptionDate, setAdoptionDate] = useState('');
  const [photo, setPhoto] = useState('');
  const [notes, setNotes] = useState('');
  const [allergies, setAllergies] = useState('');
  const [importantAlert, setImportantAlert] = useState('');
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingPet) {
      setName(editingPet.name);
      setSpecies(editingPet.species);
      setBreed(editingPet.breed);
      setSex(editingPet.sex);
      setBirthDate(editingPet.birth_date || '');
      setApproxAge(editingPet.approximate_age || '');
      setWeight(editingPet.weight || '');
      setColor(editingPet.color || '');
      setAdoptionDate(editingPet.adoption_date || '');
      setPhoto(editingPet.photo || '');
      setNotes(editingPet.notes || '');
      setAllergies(editingPet.allergies || '');
      setImportantAlert(editingPet.important_alert || '');
    } else {
      setName('');
      setSpecies('Perro');
      setBreed('');
      setSex('Macho');
      setBirthDate('');
      setApproxAge('');
      setWeight('');
      setColor('');
      setAdoptionDate('');
      setPhoto(PRESET_AVATARS[0].url);
      setNotes('');
      setAllergies('');
      setImportantAlert('');
    }
    setShowDeleteConfirm(false);
    setErrorMsg('');
  }, [editingPet, isAddPetOpen]);

  if (!isAddPetOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateAge = (dateString: string) => {
    if (!dateString) return;
    const birth = new Date(dateString);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
      years--;
      months += 12;
    }
    if (years > 0) {
      setApproxAge(`${years} ${years === 1 ? 'año' : 'años'}`);
    } else if (months > 0) {
      setApproxAge(`${months} ${months === 1 ? 'mes' : 'meses'}`);
    } else {
      setApproxAge('Cachorro');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Por favor ingresa el nombre de la mascota.');
      return;
    }
    if (!breed.trim()) {
      setErrorMsg('Por favor ingresa la raza o mestizo.');
      return;
    }
    if (weight === '' || Number(weight) <= 0) {
      setErrorMsg('Por favor ingresa un peso válido en kg.');
      return;
    }

    const petData = {
      user_id: 'user_main',
      name: name.trim(),
      species,
      breed: breed.trim(),
      sex,
      birth_date: birthDate || new Date().toISOString().split('T')[0],
      approximate_age: approxAge.trim() || '1 año',
      weight: Number(weight),
      color: color.trim() || 'Mestizo',
      adoption_date: adoptionDate || new Date().toISOString().split('T')[0],
      photo: photo || PRESET_AVATARS[0].url,
      notes: notes.trim(),
      allergies: allergies.trim() || undefined,
      important_alert: importantAlert.trim() || undefined,
    };

    if (editingPet) {
      updatePet(editingPet.id, petData);
    } else {
      addPet(petData);
      setCurrentView('home');
    }

    setIsAddPetOpen(false);
    setEditingPet(null);
  };

  const handleDelete = () => {
    if (editingPet) {
      deletePet(editingPet.id);
      setIsAddPetOpen(false);
      setEditingPet(null);
      setCurrentView('all-pets');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#FAF9F2] rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-[#EEF5F3]">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-[#EEF5F3] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#4DB6AC] text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-2xl">pets</span>
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-[#285E5B] leading-none">
                {editingPet ? `Editar a ${editingPet.name}` : 'Agregar Nueva Mascota'}
              </h2>
              <span className="text-xs text-[#6d7a77]">Información general y perfil</span>
            </div>
          </div>

          <button
            onClick={() => {
              setIsAddPetOpen(false);
              setEditingPet(null);
            }}
            className="p-2 rounded-full bg-[#EEF5F3] text-[#374745] hover:bg-[#daece9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1">
          
          {errorMsg && (
            <div className="p-3 bg-[#F47C7C]/20 border border-[#F47C7C] rounded-2xl text-xs text-[#721A20] font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Photo Section */}
          <div className="bg-white p-5 rounded-2xl border border-[#EEF5F3] shadow-sm flex flex-col items-center gap-4">
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-[#4DB6AC] bg-[#FAF9F2] shadow-md group">
              <img src={photo} alt="Preview" className="w-full h-full object-cover" />
              <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">Cambiar</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div className="w-full">
              <span className="text-xs font-bold text-[#6d7a77] uppercase tracking-wider block mb-2 text-center">
                O elige una foto rápida
              </span>
              <div className="flex gap-2 overflow-x-auto pb-2 justify-center hide-scrollbar">
                {PRESET_AVATARS.map((avatar, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPhoto(avatar.url)}
                    className={`w-11 h-11 rounded-full overflow-hidden border-2 flex-shrink-0 transition-all ${
                      photo === avatar.url ? 'border-[#4DB6AC] scale-110 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Basic Info Fields */}
          <div className="bg-white p-5 rounded-2xl border border-[#EEF5F3] shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-base text-[#285E5B]">Datos Principales</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="text-xs font-bold text-[#6d7a77] block mb-1">Nombre *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Drako, Luna, Max..."
                  className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                  required
                />
              </div>

              {/* Species */}
              <div>
                <label className="text-xs font-bold text-[#6d7a77] block mb-1">Especie *</label>
                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value as SpeciesType)}
                  className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none font-semibold"
                >
                  <option value="Perro">🐶 Perro</option>
                  <option value="Gato">🐱 Gato</option>
                  <option value="Conejo">🐰 Conejo</option>
                  <option value="Ave">🦜 Ave</option>
                  <option value="Otro">🐾 Otro</option>
                </select>
              </div>

              {/* Breed */}
              <div>
                <label className="text-xs font-bold text-[#6d7a77] block mb-1">Raza *</label>
                <input
                  type="text"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="Ej. Golden Retriever, Mestizo..."
                  className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                  required
                />
              </div>

              {/* Sex */}
              <div>
                <label className="text-xs font-bold text-[#6d7a77] block mb-1">Sexo *</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Macho', 'Hembra'] as SexType[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSex(s)}
                      className={`py-2.5 rounded-xl font-heading font-bold text-xs transition-all btn-bounce ${
                        sex === s
                          ? 'bg-[#4DB6AC] text-white shadow-sm'
                          : 'bg-[#FAF9F2] text-[#374745] border border-[#bdc9c6]/40 hover:bg-[#EEF5F3]'
                      }`}
                    >
                      {s === 'Macho' ? '♂ Macho' : '♀ Hembra'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="text-xs font-bold text-[#6d7a77] block mb-1">Peso (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Ej. 12.4"
                  className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                  required
                />
              </div>

              {/* Color */}
              <div>
                <label className="text-xs font-bold text-[#6d7a77] block mb-1">Color / Pelaje</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Ej. Dorado, Blanco con manchas..."
                  className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                />
              </div>

              {/* Birth date */}
              <div>
                <label className="text-xs font-bold text-[#6d7a77] block mb-1">Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => {
                    setBirthDate(e.target.value);
                    calculateAge(e.target.value);
                  }}
                  className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                />
              </div>

              {/* Approx Age */}
              <div>
                <label className="text-xs font-bold text-[#6d7a77] block mb-1">Edad Aproximada</label>
                <input
                  type="text"
                  value={approxAge}
                  onChange={(e) => setApproxAge(e.target.value)}
                  placeholder="Ej. 4 años, 6 meses..."
                  className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                />
              </div>

              {/* Adoption Date */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#6d7a77] block mb-1">Fecha de Adopción / Llegada</label>
                <input
                  type="date"
                  value={adoptionDate}
                  onChange={(e) => setAdoptionDate(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Health & Alerts */}
          <div className="bg-white p-5 rounded-2xl border border-[#EEF5F3] shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-base text-[#285E5B]">Salud & Alertas Importantes</h3>

            <div>
              <label className="text-xs font-bold text-[#6d7a77] block mb-1">Alergias conocidas</label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="Ej. Sensible al pollo, ninguna..."
                className="w-full text-sm p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] focus:border-[#4DB6AC] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#F47C7C] block mb-1">Alerta Médica / Nota de Emergencia</label>
              <input
                type="text"
                value={importantAlert}
                onChange={(e) => setImportantAlert(e.target.value)}
                placeholder="Ej. Sensible a la anestesia, Asustadizo con ruidos..."
                className="w-full text-sm p-3 rounded-xl border-2 border-[#F47C7C]/40 bg-[#FAF9F2] focus:border-[#F47C7C] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#6d7a77] block mb-1">Notas generales sobre su personalidad</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Personalidad, hábitos, gustos, juguetes favoritos..."
                className="w-full min-h-[80px] p-3 rounded-xl border-2 border-[#bdc9c6]/40 bg-[#FAF9F2] text-sm focus:border-[#4DB6AC] outline-none resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-full bg-[#4DB6AC] text-white font-heading font-bold text-base shadow-[0_10px_25px_-5px_rgba(77,182,172,0.3)] hover:opacity-90 active:scale-98 transition-all btn-bounce flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>{editingPet ? 'Guardar Cambios' : 'Crear Perfil de Mascota'}</span>
            </button>

            {/* Delete Option for existing pet */}
            {editingPet && (
              <div className="pt-2">
                {showDeleteConfirm ? (
                  <div className="p-4 bg-[#F47C7C]/20 border border-[#F47C7C] rounded-2xl text-center space-y-3">
                    <p className="text-xs text-[#721A20] font-bold">
                      ¿Seguro que deseas eliminar a {editingPet.name}? Se borrarán todos sus registros de salud, recordatorios, diario y gastos.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="py-2 px-4 rounded-full bg-[#ba1a1a] text-white text-xs font-bold hover:opacity-90 btn-bounce"
                      >
                        Sí, Eliminar Definitivamente
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="py-2 px-4 rounded-full bg-white text-[#374745] text-xs font-bold hover:bg-[#FAF9F2]"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full py-2.5 px-4 text-[#ba1a1a] text-xs font-bold hover:bg-[#F47C7C]/15 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar a {editingPet.name}</span>
                  </button>
                )}
              </div>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
