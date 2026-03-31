'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, X, ArrowLeft, Upload, Palette } from 'lucide-react';
import { Link as LinkType } from '@/types';
import AuthGuard from '@/components/AuthGuard';
import EmojiPicker from '@/components/EmojiPicker';
import { sanitizeUsername, validateUsername } from '@/lib/username-validation';
import { ADMIN_NAMES } from '@/lib/admins';
import { THEMES, DEFAULT_THEME, ThemeType } from '@/lib/themes';

function CreateUserContent() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [listedBy, setListedBy] = useState<string>('');
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME);
  const [profilePicture, setProfilePicture] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [bio, setBio] = useState('');
  const [links, setLinks] = useState<LinkType[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Sanitize input in real-time (remove invalid characters, convert to lowercase)
    const sanitized = sanitizeUsername(input);
    setUsername(sanitized);

    // Validate and show error if invalid
    if (sanitized) {
      const validation = validateUsername(sanitized);
      if (!validation.isValid) {
        setUsernameError(validation.error || null);
      } else {
        setUsernameError(null);
      }
    } else {
      setUsernameError(null);
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
    const newLink: LinkType = {
      id: Date.now().toString(),
      title: '',
      url: '',
      order: links.length,
    };
    setLinks([...links, newLink]);
  };

  const updateLink = (id: string, field: 'title' | 'url', value: string) => {
    setLinks(links.map((link) => (link.id === id ? { ...link, [field]: value } : link)));
  };

  const insertEmojiToLink = (linkId: string, emoji: string) => {
    setLinks(links.map((link) => {
      if (link.id === linkId) {
        // Insert emoji at the end of the title
        return { ...link, title: link.title + emoji };
      }
      return link;
    }));
  };

  const removeLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate username before submission
    const validation = validateUsername(username);
    if (!validation.isValid) {
      setUsernameError(validation.error || 'Invalid username');
      return;
    }

    // Use sanitized username
    const finalUsername = sanitizeUsername(username);
    if (!finalUsername) {
      setUsernameError('Username is required');
      return;
    }

    setSaving(true);

    try {
      let finalProfilePictureUrl = profilePicture;

      // Upload profile picture if a file was selected
      if (profilePictureFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', profilePictureFile);
        formData.append('username', finalUsername);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          finalProfilePictureUrl = uploadData.url;
        } else {
          alert('Failed to upload profile picture');
          setSaving(false);
          setUploading(false);
          return;
        }
        setUploading(false);
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: finalUsername,
          profilePicture: finalProfilePictureUrl,
          bio,
          links: links.filter((link) => link.title && link.url),
          listedBy: listedBy || null,
          theme: theme,
        }),
      });

      if (response.ok) {
        router.push('/admin/edit/' + finalUsername);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user');
    } finally {
      setSaving(false);
    }
  };

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

          {/* Right: Page Title */}
          <div className="flex-1 flex justify-end">
            <span className="text-lg font-semibold text-text-primary/60">Create New User</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-text-primary mb-6">Basic Information</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="e.g., renebachmeier776"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-text-primary ${usernameError
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-accent/20 focus:ring-accent/50'
                    }`}
                  required
                />
                {usernameError ? (
                  <p className="text-sm text-red-600 mt-2">
                    {usernameError}
                  </p>
                ) : (
                  <p className="text-sm text-text-primary/60 mt-2">
                    Only lowercase letters, numbers, and underscores. No spaces or special characters. This will be the URL: leynk.co/{username || 'username'}
                  </p>
                )}
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
                  Select which admin is creating this profile
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
              <div className="space-y-4">
                {links.map((link, index) => (
                  <div
                    key={link.id}
                    className="flex gap-4 p-4 border border-accent/20 rounded-xl hover:border-accent/40 transition-colors"
                  >
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
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors h-fit"
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
              {uploading ? 'Uploading...' : saving ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function CreateUser() {
  return (
    <AuthGuard>
      <CreateUserContent />
    </AuthGuard>
  );
}

