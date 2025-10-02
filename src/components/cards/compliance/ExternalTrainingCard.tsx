import React from 'react';
import { useTheme } from '../../../components/ThemeContext';
import { ClockIcon, CheckCircleIcon, FileTextIcon, PenToolIcon, ExternalLinkIcon, UploadIcon, HourglassIcon } from 'lucide-react';
type ExternalTraining = {
  id: string;
  title: string;
  description: string;
  url: string;
  deadline?: string;
  status: 'pending' | 'in_progress' | 'completed';
  completedDate?: string;
  isRequired: boolean;
  type: 'training' | 'document';
  lastClicked?: string;
  lastUploaded?: string;
  reviewStatus?: 'under_review';
};
type ExternalTrainingCardProps = {
  trainings: ExternalTraining[];
  onTrainingClick: (url: string, id: string) => void;
  onUploadCertificate?: (trainingId: string) => void;
};
export const ExternalTrainingCard = ({
  trainings,
  onTrainingClick,
  onUploadCertificate
}: ExternalTrainingCardProps) => {
  const {
    theme
  } = useTheme();
  // Helper function to format a date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  // Get days until deadline
  const getDaysUntilDeadline = (deadlineString: string | undefined): number | null => {
    if (!deadlineString) return null;
    const deadline = new Date(deadlineString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  // Check if a training is in progress (clicked or uploaded but not completed)
  const isInProgress = (training: ExternalTraining) => {
    return training.status === 'pending' && (training.lastClicked || training.lastUploaded) && training.reviewStatus !== 'under_review';
  };
  // Check if a training is under review
  const isUnderReview = (training: ExternalTraining) => {
    return training.reviewStatus === 'under_review';
  };
  // Count documents and trainings
  const documentCount = trainings.filter(t => t.type === 'document').length;
  const trainingCount = trainings.filter(t => t.type === 'training').length;
  // Sort trainings: overdue first, then urgent, then in progress, then pending, then completed
  const sortedTrainings = [...trainings].sort((a, b) => {
    // First, completed items go to the bottom
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    // Then, sort by review status - under review items come before others
    if (a.reviewStatus === 'under_review' && b.reviewStatus !== 'under_review') return -1;
    if (a.reviewStatus !== 'under_review' && b.reviewStatus === 'under_review') return 1;
    // Then, in progress items come before pending
    if (isInProgress(a) && !isInProgress(b)) return -1;
    if (!isInProgress(a) && isInProgress(b)) return 1;
    // Then, sort by deadline (overdue first, then most urgent)
    const daysA = getDaysUntilDeadline(a.deadline);
    const daysB = getDaysUntilDeadline(b.deadline);
    // If both have deadlines, sort by days remaining
    if (daysA !== null && daysB !== null) return daysA - daysB;
    // If only one has a deadline, it comes first
    if (daysA !== null) return -1;
    if (daysB !== null) return 1;
    // If neither has a deadline, sort alphabetically
    return a.title.localeCompare(b.title);
  });
  return <div className="space-y-3">
      <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-white/90' : 'text-gray-800'}`}>
        Compliance tasks:
      </h3>
      <div className="max-h-[350px] overflow-y-auto pr-1 space-y-2">
        {sortedTrainings.map(training => {
        const daysUntilDeadline = getDaysUntilDeadline(training.deadline);
        const isVeryUrgent = daysUntilDeadline !== null && daysUntilDeadline < 7;
        const isUrgent = daysUntilDeadline !== null && daysUntilDeadline >= 7 && daysUntilDeadline <= 14;
        const isDocument = training.type === 'document';
        const inProgress = isInProgress(training);
        const underReview = isUnderReview(training);
        return <div key={training.id} className={`w-full ${training.status === 'completed' ? 'bg-emerald-50 border-emerald-300' : underReview ? 'bg-blue-50 border-blue-300' : inProgress ? 'bg-blue-50 border-blue-300' : isVeryUrgent ? 'bg-red-50 border-red-300' : isUrgent ? 'bg-amber-50 border-amber-300' : 'bg-white/60 border-gray-200'} rounded-xl p-3 border transition-colors`}>
              <div className="flex items-start">
                {training.status === 'completed' ? <CheckCircleIcon className="text-emerald-500 mr-2 mt-0.5" size={16} /> : underReview ? <HourglassIcon className="text-blue-500 mr-2 mt-0.5" size={16} /> : inProgress ? <HourglassIcon className="text-blue-500 mr-2 mt-0.5" size={16} /> : isDocument ? <FileTextIcon className={`${isVeryUrgent ? 'text-red-500' : isUrgent ? 'text-amber-500' : 'text-gray-600'} mr-2 mt-0.5`} size={16} /> : <ClockIcon className={`${isVeryUrgent ? 'text-red-500' : isUrgent ? 'text-amber-500' : 'text-gray-600'} mr-2 mt-0.5`} size={16} />}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium text-gray-800">
                      {training.title}
                      {underReview && <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-500">
                          Under Review
                        </span>}
                      {inProgress && !underReview && <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-500">
                          In Progress
                        </span>}
                    </h4>
                  </div>
                  {training.status === 'completed' && training.completedDate ? <p className="text-xs text-emerald-600 mt-1">
                      {isDocument ? 'Signed' : 'Completed'} on{' '}
                      {formatDate(training.completedDate)}
                    </p> : training.deadline ? <p className={`text-xs ${underReview ? 'text-blue-500' : inProgress ? 'text-blue-500' : isVeryUrgent ? 'text-red-500' : isUrgent ? 'text-amber-500' : 'text-gray-600'} mt-1`}>
                      {underReview ? `Submitted, verification pending` : inProgress ? `In progress, not yet complete` : daysUntilDeadline === 0 ? 'Due today' : daysUntilDeadline === 1 ? 'Due tomorrow' : daysUntilDeadline && daysUntilDeadline > 0 ? `Due in ${daysUntilDeadline} days` : daysUntilDeadline && daysUntilDeadline < 0 ? `Overdue by ${Math.abs(daysUntilDeadline)} days` : 'No deadline'}
                    </p> : null}
                  <div className="mt-2 flex space-x-2">
                    <button onClick={() => onTrainingClick(training.url, training.id)} className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg ${theme === 'dark' ? 'bg-white/10 text-white/80 hover:bg-white/20' : 'bg-black/5 text-gray-700 hover:bg-black/10'} transition-colors`}>
                      {isDocument ? <>
                          <PenToolIcon size={12} />
                          {training.status === 'completed' ? 'View Signed Document' : 'Review & Sign'}
                        </> : <>
                          <ExternalLinkIcon size={12} />
                          {training.status === 'completed' ? 'View Certificate' : inProgress || underReview ? 'Resume Training' : 'Start Training'}
                        </>}
                    </button>
                    {/* Show Upload Record button for pending tasks that aren't under review */}
                    {training.status === 'pending' && !underReview && onUploadCertificate && <button onClick={() => onUploadCertificate(training.id)} className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg ${theme === 'dark' ? 'bg-teal-900/30 text-teal-300 hover:bg-teal-900/50' : 'bg-teal-50 text-teal-700 hover:bg-teal-100'} transition-colors`}>
                          <UploadIcon size={12} />
                          Upload Record
                        </button>}
                  </div>
                </div>
              </div>
            </div>;
      })}
      </div>
      <p className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-500'}`}>
        {documentCount > 0 && trainingCount > 0 ? 'Click to access training modules, review and sign required documents, or upload existing records.' : documentCount > 0 ? 'Click to review and sign required documents or upload existing records.' : 'Click to access the external learning platform or upload existing records.'}
      </p>
    </div>;
};