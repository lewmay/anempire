'use client';

import { useState, useEffect, useCallback } from 'react';
import { getBlogPosts, updateBlogPost } from '@/app/actions/admin';

interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  year: string | null;
  order: number;
  status: 'published' | 'comingSoon';
}

export default function BlogClient() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    subtitle: '',
    year: '',
    order: 0,
    status: 'published' as 'published' | 'comingSoon',
  });
  const [saving, setSaving] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBlogPosts();
      setPosts(data);
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleEdit = (post: BlogPost) => {
    setEditingSlug(post.slug);
    setEditForm({
      title: post.title,
      subtitle: post.subtitle,
      year: post.year || '',
      order: post.order,
      status: post.status,
    });
  };

  const handleSave = async (slug: string) => {
    setSaving(true);
    try {
      await updateBlogPost(slug, {
        title: editForm.title,
        subtitle: editForm.subtitle,
        year: editForm.year || undefined,
        order: editForm.order,
        status: editForm.status,
      });
      setEditingSlug(null);
      loadPosts();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update post');
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setEditingSlug(null);
  };

  return (
    <div>
      {loading && (
        <div className="text-center py-12">
          <p className="text-neutral-600 font-sans text-sm">Loading...</p>
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center py-12 bg-white border border-neutral-200">
          <p className="text-neutral-600 font-sans text-sm">No posts</p>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.slug} className="bg-white border border-neutral-200 p-6">
              {editingSlug === post.slug ? (
                // Edit Mode
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-sans text-neutral-600 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-3 py-2 text-base font-sans text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans text-neutral-600 mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={editForm.subtitle}
                      onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                      className="w-full px-3 py-2 text-base font-sans text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-sans text-neutral-600 mb-2">
                        Year (optional)
                      </label>
                      <input
                        type="text"
                        value={editForm.year}
                        onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                        className="w-full px-3 py-2 text-base font-sans text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-sans text-neutral-600 mb-2">
                        Order
                      </label>
                      <input
                        type="number"
                        value={editForm.order}
                        onChange={(e) => setEditForm({ ...editForm, order: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-base font-sans text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-sans text-neutral-600 mb-2">
                        Status
                      </label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value as 'published' | 'comingSoon' })}
                        className="w-full px-3 py-2 text-base font-sans text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none"
                      >
                        <option value="published">Published</option>
                        <option value="comingSoon">Coming Soon</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleSave(post.slug)}
                      disabled={saving}
                      className="px-6 py-2 text-sm font-sans text-white bg-neutral-800 hover:bg-neutral-900 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="px-6 py-2 text-sm font-sans text-neutral-700 border border-neutral-300 hover:border-neutral-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-base font-sans text-neutral-800 mb-1">
                      {post.title}
                    </div>
                    <div className="text-sm font-sans text-neutral-600 mb-2">
                      {post.subtitle}
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs font-sans text-neutral-500">
                        Order: {post.order}
                      </span>
                      {post.year && (
                        <span className="text-xs font-sans text-neutral-500">
                          Year: {post.year}
                        </span>
                      )}
                      <span className={`text-xs font-sans ${post.status === 'published' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {post.status === 'published' ? 'Published' : 'Coming Soon'}
                      </span>
                      <span className="text-xs font-sans text-neutral-400">
                        {post.slug}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleEdit(post)}
                    className="ml-4 text-sm font-sans text-neutral-600 hover:text-neutral-900"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
