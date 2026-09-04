import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  LogOut, Shield, Users, ArrowLeft, Eye, BarChart3, Edit3, Save, Plus, Trash2,
  TrendingUp, UserPlus, Activity, ImageIcon, Newspaper, MessagesSquare, MessageSquare,
  Mail, Menu, X, Home, RefreshCw, Pin,
} from 'lucide-react';
import { toast } from 'sonner';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ImageUpload } from '@/components/ImageUpload';

interface Profile { id: string; user_id: string; display_name: string | null; created_at: string; }
interface RoleRow { id: string; user_id: string; role: 'admin' | 'moderator' | 'user'; }
interface BlogPost {
  id: string; slug: string; title: string; excerpt: string | null; content: string;
  cover_image: string | null; tags: string[]; published: boolean; created_at: string;
}

type TabType = 'overview' | 'content' | 'blog' | 'forum' | 'comments' | 'subscribers' | 'users';

const NAV: [TabType, any, string][] = [
  ['overview', BarChart3, 'Overview'],
  ['content', Edit3, 'Site Content'],
  ['blog', Newspaper, 'Blog Posts'],
  ['forum', MessagesSquare, 'Forum'],
  ['comments', MessageSquare, 'Comments'],
  ['subscribers', Mail, 'Newsletter'],
  ['users', Users, 'Users & Roles'],
];

const sectionLabels: Record<string, string> = {
  hero: 'Hero Section (landing)',
  about: 'About Page',
  projects_page: 'What We Create — Page Intro',
  contact: 'Contact Page',
  stats: 'Stats Section',
  projects: 'Projects Section',
  testimonials: 'Testimonials',
  founder: 'Founder Section',
  connect: 'Connect Section',
};

const emptyPost = (): Partial<BlogPost> => ({
  slug: '', title: '', excerpt: '', content: '', cover_image: '', tags: [], published: true,
});

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // data
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [siteContent, setSiteContent] = useState<Record<string, any>>({});
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [threads, setThreads] = useState<any[]>([]);
  const [replies, setReplies] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);

  // editors
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editBuffer, setEditBuffer] = useState('');
  const [postDraft, setPostDraft] = useState<Partial<BlogPost> | null>(null);

  // analytics
  const [totalViews, setTotalViews] = useState(0);
  const [todayViews, setTodayViews] = useState(0);
  const [todaySignups, setTodaySignups] = useState(0);
  const [chart, setChart] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => { if (!loading && !user) navigate('/login'); }, [user, loading, navigate]);

  const fetchAnalytics = useCallback(async () => {
    if (!isAdmin) return;
    const today = new Date().toISOString().split('T')[0];
    const { count: total } = await supabase.from('page_views').select('*', { count: 'exact', head: true });
    setTotalViews(total || 0);
    const { count: todayCount } = await supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', today);
    setTodayViews(todayCount || 0);
    const { count: signupCount } = await supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'signup').gte('created_at', today);
    setTodaySignups(signupCount || 0);

    const days: any[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const next = new Date(d); next.setDate(next.getDate() + 1);
      const nextStr = next.toISOString().split('T')[0];
      const { count: dayViews } = await supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', dateStr).lt('created_at', nextStr);
      const { count: daySignups } = await supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'signup').gte('created_at', dateStr).lt('created_at', nextStr);
      days.push({ date: d.toLocaleDateString('en', { weekday: 'short' }), views: dayViews || 0, signups: daySignups || 0 });
    }
    setChart(days);

    const { data: recentViews } = await supabase.from('page_views').select('*').order('created_at', { ascending: false }).limit(10);
    const { data: recentEvents } = await supabase.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(10);
    setRecentActivity([
      ...(recentViews || []).map((v: any) => ({ type: 'view', label: `Page view: ${v.page}`, time: v.created_at })),
      ...(recentEvents || []).map((e: any) => ({ type: e.event_type, label: `New signup: ${e.event_data?.email || 'Unknown'}`, time: e.created_at })),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 15));
  }, [isAdmin]);

  const fetchAll = useCallback(async () => {
    if (!isAdmin) return;
    const [p, r, sc, bp, ft, fr, cm, ns] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('user_roles').select('*'),
      supabase.from('site_content').select('*'),
      supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
      supabase.from('forum_threads').select('*').order('created_at', { ascending: false }),
      supabase.from('forum_replies').select('*').order('created_at', { ascending: false }),
      supabase.from('comments').select('*').order('created_at', { ascending: false }),
      supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false }),
    ]);
    if (p.data) setProfiles(p.data as Profile[]);
    if (r.data) setRoles(r.data as RoleRow[]);
    if (sc.data) {
      const map: Record<string, any> = {};
      sc.data.forEach((row: any) => { map[row.section_key] = row; });
      setSiteContent(map);
    }
    if (bp.data) setPosts(bp.data as BlogPost[]);
    if (ft.data) setThreads(ft.data);
    if (fr.data) setReplies(fr.data);
    if (cm.data) setComments(cm.data);
    if (ns.data) setSubs(ns.data);
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchAll();
    fetchAnalytics();
    const channel = supabase.channel('admin-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'page_views' }, () => fetchAnalytics())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'analytics_events' }, () => { fetchAnalytics(); fetchAll(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, () => fetchAll())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_threads' }, () => fetchAll())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isAdmin, fetchAll, fetchAnalytics]);

  /* ---------- content ---------- */
  const startEdit = (key: string) => {
    setEditingSection(key);
    setEditBuffer(JSON.stringify(siteContent[key]?.content || {}, null, 2));
  };

  const saveEdit = async (key: string) => {
    try {
      const parsed = JSON.parse(editBuffer);
      const payload = { section_key: key, content: parsed, updated_at: new Date().toISOString(), updated_by: user?.id };
      const { error } = siteContent[key]
        ? await supabase.from('site_content').update(payload).eq('section_key', key)
        : await supabase.from('site_content').insert(payload);
      if (error) throw error;
      toast.success(`${sectionLabels[key]} updated`);
      setEditingSection(null);
      fetchAll();
    } catch (e: any) {
      toast.error(e.message || 'Invalid JSON');
    }
  };

  const patchField = (path: string, value: any) => {
    try {
      const parsed = JSON.parse(editBuffer);
      parsed[path] = value;
      setEditBuffer(JSON.stringify(parsed, null, 2));
    } catch { /* ignore */ }
  };

  /* ---------- blog ---------- */
  const savePost = async () => {
    if (!postDraft?.title || !postDraft?.slug) return toast.error('Title and slug are required');
    const payload: any = {
      slug: postDraft.slug, title: postDraft.title, excerpt: postDraft.excerpt || null,
      content: postDraft.content || '', cover_image: postDraft.cover_image || null,
      tags: postDraft.tags || [], published: postDraft.published ?? true,
      updated_at: new Date().toISOString(),
    };
    const { error } = postDraft.id
      ? await supabase.from('blog_posts').update(payload).eq('id', postDraft.id)
      : await supabase.from('blog_posts').insert(payload);
    if (error) return toast.error(error.message);
    toast.success('Post saved');
    setPostDraft(null);
    fetchAll();
  };

  const deleteRow = async (table: 'blog_posts' | 'forum_threads' | 'forum_replies' | 'comments', id: string) => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('Deleted');
    fetchAll();
  };

  const togglePin = async (id: string, pinned: boolean) => {
    const { error } = await supabase.from('forum_threads').update({ pinned: !pinned }).eq('id', id);
    if (error) return toast.error(error.message);
    fetchAll();
  };

  const toggleRole = async (userId: string, role: 'admin' | 'moderator') => {
    const existing = roles.find((r) => r.user_id === userId && r.role === role);
    const { error } = existing
      ? await supabase.from('user_roles').delete().eq('id', existing.id)
      : await supabase.from('user_roles').insert({ user_id: userId, role });
    if (error) return toast.error(error.message);
    toast.success('Role updated');
    fetchAll();
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground">Loading...</div></div>;
  if (!user) return null;

  const stat = (icon: any, label: string, value: string | number, live = false) => {
    const Icon = icon;
    return (
      <div className="card-surface border border-border/50 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2"><Icon size={16} className="text-primary" /><span className="text-xs text-muted-foreground">{label}</span></div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {live && <span className="text-[10px] text-primary animate-pulse">● LIVE</span>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-muted-foreground" onClick={() => setSidebarOpen(!sidebarOpen)}>{sidebarOpen ? <X size={18} /> : <Menu size={18} />}</button>
            <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-primary transition-colors"><ArrowLeft size={18} /></button>
            <Shield size={20} className="text-primary" />
            <span className="font-semibold text-foreground">{isAdmin ? 'CAT CPN Admin' : 'Dashboard'}</span>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && <Button variant="ghost" size="sm" onClick={() => { fetchAll(); fetchAnalytics(); toast.success('Refreshed'); }}><RefreshCw size={14} /></Button>}
            <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
            <Button variant="outline" size="sm" onClick={signOut}><LogOut size={14} className="mr-2" /> Sign Out</Button>
          </div>
        </div>
      </header>

      {!isAdmin ? (
        <div className="container mx-auto px-4 py-8">
          <div className="card-surface border border-border/50 rounded-xl p-8 text-center">
            <Shield size={48} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Welcome, {user.email}</h2>
            <p className="text-muted-foreground">You're logged in. Contact an admin if you need elevated access.</p>
          </div>
        </div>
      ) : (
        <div className="flex">
          {/* Sidebar */}
          <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block fixed lg:sticky top-16 left-0 z-40 w-60 h-[calc(100vh-4rem)] overflow-y-auto border-r border-border/50 bg-card/60 backdrop-blur-xl p-3`}>
            <nav className="space-y-1">
              {NAV.map(([key, Icon, label]) => (
                <button
                  key={key}
                  onClick={() => { setActiveTab(key); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${activeTab === key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'}`}
                >
                  <Icon size={15} /> {label}
                </button>
              ))}
              <a href="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all">
                <Home size={15} /> View Site
              </a>
            </nav>
          </aside>

          <main className="flex-1 min-w-0 px-4 py-6 lg:px-8">
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stat(Eye, 'Total Views', totalViews.toLocaleString())}
                  {stat(TrendingUp, "Today's Views", todayViews.toLocaleString(), true)}
                  {stat(UserPlus, "Today's Signups", todaySignups, true)}
                  {stat(Users, 'Total Users', profiles.length)}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stat(Newspaper, 'Blog Posts', posts.length)}
                  {stat(MessagesSquare, 'Forum Threads', threads.length)}
                  {stat(MessageSquare, 'Comments', comments.length)}
                  {stat(Mail, 'Subscribers', subs.length)}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {(['views', 'signups'] as const).map((k) => (
                    <div key={k} className="card-surface border border-border/50 rounded-xl p-5">
                      <h3 className="text-sm font-semibold text-foreground mb-4 capitalize">{k} (7 days)</h3>
                      <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={chart}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                          <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                          <Area type="monotone" dataKey={k} stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ))}
                </div>

                <div className="card-surface border border-border/50 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Activity size={16} className="text-primary" /> Live Activity <span className="text-[10px] text-primary animate-pulse">● LIVE</span>
                  </h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {recentActivity.length === 0 ? <p className="text-muted-foreground text-sm">No activity yet</p> : recentActivity.map((a, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                        <div className="flex items-center gap-3 min-w-0">
                          {a.type === 'view' ? <Eye size={14} className="text-muted-foreground shrink-0" /> : <UserPlus size={14} className="text-primary shrink-0" />}
                          <span className="text-sm text-foreground truncate">{a.label}</span>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">{new Date(a.time).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Site content */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Edit every section of the website</h2>
                {Object.entries(sectionLabels).map(([key, label]) => {
                  let parsed: any = {};
                  try { parsed = JSON.parse(editBuffer); } catch { /* ignore */ }
                  return (
                    <div key={key} className="card-surface border border-border/50 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-4 gap-2">
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
                        <div className="space-y-4">
                          {/* quick fields */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {['title', 'subtitle', 'description', 'name', 'role'].filter((f) => f in parsed).map((f) => (
                              <div key={f}>
                                <label className="text-[11px] uppercase tracking-wide text-muted-foreground">{f}</label>
                                <Input value={parsed[f] ?? ''} onChange={(e) => patchField(f, e.target.value)} />
                              </div>
                            ))}
                          </div>

                          {key === 'projects' && Array.isArray(parsed.items) && (
                            <div className="space-y-3">
                              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1"><ImageIcon size={12} /> Project Images</p>
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                {parsed.items.map((item: any, idx: number) => (
                                  <div key={idx} className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground truncate">{item.title || `Project ${idx + 1}`}</p>
                                    <ImageUpload
                                      currentUrl={item.image}
                                      folder="projects"
                                      label="Upload"
                                      onUpload={(url) => {
                                        const updated = { ...parsed };
                                        updated.items[idx].image = url;
                                        setEditBuffer(JSON.stringify(updated, null, 2));
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {key === 'founder' && (
                            <ImageUpload
                              currentUrl={parsed.image}
                              folder="founder"
                              label="Founder Photo"
                              onUpload={(url) => patchField('image', url)}
                            />
                          )}

                          <Textarea value={editBuffer} onChange={(e) => setEditBuffer(e.target.value)} className="font-mono text-xs min-h-[280px]" />
                        </div>
                      ) : (
                        <pre className="text-xs text-muted-foreground overflow-x-auto bg-background/50 rounded-lg p-4 max-h-40 overflow-y-auto">
                          {JSON.stringify(siteContent[key]?.content || {}, null, 2)}
                        </pre>
                      )}
                      {siteContent[key]?.updated_at && (
                        <p className="text-[10px] text-muted-foreground mt-2">Last updated: {new Date(siteContent[key].updated_at).toLocaleString()}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Blog */}
            {activeTab === 'blog' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Blog Posts ({posts.length})</h2>
                  <Button size="sm" onClick={() => setPostDraft(emptyPost())}><Plus size={14} className="mr-1" /> New Post</Button>
                </div>

                {postDraft && (
                  <div className="card-surface border border-primary/40 rounded-xl p-5 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] uppercase text-muted-foreground">Title</label>
                        <Input value={postDraft.title || ''} onChange={(e) => setPostDraft({ ...postDraft, title: e.target.value, slug: postDraft.id ? postDraft.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })} />
                      </div>
                      <div>
                        <label className="text-[11px] uppercase text-muted-foreground">Slug</label>
                        <Input value={postDraft.slug || ''} onChange={(e) => setPostDraft({ ...postDraft, slug: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] uppercase text-muted-foreground">Excerpt</label>
                      <Input value={postDraft.excerpt || ''} onChange={(e) => setPostDraft({ ...postDraft, excerpt: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase text-muted-foreground">Tags (comma separated)</label>
                      <Input value={(postDraft.tags || []).join(', ')} onChange={(e) => setPostDraft({ ...postDraft, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} />
                    </div>
                    <ImageUpload currentUrl={postDraft.cover_image || undefined} folder="blog" label="Cover Image" onUpload={(url) => setPostDraft({ ...postDraft, cover_image: url })} />
                    <div>
                      <label className="text-[11px] uppercase text-muted-foreground">Content (markdown)</label>
                      <Textarea value={postDraft.content || ''} onChange={(e) => setPostDraft({ ...postDraft, content: e.target.value })} className="min-h-[240px] font-mono text-xs" />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-muted-foreground">
                      <input type="checkbox" checked={postDraft.published ?? true} onChange={(e) => setPostDraft({ ...postDraft, published: e.target.checked })} /> Published
                    </label>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={savePost}><Save size={14} className="mr-1" /> Save Post</Button>
                      <Button size="sm" variant="outline" onClick={() => setPostDraft(null)}>Cancel</Button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {posts.map((p) => (
                    <div key={p.id} className="card-surface border border-border/50 rounded-xl p-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
                        <p className="text-xs text-muted-foreground truncate">/{p.slug} · {p.published ? 'Published' : 'Draft'} · {new Date(p.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button size="sm" variant="outline" onClick={() => setPostDraft(p)}><Edit3 size={14} /></Button>
                        <Button size="sm" variant="outline" onClick={() => deleteRow('blog_posts', p.id)}><Trash2 size={14} /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Forum */}
            {activeTab === 'forum' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Forum Moderation ({threads.length} threads · {replies.length} replies)</h2>
                {threads.map((t) => (
                  <div key={t.id} className="card-surface border border-border/50 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{t.pinned && '📌 '}{t.title}</p>
                        <p className="text-xs text-muted-foreground">{t.display_name} · {t.category} · {new Date(t.created_at).toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{t.body}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button size="sm" variant="outline" onClick={() => togglePin(t.id, t.pinned)}><Pin size={14} /></Button>
                        <Button size="sm" variant="outline" onClick={() => deleteRow('forum_threads', t.id)}><Trash2 size={14} /></Button>
                      </div>
                    </div>
                    {replies.filter((r) => r.thread_id === t.id).map((r) => (
                      <div key={r.id} className="mt-3 ml-4 pl-3 border-l border-border/50 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">{r.display_name} · {new Date(r.created_at).toLocaleString()}</p>
                          <p className="text-sm text-foreground">{r.body}</p>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => deleteRow('forum_replies', r.id)}><Trash2 size={13} /></Button>
                      </div>
                    ))}
                  </div>
                ))}
                {threads.length === 0 && <p className="text-muted-foreground text-sm">No threads yet.</p>}
              </div>
            )}

            {/* Comments */}
            {activeTab === 'comments' && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Comments ({comments.length})</h2>
                {comments.map((c) => (
                  <div key={c.id} className="card-surface border border-border/50 rounded-xl p-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{c.display_name} · {new Date(c.created_at).toLocaleString()}</p>
                      <p className="text-sm text-foreground">{c.message}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => deleteRow('comments', c.id)}><Trash2 size={14} /></Button>
                  </div>
                ))}
                {comments.length === 0 && <p className="text-muted-foreground text-sm">No comments yet.</p>}
              </div>
            )}

            {/* Subscribers */}
            {activeTab === 'subscribers' && (
              <div className="card-surface border border-border/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Newsletter Subscribers ({subs.length})</h2>
                  <Button size="sm" variant="outline" onClick={() => {
                    const csv = 'email,created_at\n' + subs.map((s) => `${s.email},${s.created_at}`).join('\n');
                    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
                    const a = document.createElement('a'); a.href = url; a.download = 'subscribers.csv'; a.click();
                    URL.revokeObjectURL(url);
                  }}>Export CSV</Button>
                </div>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                  {subs.map((s) => (
                    <div key={s.id} className="flex items-center justify-between border-b border-border/30 py-2 text-sm">
                      <span className="text-foreground truncate">{s.email}</span>
                      <span className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                  {subs.length === 0 && <p className="text-muted-foreground text-sm">No subscribers yet.</p>}
                </div>
              </div>
            )}

            {/* Users */}
            {activeTab === 'users' && (
              <div className="card-surface border border-border/50 rounded-xl p-5">
                <h2 className="text-lg font-semibold text-foreground mb-4">Users & Roles ({profiles.length})</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-3 px-3 text-muted-foreground font-medium">Name</th>
                        <th className="text-left py-3 px-3 text-muted-foreground font-medium">User ID</th>
                        <th className="text-left py-3 px-3 text-muted-foreground font-medium">Joined</th>
                        <th className="text-left py-3 px-3 text-muted-foreground font-medium">Roles</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profiles.map((p) => {
                        const userRoles = roles.filter((r) => r.user_id === p.user_id).map((r) => r.role);
                        return (
                          <tr key={p.id} className="border-b border-border/30 hover:bg-secondary/30">
                            <td className="py-3 px-3 text-foreground">{p.display_name || 'N/A'}</td>
                            <td className="py-3 px-3 text-muted-foreground font-mono text-xs">{p.user_id.slice(0, 8)}...</td>
                            <td className="py-3 px-3 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                            <td className="py-3 px-3">
                              <div className="flex gap-2">
                                {(['admin', 'moderator'] as const).map((role) => (
                                  <button
                                    key={role}
                                    onClick={() => toggleRole(p.user_id, role)}
                                    className={`px-2.5 py-1 rounded-md text-xs border transition-all ${userRoles.includes(role) ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}
                                  >
                                    {role}
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
};

export default Admin;
