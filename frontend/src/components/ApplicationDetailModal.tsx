import { useEffect, useState } from "react";
import { X, Building2, DollarSign, MapPin, Clock, Calendar, Bell, Link as LinkIcon, User, Sparkles, FileText } from "lucide-react";

export interface FullApplication {
  id: string;
  title: string;
  company: string;
  status: string;
  appliedAt?: string;
  notes?: string;
  jobLink?: string;
  location?: string;
  salary?: string;
  priority?: string;
  deadline?: string;
  followUp?: string;
  source?: string;
  contactPerson?: string;
  contactEmail?: string;
  timeline?: { status: string; date: string; note: string }[];
}

const statusOptions = [
  { value: "applied", label: "Applied" },
  { value: "pending", label: "Pending" },
  { value: "interview_scheduled", label: "Interview Scheduled" },
  { value: "interview_completed", label: "Interview Completed" },
  { value: "offer_received", label: "Offer Received" },
  { value: "rejected", label: "Rejected" }
];

const priorityOptions = [
  { value: "", label: "Empty" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" }
];

const sourceOptions = [
  { value: "", label: "Empty" },
  { value: "College", label: "College" },
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Website", label: "Website" },
  { value: "Referral", label: "Referral" },
  { value: "Indeed", label: "Indeed" },
  { value: "Other", label: "Other" }
];

const fieldClass =
  "w-full h-11 px-3 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none transition-colors duration-150";
const fieldStyle = { background: "#23272F", border: "1px solid #3B414B" };

function Row({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] items-center gap-3 py-2">
      <div className="flex items-center gap-2 text-white/50 text-sm">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      {children}
    </div>
  );
}

export function ApplicationDetailModal({
  application,
  onClose,
  onSave
}: {
  application: FullApplication | null;
  onClose: () => void;
  onSave: (id: string, fields: Partial<FullApplication>) => void;
}) {
  const [form, setForm] = useState<FullApplication | null>(application);

  useEffect(() => {
    setForm(application);
  }, [application]);

  if (!application || !form) return null;

  const set = (field: keyof FullApplication, value: string) => setForm((f) => (f ? { ...f, [field]: value } : f));

  const handleSave = () => {
    onSave(application.id, form);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,.6)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl overflow-hidden"
        style={{ background: "#1B1F24", border: "1px solid rgba(255,255,255,.06)", boxShadow: "0 25px 60px rgba(0,0,0,.45)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 pt-6 pb-2">
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className="bg-transparent text-2xl font-bold text-white focus:outline-none w-full mr-4"
          />
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors duration-150 mt-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-5 max-h-[65vh] overflow-y-auto">
          <Row icon={Building2} label="Company">
            <input
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
              className={fieldClass}
              style={fieldStyle}
            />
          </Row>
          <Row icon={DollarSign} label="Pay/Salary">
            <input
              value={form.salary || ""}
              onChange={(e) => set("salary", e.target.value)}
              placeholder="Empty"
              className={fieldClass}
              style={fieldStyle}
            />
          </Row>
          <Row icon={MapPin} label="Location">
            <input
              value={form.location || ""}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Empty"
              className={fieldClass}
              style={fieldStyle}
            />
          </Row>
          <Row icon={Calendar} label="Deadline">
            <input
              type="date"
              value={form.deadline || ""}
              onChange={(e) => set("deadline", e.target.value)}
              className={fieldClass + " [color-scheme:dark]"}
              style={fieldStyle}
            />
          </Row>
          <Row icon={Bell} label="Follow up">
            <input
              type="date"
              value={form.followUp || ""}
              onChange={(e) => set("followUp", e.target.value)}
              className={fieldClass + " [color-scheme:dark]"}
              style={fieldStyle}
            />
          </Row>
          <Row icon={LinkIcon} label="URL">
            <input
              value={form.jobLink || ""}
              onChange={(e) => set("jobLink", e.target.value)}
              placeholder="Empty"
              className={fieldClass}
              style={fieldStyle}
            />
          </Row>
          <Row icon={User} label="Contact">
            <div className="flex gap-2">
              <input
                value={form.contactPerson || ""}
                onChange={(e) => set("contactPerson", e.target.value)}
                placeholder="Name"
                className={fieldClass}
                style={fieldStyle}
              />
              <input
                value={form.contactEmail || ""}
                onChange={(e) => set("contactEmail", e.target.value)}
                placeholder="Email"
                className={fieldClass}
                style={fieldStyle}
              />
            </div>
          </Row>
          <Row icon={Clock} label="Status">
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className={fieldClass} style={fieldStyle}>
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Row>
          <Row icon={Sparkles} label="Priority">
            <select value={form.priority || ""} onChange={(e) => set("priority", e.target.value)} className={fieldClass} style={fieldStyle}>
              {priorityOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Row>
          <Row icon={Sparkles} label="Source">
            <select value={form.source || ""} onChange={(e) => set("source", e.target.value)} className={fieldClass} style={fieldStyle}>
              {sourceOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Row>

          <div className="mt-3">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-1.5">
              <FileText className="w-4 h-4" />
              Notes
            </div>
            <textarea
              value={form.notes || ""}
              onChange={(e) => set("notes", e.target.value)}
              rows={3}
              className={fieldClass + " !h-auto py-2 resize-none"}
              style={fieldStyle}
              placeholder="HR call done, Asked DSA questions..."
            />
          </div>

          {form.timeline && form.timeline.length > 0 && (
            <div className="mt-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}>
              <div className="text-white/50 text-xs mb-2">Timeline</div>
              <div className="space-y-1.5">
                {form.timeline.slice(0, 5).map((event, idx) => (
                  <div key={idx} className="text-xs text-white/50">
                    <span className="text-white/80 capitalize">{event.status.replace(/_/g, " ")}</span> —{" "}
                    {new Date(event.date).toLocaleDateString()}
                    {event.note && <div className="text-white/30 italic">{event.note}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}>
          <button
            onClick={onClose}
            className="h-10 px-5 rounded-lg text-sm font-medium text-white/80 hover:text-white transition-colors duration-150"
            style={{ background: "#2A2E35" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="h-10 px-6 rounded-lg text-sm font-semibold text-black/85"
            style={{ background: "linear-gradient(135deg, #F2C744 0%, #E4572E 100%)" }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}