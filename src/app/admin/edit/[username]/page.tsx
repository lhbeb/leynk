'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, X, ArrowLeft, Upload, CheckCircle, AlertCircle, Palette, GripVertical, Eye } from 'lucide-react';
import { Link as LinkType, UserPage } from '@/types';
import AuthGuard from '@/components/AuthGuard';
import EmojiPicker from '@/components/EmojiPicker';
import { ADMIN_NAMES } from '@/lib/admins';
import { THEMES, DEFAULT_THEME, ThemeType } from '@/lib/themes';

function EditUserContent({ params }: { params: { username: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(params.username);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [listedBy, setListedBy] = useState<string>('');
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME);
  const [profilePicture, setProfilePicture] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [bio, setBio] = useState('');
  const [links, setLinks] = useState<LinkType[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  // Drag-and-drop state
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
  }, [params.username]);

  // Debug: Log links state changes
  useEffect(() => {
    console.log('🔗 Links state updated:', {
      count: links.length,
      links: links.map(l => ({ id: l.id, title: l.title, url: l.url })),
    });
  }, [links]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${params.username}`);
      if (response.ok) {
        const data = await response.json();
        const user: UserPage = data.user;
        setUsername(user.username);
        setListedBy(user.listedBy || '');
        setTheme((user.theme as ThemeType) || DEFAULT_THEME);
        setProfilePicture(user.profilePicture);
        setBio(user.bio);
        setLinks(user.links);
      } else {
        setSaveError('User not found');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setSaveError('Failed to load user. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePictureFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addLink = () => {
    setLinks((prevLinks) => {
      const newLink: LinkType = {
        id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: '',
        url: '',
        order: prevLinks.length,
      };
      console.log('Adding new link:', newLink.id);
      return [...prevLinks, newLink];
    });
  };

  const updateLink = (id: string, field: 'title' | 'url', value: string) => {
    setLinks((prevLinks) =>
      prevLinks.map((link) => (link.id === id ? { ...link, [field]: value } : link))
    );
  };

  const insertEmojiToLink = (linkId: string, emoji: string) => {
    setLinks((prevLinks) =>
      prevLinks.map((link) => {
        if (link.id === linkId) {
          // Insert emoji at the end of the title
          return { ...link, title: link.title + emoji };
        }
        return link;
      })
    );
  };

  const removeLink = (id: string) => {
    setLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
  };

  // ── Drag-and-drop handlers ────────────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id !== dragId) setDragOverId(id);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!dragId || dragId === targetId) {
      setDragId(null);
      setDragOverId(null);
      return;
    }
    setLinks((prev) => {
      const items = [...prev];
      const fromIdx = items.findIndex((l) => l.id === dragId);
      const toIdx = items.findIndex((l) => l.id === targetId);
      const [moved] = items.splice(fromIdx, 1);
      items.splice(toIdx, 0, moved);
      // Re-assign order values to match new positions
      return items.map((l, i) => ({ ...l, order: i }));
    });
    setDragId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDragId(null);
    setDragOverId(null);
  };
  // ─────────────────────────────────────────────────────────────────────────

  const handleUsernameChange = (newUsername: string) => {
    setUsername(newUsername);
    setUsernameError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submission
    if (saving || uploading) {
      return;
    }

    // Validate that admin is selected
    if (!listedBy || listedBy.trim() === '') {
      setSaveError('Please select which admin is managing this profile');
      return;
    }

    setSaving(true);

    try {
      // Check if username has changed
      if (username !== params.username) {
        // Rename the user first
        const renameResponse = await fetch('/api/users/rename', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            oldUsername: params.username,
            newUsername: username,
          }),
        });

        const renameData = await renameResponse.json();

        if (!renameResponse.ok) {
          setUsernameError(renameData.error || 'Failed to change username');
          setSaveError(renameData.error || 'Failed to change username');
          setSaving(false);
          return;
        }

        console.log('✅ Username changed successfully:', renameData);

        // Redirect to the new username's edit page
        router.push(`/admin/edit/${username}`);
        router.refresh();
        return;
      }

      let finalProfilePictureUrl = profilePicture;

      // Upload profile picture if a file was selected
      if (profilePictureFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', profilePictureFile);
        formData.append('username', username);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          finalProfilePictureUrl = uploadData.url;
        } else {
          setSaveError('Failed to upload profile picture. Please try again.');
          setSaving(false);
          setUploading(false);
          return;
        }
        setUploading(false);
      }

      // Log all links in state before filtering
      console.log('=== SAVE ATTEMPT ===');
      console.log('All links in state:', JSON.stringify(links, null, 2));

      // Filter and prepare links for saving
      const validLinks = links.filter((link) => {
        const hasTitle = link.title && typeof link.title === 'string' && link.title.trim().length > 0;
        const hasUrl = link.url && typeof link.url === 'string' && link.url.trim().length > 0;
        if (!hasTitle || !hasUrl) {
          console.log('❌ Filtering out invalid link:', {
            id: link.id,
            title: link.title,
            url: link.url,
            hasTitle,
            hasUrl,
          });
        } else {
          console.log('✅ Valid link:', {
            id: link.id,
            title: link.title.trim(),
            url: link.url.trim(),
          });
        }
        return hasTitle && hasUrl;
      });

      const linksToSave = validLinks.map((link, index) => ({
        id: link.id,
        title: link.title.trim(),
        url: link.url.trim(),
        order: index,
      }));

      console.log('Total links in form:', links.length);
      console.log('Valid links to save:', linksToSave.length);
      console.log('Links data being sent:', JSON.stringify(linksToSave, null, 2));

      if (linksToSave.length === 0 && links.length > 0) {
        setSaveError('Please fill in both title and URL for all links before saving.');
        setSaveSuccess(false);
        setSaving(false);
        return;
      }

      const requestBody = {
        username: username,
        profilePicture: finalProfilePictureUrl,
        bio,
        links: linksToSave,
        listedBy: listedBy || null,
        theme: theme || DEFAULT_THEME,
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('✅ User saved successfully:', responseData.user);
        // Verify the saved user has the links
        if (responseData.user && responseData.user.links) {
          console.log('✅ Saved links count:', responseData.user.links.length);
          console.log('✅ Saved links:', JSON.stringify(responseData.user.links, null, 2));

          // Verify links match what we sent
          if (responseData.user.links.length !== linksToSave.length) {
            console.warn('⚠️ Warning: Saved links count does not match sent links count', {
              sent: linksToSave.length,
              saved: responseData.user.links.length,
            });
          }
        } else {
          console.error('❌ No links in saved user data!');
        }

        // Update local state with saved data
        setProfilePicture(responseData.user.profilePicture || '');
        setBio(responseData.user.bio || '');
        setLinks(responseData.user.links || []);
        setProfilePictureFile(null); // Clear file input

        // Show success message
        setSaveSuccess(true);
        setSaveError(null);

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 5000);

        // Clear any cached data and refresh
        router.refresh();
      } else {
        console.error('❌ Save failed:', responseData);
        console.error('Response status:', response.status);
        setSaveError(responseData.error || 'Unknown error. Please check the console for details.');
        setSaveSuccess(false);
      }
    } catch (error: any) {
      console.error('❌ Error updating user:', error);
      setSaveError(error.message || 'Unknown error. Please check the console for details.');
      setSaveSuccess(false);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <p className="text-text-primary/60">Loading...</p>
      </div>
    );
  }

  // Show error message even when loading is done but user is not found
  if (saveError && !loading && !profilePicture && !bio) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <header className="border-b border-accent/20 bg-white/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 py-6 flex items-center">
            {/* Left: Back to Dashboard */}
            <div className="flex-1">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-text-primary/60 hover:text-text-primary transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Dashboard
              </Link>
            </div>

            {/* Center: Logo */}
            <div className="flex-1 flex justify-center">
              <Link href="/admin">
                <Image
                  src="/leynk-logo.svg"
                  alt="Leynk"
                  width={180}
                  height={49}
                  priority
                />
              </Link>
            </div>

            {/* Right: Page Title */}
            <div className="flex-1 flex justify-end">
              <span className="text-lg font-semibold text-text-primary/60">Edit User</span>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
            <div className="flex-1">
              <p className="text-red-800 font-semibold">Error</p>
              <p className="text-red-700 text-sm">{saveError}</p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-accent/20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center">
          {/* Left: Back to Dashboard */}
          <div className="flex-1">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-text-primary/60 hover:text-text-primary transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </Link>
          </div>

          {/* Center: Logo */}
          <div className="flex-1 flex justify-center">
            <Link href="/admin">
              <Image
                src="/leynk-logo.svg"
                alt="Leynk"
                width={180}
                height={49}
                priority
              />
            </Link>
          </div>

          {/* Right: Actions & Page Title */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <Link
              href={`/${username}`}
              target="_blank"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors text-sm font-semibold"
            >
              <Eye size={16} />
              View Profile
            </Link>
            <span className="text-lg font-semibold text-text-primary/60">Edit {username}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
            <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
            <div className="flex-1">
              <p className="text-green-800 font-semibold">User updated successfully!</p>
              <p className="text-green-700 text-sm">Your changes have been saved.</p>
            </div>
            <button
              onClick={() => setSaveSuccess(false)}
              className="text-green-600 hover:text-green-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Error Message */}
        {saveError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
            <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
            <div className="flex-1">
              <p className="text-red-800 font-semibold">Failed to update user</p>
              <p className="text-red-700 text-sm">{saveError}</p>
            </div>
            <button
              onClick={() => setSaveError(null)}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-text-primary mb-6">Basic Information</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  className="w-full px-4 py-3 border border-accent/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary"
                  placeholder="Enter username"
                />
                {usernameError && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {usernameError}
                  </p>
                )}
                {username !== params.username && !usernameError && (
                  <p className="text-sm text-amber-600 mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    Changing username will redirect you to the new profile page
                  </p>
                )}
                <p className="text-sm text-text-primary/60 mt-2">
                  Your profile will be accessible at: leynk.co/{username}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Profile Picture
                </label>

                {/* File Upload */}
                <div className="mb-4">
                  <label className="block w-full cursor-pointer">
                    <div className="border-2 border-dashed border-accent/30 rounded-xl p-6 hover:border-accent/50 transition-colors">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="text-accent" size={32} />
                        <span className="text-sm font-medium text-text-primary">
                          Click to upload or drag and drop
                        </span>
                        <span className="text-xs text-text-primary/60">
                          PNG, JPG, GIF, WebP up to 5MB
                        </span>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Or URL Input */}
                <div className="text-center text-sm text-text-primary/60 mb-3">or</div>
                <input
                  type="url"
                  value={profilePictureFile ? '' : profilePicture}
                  onChange={(e) => {
                    setProfilePicture(e.target.value);
                    setProfilePictureFile(null);
                  }}
                  placeholder="https://example.com/image.jpg"
                  disabled={!!profilePictureFile}
                  className="w-full px-4 py-3 border border-accent/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary disabled:bg-gray-50 disabled:text-text-primary/50"
                />

                {/* Preview */}
                {profilePicture && (
                  <div className="mt-4">
                    <p className="text-sm text-text-primary/60 mb-2">Preview:</p>
                    <img
                      src={profilePicture}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Listed By *
                </label>
                <select
                  value={listedBy}
                  onChange={(e) => setListedBy(e.target.value)}
                  className="w-full px-4 py-3 border border-accent/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary bg-white"
                  required
                >
                  <option value="">Select admin...</option>
                  {ADMIN_NAMES.map((admin) => (
                    <option key={admin} value={admin}>
                      {admin}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-text-primary/60 mt-2">
                  You must identify yourself to edit this profile
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Profile Theme
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Palette className="text-text-primary/40" size={20} />
                  </div>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as ThemeType)}
                    className="w-full pl-12 pr-4 py-3 border border-accent/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary bg-white appearance-none"
                  >
                    {Object.values(THEMES).map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} - {t.description}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-text-primary/60 mt-2">
                  Choose a visual style for this profile
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="w-full px-4 py-3 border border-accent/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary resize-none"
                />
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-text-primary">Links</h2>
              <button
                type="button"
                onClick={addLink}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-full font-semibold hover:bg-accent/90 transition-all"
              >
                <Plus size={18} />
                Add Link
              </button>
            </div>

            {links.length === 0 ? (
              <div className="text-center py-12 text-text-primary/60">
                <p className="mb-4">No links yet</p>
                <button
                  type="button"
                  onClick={addLink}
                  className="text-accent hover:text-accent/80 font-semibold"
                >
                  Add your first link
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {links.map((link, index) => (
                  <div
                    key={link.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, link.id)}
                    onDragOver={(e) => handleDragOver(e, link.id)}
                    onDrop={(e) => handleDrop(e, link.id)}
                    onDragEnd={handleDragEnd}
                    className={`flex gap-3 p-4 border rounded-xl transition-all duration-150 ${dragOverId === link.id
                        ? 'border-t-2 border-t-accent border-accent/40 bg-accent/5 scale-[1.01]'
                        : dragId === link.id
                          ? 'opacity-40 border-accent/20'
                          : 'border-accent/20 hover:border-accent/40'
                      }`}
                  >
                    {/* Drag handle */}
                    <div
                      className="flex items-center self-stretch px-1 cursor-grab active:cursor-grabbing text-text-primary/30 hover:text-accent transition-colors flex-shrink-0"
                      title="Drag to reorder"
                    >
                      <GripVertical size={20} />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="relative">
                        <input
                          type="text"
                          value={link.title}
                          onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                          placeholder="Link title"
                          className="w-full px-4 py-2 pr-12 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <EmojiPicker onEmojiSelect={(emoji) => insertEmojiToLink(link.id, emoji)} />
                        </div>
                      </div>
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-4 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeLink(link.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors h-fit self-start mt-1"
                    >
                      <X className="text-text-primary/60 hover:text-red-600" size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link
              href="/admin"
              className="px-6 py-3 border border-accent/20 text-text-primary rounded-full font-semibold hover:bg-white transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || uploading}
              className="px-6 py-3 bg-accent text-white rounded-full font-semibold hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default async function EditUser({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  return (
    <AuthGuard>
      <EditUserContent params={{ username }} />
    </AuthGuard>
  );
}

