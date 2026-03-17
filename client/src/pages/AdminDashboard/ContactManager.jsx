import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  MessageSquare,
  Search,
  Trash2,
  Eye,
  X,
  Check,
  Mail,
  Phone,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const ContactManager = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);
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

  // Fetch contacts using TanStack Query
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['admin', 'contacts'],
    queryFn: async () => {
      const response = await adminAPI.getAllContacts();
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch unread count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['admin', 'contacts', 'unread-count'],
    queryFn: async () => {
      const response = await adminAPI.getUnreadContactsCount();
      return response.data?.count || 0;
    },
    staleTime: 2 * 60 * 1000,
  });

  // Delete mutation
  const deleteContactMutation = useMutation({
    mutationFn: (id) => adminAPI.deleteContact(id),
    onSuccess: () => {
      toast.success('Contact deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'contacts', 'unread-count'] });
    },
    onError: (error) => {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id) => adminAPI.updateContact(id, { is_read: true }),
    onSuccess: () => {
      toast.success('Marked as read');
      queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'contacts', 'unread-count'] });
    },
    onError: (error) => {
      console.error('Error marking contact as read:', error);
      toast.error('Failed to update contact');
    }
  });

  // Mark as replied mutation
  const markAsRepliedMutation = useMutation({
    mutationFn: (id) => adminAPI.updateContact(id, { is_replied: true }),
    onSuccess: () => {
      toast.success('Marked as replied');
      queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] });
    },
    onError: (error) => {
      console.error('Error marking contact as replied:', error);
      toast.error('Failed to update contact');
    }
  });

  const handleView = (contact) => {
    setSelectedContact(contact);
    // Mark as read if not read
    if (!contact.is_read) {
      markAsReadMutation.mutate(contact.id);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this contact submission?')) return;
    deleteContactMutation.mutate(id);
  };

  const handleMarkAsRead = (id) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAsReplied = (id) => {
    markAsRepliedMutation.mutate(id);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'unread') return matchesSearch && !contact.is_read;
    if (statusFilter === 'read') return matchesSearch && contact.is_read;
    if (statusFilter === 'replied') return matchesSearch && contact.is_replied;
    return matchesSearch;
  });

  const getStatusBadge = (contact) => {
    if (contact.is_replied) {
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded">
          <CheckCircle size={12} />
          Replied
        </span>
      );
    }
    if (contact.is_read) {
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded">
          <Check size={12} />
          Read
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs rounded">
        <Clock size={12} />
        Unread
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Submissions</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage incoming contact form submissions</p>
          </div>
          {unreadCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-lg">
              <AlertCircle size={20} />
              <span className="font-medium">{unreadCount} unread</span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Contacts</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>
        </div>

        {/* Contact List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading contacts...</div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <MessageSquare size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>No contacts found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredContacts.map((contact) => (
                <div 
                  key={contact.id} 
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${!contact.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  onClick={() => handleView(contact)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <User size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{contact.name || 'Anonymous'}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</p>
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">{contact.subject || 'No Subject'}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{contact.message}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(contact)}
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(contact.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start p-6 border-b dark:border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contact Details</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(selectedContact.created_at)}</p>
              </div>
              <button onClick={() => setSelectedContact(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <User size={20} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                    <p className="font-medium dark:text-white">{selectedContact.name || 'Anonymous'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Mail size={20} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium dark:text-white">{selectedContact.email}</p>
                  </div>
                </div>
                {selectedContact.phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Phone size={20} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="font-medium dark:text-white">{selectedContact.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  {getStatusBadge(selectedContact)}
                </div>
              </div>

              {/* Subject */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Subject</h3>
                <p className="text-lg font-medium dark:text-white">{selectedContact.subject || 'No Subject'}</p>
              </div>

              {/* Message */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Message</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="whitespace-pre-wrap dark:text-gray-200">{selectedContact.message}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                {!selectedContact.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(selectedContact.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Check size={18} />
                    Mark as Read
                  </button>
                )}
                {!selectedContact.is_replied && (
                  <button
                    onClick={() => handleMarkAsReplied(selectedContact.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Mail size={18} />
                    Mark as Replied
                  </button>
                )}
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Mail size={18} />
                  Reply via Email
                </a>
                <button
                  onClick={() => {
                    setSelectedContact(null);
                    handleDelete(selectedContact.id);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManager;