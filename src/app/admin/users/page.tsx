'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, X, Pencil, Search, Users, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useLang } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
}

const roles = ['startup', 'corporate', 'investor', 'admin'];

export default function AdminUsersPage() {
  const { lang } = useLang();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});
  const [saving, setSaving] = useState(false);
  const [filterRole, setFilterRole] = useState<string>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  }

  function startEdit(user: UserProfile) {
    setEditingId(user.id);
    setEditData({ full_name: user.full_name, email: user.email, role: user.role });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditData({});
  }

  async function saveEdit(id: string) {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editData.full_name,
        role: editData.role,
      })
      .eq('id', id);

    if (error) {
      alert('Hata: ' + error.message);
    } else {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...editData } : u));
      setEditingId(null);
      setEditData({});
    }
    setSaving(false);
  }

  async function deleteUser(id: string, name: string) {
    const confirmed = window.confirm(
      lang === 'tr'
        ? `"${name}" kullanıcısını silmek istediğinize emin misiniz?`
        : `Are you sure you want to delete "${name}"?`
    );
    if (!confirmed) return;

    const supabase = createClient();
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
      alert('Hata: ' + error.message);
    } else {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  }

  const roleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700 border-0';
      case 'startup': return 'bg-emerald-100 text-emerald-700 border-0';
      case 'corporate': return 'bg-blue-100 text-blue-700 border-0';
      case 'investor': return 'bg-purple-100 text-purple-700 border-0';
      default: return 'bg-gray-100 text-gray-700 border-0';
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-600">Loading...</div></div>;

  return (
    <main className="w-full">
      <section className="py-8 sm:py-12 bg-gradient-to-r from-slate-700 to-slate-900 text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white mb-4">
            <ArrowLeft size={14} /> {lang === 'tr' ? 'Admin Paneli' : 'Admin Dashboard'}
          </Link>
          <div className="flex items-center gap-3">
            <Users size={28} />
            <h1 className="text-3xl font-bold">
              {lang === 'tr' ? 'Kullanıcı Yönetimi' : 'User Management'}
            </h1>
            <Badge className="bg-white/20 text-white border-0 ml-2">{users.length}</Badge>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={lang === 'tr' ? 'İsim veya e-posta ara...' : 'Search name or email...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{lang === 'tr' ? 'Tüm Roller' : 'All Roles'}</SelectItem>
                <SelectItem value="startup">Startup</SelectItem>
                <SelectItem value="corporate">{lang === 'tr' ? 'Kurumsal' : 'Corporate'}</SelectItem>
                <SelectItem value="investor">{lang === 'tr' ? 'Yatırımcı' : 'Investor'}</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 font-medium text-gray-600">{lang === 'tr' ? 'Ad Soyad' : 'Full Name'}</th>
                      <th className="text-left p-4 font-medium text-gray-600">E-posta</th>
                      <th className="text-left p-4 font-medium text-gray-600">{lang === 'tr' ? 'Rol' : 'Role'}</th>
                      <th className="text-left p-4 font-medium text-gray-600">{lang === 'tr' ? 'Kayıt Tarihi' : 'Registered'}</th>
                      <th className="text-right p-4 font-medium text-gray-600">{lang === 'tr' ? 'İşlemler' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50/50">
                        <td className="p-4">
                          {editingId === user.id ? (
                            <Input
                              value={editData.full_name || ''}
                              onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                              className="h-8"
                            />
                          ) : (
                            <span className="font-medium">{user.full_name}</span>
                          )}
                        </td>
                        <td className="p-4 text-gray-600">{user.email}</td>
                        <td className="p-4">
                          {editingId === user.id ? (
                            <Select
                              value={editData.role || ''}
                              onValueChange={(v) => setEditData({ ...editData, role: v })}
                            >
                              <SelectTrigger className="h-8 w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {roles.map(r => (
                                  <SelectItem key={r} value={r}>{r}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge className={roleColor(user.role)}>{user.role}</Badge>
                          )}
                        </td>
                        <td className="p-4 text-gray-600">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          {editingId === user.id ? (
                            <div className="flex items-center justify-end gap-1">
                              <Button size="sm" onClick={() => saveEdit(user.id)} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 h-8 gap-1">
                                <Save size={14} /> {lang === 'tr' ? 'Kaydet' : 'Save'}
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEdit} className="h-8 gap-1">
                                <X size={14} /> {lang === 'tr' ? 'İptal' : 'Cancel'}
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1">
                              <Button size="sm" variant="outline" onClick={() => startEdit(user)} className="h-8 gap-1">
                                <Pencil size={14} /> {lang === 'tr' ? 'Düzenle' : 'Edit'}
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => deleteUser(user.id, user.full_name)} className="h-8 gap-1 text-red-600 border-red-200 hover:bg-red-50">
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  {lang === 'tr' ? 'Kullanıcı bulunamadı' : 'No users found'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
