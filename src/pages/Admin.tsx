import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { LogOut, Shield, Users, Settings, ArrowLeft } from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  created_at: string;
}

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      supabase.from('profiles').select('*').then(({ data }) => {
        if (data) setProfiles(data);
      });
    }
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft size={18} />
            </button>
            <Shield size={20} className="text-primary" />
            <span className="font-semibold text-foreground">
              {isAdmin ? 'Admin Panel' : 'Dashboard'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut size={14} className="mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {isAdmin ? (
          <>
            {/* Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="card-surface border border-border/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users size={18} className="text-primary" />
                  <span className="text-sm text-muted-foreground">Total Users</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{profiles.length}</p>
              </div>
              <div className="card-surface border border-border/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Shield size={18} className="text-primary" />
                  <span className="text-sm text-muted-foreground">Role</span>
                </div>
                <p className="text-2xl font-bold text-primary">Admin</p>
              </div>
              <div className="card-surface border border-border/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Settings size={18} className="text-primary" />
                  <span className="text-sm text-muted-foreground">Status</span>
                </div>
                <p className="text-2xl font-bold text-primary">Active</p>
              </div>
            </div>

            {/* User List */}
            <div className="card-surface border border-border/50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Registered Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Name</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">User ID</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((p) => (
                      <tr key={p.id} className="border-b border-border/30 hover:bg-secondary/30">
                        <td className="py-3 px-4 text-foreground">{p.display_name || 'N/A'}</td>
                        <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{p.user_id.slice(0, 8)}...</td>
                        <td className="py-3 px-4 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="card-surface border border-border/50 rounded-xl p-8 text-center">
            <Shield size={48} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Welcome, {user.email}</h2>
            <p className="text-muted-foreground">You're logged in. Contact an admin if you need elevated access.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
