import React from 'react';
import { useTheme } from '../../../components/ThemeContext';
import { PlusIcon, AlertCircleIcon, ClockIcon, CheckCircleIcon, HourglassIcon } from 'lucide-react';
type Credential = {
  id: string;
  type: string;
  number: string;
  expiryDate: string;
  daysUntilExpiry: number;
  name: string;
  status?: 'active' | 'under_review' | 'rejected' | 'expired';
  rejectionReason?: string;
};
type CredentialInfoCardProps = {
  credentials: Credential[];
  currentCredential: Credential | null;
  onCredentialClick: (credentialId: string) => void;
};
export const CredentialInfoCard = ({
  credentials,
  currentCredential,
  onCredentialClick
}: CredentialInfoCardProps) => {
  const {
    theme
  } = useTheme();
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  // Determine if a credential is expiring soon (within 30 days)
  const isExpiringSoon = (daysUntilExpiry: number) => daysUntilExpiry <= 30;
  // Determine if a credential is expired
  const isExpired = (daysUntilExpiry: number) => daysUntilExpiry <= 0;
  // Sort credentials by expiry (expiring soonest first)
  const sortedCredentials = [...credentials].sort((a, b) => {
    // Expired credentials first
    if (isExpired(a.daysUntilExpiry) && !isExpired(b.daysUntilExpiry)) return -1;
    if (!isExpired(a.daysUntilExpiry) && isExpired(b.daysUntilExpiry)) return 1;
    // Then credentials under review
    if (a.status === 'under_review' && b.status !== 'under_review') return -1;
    if (a.status !== 'under_review' && b.status === 'under_review') return 1;
    // Then rejected credentials
    if (a.status === 'rejected' && b.status !== 'rejected') return -1;
    if (a.status !== 'rejected' && b.status === 'rejected') return 1;
    // Then by days until expiry
    return a.daysUntilExpiry - b.daysUntilExpiry;
  });
  return <div className="space-y-3">
      <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-white/90' : 'text-gray-800'}`}>
        Your Credentials:
      </h3>
      <div className="max-h-[350px] overflow-y-auto pr-1 space-y-2">
        {sortedCredentials.map(credential => {
        // Force expired credentials to always be red
        const isExpired = credential.daysUntilExpiry <= 0;
        // For non-expired credentials, check if they're expiring soon
        const isExpiringSoon = !isExpired && credential.daysUntilExpiry <= 30;
        const isUnderReview = credential.status === 'under_review';
        const isRejected = credential.status === 'rejected';
        return <div key={credential.id} onClick={() => onCredentialClick(credential.id)} className={`w-full cursor-pointer transition-all ${isExpired ? 'bg-red-50 border-red-300' : isRejected ? 'bg-red-50 border-red-300' : isUnderReview ? 'bg-blue-50 border-blue-300' : isExpiringSoon ? 'bg-red-50 border-red-300' : 'bg-white/60 border-gray-200'} rounded-xl p-3 border hover:shadow-md`}>
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-800">
                      {credential.type}
                      {isUnderReview && <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-500">
                          Under Review
                        </span>}
                      {isRejected && <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-500">
                          Rejected
                        </span>}
                    </h4>
                    {isExpired ? <AlertCircleIcon className="text-red-500" size={16} /> : isUnderReview ? <HourglassIcon className="text-blue-500" size={16} /> : isRejected ? <AlertCircleIcon className="text-red-500" size={16} /> : isExpiringSoon ? <ClockIcon className="text-red-500" size={16} /> : <CheckCircleIcon className="text-emerald-500" size={16} />}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {credential.number}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className={`text-xs ${isExpired ? 'text-red-600' : isRejected ? 'text-red-600' : isUnderReview ? 'text-blue-600' : isExpiringSoon ? 'text-red-600' : 'text-emerald-600'}`}>
                      {isRejected ? 'Rejected - Reupload Required' : isUnderReview ? 'Verification in progress' : isExpired ? 'Expired' : isExpiringSoon ? `Expires in ${credential.daysUntilExpiry} days` : `Expires: ${formatDate(credential.expiryDate)}`}
                    </p>
                  </div>
                  {isRejected && credential.rejectionReason && <p className="text-xs text-red-600 mt-1 italic">
                      Reason: {credential.rejectionReason}
                    </p>}
                </div>
              </div>
            </div>;
      })}
        <div onClick={() => onCredentialClick('new')} className={`w-full cursor-pointer transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/60 border-gray-200 hover:bg-gray-50'} rounded-xl p-3 border hover:shadow-md flex items-center justify-center`}>
          <PlusIcon className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-500'} mr-1`} size={16} />
          <span className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-500'}`}>
            Add New Credential
          </span>
        </div>
      </div>
      <p className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-500'}`}>
        Click on a credential to upload or update it.
      </p>
    </div>;
};