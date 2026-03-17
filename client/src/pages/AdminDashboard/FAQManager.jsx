import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import { useFAQs } from '../../hooks/useAdminQueries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  HelpCircle,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Save,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const FAQManager = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    order_index: 0,
    is_active: true
  });
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Wait for auth to finish loading before checking admin status
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check admin status only once after auth finishes loading
  const isUserAdmin = isAdmin();
  if (!hasCheckedAuth) {
    setHasCheckedAuth(true);
    if (!isUserAdmin) {
      navigate('/');
      return null;
    }
  }

  // Redirect if not admin on subsequent renders
  if (!isUserAdmin) {
    return null;
  }

  const { data: faqsData, isLoading, refetch } = useFAQs();
  const faqs = faqsData || [];

  const createFaqMutation = useMutation({
    mutationFn: (faqData) => adminAPI.createFAQ(faqData),
    onSuccess: () => {
      toast.success('FAQ created successfully');
      setShowModal(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['admin', 'faqs'] });
    },
    onError: (error) => {
      console.error('Error creating FAQ:', error);
      toast.error('Failed to create FAQ');
    }
  });

  const updateFaqMutation = useMutation({
    mutationFn: ({ id, faqData }) => adminAPI.updateFAQ(id, faqData),
    onSuccess: () => {
      toast.success('FAQ updated successfully');
      setShowModal(false);
      setEditingFaq(null);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['admin', 'faqs'] });
    },
    onError: (error) => {
      console.error('Error updating FAQ:', error);
      toast.error('Failed to update FAQ');
    }
  });

  const deleteFaqMutation = useMutation({
    mutationFn: (id) => adminAPI.deleteFAQ(id),
    onSuccess: () => {
      toast.success('FAQ deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'faqs'] });
    },
    onError: (error) => {
      console.error('Error deleting FAQ:', error);
      toast.error('Failed to delete FAQ');
    }
  });

  const reorderFaqsMutation = useMutation({
    mutationFn: (reorderedFaqs) => adminAPI.reorderFAQs(reorderedFaqs),
    onSuccess: () => {
      toast.success('FAQ order updated');
      queryClient.invalidateQueries({ queryKey: ['admin', 'faqs'] });
    },
    onError: (error) => {
      console.error('Error reordering FAQs:', error);
      toast.error('Failed to reorder FAQs');
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }) => adminAPI.updateFAQ(id, { is_active: isActive }),
    onSuccess: () => {
      toast.success('FAQ status updated');
      queryClient.invalidateQueries({ queryKey: ['admin', 'faqs'] });
    },
    onError: (error) => {
      console.error('Error toggling FAQ:', error);
      toast.error('Failed to update FAQ');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingFaq) {
      updateFaqMutation.mutate({ id: editingFaq.id, faqData: formData });
    } else {
      createFaqMutation.mutate(formData);
    }
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || '',
      order_index: faq.order_index || 0,
      is_active: faq.is_active !== false
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    deleteFaqMutation.mutate(id);
  };

  const handleToggleActive = (faq) => {
    toggleActiveMutation.mutate({ id: faq.id, isActive: !faq.is_active });
  };

  const handleReorder = (faqId, direction) => {
    const currentIndex = faqs.findIndex(f => f.id === faqId);
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === faqs.length - 1) return;

    const newFaqs = [...faqs];
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Swap order_index values
    const tempOrder = newFaqs[currentIndex].order_index;
    newFaqs[currentIndex].order_index = newFaqs[swapIndex].order_index;
    newFaqs[swapIndex].order_index = tempOrder;

    reorderFaqsMutation.mutate(newFaqs.map(f => ({ id: f.id, order_index: f.order_index })));
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: '',
      order_index: faqs.length,
      is_active: true
    });
  };

  const openNewModal = () => {
    resetForm();
    setEditingFaq(null);
    setShowModal(true);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">FAQ Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your frequently asked questions</p>
          </div>
          <button
            onClick={openNewModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
          >
            <Plus size={20} />
            New FAQ
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 dark:bg-gray-800 dark:shadow-gray-700/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-lg shadow overflow-hidden dark:bg-gray-800 dark:shadow-gray-700/50">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading FAQs...</div>
          ) : filteredFaqs.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <HelpCircle size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>No FAQs found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredFaqs.map((faq, index) => (
                <div key={faq.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-start gap-4 p-4">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleReorder(faq.id, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        onClick={() => handleReorder(faq.id, 'down')}
                        disabled={index === filteredFaqs.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>

                    {/* Expand/Collapse */}
                    <button
                      onClick={() => toggleExpand(faq.id)}
                      className="mt-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {expandedId === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">{faq.question}</h3>
                          {faq.category && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded dark:bg-blue-900/30 dark:text-blue-400">
                              {faq.category}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleActive(faq)}
                            className={`px-2 py-1 text-xs rounded ${faq.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
                          >
                            {faq.is_active ? 'Active' : 'Inactive'}
                          </button>
                          <button
                            onClick={() => handleEdit(faq)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded dark:text-blue-400 dark:hover:bg-blue-900/20"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(faq.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded dark:text-red-400 dark:hover:bg-red-900/20"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Expanded Content */}
                      {expandedId === faq.id && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
                          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 dark:bg-black/70">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto dark:bg-gray-800">
            <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-bold dark:text-white">{editingFaq ? 'Edit FAQ' : 'New FAQ'}</h2>
              <button onClick={() => { setShowModal(false); setEditingFaq(null); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Answer *</label>
                <textarea
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., General, Billing, Technical"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700 dark:text-gray-300">Active</label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingFaq(null); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  {editingFaq ? 'Update' : 'Create'} FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQManager;