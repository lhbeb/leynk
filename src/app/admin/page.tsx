'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Link2, Plus, Edit, Trash2, Eye, Users, LogOut, Copy, Check, BarChart3, RefreshCw, Trash, MoreVertical, Search, X, Terminal } from 'lucide-react';
import { UserPage } from '@/types';
import AuthGuard from '@/components/AuthGuard';
import { clearSession, isSuperAdmin } from '@/lib/auth';
import Tooltip from '@/components/Tooltip';
import AnalyticsModal from '@/components/AnalyticsModal';

type TabType = 'active' | 'deleted';

function AdminDashboardContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [users, setUsers] = useState<UserPage[]>([]);
  const [deletedUsers, setDeletedUsers] = useState<UserPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedUsername, setCopiedUsername] = useState<string | null>(null);
  const [viewStats, setViewStats] = useState<{ [username: string]: number }>({});
  const [analyticsUsername, setAnalyticsUsername] = useState<string | null>(null);
  const [openMenuUsername, setOpenMenuUsername] = useState<string | null>(null);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest-views'>('newest');
  const [filterListedBy, setFilterListedBy] = useState('');
  const [superAdmin] = useState(() => isSuperAdmin());

  useEffect(() => {
    fetchUsers();
    fetchDeletedUsers();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenuUsername(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      const activeUsers = data.users || [];
      setUsers(activeUsers);

      // Fetch view stats immediately after users load — no extra render cycle
      if (activeUsers.length > 0) {
        fetchViewStats(activeUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedUsers = async () => {
    try {
      const response = await fetch('/api/users/deleted');
      const data = await response.json();
      setDeletedUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching deleted users:', error);
    }
  };

  const fetchViewStats = async (activeUsers = users) => {
    try {
      const usernames = activeUsers.map((u) => u.username).join(',');
      if (!usernames) return;
      const response = await fetch(`/api/analytics/stats?usernames=${encodeURIComponent(usernames)}`);
      if (response.ok) {
        const data = await response.json();
        setViewStats(data.stats || {});
      }
    } catch (error) {
      console.error('Error fetching view stats:', error);
    }
  };

  const handleDelete = async (username: string) => {
    if (!confirm(`Are you sure you want to delete ${username}? It will be moved to Deleted Profiles.`)) return;

    try {
      const response = await fetch(`/api/users?username=${username}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh both lists
        await fetchUsers();
        await fetchDeletedUsers();
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleRecover = async (username: string) => {
    if (!confirm(`Are you sure you want to recover ${username}?`)) return;

    try {
      const response = await fetch(`/api/users/recover`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        // Refresh both lists
        await fetchUsers();
        await fetchDeletedUsers();
      } else {
        alert('Failed to recover user');
      }
    } catch (error) {
      console.error('Error recovering user:', error);
      alert('Failed to recover user');
    }
  };

  const handlePermanentDelete = async (username: string) => {
    if (!confirm(`⚠️ PERMANENT DELETE WARNING!\n\nAre you sure you want to PERMANENTLY delete ${username}?\n\nThis action CANNOT be undone!\n- All user data will be lost forever\n- Profile picture will be deleted\n- All links will be deleted\n- All analytics will be deleted\n\nType "DELETE" to confirm.`)) return;

    const confirmation = prompt('Type "DELETE" to confirm permanent deletion:');
    if (confirmation !== 'DELETE') {
      alert('Permanent deletion cancelled');
      return;
    }

    try {
      const response = await fetch(`/api/users/permanent?username=${username}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh deleted users list
        await fetchDeletedUsers();
      } else {
        alert('Failed to permanently delete user');
      }
    } catch (error) {
      console.error('Error permanently deleting user:', error);
      alert('Failed to permanently delete user');
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      clearSession();
      router.push('/admin/login');
    }
  };

  const handleCopyLink = async (username: string) => {
    const userPageUrl = `${window.location.origin}/${username}`;

    try {
      await navigator.clipboard.writeText(userPageUrl);
      setCopiedUsername(username);
      setTimeout(() => {
        setCopiedUsername(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = userPageUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedUsername(username);
        setTimeout(() => {
          setCopiedUsername(null);
        }, 2000);
      } catch (err) {
        console.error('Fallback copy failed:', err);
        alert('Failed to copy link. Please copy manually: ' + userPageUrl);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleCopyProfile = async (username: string) => {
    if (!confirm(`Are you sure you want to copy ${username}'s profile? A new profile with a numeric suffix will be created.`)) return;

    try {
      const response = await fetch('/api/users/copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Profile copied successfully!');
        // Refresh the users list
        await fetchUsers();
      } else {
        alert(data.error || 'Failed to copy profile');
      }
    } catch (error) {
      console.error('Error copying profile:', error);
      alert('Failed to copy profile');
    } finally {
      setOpenMenuUsername(null);
    }
  };

  const currentUsers = activeTab === 'active' ? users : deletedUsers;

  // Deduplicated list of "listed by" values for the filter dropdown
  const listedByOptions = Array.from(
    new Set(users.map((u) => u.listedBy ?? '').filter(Boolean))
  ).sort();

  // Filtered + sorted active users
  const filteredUsers = users
    .filter((u) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        u.username.toLowerCase().includes(q) ||
        (u.bio || '').toLowerCase().includes(q);
      const matchesListedBy =
        !filterListedBy ||
        (filterListedBy === '__unassigned__'
          ? !u.listedBy
          : u.listedBy === filterListedBy);
      return matchesSearch && matchesListedBy;
    })
    .sort((a, b) => {
      if (sortBy === 'highest-views') {
        return (viewStats[b.username] || 0) - (viewStats[a.username] || 0);
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      // newest (default)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const isFiltered =
    !!searchQuery || sortBy !== 'newest' || !!filterListedBy;

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-accent/20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center">
          {/* Left: Back to Home */}
          <div className="flex-1">
            <Link href="/" className="inline-flex items-center text-text-primary/60 hover:text-text-primary transition-colors">
              ← Back to Home
            </Link>
          </div>

          {/* Center: Logo, Admin Badge, and Scripts nav */}
          <div className="flex-1 flex justify-center items-center gap-4">
            <Link href="/admin" className="flex items-center gap-3">
              <Image
                src="/leynk-logo.svg"
                alt="Leynk"
                width={180}
                height={49}
                priority
              />
              <span className="px-3 py-1 bg-accent text-white text-sm font-semibold rounded-full">
                Admin
              </span>
            </Link>
            {superAdmin && (
              <Link
                href="/admin/scripts"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-text-primary/60 hover:text-accent hover:bg-accent/8 transition-colors"
              >
                <Terminal size={15} />
                Scripts
              </Link>
            )}
          </div>

          {/* Right: Logout */}
          <div className="flex-1 flex justify-end">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-text-primary/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Users className="text-accent" size={24} />
              </div>
              <div>
                <p className="text-text-primary/60 text-sm">Active Users</p>
                <p className="text-3xl font-bold text-text-primary">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Trash2 className="text-accent" size={24} />
              </div>
              <div>
                <p className="text-text-primary/60 text-sm">Deleted Profiles</p>
                <p className="text-3xl font-bold text-text-primary">{deletedUsers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <BarChart3 className="text-accent" size={24} />
              </div>
              <div>
                <p className="text-text-primary/60 text-sm">Total Clicks</p>
                <p className="text-3xl font-bold text-text-primary">
                  {Object.values(viewStats).reduce((sum, count) => sum + count, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <Link
              href="/admin/create"
              className="flex items-center gap-3 justify-center h-full group"
            >
              <Plus className="text-accent group-hover:scale-110 transition-transform" size={24} />
              <span className="text-lg font-semibold text-accent group-hover:text-accent/80 transition-colors">
                Create New User
              </span>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-accent/20">
            <div className="flex">
              <button
                onClick={() => setActiveTab('active')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'active'
                  ? 'bg-accent text-white'
                  : 'text-text-primary/60 hover:bg-bg-primary/30'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Users size={20} />
                  Active Profiles ({users.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('deleted')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'deleted'
                  ? 'bg-red-600 text-white'
                  : 'text-text-primary/60 hover:bg-bg-primary/30'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Trash2 size={20} />
                  Deleted Profiles ({deletedUsers.length})
                </div>
              </button>
            </div>
          </div>

          {/* Search & Filter bar — active tab only */}
          {activeTab === 'active' && (
            <div className="px-6 py-4 border-b border-accent/10 bg-bg-primary/30">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-primary/40"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search by username or bio…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-accent/20 bg-white text-sm text-text-primary placeholder:text-text-primary/40 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-primary/40 hover:text-text-primary transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Sort dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-2.5 rounded-xl border border-accent/20 bg-white text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition cursor-pointer"
                >
                  <option value="newest">⬇ Newest first</option>
                  <option value="oldest">⬆ Oldest first</option>
                  <option value="highest-views">📊 Highest views</option>
                </select>

                {/* Listed By dropdown */}
                <select
                  value={filterListedBy}
                  onChange={(e) => setFilterListedBy(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-accent/20 bg-white text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition cursor-pointer"
                >
                  <option value="">👤 All listed-by</option>
                  {listedByOptions.map((lb) => (
                    <option key={lb} value={lb}>
                      {lb}
                    </option>
                  ))}
                  <option value="__unassigned__">— Unassigned</option>
                </select>
              </div>

              {/* Result count */}
              {isFiltered && (
                <p className="mt-2 text-xs text-text-primary/50">
                  Showing <span className="font-semibold text-accent">{filteredUsers.length}</span> of{' '}
                  <span className="font-semibold">{users.length}</span> profiles
                </p>
              )}
            </div>
          )}

          {/* Table Content */}
          {loading ? (
            <div className="p-12 text-center text-text-primary/60">Loading...</div>
          ) : activeTab === 'active' && filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-text-primary/60 mb-4">
                {isFiltered ? 'No profiles match your search or filters.' : 'No active users yet'}
              </p>
              {!isFiltered && (
                <Link
                  href="/admin/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full font-semibold hover:bg-accent/90 transition-all"
                >
                  <Plus size={20} />
                  Create Your First User
                </Link>
              )}
            </div>
          ) : activeTab === 'deleted' && currentUsers.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-text-primary/60 mb-4">No deleted profiles</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-primary">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                      Username
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                      Bio
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                      Listed By
                    </th>
                    {activeTab === 'active' && (
                      <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                        Clicks
                      </th>
                    )}
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                      {activeTab === 'active' ? 'Created' : 'Deleted'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-text-primary">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-accent/10">
                  {(activeTab === 'active' ? filteredUsers : currentUsers).map((user) => (
                    <tr key={user.username} className="hover:bg-bg-primary/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user.username}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                              <span className="text-accent font-semibold text-sm">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="font-medium text-text-primary">{user.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-text-primary/70 truncate">
                          {user.bio || 'No bio'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {user.listedBy ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                            {user.listedBy}
                          </span>
                        ) : (
                          <span className="text-text-primary/40 text-sm italic">Unassigned</span>
                        )}
                      </td>
                      {activeTab === 'active' && (
                        <td className="px-6 py-4">
                          <span className="text-text-primary font-semibold">
                            {viewStats[user.username] || 0}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-4 text-text-primary/70 text-sm">
                        {new Date(activeTab === 'active' ? user.createdAt : user.deletedAt!).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {activeTab === 'active' ? (
                            <>
                              <Tooltip text="View analytics and statistics" position="top">
                                <button
                                  onClick={() => setAnalyticsUsername(user.username)}
                                  className="p-2 hover:bg-accent/10 rounded-lg transition-colors group"
                                >
                                  <BarChart3 className="text-text-primary/60 group-hover:text-accent" size={18} />
                                </button>
                              </Tooltip>
                              <Tooltip text="Copy user page link to clipboard" position="top">
                                <button
                                  onClick={() => handleCopyLink(user.username)}
                                  className="p-2 hover:bg-accent/10 rounded-lg transition-colors group relative"
                                >
                                  {copiedUsername === user.username ? (
                                    <Check className="text-accent" size={18} />
                                  ) : (
                                    <Copy className="text-text-primary/60 group-hover:text-accent" size={18} />
                                  )}
                                </button>
                              </Tooltip>
                              <Tooltip text="View user page in new tab" position="top">
                                <Link
                                  href={`/${user.username}`}
                                  target="_blank"
                                  className="p-2 hover:bg-accent/10 rounded-lg transition-colors group"
                                >
                                  <Eye className="text-text-primary/60 group-hover:text-accent" size={18} />
                                </Link>
                              </Tooltip>
                              <Tooltip text="Edit user profile and links" position="top">
                                <Link
                                  href={`/admin/edit/${user.username}`}
                                  className="p-2 hover:bg-accent/10 rounded-lg transition-colors group"
                                >
                                  <Edit className="text-text-primary/60 group-hover:text-accent" size={18} />
                                </Link>
                              </Tooltip>
                              <Tooltip text="Move to deleted profiles" position="top">
                                <button
                                  onClick={() => handleDelete(user.username)}
                                  className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                                >
                                  <Trash2 className="text-text-primary/60 group-hover:text-red-600" size={18} />
                                </button>
                              </Tooltip>

                              {/* 3-dot menu for additional actions */}
                              <div className="relative">
                                <Tooltip text="More actions" position="top">
                                  <button
                                    onClick={() => setOpenMenuUsername(openMenuUsername === user.username ? null : user.username)}
                                    className="p-2 hover:bg-accent/10 rounded-lg transition-colors group"
                                  >
                                    <MoreVertical className="text-text-primary/60 group-hover:text-accent" size={18} />
                                  </button>
                                </Tooltip>

                                {/* Dropdown menu */}
                                {openMenuUsername === user.username && (
                                  <>
                                    {/* Backdrop to close menu when clicking outside */}
                                    <div
                                      className="fixed inset-0 z-10"
                                      onClick={() => setOpenMenuUsername(null)}
                                    />

                                    {/* Menu content */}
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-accent/20 z-20 overflow-hidden">
                                      <button
                                        onClick={() => handleCopyProfile(user.username)}
                                        className="w-full px-4 py-3 text-left hover:bg-accent/10 transition-colors flex items-center gap-3 text-text-primary"
                                      >
                                        <Copy size={16} className="text-accent" />
                                        <span className="font-medium">Copy Profile</span>
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              <Tooltip text="Recover user profile" position="top">
                                <button
                                  onClick={() => handleRecover(user.username)}
                                  className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                                >
                                  <RefreshCw className="text-text-primary/60 group-hover:text-green-600" size={18} />
                                </button>
                              </Tooltip>
                              <Tooltip text="Permanently delete (cannot be undone)" position="top">
                                <button
                                  onClick={() => handlePermanentDelete(user.username)}
                                  className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                                >
                                  <Trash className="text-text-primary/60 group-hover:text-red-600" size={18} />
                                </button>
                              </Tooltip>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Analytics Modal */}
      {analyticsUsername && (
        <AnalyticsModal
          isOpen={!!analyticsUsername}
          onClose={() => setAnalyticsUsername(null)}
          username={analyticsUsername}
        />
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AuthGuard>
      <AdminDashboardContent />
    </AuthGuard>
  );
}
