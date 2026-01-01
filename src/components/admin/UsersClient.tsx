'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllUsers, createUser, updateUserRole, toggleUserStatus } from '@/app/actions/admin';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'system_user';
  status: 'active' | 'disabled';
  created_at: string;
}

export default function UsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'create'>('list');

  // Create user state
  const [createEmail, setCreateEmail] = useState('');
  const [createName, setCreateName] = useState('');
  const [createRole, setCreateRole] = useState<'admin' | 'system_user'>('system_user');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    setCreateSuccess('');

    try {
      await createUser(createEmail, createRole, createName || undefined);
      setCreateSuccess('User created. Set password email sent.');
      setCreateEmail('');
      setCreateName('');
      setCreateRole('system_user');
      setTimeout(() => {
        setView('list');
        setCreateSuccess('');
        loadUsers();
      }, 2000);
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : 'Failed to create user');
    }
    setCreating(false);
  };

  const handleUpdateRole = async (userId: string, newRole: 'admin' | 'system_user') => {
    try {
      await updateUserRole(userId, newRole);
      loadUsers();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update role');
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      await toggleUserStatus(userId);
      loadUsers();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to toggle status');
    }
  };

  return (
    <div>
      {/* View Selector */}
      <div className="border-b border-neutral-200 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setView('list')}
            className={`pb-3 px-1 font-sans text-sm transition-colors ${
              view === 'list'
                ? 'border-b-2 border-neutral-800 text-neutral-900'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            User list
          </button>
          <button
            onClick={() => setView('create')}
            className={`pb-3 px-1 font-sans text-sm transition-colors ${
              view === 'create'
                ? 'border-b-2 border-neutral-800 text-neutral-900'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Create user
          </button>
        </div>
      </div>

      {/* Create User View */}
      {view === 'create' && (
        <div className="max-w-2xl">
          <div className="bg-white border border-neutral-200 p-6">
            <h2 className="text-lg font-sans font-light text-neutral-800 mb-6">Create user</h2>

            <form onSubmit={handleCreateUser} className="space-y-6">
              {createError && (
                <div className="text-sm text-red-600">{createError}</div>
              )}

              {createSuccess && (
                <div className="text-sm text-green-600">{createSuccess}</div>
              )}

              <div>
                <label className="block text-sm font-sans text-neutral-600 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-base font-sans text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-sans text-neutral-600 mb-2">
                  Name (optional)
                </label>
                <input
                  type="text"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  className="w-full px-4 py-3 text-base font-sans text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-sans text-neutral-600 mb-2">
                  Role
                </label>
                <select
                  value={createRole}
                  onChange={(e) => setCreateRole(e.target.value as 'admin' | 'system_user')}
                  className="w-full px-4 py-3 text-base font-sans text-neutral-800 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none"
                >
                  <option value="system_user">System User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={creating || !createEmail}
                className="px-6 py-3 text-base font-sans text-white bg-neutral-800 hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Creating...' : 'Create user'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* User List View */}
      {view === 'list' && (
        <div>
          {loading && (
            <div className="text-center py-12">
              <p className="text-neutral-600 font-sans text-sm">Loading...</p>
            </div>
          )}

          {!loading && users.length === 0 && (
            <div className="text-center py-12 bg-white border border-neutral-200">
              <p className="text-neutral-600 font-sans text-sm">No users</p>
            </div>
          )}

          {!loading && users.length > 0 && (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`bg-white border p-6 ${
                    user.status === 'disabled' ? 'border-neutral-300 opacity-60' : 'border-neutral-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-base font-sans text-neutral-800 mb-1">
                        {user.email}
                      </div>
                      {user.name && (
                        <div className="text-sm font-sans text-neutral-600 mb-2">
                          {user.name}
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-3">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value as 'admin' | 'system_user')}
                          className="px-3 py-1 text-sm font-sans text-neutral-700 bg-white border border-neutral-300 focus:border-neutral-500 focus:outline-none"
                        >
                          <option value="system_user">System User</option>
                          <option value="admin">Admin</option>
                        </select>

                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className="text-sm font-sans text-neutral-600 hover:text-neutral-900"
                        >
                          {user.status === 'active' ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </div>

                    <div className="ml-4 text-right">
                      <div className="text-xs font-sans text-neutral-500 mb-1">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div className={`text-xs font-sans ${user.status === 'active' ? 'text-green-600' : 'text-neutral-500'}`}>
                        {user.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
