import React, { useState, useRef } from 'react';
import { UploadIcon, CameraIcon } from 'lucide-react';
type UploadCardProps = {
  onUpload: (file: File) => void;
  onSave: () => void;
  availableTrainings?: Array<{
    id: string;
    title: string;
  }>;
  selectedTrainingId?: string;
  onTrainingSelect?: (trainingId: string) => void;
  isComplianceTaskUpload?: boolean; // New prop to distinguish between compliance task and credential uploads
};
export const UploadCard = ({
  onUpload,
  onSave,
  availableTrainings = [],
  selectedTrainingId,
  onTrainingSelect,
  isComplianceTaskUpload = false
}: UploadCardProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  const handleFile = (file: File) => {
    // Create a preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    // Pass the file to the parent component
    onUpload(file);
    // Note: We no longer auto-submit after upload
  };
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };
  // Only show training selector if there are available trainings, we can select a training,
  // AND we don't already have a specific training selected (meaning we didn't come from clicking a specific task)
  const showTrainingSelector = availableTrainings.length > 0 && onTrainingSelect && !selectedTrainingId;
  // Get the title of the selected training if we have one
  const selectedTrainingTitle = selectedTrainingId ? availableTrainings.find(t => t.id === selectedTrainingId)?.title : null;
  // Different heading based on upload type
  const heading = isComplianceTaskUpload ? 'Upload Compliance Record' : 'Upload Credential';
  return <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-800">{heading}</h3>
      {/* Show training selector only if needed */}
      {showTrainingSelector && <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Select which task this record is for:
          </label>
          <select value={selectedTrainingId || ''} onChange={e => onTrainingSelect?.(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500">
            <option value="" disabled>
              Select a task
            </option>
            {availableTrainings.map(training => <option key={training.id} value={training.id}>
                {training.title}
              </option>)}
          </select>
        </div>}
      {/* Show which training/task we're uploading for if one is selected */}
      {selectedTrainingId && selectedTrainingTitle && <div className="mb-4">
          <p className="text-xs text-teal-600 font-medium">
            Uploading record for: {selectedTrainingTitle}
          </p>
        </div>}
      <div className={`border-2 border-dashed rounded-xl p-4 text-center ${dragActive ? 'border-teal-500 bg-teal-500/10' : 'border-gray-400 hover:border-gray-600'} bg-white transition-colors`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
        <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleChange} className="hidden" />
        {previewUrl ? <div className="space-y-2">
            <div className="relative w-full h-32 overflow-hidden rounded-lg">
              <img src={previewUrl} alt="Document preview" className="w-full h-full object-cover" />
            </div>
            <p className="text-xs text-gray-700">
              Document uploaded successfully
            </p>
            <button onClick={openFileDialog} className="text-xs text-teal-600 hover:text-teal-700">
              Replace
            </button>
          </div> : <div className="space-y-2 py-6">
            <div className="flex justify-center">
              <UploadIcon className="text-gray-500" size={24} />
            </div>
            <p className="text-sm text-gray-700">
              Drag and drop your{' '}
              {isComplianceTaskUpload ? 'record' : 'credential'} here, or
              <button onClick={openFileDialog} className="ml-1 text-teal-600 hover:text-teal-700">
                browse
              </button>
            </p>
            <p className="text-xs text-gray-500">
              Supported formats: JPG, PNG, PDF
            </p>
          </div>}
      </div>
      {/* Show camera button if no file uploaded */}
      {!previewUrl && <button onClick={() => {}} // Would trigger camera capture in a real implementation
    className="w-full flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors">
          <CameraIcon size={16} />
          <span className="text-sm">Take Photo Instead</span>
        </button>}
      {/* Show save button only after file is uploaded */}
      {previewUrl && <button onClick={onSave} className="w-full flex items-center justify-center gap-2 py-2 mt-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm rounded-lg hover:from-teal-400 hover:to-emerald-500 transition-colors">
          <span>Submit Document</span>
        </button>}
    </div>;
};