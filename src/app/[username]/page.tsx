import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getUser } from '@/lib/storage';
import { Metadata } from 'next';
import LinkCard from '@/components/LinkCard';
import ShareButton from '@/components/ShareButton';
import NotificationButton from '@/components/NotificationButton';
import LeftActionButton from '@/components/LeftActionButton';
import PageViewTracker from '@/components/PageViewTracker';
import { validateUsername } from '@/lib/username-validation';
import { THEMES, ThemeType, DEFAULT_THEME } from '@/lib/themes';

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;

  // Validate username format first
  const validation = validateUsername(username);
  if (!validation.isValid) {
    return {
      title: 'Invalid Username - Leynk',
    };
  }

  const user = await getUser(username);

  if (!user || !user.username) {
    return {
      title: 'User Not Found - Leynk',
    };
  }

  return {
    title: `${user.username} - Leynk`,
    description: user.bio || `Check out ${user.username}'s links`,
  };
}

export default async function UserProfile({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  // Validate username format first - return 404 for invalid usernames
  const validation = validateUsername(username);
  if (!validation.isValid) {
    notFound();
  }

  const user = await getUser(username);

  if (!user || !user.username) {
    notFound();
  }

  const themeId = (user.theme || DEFAULT_THEME) as ThemeType;
  const theme = THEMES[themeId] || THEMES[DEFAULT_THEME];
  const styles = theme.styles;

  return (
    <div className={`min-h-screen ${styles.background} transition-colors duration-500`}>
      <PageViewTracker username={user.username} />
      {/* Header - Action Buttons at Top */}
      <header className="w-full px-4 py-4 md:px-6 md:py-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <LeftActionButton />
          <div className="flex items-center gap-3">
            <ShareButton
              title={`Check out ${user.username}'s links on Leynk`}
            />
            <NotificationButton username={user.username} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Profile Card */}
          <div className={`${styles.cardBg} ${styles.cardRounded} ${styles.cardShadow} ${styles.cardBorder} p-8 md:p-12 transition-all duration-500`}>
            {/* Profile Picture */}
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.username}
                className={`w-28 h-28 rounded-full mx-auto mb-6 object-cover border-4 ${styles.profileBorder} ${styles.profileShadow}`}
              />
            ) : (
              <div className={`w-28 h-28 rounded-full mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-4 ${styles.profileBorder} ${styles.profileShadow}`}>
                <span className="text-white text-4xl font-bold">
                  {user.username && user.username.length > 0
                    ? user.username.charAt(0).toUpperCase()
                    : '?'}
                </span>
              </div>
            )}

            {/* Username */}
            <div className="flex flex-col items-center gap-4 mb-3">
              <h1 className={`text-3xl md:text-4xl font-bold ${styles.textPrimary} text-center`}>
                @{user.username || 'Unknown User'}
              </h1>
            </div>

            {/* Bio */}
            {user.bio && (
              <p className={`${styles.textSecondary} text-center mb-8 max-w-lg mx-auto leading-relaxed`}>
                {user.bio}
              </p>
            )}

            {/* Links */}
            {user.links && user.links.length > 0 ? (
              <div className="space-y-3 md:space-y-4 mt-8">
                {user.links
                  .sort((a, b) => a.order - b.order)
                  .map((link) => (
                    <LinkCard
                      key={link.id}
                      title={link.title}
                      url={link.url}
                      username={user.username}
                      themeId={themeId}
                    />
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-text-primary/60">
                <p>No links yet</p>
              </div>
            )}

            {/* Footer Links */}
            <div className={`mt-12 pt-6 border-t ${styles.profileBorder}`}>
              <div className={`flex flex-wrap items-center justify-center gap-3 text-xs ${styles.footerText} mb-6`}>
                <Link
                  href="/cookie-preferences"
                  className="hover:text-text-primary transition-colors"
                >
                  Cookie Preferences
                </Link>
                <span className="text-text-primary/30">·</span>
                <Link
                  href="/report"
                  className="hover:text-text-primary transition-colors"
                >
                  Report
                </Link>
                <span className="text-text-primary/30">·</span>
                <Link
                  href="/privacy"
                  className="hover:text-text-primary transition-colors"
                >
                  Privacy
                </Link>
              </div>

              {/* Powered by Leynk */}
              <div className="text-center">
                <Link
                  href="/"
                  className="inline-flex flex-col items-center gap-2 group"
                >
                  <span className={`text-xs ${styles.footerText} group-hover:opacity-100 transition-opacity`}>Powered by</span>
                  <Image
                    src="/leynk-logo.svg"
                    alt="Leynk"
                    width={80}
                    height={22}
                    className={`opacity-60 group-hover:opacity-100 transition-opacity ${['dark', 'neon'].includes(themeId) ? 'invert brightness-0' : ''}`}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

