'use client';

import { useState, useEffect, useCallback } from 'react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  content: string | null;
  year: string | null;
  display_order: number;
  status: 'published' | 'comingSoon' | 'draft';
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

type ViewMode = 'list' | 'edit' | 'create';

export default function BlogClient() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    slug: '',
    content: '',
    year: '',
    display_order: 0,
    status: 'draft' as 'published' | 'comingSoon' | 'draft',
  });

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/blog');
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load posts');
      }
      
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load blog posts');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      slug: '',
      content: '',
      year: '',
      display_order: posts.length + 1,
      status: 'draft',
    });
    setEditingPost(null);
    setError(null);
  };

  const handleCreate = () => {
    resetForm();
    setFormData((prev) => ({ ...prev, display_order: posts.length + 1 }));
    setViewMode('create');
  };

  const handleEdit = async (post: BlogPost) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load post');
      }
      
      const fullPost = data.post;
      setEditingPost(fullPost);
      setFormData({
        title: fullPost.title,
        subtitle: fullPost.subtitle || '',
        slug: fullPost.slug,
        content: fullPost.content || '',
        year: fullPost.year || '',
        display_order: fullPost.display_order,
        status: fullPost.status,
      });
      setViewMode('edit');
    } catch (err) {
      console.error('Failed to load post:', err);
      setError(err instanceof Error ? err.message : 'Failed to load post');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      // Validate
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.slug.trim()) {
        throw new Error('Slug is required');
      }

      // Sanitize slug
      const sanitizedSlug = formData.slug
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const payload = {
        ...formData,
        slug: sanitizedSlug,
      };

      let res;
      if (viewMode === 'create') {
        res = await fetch('/api/admin/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else if (editingPost) {
        res = await fetch(`/api/admin/blog/${editingPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res && !res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save post');
      }

      await loadPosts();
      setViewMode('list');
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    }

    setSaving(false);
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Are you sure you want to delete "${post.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete post');
      }
      
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  const handleCancel = () => {
    setViewMode('list');
    resetForm();
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'comingSoon':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return 'Published';
      case 'comingSoon':
        return 'Coming Soon';
      case 'draft':
        return 'Draft';
      default:
        return status;
    }
  };

  // List View
  if (viewMode === 'list') {
    return (
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-sm text-neutral-600">
            {posts.length} post{posts.length !== 1 ? 's' : ''}
          </p>
          <button
            onClick={handleCreate}
            className="px-4 py-2 text-sm font-sans text-white bg-neutral-800 hover:bg-neutral-900"
          >
            + New Post
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-neutral-600 font-sans text-sm">Loading...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-12 bg-white border border-neutral-200">
            <p className="text-neutral-600 font-sans text-sm mb-4">No blog posts yet</p>
            <button
              onClick={handleCreate}
              className="px-4 py-2 text-sm font-sans text-neutral-700 border border-neutral-300 hover:border-neutral-400"
            >
              Create your first post
            </button>
          </div>
        )}

        {/* Posts List */}
        {!loading && posts.length > 0 && (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-neutral-200 p-6 hover:border-neutral-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-base font-sans text-neutral-800">
                        {post.title}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${getStatusBadgeClass(post.status)}`}
                      >
                        {getStatusLabel(post.status)}
                      </span>
                    </div>
                    {post.subtitle && (
                      <p className="text-sm font-sans text-neutral-600 mb-2">
                        {post.subtitle}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
                      <span>Order: {post.display_order}</span>
                      {post.year && <span>Year: {post.year}</span>}
                      <span className="text-neutral-400">/{post.slug}</span>
                      {post.content && post.content.length > 0 && (
                        <span className="text-neutral-400">
                          {post.content.length} chars
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-sm font-sans text-neutral-600 hover:text-neutral-900 px-3 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post)}
                      className="text-sm font-sans text-red-600 hover:text-red-800 px-3 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Edit/Create View
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={handleCancel}
          className="text-sm font-sans text-neutral-600 hover:text-neutral-900"
        >
          ← Back to posts
        </button>
        <h2 className="text-lg font-sans text-neutral-800">
          {viewMode === 'create' ? 'New Post' : 'Edit Post'}
        </h2>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-white border border-neutral-200 p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-sans text-neutral-600 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => {
              const title = e.target.value;
              setFormData({
                ...formData,
                title,
                // Auto-generate slug only for new posts
                ...(viewMode === 'create' && !formData.slug
                  ? { slug: generateSlug(title) }
                  : {}),
              });
            }}
            className="w-full px-3 py-2 text-base font-sans text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none"
            placeholder="Enter post title"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-sans text-neutral-600 mb-2">
            Subtitle
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full px-3 py-2 text-base font-sans text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none"
            placeholder="Brief description"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-sans text-neutral-600 mb-2">
            Slug * <span className="text-neutral-400">(URL path)</span>
          </label>
          <div className="flex items-center">
            <span className="text-sm text-neutral-400 mr-1">/articles/</span>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })
              }
              className="flex-1 px-3 py-2 text-base font-sans text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none"
              placeholder="post-slug"
            />
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-sans text-neutral-600 mb-2">
            Content <span className="text-neutral-400">(Markdown supported)</span>
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={15}
            className="w-full px-3 py-2 text-sm font-mono text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none resize-y"
            placeholder="Write your post content here. Markdown formatting is supported.

# Heading 1
## Heading 2

**Bold text** and *italic text*

- Bullet point
- Another point

1. Numbered list
2. Second item"
          />
          <p className="mt-1 text-xs text-neutral-400">
            {formData.content.length} characters
          </p>
        </div>

        {/* Meta Fields */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-sans text-neutral-600 mb-2">
              Year <span className="text-neutral-400">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-3 py-2 text-base font-sans text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none"
              placeholder="2024"
            />
          </div>

          <div>
            <label className="block text-sm font-sans text-neutral-600 mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) =>
                setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 text-base font-sans text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-sans text-neutral-600 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as 'published' | 'comingSoon' | 'draft',
                })
              }
              className="w-full px-3 py-2 text-base font-sans text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="comingSoon">Coming Soon</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-neutral-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 text-sm font-sans text-white bg-neutral-800 hover:bg-neutral-900 disabled:opacity-50"
          >
            {saving ? 'Saving...' : viewMode === 'create' ? 'Create Post' : 'Save Changes'}
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
    </div>
  );
}
