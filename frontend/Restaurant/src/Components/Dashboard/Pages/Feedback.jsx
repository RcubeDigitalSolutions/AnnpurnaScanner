import React, { useState, useMemo } from 'react';
import { Search, Star, ThumbsUp, ThumbsDown, MessageCircle, Trash2, Eye, Filter, TrendingUp, Users, Award, AlertCircle, CheckCircle } from 'lucide-react';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([
    { id: '001', customerName: 'Raj Gupta', email: 'raj@email.com', rating: 5, category: 'Food', comment: 'Excellent food quality and presentation!', date: '2026-02-22', status: 'seen', sentiment: 'positive' },
    { id: '002', customerName: 'Priya Sharma', email: 'priya@email.com', rating: 4, category: 'Service', comment: 'Good service, but a bit slow during peak hours.', date: '2026-02-21', status: 'seen', sentiment: 'positive' },
    { id: '003', customerName: 'Arjun Singh', email: 'arjun@email.com', rating: 5, category: 'Ambiance', comment: 'Beautiful restaurant with great ambiance!', date: '2026-02-20', status: 'unseen', sentiment: 'positive' },
    { id: '004', customerName: 'Neha Verma', email: 'neha@email.com', rating: 3, category: 'Food', comment: 'Food was average. Spices could be better.', date: '2026-02-19', status: 'seen', sentiment: 'neutral' },
    { id: '005', customerName: 'Siddharth Patel', email: 'siddharth@email.com', rating: 2, category: 'Service', comment: 'Staff was rude. Not coming back.', date: '2026-02-18', status: 'unseen', sentiment: 'negative' },
    { id: '006', customerName: 'Anjali Mishra', email: 'anjali@email.com', rating: 5, category: 'Value', comment: 'Best value for money in the city!', date: '2026-02-17', status: 'seen', sentiment: 'positive' },
    { id: '007', customerName: 'Vikram Kumar', email: 'vikram@email.com', rating: 4, category: 'Ambiance', comment: 'Nice place, but a bit noisy.', date: '2026-02-16', status: 'seen', sentiment: 'positive' },
    { id: '008', customerName: 'Meera Singh', email: 'meera@email.com', rating: 5, category: 'Food', comment: 'Loved the new menu items!', date: '2026-02-22', status: 'unseen', sentiment: 'positive' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(feedback => {
      const matchesSearch = feedback.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           feedback.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || feedback.category === categoryFilter;
      const matchesRating = ratingFilter === 'all' || feedback.rating === parseInt(ratingFilter);
      const matchesSentiment = sentimentFilter === 'all' || feedback.sentiment === sentimentFilter;
      return matchesSearch && matchesCategory && matchesRating && matchesSentiment;
    });
  }, [feedbacks, searchTerm, categoryFilter, ratingFilter, sentimentFilter]);

  const stats = {
    totalFeedback: feedbacks.length,
    averageRating: (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1),
    positiveFeedback: feedbacks.filter(f => f.sentiment === 'positive').length,
    unseenFeedback: feedbacks.filter(f => f.status === 'unseen').length
  };

  const deleteFeedback = (id) => {
    setFeedbacks(feedbacks.filter(f => f.id !== id));
  };

  const markAsSeen = (id) => {
    setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, status: 'seen' } : f));
  };

  const openDetailModal = (feedback) => {
    setSelectedFeedback(feedback);
    markAsSeen(feedback.id);
    setShowDetailModal(true);
  };

  const getStarColor = (rating) => {
    if (rating >= 4) return 'text-yellow-500';
    if (rating === 3) return 'text-blue-500';
    return 'text-red-500';
  };

  const getSentimentColor = (sentiment) => {
    const colors = {
      'positive': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'neutral': 'bg-blue-100 text-blue-800 border-blue-200',
      'negative': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[sentiment] || colors['neutral'];
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food': 'bg-orange-100 text-orange-800 border-orange-200',
      'Service': 'bg-purple-100 text-purple-800 border-purple-200',
      'Ambiance': 'bg-pink-100 text-pink-800 border-pink-200',
      'Value': 'bg-teal-100 text-teal-800 border-teal-200'
    };
    return colors[category] || colors['Food'];
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <div className="p-8 max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-end gap-4 mb-2">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Feedback</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-emerald-600 uppercase">Real-time</span>
            </div>
          </div>
          <p className="text-slate-500 font-bold text-sm">Track and manage customer reviews & feedback</p>
          <div className="mt-4 h-1 w-75 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Feedback', value: stats.totalFeedback, color: 'text-blue-600', icon: MessageCircle, bg: 'bg-blue-50' },
            { label: 'Average Rating', value: `${stats.averageRating}/5`, color: 'text-yellow-600', icon: Star, bg: 'bg-yellow-50' },
            { label: 'Positive', value: stats.positiveFeedback, color: 'text-emerald-600', icon: ThumbsUp, bg: 'bg-emerald-50' },
            { label: 'Unseen', value: stats.unseenFeedback, color: 'text-orange-600', icon: AlertCircle, bg: 'bg-orange-50' }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-orange-200 transition-all group">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                    <h3 className={`text-3xl font-black tracking-tight ${stat.color}`}>{stat.value}</h3>
                  </div>
                  <div className={`${stat.bg} group-hover:shadow-md p-3 rounded-xl transition-all`}>
                    <Icon size={22} className={stat.color} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 lg:w-96 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="flex gap-3 flex-wrap md:flex-nowrap">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-slate-600 font-semibold"
            >
              <option value="all">All Categories</option>
              <option value="Food">Food</option>
              <option value="Service">Service</option>
              <option value="Ambiance">Ambiance</option>
              <option value="Value">Value</option>
            </select>

            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-slate-600 font-semibold"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-slate-600 font-semibold"
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>

            <button
              onClick={() => { setSearchTerm(''); setCategoryFilter('all'); setRatingFilter('all'); setSentimentFilter('all'); }}
              className="px-4 py-3 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 font-semibold transition-all"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Feedback Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {filteredFeedbacks.length > 0 ? (
            filteredFeedbacks.map((feedback) => (
              <div key={feedback.id} className={`bg-white rounded-[24px] border-l-4 p-6 shadow-sm hover:shadow-lg transition-all group ${
                feedback.sentiment === 'positive' ? 'border-l-emerald-500 hover:border-l-emerald-600' :
                feedback.sentiment === 'neutral' ? 'border-l-blue-500 hover:border-l-blue-600' :
                'border-l-red-500 hover:border-l-red-600'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {feedback.customerName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900">{feedback.customerName}</h3>
                        <p className="text-[10px] text-slate-500 font-semibold">{feedback.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full border ${getSentimentColor(feedback.sentiment)}`}>
                      {feedback.sentiment === 'positive' ? <ThumbsUp size={14} /> : feedback.sentiment === 'neutral' ? <Filter size={14} /> : <ThumbsDown size={14} />}
                      <span className="text-[10px] font-black uppercase">{feedback.sentiment}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-4">
                  <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full border ${getCategoryColor(feedback.category)}`}>
                    {feedback.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < feedback.rating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-300'} />
                    ))}
                    <span className="text-[10px] font-black text-slate-600 ml-1">{feedback.rating}/5</span>
                  </div>
                </div>

                <p className="text-sm font-medium text-slate-700 mb-4 line-clamp-2">{feedback.comment}</p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400">{feedback.date}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openDetailModal(feedback)}
                      className="p-2.5 bg-slate-50 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => deleteFeedback(feedback.id)}
                      className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="flex flex-col items-center opacity-20">
                <MessageCircle size={64} className="mb-4" />
                <p className="text-xl font-black uppercase tracking-[0.3em]">No Feedback Found</p>
              </div>
            </div>
          )}
        </div>

        {/* Feedback Detail Modal */}
        {showDetailModal && selectedFeedback && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-[32px] shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100">
              <div className="bg-slate-900 p-8 flex justify-between items-center border-b-4 border-orange-500">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">Feedback Details</span>
                  <h2 className="text-3xl font-black tracking-tight text-white mt-1">{selectedFeedback.customerName}</h2>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all text-xl font-light">
                  ✕
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Customer Email</p>
                    <p className="text-lg font-black text-slate-900">{selectedFeedback.email}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Date</p>
                    <p className="text-lg font-black text-slate-900">{selectedFeedback.date}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Category</p>
                    <span className={`text-sm font-black uppercase px-3 py-1.5 rounded-full border inline-block ${getCategoryColor(selectedFeedback.category)}`}>
                      {selectedFeedback.category}
                    </span>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Rating</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} className={i < selectedFeedback.rating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-300'} />
                      ))}
                      <span className="ml-2 font-black text-slate-900">{selectedFeedback.rating}/5</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Feedback Comment</p>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">{selectedFeedback.comment}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Sentiment</p>
                  <span className={`text-sm font-black uppercase px-3 py-1.5 rounded-full border inline-flex items-center gap-2 ${getSentimentColor(selectedFeedback.sentiment)}`}>
                    {selectedFeedback.sentiment === 'positive' ? <ThumbsUp size={16} /> : selectedFeedback.sentiment === 'neutral' ? <Filter size={16} /> : <ThumbsDown size={16} />}
                    {selectedFeedback.sentiment}
                  </span>
                </div>
              </div>

              <div className="p-8 border-t border-slate-200 flex gap-4">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 py-4 text-slate-600 border border-slate-200 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => { deleteFeedback(selectedFeedback.id); setShowDetailModal(false); }}
                  className="flex-1 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-rose-600/20 transition-all"
                >
                  Delete Feedback
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
