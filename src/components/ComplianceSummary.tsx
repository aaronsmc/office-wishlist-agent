import React from 'react';
import { CheckCircleIcon, FileTextIcon, CalendarIcon, UserIcon } from 'lucide-react';
type ComplianceData = {
  extractedData: {
    type: string;
    number: string;
    expiryDate: string;
    name: string;
  };
};
type ComplanceSummaryProps = {
  data: ComplianceData;
};
export const ComplianceSummary = ({
  data
}: ComplianceSummaryProps) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  return <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CheckCircleIcon size={18} className="text-emerald-500" />
        <h3 className="text-sm font-medium text-white/90">
          Credential Updated Successfully
        </h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-start">
          <FileTextIcon size={16} className="mt-0.5 text-teal-400 mr-3 opacity-80" />
          <div className="flex-1">
            <p className="text-xs font-medium text-white/80">Credential Type</p>
            <p className="text-xs text-white/60">{data.extractedData.type}</p>
          </div>
        </div>
        <div className="flex items-start">
          <UserIcon size={16} className="mt-0.5 text-teal-400 mr-3 opacity-80" />
          <div className="flex-1">
            <p className="text-xs font-medium text-white/80">License Number</p>
            <p className="text-xs text-white/60">{data.extractedData.number}</p>
          </div>
        </div>
        <div className="flex items-start">
          <CalendarIcon size={16} className="mt-0.5 text-teal-400 mr-3 opacity-80" />
          <div className="flex-1">
            <p className="text-xs font-medium text-white/80">Expiration Date</p>
            <p className="text-xs text-white/60">
              {formatDate(data.extractedData.expiryDate)}
            </p>
          </div>
        </div>
      </div>
      <p className="text-xs text-white/70">
        Your credential has been updated in our system. You'll receive a
        confirmation email shortly.
      </p>
    </div>;
};