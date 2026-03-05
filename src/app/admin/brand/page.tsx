'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import AccessRestricted from '@/components/admin/AccessRestricted';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'system_user';
  status: 'active' | 'disabled';
}

interface BrandAssets {
  baseUrl: string;
  ogImage: { exists: boolean; url: string };
  favicon: { exists: boolean; url: string };
  favicon16: { exists: boolean; url: string };
  favicon32: { exists: boolean; url: string };
  appleTouchIcon: { exists: boolean; url: string };
  manifest: { exists: boolean; url: string };
}

interface UploadStatus {
  type: string;
  status: 'idle' | 'uploading' | 'success' | 'error';
  message?: string;
}

export default function BrandPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [assets, setAssets] = useState<BrandAssets | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    type: '',
    status: 'idle',
  });

  // Auth check
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/setup');
        const data = await res.json();
        
        if (data.user && data.user.status === 'active') {
          setUser(data.user);
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin/login');
      } finally {
        setAuthLoading(false);
      }
    }
    
    checkAuth();
  }, [router]);

  // Fetch current asset status
  useEffect(() => {
    if (user) {
      fetchAssetStatus();
    }
  }, [user]);

  const fetchAssetStatus = async () => {
    try {
      const response = await fetch('/api/admin/brand/status');
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch asset status');
      }
      
      const data = await response.json();
      setAssets(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch asset status:', err);
      setError(err instanceof Error ? err.message : 'Failed to load brand assets');
      // Set default empty assets to prevent crashes
      setAssets({
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'Not configured',
        ogImage: { exists: false, url: '/og-image.png' },
        favicon: { exists: false, url: '/favicon.ico' },
        favicon16: { exists: false, url: '/favicon-16.png' },
        favicon32: { exists: false, url: '/favicon-32.png' },
        appleTouchIcon: { exists: false, url: '/apple-touch-icon.png' },
        manifest: { exists: false, url: '/site.webmanifest' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    fileType: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus({ type: fileType, status: 'uploading' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', fileType);

    try {
      const response = await fetch('/api/admin/brand/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadStatus({
          type: fileType,
          status: 'success',
          message: `Uploaded ${data.filename}`,
        });
        fetchAssetStatus();

        setTimeout(() => {
          setUploadStatus({ type: '', status: 'idle' });
        }, 3000);
      } else {
        setUploadStatus({
          type: fileType,
          status: 'error',
          message: data.error || data.suggestion || 'Upload failed',
        });
      }
    } catch (err) {
      setUploadStatus({
        type: fileType,
        status: 'error',
        message: 'Network error',
      });
    }
  };

  const generateManifest = async () => {
    try {
      const response = await fetch('/api/admin/brand/generate-manifest', {
        method: 'POST',
      });

      if (response.ok) {
        alert('Web manifest generated successfully');
        fetchAssetStatus();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to generate manifest');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const copyBaseUrl = () => {
    if (assets?.baseUrl) {
      navigator.clipboard.writeText(assets.baseUrl);
      alert('Base URL copied to clipboard');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-neutral-600 font-sans">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user.role !== 'admin') {
    return <AccessRestricted user={user} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <AdminNav user={user} />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <p className="text-neutral-600 font-sans">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminNav user={user} />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-light text-neutral-900 mb-2">
            Brand Assets
          </h1>
          <p className="text-sm text-neutral-600 font-sans">
            Manage Open Graph images, favicons, and site metadata. Changes apply
            sitewide.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-800 font-sans">{error}</p>
          </div>
        )}

        {/* Netlify Notice */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800 font-sans">
            <strong>Note:</strong> File uploads don&apos;t work on Netlify&apos;s serverless environment. 
            To add brand assets, upload them directly to your GitHub repository in the <code className="bg-blue-100 px-1 rounded">/public</code> folder.
          </p>
        </div>

        {/* Base URL Section */}
        <section className="mb-12 border-t border-neutral-200 pt-8">
          <h2 className="text-lg font-serif font-light text-neutral-900 mb-4">
            Base URL
          </h2>

          <div className="bg-neutral-50 p-6 rounded border border-neutral-200">
            <div className="mb-3">
              <p className="text-sm font-sans text-neutral-700 mb-1">
                Current Value:
              </p>
              <p className="text-base font-mono text-neutral-900">
                {assets?.baseUrl || 'Not set'}
              </p>
            </div>

            {assets?.baseUrl && assets.baseUrl.includes('localhost') && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800 font-sans">
                  ⚠️ Warning: Using localhost URL. Update NEXT_PUBLIC_BASE_URL in
                  production environment variables.
                </p>
              </div>
            )}

            <button
              onClick={copyBaseUrl}
              className="text-sm font-sans text-neutral-700 hover:text-neutral-900 border border-neutral-300 px-4 py-2 rounded hover:bg-neutral-50 transition-colors"
            >
              Copy current value
            </button>

            <p className="text-xs text-neutral-500 font-sans mt-4">
              Note: This UI cannot change environment variables. Update
              NEXT_PUBLIC_BASE_URL in your deployment platform&apos;s environment
              settings.
            </p>
          </div>
        </section>

        {/* OG Image Section */}
        <section className="mb-12 border-t border-neutral-200 pt-8">
          <h2 className="text-lg font-serif font-light text-neutral-900 mb-4">
            Open Graph Image
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-neutral-700 font-sans mb-2">
                Default social sharing image (1200×630 recommended)
              </p>

              {assets?.ogImage?.exists && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-800 font-sans">
                    ✓ OG image exists at {assets.ogImage.url}
                  </p>
                </div>
              )}

              <label className="block">
                <span className="sr-only">Upload OG image</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => handleFileUpload(e, 'og-image')}
                  className="block w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-sans file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 cursor-pointer"
                />
              </label>

              {uploadStatus.type === 'og-image' && uploadStatus.status === 'uploading' && (
                <p className="text-sm text-neutral-600 font-sans mt-2">
                  Uploading...
                </p>
              )}
              {uploadStatus.type === 'og-image' && uploadStatus.status === 'success' && (
                <p className="text-sm text-green-700 font-sans mt-2">
                  ✓ {uploadStatus.message}
                </p>
              )}
              {uploadStatus.type === 'og-image' && uploadStatus.status === 'error' && (
                <p className="text-sm text-red-700 font-sans mt-2">
                  ✗ {uploadStatus.message}
                </p>
              )}
            </div>

            <p className="text-xs text-neutral-500 font-sans">
              PNG or JPEG format. Will be saved as og-image.png. Used for social
              sharing previews.
            </p>
          </div>
        </section>

        {/* Favicons Section */}
        <section className="mb-12 border-t border-neutral-200 pt-8">
          <h2 className="text-lg font-serif font-light text-neutral-900 mb-4">
            Favicons & App Icons
          </h2>

          <div className="space-y-6">
            {/* Favicon ICO */}
            <div>
              <p className="text-sm text-neutral-700 font-sans mb-2">
                Favicon (ICO format)
              </p>

              {assets?.favicon?.exists && (
                <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-xs text-green-800 font-sans">
                    ✓ Exists
                  </p>
                </div>
              )}

              <label className="block">
                <span className="sr-only">Upload favicon.ico</span>
                <input
                  type="file"
                  accept=".ico"
                  onChange={(e) => handleFileUpload(e, 'favicon')}
                  className="block w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-sans file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 cursor-pointer"
                />
              </label>

              {uploadStatus.type === 'favicon' && uploadStatus.status === 'uploading' && (
                <p className="text-sm text-neutral-600 font-sans mt-2">
                  Uploading...
                </p>
              )}
              {uploadStatus.type === 'favicon' && uploadStatus.status === 'success' && (
                <p className="text-sm text-green-700 font-sans mt-2">
                  ✓ {uploadStatus.message}
                </p>
              )}
              {uploadStatus.type === 'favicon' && uploadStatus.status === 'error' && (
                <p className="text-sm text-red-700 font-sans mt-2">
                  ✗ {uploadStatus.message}
                </p>
              )}
            </div>

            {/* Favicon 16×16 */}
            <div>
              <p className="text-sm text-neutral-700 font-sans mb-2">
                Favicon 16×16 (PNG)
              </p>

              {assets?.favicon16?.exists && (
                <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-xs text-green-800 font-sans">
                    ✓ Exists
                  </p>
                </div>
              )}

              <label className="block">
                <span className="sr-only">Upload favicon-16.png</span>
                <input
                  type="file"
                  accept="image/png"
                  onChange={(e) => handleFileUpload(e, 'favicon-16')}
                  className="block w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-sans file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 cursor-pointer"
                />
              </label>

              {uploadStatus.type === 'favicon-16' && uploadStatus.status === 'uploading' && (
                <p className="text-sm text-neutral-600 font-sans mt-2">
                  Uploading...
                </p>
              )}
              {uploadStatus.type === 'favicon-16' && uploadStatus.status === 'success' && (
                <p className="text-sm text-green-700 font-sans mt-2">
                  ✓ {uploadStatus.message}
                </p>
              )}
              {uploadStatus.type === 'favicon-16' && uploadStatus.status === 'error' && (
                <p className="text-sm text-red-700 font-sans mt-2">
                  ✗ {uploadStatus.message}
                </p>
              )}
            </div>

            {/* Favicon 32×32 */}
            <div>
              <p className="text-sm text-neutral-700 font-sans mb-2">
                Favicon 32×32 (PNG)
              </p>

              {assets?.favicon32?.exists && (
                <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-xs text-green-800 font-sans">
                    ✓ Exists
                  </p>
                </div>
              )}

              <label className="block">
                <span className="sr-only">Upload favicon-32.png</span>
                <input
                  type="file"
                  accept="image/png"
                  onChange={(e) => handleFileUpload(e, 'favicon-32')}
                  className="block w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-sans file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 cursor-pointer"
                />
              </label>

              {uploadStatus.type === 'favicon-32' && uploadStatus.status === 'uploading' && (
                <p className="text-sm text-neutral-600 font-sans mt-2">
                  Uploading...
                </p>
              )}
              {uploadStatus.type === 'favicon-32' && uploadStatus.status === 'success' && (
                <p className="text-sm text-green-700 font-sans mt-2">
                  ✓ {uploadStatus.message}
                </p>
              )}
              {uploadStatus.type === 'favicon-32' && uploadStatus.status === 'error' && (
                <p className="text-sm text-red-700 font-sans mt-2">
                  ✗ {uploadStatus.message}
                </p>
              )}
            </div>

            {/* Apple Touch Icon */}
            <div>
              <p className="text-sm text-neutral-700 font-sans mb-2">
                Apple Touch Icon (180×180 PNG)
              </p>

              {assets?.appleTouchIcon?.exists && (
                <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-xs text-green-800 font-sans">
                    ✓ Exists
                  </p>
                </div>
              )}

              <label className="block">
                <span className="sr-only">Upload apple-touch-icon.png</span>
                <input
                  type="file"
                  accept="image/png"
                  onChange={(e) => handleFileUpload(e, 'apple-touch-icon')}
                  className="block w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-sans file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 cursor-pointer"
                />
              </label>

              {uploadStatus.type === 'apple-touch-icon' &&
                uploadStatus.status === 'uploading' && (
                  <p className="text-sm text-neutral-600 font-sans mt-2">
                    Uploading...
                  </p>
                )}
              {uploadStatus.type === 'apple-touch-icon' &&
                uploadStatus.status === 'success' && (
                  <p className="text-sm text-green-700 font-sans mt-2">
                    ✓ {uploadStatus.message}
                  </p>
                )}
              {uploadStatus.type === 'apple-touch-icon' &&
                uploadStatus.status === 'error' && (
                  <p className="text-sm text-red-700 font-sans mt-2">
                    ✗ {uploadStatus.message}
                  </p>
                )}
            </div>
          </div>
        </section>

        {/* Web Manifest Section */}
        <section className="mb-12 border-t border-neutral-200 pt-8">
          <h2 className="text-lg font-serif font-light text-neutral-900 mb-4">
            Web Manifest
          </h2>

          <div className="space-y-4">
            {assets?.manifest?.exists ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-800 font-sans">
                  ✓ site.webmanifest exists
                </p>
              </div>
            ) : (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800 font-sans mb-3">
                  Web manifest not found. Add a site.webmanifest file to your /public folder.
                </p>
              </div>
            )}

            {assets?.manifest?.exists && (
              <a
                href="/site.webmanifest"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-sans text-neutral-700 hover:text-neutral-900 border-b border-neutral-300 hover:border-neutral-900 transition-colors"
              >
                View current manifest
              </a>
            )}
          </div>
        </section>

        {/* Instructions Section */}
        <section className="border-t border-neutral-200 pt-8">
          <h2 className="text-lg font-serif font-light text-neutral-900 mb-4">
            How to Add Brand Assets
          </h2>
          <div className="bg-neutral-100 p-4 rounded text-sm font-mono text-neutral-700 space-y-2">
            <p>Add these files to your GitHub repo in /public:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>og-image.png (1200×630)</li>
              <li>favicon.ico</li>
              <li>favicon-16.png (16×16)</li>
              <li>favicon-32.png (32×32)</li>
              <li>apple-touch-icon.png (180×180)</li>
              <li>site.webmanifest</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
