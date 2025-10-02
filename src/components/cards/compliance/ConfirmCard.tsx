import React from 'react';
import { CheckCircleIcon, PencilIcon } from 'lucide-react';
type ConfirmCardProps = {
  data: {
    type: string;
    number: string;
    expiryDate: string;
    name: string;
  };
  onConfirm: () => void;
  onEdit: () => void;
};
export const ConfirmCard = ({
  data,
  onConfirm,
  onEdit
}: ConfirmCardProps) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  return <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-800">Confirm Information</h3>
      <p className="text-xs text-gray-600">
        Please review the information below before submitting.
      </p>
      <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">Credential Type</span>
          <span className="text-sm text-gray-800 font-medium">{data.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">License/Certificate #</span>
          <span className="text-sm text-gray-800 font-medium">
            {data.number}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">Name on Document</span>
          <span className="text-sm text-gray-800 font-medium">{data.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">Expiration Date</span>
          <span className="text-sm text-gray-800 font-medium">
            {formatDate(data.expiryDate)}
          </span>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-1 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <PencilIcon size={14} />
          <span className="text-sm">Edit</span>
        </button>
        <button onClick={onConfirm} className="flex-1 flex items-center justify-center gap-1 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg hover:from-teal-400 hover:to-emerald-500 transition-all">
          <CheckCircleIcon size={14} />
          <span className="text-sm">Confirm</span>
        </button>
      </div>
    </div>;
};