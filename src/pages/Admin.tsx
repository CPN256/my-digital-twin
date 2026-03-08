import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LogOut, Shield, Users, Settings, ArrowLeft, Eye, BarChart3, Edit3, Save, Plus, Trash2, TrendingUp, UserPlus, Activity, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ImageUpload } from '@/components/ImageUpload';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  created_at: string;
}

type TabType = 'analytics' | 'content' | 'users';

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('analytics');
  const [siteContent, setSiteContent] = useState<Record<string, any>>({});
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editBuffer, setEditBuffer] = useState('');

  // Analytics state
  const [totalViews, setTotalViews] = useState(0);
  const [todayViews, setTodayViews] = useState(0);
  const [todaySignups, setTodaySignups] = useState(0);
  const [viewsChart, setViewsChart] = useState<any[]>([]);
  const [signupsChart, setSignupsChart] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  const fetchAnalytics = useCallback(async () => {
    if (!isAdmin) return;

    // Total views
    const { count: total } = await supabase.from('page_views').select('*', { count: 'exact', head: true });
    setTotalViews(total || 0);

    // Today's views
    const today = new Date().toISOString().split('T')[0];
    const { count: todayCount } = await supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', today);
    setTodayViews(todayCount || 0);

    // Today's signups
    const { count: signupCount } = await supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'signup').gte('created_at', today);
    setTodaySignups(signupCount || 0);

    // Views chart (last 7 days)
    const days: any[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);

      const { count: dayViews } = await supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', dateStr).lt('created_at', nextDay.toISOString().split('T')[0]);

      const { count: daySignups } = await supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'signup').gte('created_at', dateStr).lt('created_at', nextDay.toISOString().split('T')[0]);

      days.push({
        date: d.toLocaleDateString('en', { weekday: 'short' }),
        views: dayViews || 0,
        signups: daySignups || 0,
      });
    }
    setViewsChart(days);
    setSignupsChart(days);

    // Recent activity
    const { data: recentViews } = await supabase.from('page_views').select('*').order('created_at', { ascending: false }).limit(10);
    const { data: recentEvents } = await supabase.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(10);

    const combined = [
      ...(recentViews || []).map((v: any) => ({ type: 'view', page: v.page, time: v.created_at })),
      ...(recentEvents || []).map((e: any) => ({ type: e.event_type, page: e.event_data?.email || 'Unknown', time: e.created_at })),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 15);
    setRecentActivity(combined);
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      supabase.from('profiles').select('*').then(({ data }) => { if (data) setProfiles(data); });
      fetchContent();
      fetchAnalytics();

      // Realtime subscriptions
      const viewsChannel = supabase.channel('admin-views').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'page_views' }, () => {
        fetchAnalytics();
      }).subscribe();

      const eventsChannel = supabase.channel('admin-events').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'analytics_events' }, () => {
        fetchAnalytics();
        supabase.from('profiles').select('*').then(({ data }) => { if (data) setProfiles(data); });
      }).subscribe();

      return () => {
        supabase.removeChannel(viewsChannel);
        supabase.removeChannel(eventsChannel);
      };
    }
  }, [isAdmin, fetchAnalytics]);

  const fetchContent = async () => {
    const { data } = await supabase.from('site_content').select('*');
    if (data) {
      const map: Record<string, any> = {};
      data.forEach((row: any) => { map[row.section_key] = row; });
      setSiteContent(map);
    }
  };

  const startEdit = (key: string) => {
    setEditingSection(key);
    setEditBuffer(JSON.stringify(siteContent[key]?.content || {}, null, 2));
  };

  const saveEdit = async (key: string) => {
    try {
      const parsed = JSON.parse(editBuffer);
      const { error } = await supabase.from('site_content').update({ content: parsed, updated_at: new Date().toISOString(), updated_by: user?.id }).eq('section_key', key);
      if (error) throw error;
      toast.success(`${key} section updated!`);
      setEditingSection(null);
      fetchContent();
    } catch (e: any) {
      toast.error(e.message || 'Invalid JSON');
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground">Loading...</div></div>;
  if (!user) return null;

  const sectionLabels: Record<string, string> = {
    hero: '🏠 Hero Section',
    stats: '📊 Stats Section',
    projects: '🛠 Projects Section',
    testimonials: '💬 Testimonials',
    founder: '👤 Founder Section',
    connect: '🔗 Connect Section',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-primary transition-colors"><ArrowLeft size={18} /></button>
            <Shield size={20} className="text-primary" />
            <span className="font-semibold text-foreground">{isAdmin ? 'Admin Panel' : 'Dashboard'}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
            <Button variant="outline" size="sm" onClick={signOut}><LogOut size={14} className="mr-2" /> Sign Out</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {isAdmin ? (
          <>
            {/* Tabs */}
            <div className="flex gap-2 mb-8 flex-wrap">
              {([['analytics', BarChart3, 'Analytics'], ['content', Edit3, 'Edit Content'], ['users', Users, 'Users']] as const).map(([key, Icon, label]) => (
                <button key={key} onClick={() => setActiveTab(key)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all border ${activeTab === key ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-primary hover:border-primary/40'}`}>
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="card-surface border border-border/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2"><Eye size={18} className="text-primary" /><span className="text-sm text-muted-foreground">Total Views</span></div>
                    <p className="text-3xl font-bold text-foreground">{totalViews.toLocaleString()}</p>
                  </div>
                  <div className="card-surface border border-border/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2"><TrendingUp size={18} className="text-primary" /><span className="text-sm text-muted-foreground">Today's Views</span></div>
                    <p className="text-3xl font-bold text-foreground">{todayViews.toLocaleString()}</p>
                    <span className="text-xs text-primary animate-pulse">● LIVE</span>
                  </div>
                  <div className="card-surface border border-border/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2"><UserPlus size={18} className="text-primary" /><span className="text-sm text-muted-foreground">Today's Signups</span></div>
                    <p className="text-3xl font-bold text-foreground">{todaySignups}</p>
                    <span className="text-xs text-primary animate-pulse">● LIVE</span>
                  </div>
                  <div className="card-surface border border-border/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2"><Users size={18} className="text-primary" /><span className="text-sm text-muted-foreground">Total Users</span></div>
                    <p className="text-3xl font-bold text-foreground">{profiles.length}</p>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card-surface border border-border/50 rounded-xl p-6">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Page Views (7 days)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={viewsChart}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 20%)" />
                        <XAxis dataKey="date" stroke="hsl(220 10% 50%)" fontSize={12} />
                        <YAxis stroke="hsl(220 10% 50%)" fontSize={12} />
                        <Tooltip contentStyle={{ background: 'hsl(240 12% 8%)', border: '1px solid hsl(168 40% 20%)', borderRadius: '8px', color: 'hsl(180 10% 90%)' }} />
                        <Area type="monotone" dataKey="views" stroke="hsl(168 100% 47%)" fill="hsl(168 100% 47% / 0.2)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="card-surface border border-border/50 rounded-xl p-6">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Signups (7 days)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={signupsChart}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 20%)" />
                        <XAxis dataKey="date" stroke="hsl(220 10% 50%)" fontSize={12} />
                        <YAxis stroke="hsl(220 10% 50%)" fontSize={12} />
                        <Tooltip contentStyle={{ background: 'hsl(240 12% 8%)', border: '1px solid hsl(168 40% 20%)', borderRadius: '8px', color: 'hsl(180 10% 90%)' }} />
                        <Area type="monotone" dataKey="signups" stroke="hsl(168 100% 47%)" fill="hsl(168 100% 47% / 0.2)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Activity Feed */}
                <div className="card-surface border border-border/50 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Activity size={16} className="text-primary" /> Live Activity Feed
                    <span className="text-xs text-primary animate-pulse ml-2">● LIVE</span>
                  </h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {recentActivity.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No activity yet</p>
                    ) : recentActivity.map((a, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                        <div className="flex items-center gap-3">
                          {a.type === 'view' ? <Eye size={14} className="text-muted-foreground" /> : <UserPlus size={14} className="text-primary" />}
                          <span className="text-sm text-foreground">
                            {a.type === 'view' ? `Page view: ${a.page}` : `New signup: ${a.page}`}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{new Date(a.time).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Content Editor Tab */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                {Object.entries(sectionLabels).map(([key, label]) => (
                  <div key={key} className="card-surface border border-border/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">{label}</h3>
                      {editingSection === key ? (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingSection(null)}>Cancel</Button>
                          <Button size="sm" onClick={() => saveEdit(key)}><Save size={14} className="mr-1" /> Save</Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => startEdit(key)}><Edit3 size={14} className="mr-1" /> Edit</Button>
                      )}
                    </div>
                    {editingSection === key ? (
                      <Textarea value={editBuffer} onChange={(e) => setEditBuffer(e.target.value)} className="font-mono text-xs min-h-[300px] bg-background border-border" />
                    ) : (
                      <pre className="text-xs text-muted-foreground overflow-x-auto bg-background/50 rounded-lg p-4 max-h-40 overflow-y-auto">
                        {JSON.stringify(siteContent[key]?.content || {}, null, 2)}
                      </pre>
                    )}
                    {siteContent[key]?.updated_at && (
                      <p className="text-[10px] text-muted-foreground mt-2">Last updated: {new Date(siteContent[key].updated_at).toLocaleString()}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="card-surface border border-border/50 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Registered Users ({profiles.length})</h2>
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
            )}
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
