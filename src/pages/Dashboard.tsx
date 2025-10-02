import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabaseWishlistService, WishlistSubmission } from '../services/SupabaseWishlistService';
import { ArrowLeftIcon, TrashIcon, RefreshCwIcon, XCircleIcon, ClipboardListIcon } from 'lucide-react';
// Remove the local type definition since we're importing it from the service
export function Dashboard() {
  const [submissions, setSubmissions] = useState<WishlistSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<WishlistSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  // Load submissions on component mount
  useEffect(() => {
    loadSubmissions();
  }, []);
  // Function to load submissions from Supabase
  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const data = await supabaseWishlistService.getAllSubmissions();
      // Data is already sorted by created_at DESC from the service
      setSubmissions(data);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };
  // Handle deleting a submission
  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const success = await supabaseWishlistService.deleteSubmissionById(id);
    if (success) {
      loadSubmissions();
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
    }
  };
  // Handle clearing all submissions
  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete ALL submissions? This cannot be undone.')) {
      const success = await supabaseWishlistService.clearAllSubmissions();
      if (success) {
        setSubmissions([]);
        setSelectedSubmission(null);
      }
    }
  };
  // Format date from created_at string
  const formatDate = (createdAt: string) => {
    return new Date(createdAt).toLocaleString();
  };
  // Get a color for a submission based on the username
  const getSubmissionColor = (userName: string) => {
    const colors = ['bg-pink-100 border-pink-300 text-pink-800', 'bg-purple-100 border-purple-300 text-purple-800', 'bg-blue-100 border-blue-300 text-blue-800', 'bg-green-100 border-green-300 text-green-800', 'bg-yellow-100 border-yellow-300 text-yellow-800', 'bg-orange-100 border-orange-300 text-orange-800', 'bg-red-100 border-red-300 text-red-800', 'bg-indigo-100 border-indigo-300 text-indigo-800', 'bg-teal-100 border-teal-300 text-teal-800'];
    // Simple hash function to get a consistent color for each user
    let hash = 0;
    for (let i = 0; i < userName.length; i++) {
      hash = userName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-white hover:text-blue-100 mr-4">
              <ArrowLeftIcon size={16} className="mr-1" />
              <span>Back</span>
            </Link>
            <h1 className="text-xl font-semibold text-white">
              Wishlist Dashboard
            </h1>
          </div>
          <div className="flex items-center">
            <button onClick={loadSubmissions} className="flex items-center text-sm text-white hover:text-blue-100 mr-4">
              <RefreshCwIcon size={14} className="mr-1" />
              <span>Refresh</span>
            </button>
            {submissions.length > 0 && <button onClick={handleClearAll} className="flex items-center text-sm text-red-100 hover:text-red-200">
                <TrashIcon size={14} className="mr-1" />
                <span>Clear All</span>
              </button>}
          </div>
        </div>
      </header>
      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-6 sm:px-6">
        {loading ? <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
          </div> : submissions.length === 0 ? <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <ClipboardListIcon size={48} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">
              No submissions yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Submissions will appear here after users complete the wishlist
              form
            </p>
            <Link to="/" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">
              Go to Form
            </Link>
          </div> : <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Submissions list */}
            <div className="col-span-1">
              <h3 className="text-sm font-medium text-gray-700 mb-2 ml-1">
                Submissions ({submissions.length})
              </h3>
              <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                {submissions.map(submission => {
              const colorClass = getSubmissionColor(submission.user_name);
              return <div key={submission.id} onClick={() => setSelectedSubmission(submission)} className={`p-3 rounded-lg cursor-pointer border transition-all ${selectedSubmission?.id === submission.id ? `${colorClass} shadow-md` : 'bg-white border-gray-200 hover:border-purple-300'}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{submission.user_name}</h4>
                          <p className="text-xs text-gray-500">
                            {formatDate(submission.created_at)}
                          </p>
                        </div>
                        <button onClick={e => handleDelete(submission.id, e)} className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Delete submission">
                          <XCircleIcon size={18} />
                        </button>
                      </div>
                    </div>;
            })}
              </div>
            </div>
            {/* Submission details */}
            <div className="col-span-1 md:col-span-2 bg-white shadow rounded-lg border border-gray-200">
              {selectedSubmission ? <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedSubmission.user_name}'s Wishlist
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatDate(selectedSubmission.created_at)}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                      <h4 className="text-sm font-medium text-yellow-800">
                        Must-Have Items
                      </h4>
                      <p className="mt-1 whitespace-pre-line text-yellow-900">
                        {selectedSubmission.must_have_items || 'None specified'}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                      <h4 className="text-sm font-medium text-blue-800">
                        Nice-to-Have Items
                      </h4>
                      <p className="mt-1 whitespace-pre-line text-blue-900">
                        {selectedSubmission.nice_to_have_items || 'None specified'}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
                      <h4 className="text-sm font-medium text-purple-800">
                        Preposterous Wishes
                      </h4>
                      <p className="mt-1 whitespace-pre-line text-purple-900">
                        {selectedSubmission.preposterous_wishes || 'None specified'}
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-md border border-green-200">
                      <h4 className="text-sm font-medium text-green-800">
                        Dream Snacks
                      </h4>
                      <p className="mt-1 whitespace-pre-line text-green-900">
                        {selectedSubmission.dream_snacks || 'None specified'}
                      </p>
                    </div>
                    {selectedSubmission.additional_comments && <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700">
                          Additional Comments
                        </h4>
                        <p className="mt-1 whitespace-pre-line text-gray-800">
                          {selectedSubmission.additional_comments}
                        </p>
                      </div>}
                    <button onClick={e => handleDelete(selectedSubmission.id, e)} className="mt-2 flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors">
                      <TrashIcon size={14} className="mr-1" />
                      <span>Delete this submission</span>
                    </button>
                  </div>
                </div> : <div className="px-4 py-16 text-center text-gray-500">
                  <ClipboardListIcon size={32} className="mx-auto text-gray-400 mb-2" />
                  <p>Select a submission from the list to view details</p>
                </div>}
            </div>
          </div>}
      </main>
    </div>;
}