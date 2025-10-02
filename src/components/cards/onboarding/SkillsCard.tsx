import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
import { useTheme } from '../../ThemeContext';
type SkillsProps = {
  value: {
    yearsExperience: number;
    specialties: string[];
  };
  onChange: (value: {
    yearsExperience: number;
    specialties: string[];
  }) => void;
};
export const SkillsCard = ({
  value,
  onChange
}: SkillsProps) => {
  const [skills, setSkills] = useState(value);
  const [newSpecialty, setNewSpecialty] = useState('');
  const {
    theme
  } = useTheme();
  const handleYearsChange = (years: number) => {
    const updated = {
      ...skills,
      yearsExperience: years
    };
    setSkills(updated);
    onChange(updated);
  };
  const addSpecialty = () => {
    if (newSpecialty.trim() && !skills.specialties.includes(newSpecialty.trim())) {
      const updated = {
        ...skills,
        specialties: [...skills.specialties, newSpecialty.trim()]
      };
      setSkills(updated);
      onChange(updated);
      setNewSpecialty('');
    }
  };
  const removeSpecialty = (specialty: string) => {
    const updated = {
      ...skills,
      specialties: skills.specialties.filter(s => s !== specialty)
    };
    setSkills(updated);
    onChange(updated);
  };
  const experienceOptions = [{
    label: '< 1 year',
    value: 0
  }, {
    label: '1-2 years',
    value: 1
  }, {
    label: '3-5 years',
    value: 3
  }, {
    label: '6-10 years',
    value: 6
  }, {
    label: '10+ years',
    value: 10
  }];
  const commonSpecialties = ['Critical Care', 'Emergency', 'Pediatrics', 'Geriatrics', 'Mental Health', 'Surgery', 'Oncology'];
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSpecialty();
    }
  };
  return <div className="space-y-3">
      <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-white/90' : 'text-gray-800'}`}>
        Professional Experience
      </h3>
      <div>
        <label className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mb-1 block`}>
          Years of Experience
        </label>
        <div className="flex flex-wrap gap-2">
          {experienceOptions.map(option => <button key={option.value} onClick={() => handleYearsChange(option.value)} className={`px-3 py-1.5 text-xs rounded-full transition-colors ${skills.yearsExperience === option.value ? theme === 'dark' ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white' : 'bg-gradient-to-r from-green-700 to-green-800 text-white' : theme === 'dark' ? 'bg-white/10 text-white/70 hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {option.label}
            </button>)}
        </div>
      </div>
      <div>
        <label className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mb-1 block`}>
          Specialties
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {commonSpecialties.map(specialty => <button key={specialty} onClick={() => {
          if (!skills.specialties.includes(specialty)) {
            const updated = {
              ...skills,
              specialties: [...skills.specialties, specialty]
            };
            setSkills(updated);
            onChange(updated);
          }
        }} className={`px-3 py-1.5 text-xs rounded-full transition-colors ${skills.specialties.includes(specialty) ? theme === 'dark' ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white' : 'bg-gradient-to-r from-green-700 to-green-800 text-white' : theme === 'dark' ? 'bg-white/10 text-white/70 hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {specialty}
            </button>)}
        </div>
        <div className="flex mt-2">
          <input type="text" value={newSpecialty} onChange={e => setNewSpecialty(e.target.value)} onKeyPress={handleKeyPress} placeholder="Add other specialty..." className={`flex-1 ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'} border rounded-l-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-green-700/50'}`} />
          <button onClick={addSpecialty} className={`${theme === 'dark' ? 'bg-gradient-to-r from-teal-500 to-emerald-600' : 'bg-gradient-to-r from-green-700 to-green-800'} text-white px-3 py-1.5 rounded-r-lg text-sm`}>
            Add
          </button>
        </div>
        {skills.specialties.length > 0 && <div className="space-y-1.5 mt-2">
            {skills.specialties.map(specialty => <div key={specialty} className={`flex justify-between items-center ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} px-3 py-1.5 rounded-lg`}>
                <span className={`text-xs ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>
                  {specialty}
                </span>
                <button onClick={() => removeSpecialty(specialty)} className={theme === 'dark' ? 'text-white/50 hover:text-white/80' : 'text-gray-400 hover:text-gray-600'}>
                  <XIcon size={14} />
                </button>
              </div>)}
          </div>}
      </div>
    </div>;
};