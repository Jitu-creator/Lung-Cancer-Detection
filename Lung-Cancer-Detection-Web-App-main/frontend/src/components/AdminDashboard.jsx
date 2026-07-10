import React, { useState, useEffect } from "react";
import API_BASE_URL from "../api";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaShieldAlt, FaTrash, FaEdit, FaUserShield, FaUser, FaBrain, FaLungsVirus } from "react-icons/fa";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/users/`);
      setUsers(res.data.users);
    } catch {
      toast.error("Failed to fetch users");
    }
    setLoading(false);
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditForm({
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      is_staff: user.is_staff,
      is_active: user.is_active,
    });
  };

  const handleEditChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setEditForm({ ...editForm, [e.target.name]: value });
  };

  const saveEdit = async (id) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/api/admin/users/${id}/`, editForm);
      toast.success(res.data.msg);
      setEditingUser(null);
      fetchUsers();
    } catch {
      toast.error("Failed to update user");
    }
  };

  const toggleRole = async (user) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/api/admin/users/${user.id}/`, {
        is_staff: !user.is_staff,
      });
      toast.success(res.data.msg);
      fetchUsers();
    } catch {
      toast.error("Failed to update role");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await axios.delete(`${API_BASE_URL}/api/admin/users/${id}/delete/`);
      toast.success(res.data.msg);
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500 flex items-center justify-center shadow-lg">
              <FaShieldAlt className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-400">Manage users and their roles</p>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center text-slate-400 py-20">Loading users...</div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl overflow-hidden shadow-lg">
              <thead>
                <tr className="bg-cyan-500 border-b border-gray-200">
                  <th className="text-left px-6 py-4 text-white font-semibold">ID</th>
                  <th className="text-left px-6 py-4 text-white font-semibold">Username</th>
                  <th className="text-left px-6 py-4 text-white font-semibold">Email</th>
                  <th className="text-left px-6 py-4 text-white font-semibold">Name</th>
                  <th className="text-left px-6 py-4 text-white font-semibold">Joined</th>
                  <th className="text-center px-6 py-4 text-white font-semibold">Role</th>
                  <th className="text-center px-6 py-4 text-white font-semibold">Active</th>
                  <th className="text-center px-6 py-4 text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-cyan-50 transition-all`}>
                    {editingUser === user.id ? (
                      <>
                        <td className="px-6 py-4 text-gray-500">{user.id}</td>
                        <td className="px-6 py-4">
                          <input name="username" value={editForm.username} onChange={handleEditChange} className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-gray-900 w-full" />
                        </td>
                        <td className="px-6 py-4">
                          <input name="email" value={editForm.email} onChange={handleEditChange} className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-gray-900 w-full" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <input name="first_name" value={editForm.first_name} onChange={handleEditChange} placeholder="First" className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-gray-900 w-20" />
                            <input name="last_name" value={editForm.last_name} onChange={handleEditChange} placeholder="Last" className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-gray-900 w-20" />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{new Date(user.date_joined).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="is_staff" checked={editForm.is_staff} onChange={handleEditChange} className="sr-only peer" />
                            <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                          </label>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="is_active" checked={editForm.is_active} onChange={handleEditChange} className="sr-only peer" />
                            <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                          </label>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => saveEdit(user.id)} className="bg-green-500 hover:bg-green-400 text-white px-3 py-1 rounded-lg text-sm transition-all">Save</button>
                            <button onClick={cancelEdit} className="bg-gray-500 hover:bg-gray-400 text-white px-3 py-1 rounded-lg text-sm transition-all">Cancel</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-gray-500">{user.id}</td>
                        <td className="px-6 py-4 text-gray-900 font-medium">{user.username}</td>
                        <td className="px-6 py-4 text-gray-700">{user.email}</td>
                        <td className="px-6 py-4 text-gray-700">{(user.first_name || user.last_name) ? `${user.first_name} ${user.last_name}` : "-"}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm">{new Date(user.date_joined).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${user.is_staff ? "bg-cyan-100 text-cyan-800" : "bg-gray-100 text-gray-600"}`}>
                            {user.is_staff ? <FaUserShield /> : <FaUser />}
                            {user.is_staff ? "Admin" : "User"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {user.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => toggleRole(user)} className="p-2 rounded-lg bg-cyan-100 hover:bg-cyan-200 text-cyan-700 transition-all" title="Toggle role">
                              <FaUserShield />
                            </button>
                            <button onClick={() => handleEdit(user)} className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-all" title="Edit user">
                              <FaEdit />
                            </button>
                            <button onClick={() => deleteUser(user.id)} className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-all" title="Delete user">
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;