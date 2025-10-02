import React, { useState } from 'react';
import { CredentialInfoCard } from './compliance/CredentialInfoCard';
import { UploadCard } from './compliance/UploadCard';
import { ExtractedDataCard } from './compliance/ExtractedDataCard';
import { ConfirmCard } from './compliance/ConfirmCard';
import { ExternalTrainingCard } from './compliance/ExternalTrainingCard';
type ComplianceCardProps = {
  type: 'credentialInfo' | 'upload' | 'extractedData' | 'confirm' | 'externalTraining';
  data: any;
  onSubmit: (type: string, data: any) => void;
  onCredentialClick?: (credentialId: string) => void;
  onTrainingClick?: (url: string, id: string) => void;
};
export const ComplianceCard = ({
  type,
  data,
  onSubmit,
  onCredentialClick,
  onTrainingClick
}: ComplianceCardProps) => {
  const [localData, setLocalData] = useState(data);
  const [selectedTrainingId, setSelectedTrainingId] = useState<string | undefined>(data.selectedTrainingId);
  const handleChange = (newData: any) => {
    setLocalData(newData);
  };
  const handleSubmit = () => {
    onSubmit(type, localData);
  };
  const handleUpload = (file: File) => {
    // In a real implementation, this would process the file
    // For now, we'll just store the file name and simulate OCR later
    const updated = {
      ...localData,
      uploadedDocument: {
        name: file.name,
        type: file.type,
        size: file.size
      },
      // Pass along the selected training ID if we're uploading for a training
      selectedTrainingId: selectedTrainingId
    };
    setLocalData(updated);
    // No longer auto-submit after upload
  };
  const handleSaveUpload = () => {
    // Now we submit only when the save button is clicked
    onSubmit('upload', localData);
  };
  const handleConfirm = () => {
    onSubmit('confirm', localData);
  };
  const handleEdit = () => {
    onSubmit('edit', localData);
  };
  const handleCredentialClick = (credentialId: string) => {
    if (onCredentialClick) {
      onCredentialClick(credentialId);
    } else {
      // Fall back to showing upload card
      // Make sure 'new' is handled the same as any other credential ID
      onSubmit('requestUpload', {
        ...localData,
        isComplianceTaskUpload: false // Make sure to set this flag for the proper flow
      });
    }
  };
  const handleTrainingClick = (url: string, id: string) => {
    if (onTrainingClick) {
      onTrainingClick(url, id);
    } else {
      // Default behavior: open the URL in a new tab
      window.open(url, '_blank', 'noopener,noreferrer');
      // Update the local state to mark this training as viewed/clicked
      const updatedTrainings = localData.trainings?.map((training: any) => training.id === id ? {
        ...training,
        lastClicked: new Date().toISOString()
      } : training);
      if (updatedTrainings) {
        const updated = {
          ...localData,
          trainings: updatedTrainings
        };
        setLocalData(updated);
        onSubmit('trainingClicked', updated);
      }
    }
  };
  const handleUploadCertificate = (trainingId: string) => {
    // Set the selected training ID and switch to upload view
    setSelectedTrainingId(trainingId);
    // Get the training details to include in the upload
    const selectedTraining = localData.trainings?.find((training: any) => training.id === trainingId);
    const updated = {
      ...localData,
      selectedTrainingId: trainingId,
      selectedTraining: selectedTraining,
      uploadType: 'certificate',
      isComplianceTaskUpload: true // Set this flag to true for compliance task uploads
    };
    // Submit to change to upload view with the selected training
    onSubmit('requestCertificateUpload', updated);
  };
  const handleTrainingSelect = (trainingId: string) => {
    setSelectedTrainingId(trainingId);
    setLocalData({
      ...localData,
      selectedTrainingId: trainingId
    });
  };
  // Get pending trainings for the upload selector
  const getPendingTrainings = () => {
    if (!localData.trainings) return [];
    return localData.trainings.filter((training: any) => training.status === 'pending' && training.type !== 'document').map((training: any) => ({
      id: training.id,
      title: training.title
    }));
  };
  const renderCard = () => {
    switch (type) {
      case 'credentialInfo':
        return <CredentialInfoCard credentials={localData.credentials || []} currentCredential={localData.currentCredential} onCredentialClick={handleCredentialClick} />;
      case 'upload':
        return <UploadCard onUpload={handleUpload} onSave={handleSaveUpload} availableTrainings={getPendingTrainings()} selectedTrainingId={selectedTrainingId} onTrainingSelect={handleTrainingSelect} isComplianceTaskUpload={localData.isComplianceTaskUpload} />;
      case 'extractedData':
        return <ExtractedDataCard value={localData.extractedData} onChange={value => handleChange({
          ...localData,
          extractedData: value
        })} />;
      case 'confirm':
        return <ConfirmCard data={localData.extractedData} onConfirm={handleConfirm} onEdit={handleEdit} />;
      case 'externalTraining':
        return <ExternalTrainingCard trainings={localData.trainings || []} onTrainingClick={handleTrainingClick} onUploadCertificate={handleUploadCertificate} />;
      default:
        return <div>Unknown card type</div>;
    }
  };
  const shouldShowSaveButton = () => {
    // Only show save button for extractedData
    return type === 'extractedData';
  };
  return <div className="space-y-4">
      {renderCard()}
      {shouldShowSaveButton() && <div className="pt-2 flex justify-end">
          <button onClick={handleSubmit} className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm rounded-full hover:from-teal-400 hover:to-emerald-500 transition-all">
            Save
          </button>
        </div>}
    </div>;
};