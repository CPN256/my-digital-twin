import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, LogOut, Save } from "lucide-react";

const Profile = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ display_name: "", bio: "", phone: "", date_of_birth: "", avatar_url: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) setForm({
        display_name: data.display_name ?? "",
        bio: (data as any).bio ?? "",
        phone: (data as any).phone ?? "",
        date_of_birth: (data as any).date_of_birth ?? "",
        avatar_url: data.avatar_url ?? "",
      });
    });
  }, [user]);

  const save = async () => {
    if (!user) return;
    if (form.phone && !/^\+?[0-9 ]{7,20}$/.test(form.phone)) return toast.error("Enter a valid phone number.");
    setSaving(true);
    const payload = {
      user_id: user.id,
      display_name: form.display_name.trim().slice(0, 80) || null,
      bio: form.bio.trim().slice(0, 500) || null,
      phone: form.phone.trim() || null,
      date_of_birth: form.date_of_birth || null,
      avatar_url: form.avatar_url.trim() || null,
    };
    const { data: existing } = await supabase.from("profiles").select("id").eq("user_id", user.id).maybeSingle();
    const { error } = existing
      ? await supabase.from("profiles").update(payload).eq("user_id", user.id)
      : await supabase.from("profiles").insert(payload);
    setSaving(false);
    error ? toast.error(error.message) : toast.success("Profile saved");
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  if (!user) return null;
  const initials = (form.display_name || user.email || "?").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-xl mx-auto">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to home
        </button>
        <div className="card-surface border border-border/50 rounded-xl p-8 border-glow space-y-5">
          <div className="flex items-center gap-4">
            {form.avatar_url ? (
              <img src={form.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-primary/40" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center text-primary font-bold">{initials}</div>
            )}
            <div>
              <h1 className="text-xl font-semibold text-foreground">My Profile</h1>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div><Label>Full name</Label><Input value={form.display_name} onChange={set("display_name")} maxLength={80} className="mt-1" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Phone number</Label><Input type="tel" value={form.phone} onChange={set("phone")} maxLength={20} className="mt-1" /></div>
            <div><Label>Date of birth</Label><Input type="date" value={form.date_of_birth} onChange={set("date_of_birth")} className="mt-1" /></div>
          </div>
          <div><Label>Photo link (optional)</Label><Input value={form.avatar_url} onChange={set("avatar_url")} placeholder="https://..." className="mt-1" /></div>
          <div>
            <Label>Bio</Label>
            <textarea value={form.bio} onChange={set("bio")} maxLength={500} rows={4} className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground" />
          </div>
          <div className="flex gap-3">
            <Button onClick={save} disabled={saving} className="flex-1"><Save size={16} className="mr-2" />{saving ? "Saving..." : "Save profile"}</Button>
            <Button variant="outline" onClick={async () => { await signOut(); navigate("/"); }}><LogOut size={16} className="mr-2" />Sign out</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
