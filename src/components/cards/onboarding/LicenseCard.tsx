import React, { useState, useRef } from 'react';
import { useTheme } from '../../ThemeContext';
import { UploadIcon, UserIcon } from 'lucide-react';
type LicenseProps = {
  value: {
    type: string;
    number: string;
    licenseImage?: string | null;
  };
  onChange: (value: {
    type: string;
    number: string;
    licenseImage?: string | null;
  }) => void;
};
export const LicenseCard = ({
  value,
  onChange
}: LicenseProps) => {
  const [license, setLicense] = useState(value);
  const [picturePreviewUrl, setPicturePreviewUrl] = useState<string | null>(license.licenseImage || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    theme
  } = useTheme();
  const handleChange = (field: keyof typeof license, newValue: string) => {
    const updated = {
      ...license,
      [field]: newValue
    };
    setLicense(updated);
  };
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  const handleFile = (file: File) => {
    // Create a preview URL
    const url = URL.createObjectURL(file);
    setPicturePreviewUrl(url);
    // Update license state with the image URL
    setLicense({
      ...license,
      licenseImage: url
    });
  };
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };
  const handleSave = () => {
    // Only allow save if both fields are filled and image is uploaded
    if (license.type && license.number && picturePreviewUrl) {
      onChange(license);
    }
  };
  const isFormComplete = license.type && license.number && picturePreviewUrl;
  return <div className="space-y-3">
      <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-white/90' : 'text-gray-800'}`}>
        Professional License
      </h3>
      <div className="space-y-2">
        <div>
          <label className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mb-1 block`}>
            License Type
          </label>
          <input type="text" value={license.type} onChange={e => handleChange('type', e.target.value)} placeholder="e.g., RN, LPN, CNA" className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'} border rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-green-700/50'}`} />
        </div>
        <div>
          <label className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mb-1 block`}>
            License Number
          </label>
          <input type="text" value={license.number} onChange={e => handleChange('number', e.target.value)} placeholder="Enter your license number" className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'} border rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-green-700/50'}`} />
        </div>
        {/* License Image Upload */}
        <div>
          <label className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mb-1 block`}>
            License Image (Required)
          </label>
          <div className={`border-2 border-dashed rounded-lg p-4 text-center ${dragActive ? 'border-teal-500 bg-teal-500/10' : `border-gray-300 hover:border-gray-400 ${theme === 'dark' ? 'bg-white/10' : 'bg-white'}`} transition-colors`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            {picturePreviewUrl ? <div className="space-y-2">
                <div className="relative w-full h-32 overflow-hidden rounded-lg">
                  <img src={picturePreviewUrl} alt="License preview" className="w-full h-full object-cover" />
                </div>
                <p className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-700'}`}>
                  License image uploaded
                </p>
                <button onClick={openFileDialog} className={`text-xs ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'} hover:${theme === 'dark' ? 'text-teal-300' : 'text-teal-700'}`}>
                  Replace
                </button>
              </div> : <div className="space-y-2 py-4">
                <div className="flex justify-center">
                  <UploadIcon className={`${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`} size={24} />
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-700'}`}>
                  Drag and drop your license image here, or
                  <button onClick={openFileDialog} className={`ml-1 ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'} hover:${theme === 'dark' ? 'text-teal-300' : 'text-teal-700'}`}>
                    browse
                  </button>
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`}>
                  Supported formats: JPG, PNG
                </p>
              </div>}
          </div>
        </div>
      </div>
      <div className="pt-2 flex justify-end">
        <button onClick={handleSave} disabled={!isFormComplete} className={`px-4 py-2 ${isFormComplete ? theme === 'dark' ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500' : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600' : theme === 'dark' ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-300 cursor-not-allowed text-gray-500'} text-white text-sm rounded-full transition-all`}>
          Save
        </button>
      </div>
    </div>;
};