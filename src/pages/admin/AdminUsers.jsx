// src/pages/admin/AdminUsers.jsx
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Filter, CheckCircle, XCircle, Shield, User,
  Trash2, Edit, MoreHorizontal, ChevronDown, X
} from 'lucide-react'
import toast from 'react-hot-toast'
import { adminApi } from '@/services/api'
import useAuthStore from '@/store/authStore'
import { useDebounce } from '@/hooks'
import { formatDate, timeAgo, getErrorMessage } from '@/utils'
import { ListSkeleton } from '@/components/ui/Skeleton'
import Pagination from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/Pagination'
import Avatar from '@/components/ui/Avatar'
import Modal from '@/components/ui/Modal'

const ROLES = ['all', 'user', 'admin']
const VERIFIED = ['all', 'verified', 'unverified']

export default function AdminUsers() {
  const { user: me } = useAuthStore()
  const qc = useQueryClient()
  const [search, setSearch]       = useState('')
  const [role, setRole]           = useState('all')
  const [verified, setVerified]   = useState('all')
  const [page, setPage]           = useState(1)
  const [editUser, setEditUser]   = useState(null)
  const [menuOpen, setMenuOpen]   = useState(null)
  const dSearch = useDebounce(search, 400)

  const queryParams = {
    page, limit: 10,
    ...(dSearch && { search: dSearch }),
    ...(role !== 'all' && { role }),
    ...(verified === 'verified' && { verified: 'true' }),
    ...(verified === 'unverified' && { verified: 'false' }),
  }

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['admin-users', queryParams],
    queryFn: () => adminApi.listUsers(queryParams),
    placeholderData: (prev) => prev,
  })

  const users = data?.data?.data || []
  const meta  = data?.data?.meta

  const { mutate: updateUser, isPending: updating } = useMutation({
    mutationFn: ({ id, ...body }) => adminApi.updateUser(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] })
      toast.success('User updated')
      setEditUser(null)
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const { mutate: deleteUser, isPending: deleting } = useMutation({
    mutationFn: (id) => adminApi.deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] })
      toast.success('User deactivated')
      setMenuOpen(null)
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const handleDelete = (u) => {
    if (u._id === me?._id) { toast.error("You can't delete your own account"); return }
    if (window.confirm(`Deactivate ${u.name}? They will lose access immediately.`)) deleteUser(u._id)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-semibold text-surface-900">Users</h1>
          <p className="text-surface-500 text-sm mt-1">{meta?.total ?? '…'} registered users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card card-body p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by name, email, or phone…"
              className="form-input pl-9 text-sm w-full"
            />
            {search && (
              <button onClick={() => { setSearch(''); setPage(1) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-700">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <select value={role} onChange={(e) => { setRole(e.target.value); setPage(1) }} className="form-input text-sm py-2 w-auto">
              {ROLES.map((r) => <option key={r} value={r}>{r === 'all' ? 'All roles' : r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </select>
            <select value={verified} onChange={(e) => { setVerified(e.target.value); setPage(1) }} className="form-input text-sm py-2 w-auto">
              {VERIFIED.map((v) => <option key={v} value={v}>{v === 'all' ? 'All users' : v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={`card overflow-hidden transition-opacity ${isFetching && !isLoading ? 'opacity-70' : ''}`}>
        {isLoading ? (
          <div className="p-4"><ListSkeleton rows={6} /></div>
        ) : users.length === 0 ? (
          <EmptyState icon={User} title="No users found" description="Try adjusting your search or filters." />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-100 bg-surface-50">
                    {['User', 'Role', 'Status', 'Verified', 'Joined', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-surface-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-50">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-surface-50 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} src={u.avatar?.url} size="sm" />
                          <div className="min-w-0">
                            <p className="font-medium text-surface-900 truncate max-w-[160px]">{u.name}</p>
                            <p className="text-xs text-surface-400 truncate max-w-[160px]">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={u.role === 'admin' ? 'badge-primary' : 'badge-gray'}>
                          {u.role === 'admin' && <Shield size={9} />} {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={u.isActive ? 'badge-success' : 'badge-danger'}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {u.isEmailVerified && u.isPhoneVerified
                            ? <><CheckCircle size={14} className="text-green-500" /><span className="text-xs text-green-600">Verified</span></>
                            : <><XCircle size={14} className="text-amber-400" /><span className="text-xs text-amber-600">Pending</span></>
                          }
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-surface-500" title={formatDate(u.createdAt)}>
                        {timeAgo(u.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditUser(u)}
                            className="p-1.5 rounded-lg hover:bg-primary-50 text-surface-400 hover:text-primary-600 transition-colors"
                            title="Edit user"
                          >
                            <Edit size={14} />
                          </button>
                          {u._id !== me?._id && (
                            <button
                              onClick={() => handleDelete(u)}
                              disabled={deleting}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-600 transition-colors"
                              title="Deactivate user"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-surface-100">
              {users.map((u) => (
                <div key={u._id} className="p-4 flex items-center gap-3">
                  <Avatar name={u.name} src={u.avatar?.url} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-surface-900 text-sm truncate">{u.name}</p>
                    <p className="text-xs text-surface-500 truncate">{u.email}</p>
                    <div className="flex gap-2 mt-1">
                      <span className={u.role === 'admin' ? 'badge-primary text-[10px]' : 'badge-gray text-[10px]'}>{u.role}</span>
                      <span className={u.isActive ? 'badge-success text-[10px]' : 'badge-danger text-[10px]'}>{u.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                  <button onClick={() => setEditUser(u)} className="btn-ghost btn-sm p-2">
                    <Edit size={14} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="p-4 border-t border-surface-100">
            <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={(p) => { setPage(p); window.scrollTo(0, 0) }} />
          </div>
        )}
      </div>

      {/* Edit modal */}
      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Edit user" size="sm">
        {editUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
              <Avatar name={editUser.name} src={editUser.avatar?.url} size="sm" />
              <div>
                <p className="font-medium text-surface-900 text-sm">{editUser.name}</p>
                <p className="text-xs text-surface-500">{editUser.email}</p>
              </div>
            </div>

            <div>
              <label className="form-label">Role</label>
              <select
                defaultValue={editUser.role}
                id="edit-role"
                className="form-input"
                disabled={editUser._id === me?._id}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-surface-900">Account active</p>
                <p className="text-xs text-surface-500">Inactive users cannot log in</p>
              </div>
              <input
                type="checkbox"
                id="edit-active"
                defaultChecked={editUser.isActive}
                className="w-4 h-4 accent-primary-600"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-surface-900">Email verified</p>
              </div>
              <input
                type="checkbox"
                id="edit-email-verified"
                defaultChecked={editUser.isEmailVerified}
                className="w-4 h-4 accent-primary-600"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-surface-900">Phone verified</p>
              </div>
              <input
                type="checkbox"
                id="edit-phone-verified"
                defaultChecked={editUser.isPhoneVerified}
                className="w-4 h-4 accent-primary-600"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setEditUser(null)} className="btn-secondary">Cancel</button>
              <button
                onClick={() => {
                  updateUser({
                    id: editUser._id,
                    role: document.getElementById('edit-role').value,
                    isActive: document.getElementById('edit-active').checked,
                    isEmailVerified: document.getElementById('edit-email-verified').checked,
                    isPhoneVerified: document.getElementById('edit-phone-verified').checked,
                  })
                }}
                disabled={updating}
                className="btn-primary"
              >
                {updating ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
