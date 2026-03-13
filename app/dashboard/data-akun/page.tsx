"use client";

import { useEffect, useState } from "react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/app/controller/user.controller";
import type { User, UserRole } from "@/app/model/user.model";

const ROLES: UserRole[] = ["admin", "kasir", "gudang", "owner"];

const ROLE_BADGE: Record<UserRole, string> = {
  admin: "bg-purple-100 text-purple-700",
  kasir: "bg-blue-100 text-blue-700",
  gudang: "bg-amber-100 text-amber-700",
  owner: "bg-green-100 text-green-700",
};

const AVATAR_COLORS = [
  "bg-green-500",
  "bg-blue-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-indigo-500",
];

function getInitial(nama: string) {
  return nama
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
function getAvatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

interface FormState {
  nama: string;
  email: string;
  password: string;
  role: UserRole;
}

const EMPTY_FORM: FormState = {
  nama: "",
  email: "",
  password: "",
  role: "kasir",
};

export default function DataAkunPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<UserRole | "">("");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchUsers() {
    setLoading(true);
    const res = await getAllUsers();
    if (res.success) setUsers(res.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function openAdd() {
    setEditUser(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  }

  function openEdit(u: User) {
    setEditUser(u);
    setForm({
      nama: u.nama,
      email: u.email,
      password: u.password,
      role: u.role as UserRole,
    });
    setFormError("");
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.nama.trim() || !form.email.trim() || !form.password.trim()) {
      setFormError("Semua field wajib diisi.");
      return;
    }
    setSaving(true);
    setFormError("");
    const res = editUser
      ? await updateUser(editUser.id, form)
      : await createUser(form);
    setSaving(false);
    if (!res.success) {
      setFormError(res.message);
      return;
    }
    setShowModal(false);
    fetchUsers();
  }

  async function handleDelete() {
    if (!deleteConfirm) return;
    setDeleting(true);
    await deleteUser(deleteConfirm.id);
    setDeleting(false);
    setDeleteConfirm(null);
    fetchUsers();
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.nama.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
      (filterRole ? u.role === filterRole : true)
    );
  });

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Data Akun</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola akun pengguna sistem · {users.length} akun terdaftar
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 active:bg-green-800 transition shadow-md shadow-green-200">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah Akun
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau email..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white placeholder:text-gray-300"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as UserRole | "")}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-600">
          <option value="">Semua Role</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <svg
              className="w-12 h-12 text-gray-200"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
              />
              <circle cx="9" cy="7" r="4" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
              />
            </svg>
            <p className="text-gray-400 text-sm font-medium">
              Tidak ada akun ditemukan
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["#", "Pengguna", "Email", "Role", "Dibuat", "Aksi"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u, i) => (
                  <tr
                    key={u.id}
                    className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4 text-xs text-gray-300 font-medium">
                      {i + 1}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full ${getAvatarColor(u.id)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                          {getInitial(u.nama)}
                        </div>
                        <p className="text-sm font-semibold text-gray-800">
                          {u.nama}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {u.email}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${ROLE_BADGE[u.role as UserRole] ?? "bg-gray-100 text-gray-600"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400">
                      {new Date(u.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(u)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-white text-xs font-semibold transition">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(u)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-xs font-semibold transition">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tambah / Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {editUser ? "Edit Akun" : "Tambah Akun Baru"}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editUser
                    ? `Mengedit akun ${editUser.nama}`
                    : "Isi data akun pengguna baru"}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {[
                {
                  label: "Nama Lengkap",
                  key: "nama",
                  type: "text",
                  placeholder: "Masukkan nama lengkap",
                },
                {
                  label: "Email",
                  key: "email",
                  type: "email",
                  placeholder: "contoh@email.com",
                },
                {
                  label: "Password",
                  key: "password",
                  type: "text",
                  placeholder: "Password akun",
                },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={form[key as keyof FormState]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-gray-300"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Role
                </label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value as UserRole })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-700">
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              {formError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-xl">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {formError}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-semibold transition disabled:opacity-50">
                {saving
                  ? "Menyimpan..."
                  : editUser
                    ? "Simpan Perubahan"
                    : "Tambah Akun"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hapus */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl sm:w-full w-1/3 p-6">
            <div className="flex flex-col items-center text-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Hapus Akun
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Yakin ingin menghapus akun{" "}
                  <strong className="text-gray-800">
                    {deleteConfirm.nama}
                  </strong>
                  ? Aksi ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-sm font-semibold transition disabled:opacity-50">
                {deleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
