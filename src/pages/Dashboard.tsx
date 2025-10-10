import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabaseWishlistService, WishlistSubmission } from '../services/SupabaseWishlistService';
import { ArrowLeftIcon, TrashIcon, RefreshCwIcon, XCircleIcon, ClipboardListIcon, HeartIcon, StarIcon, ZapIcon, CoffeeIcon, GamepadIcon, SparklesIcon, ThumbsUpIcon, TrendingUpIcon } from 'lucide-react';
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

  // Get profile picture path for a user
  const getProfilePicture = (userName: string) => {
    const profilePics: { [key: string]: string } = {
      'Aaron': '/aaron.jpg',
      'Amy': '/amy.jpg',
      'Julien': '/julien.jpg',
      'Malini': '/malini.jpg',
      'Joki': '/joki.jpg',
      'Arun': '/arun.jpg',
      'Siddarth': '/siddarth.jpg',
      'Maria': '/maria.jpg',
      'Joshua': '/joshua.jpg',
      'Stephen': '/stephen.jpg',
      'Sergey': '/sergey.jpg',
      'Ivan': '/ivan.jpg',
      'Jack': '/jack.jpg',
      'Anand': '/anand.jpg',
      'Kunal': '/kunal.jpg',
      'Ian': '/ian.jpg',
      'Alexandria': '/alexandria.jpg'
    };
    return profilePics[userName] || null;
  };
  return <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 shadow-xl relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 via-blue-600/90 to-indigo-600/90"></div>
        <div className="relative max-w-5xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-white hover:text-blue-100 mr-6 transition-all duration-200 hover:scale-105">
              <ArrowLeftIcon size={18} className="mr-2" />
              <span className="font-medium">Back to Chat</span>
            </Link>
            <div className="flex items-center">
              <SparklesIcon size={24} className="mr-3 text-yellow-300 animate-pulse" />
              <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                🎉 Office Wishlist Dashboard
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={loadSubmissions} className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm">
              <RefreshCwIcon size={16} className="mr-2" />
              <span className="font-medium">Refresh</span>
            </button>
            {submissions.length > 0 && <button onClick={handleClearAll} className="flex items-center px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-100 rounded-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm">
                <TrashIcon size={16} className="mr-2" />
                <span className="font-medium">Clear All</span>
              </button>}
          </div>
        </div>
      </header>
      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-6 sm:px-6">
        {loading ? <div className="flex justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <SparklesIcon size={24} className="text-purple-600 animate-pulse" />
              </div>
            </div>
          </div> : submissions.length === 0 ? <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 opacity-50"></div>
            <div className="relative">
              <div className="text-6xl mb-4">🎯</div>
              <ClipboardListIcon size={48} className="mx-auto text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No submissions yet! 
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                The office wishlist is waiting for your team's amazing ideas! 🚀
              </p>
              <Link to="/" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <SparklesIcon size={20} className="mr-2" />
                Start the Wishlist Journey
              </Link>
            </div>
          </div> : <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Submissions list */}
            <div className="col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4">
                <div className="flex items-center mb-4">
                  <HeartIcon size={20} className="text-pink-500 mr-2" />
                  <h3 className="text-lg font-bold text-gray-800">
                    Team Wishlists ({submissions.length})
                  </h3>
                </div>
                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                  {submissions.map((submission, index) => {
                const colorClass = getSubmissionColor(submission.user_name);
                const profilePic = getProfilePicture(submission.user_name);
                return <div key={submission.id} onClick={() => setSelectedSubmission(submission)} className={`p-4 rounded-xl cursor-pointer border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${selectedSubmission?.id === submission.id ? `${colorClass} shadow-xl scale-105` : 'bg-white/90 border-gray-200 hover:border-purple-400 hover:bg-purple-50/50'}`} style={{animationDelay: `${index * 100}ms`}}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {profilePic && <div className="relative">
                                <img src={profilePic} alt={submission.user_name} className="w-10 h-10 rounded-full object-cover border-3 border-white shadow-lg" />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                              </div>}
                            <div className="ml-3">
                              <h4 className="font-bold text-gray-800">{submission.user_name}</h4>
                              <p className="text-xs text-gray-500 flex items-center">
                                <span className="mr-1">🕒</span>
                                {formatDate(submission.created_at)}
                              </p>
                            </div>
                          </div>
                          <button onClick={e => handleDelete(submission.id, e)} className="text-gray-400 hover:text-red-500 transition-all duration-200 hover:scale-110 p-1 rounded-full hover:bg-red-50" aria-label="Delete submission">
                            <XCircleIcon size={18} />
                          </button>
                        </div>
                      </div>;
              })}
                </div>
              </div>
            </div>
            {/* Submission details */}
            <div className="col-span-1 md:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {selectedSubmission ? <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      {getProfilePicture(selectedSubmission.user_name) && <img src={getProfilePicture(selectedSubmission.user_name)!} alt={selectedSubmission.user_name} className="w-12 h-12 rounded-full object-cover border-3 border-white shadow-lg mr-4" />}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                          {selectedSubmission.user_name}'s Wishlist
                          <span className="ml-2 text-2xl">✨</span>
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          <span className="mr-1">🕒</span>
                          {formatDate(selectedSubmission.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-2xl border-2 border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center mb-3">
                        <CoffeeIcon size={20} className="text-yellow-600 mr-2" />
                        <h4 className="text-lg font-bold text-yellow-800">
                          🍕 Must-Have Items (Snacks Included)
                        </h4>
                      </div>
                      <p className="whitespace-pre-line text-yellow-900 font-medium">
                        {selectedSubmission.must_have_items || 'None specified'}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center mb-3">
                        <StarIcon size={20} className="text-blue-600 mr-2" />
                        <h4 className="text-lg font-bold text-blue-800">
                          ⭐ Nice-to-Have Items
                        </h4>
                      </div>
                      <p className="whitespace-pre-line text-blue-900 font-medium">
                        {selectedSubmission.nice_to_have_items || 'None specified'}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-2xl border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center mb-3">
                        <ZapIcon size={20} className="text-purple-600 mr-2" />
                        <h4 className="text-lg font-bold text-purple-800">
                          🚀 Preposterous Wishes
                        </h4>
                      </div>
                      <p className="whitespace-pre-line text-purple-900 font-medium">
                        {selectedSubmission.preposterous_wishes || 'None specified'}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center mb-3">
                        <HeartIcon size={20} className="text-green-600 mr-2" />
                        <h4 className="text-lg font-bold text-green-800">
                          🎉 Excited About New Office
                        </h4>
                      </div>
                      <p className="whitespace-pre-line text-green-900 font-bold text-xl">
                        YES! 🎊
                      </p>
                    </div>
                    {selectedSubmission.additional_comments && <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-5 rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center mb-3">
                          <ClipboardListIcon size={20} className="text-gray-600 mr-2" />
                          <h4 className="text-lg font-bold text-gray-700">
                            💭 Additional Comments
                          </h4>
                        </div>
                        <p className="whitespace-pre-line text-gray-800 font-medium">
                          {selectedSubmission.additional_comments}
                        </p>
                      </div>}
                    <button onClick={e => handleDelete(selectedSubmission.id, e)} className="mt-4 flex items-center px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      <TrashIcon size={16} className="mr-2" />
                      <span className="font-semibold">Delete this submission</span>
                    </button>
                  </div>
                </div> : <div className="px-6 py-20 text-center">
                  <div className="text-6xl mb-4">👆</div>
                  <ClipboardListIcon size={48} className="mx-auto text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    Choose a Team Member's Wishlist! 
                  </h3>
                  <p className="text-gray-500">
                    Click on someone from the list to see their amazing office ideas! ✨
                  </p>
                </div>}
            </div>
          </div>}
      </main>
    </div>;
}