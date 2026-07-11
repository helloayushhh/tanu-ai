import { useState } from "react";
import { FileText, Building2, Calendar, Sparkles } from "lucide-react";

const sourceOptions = ["College", "LinkedIn", "Website", "Referral", "Indeed", "Other"];

export function QuickAddColumnForm({
  onAdd,
  onClose
}: {
  onAdd: (fields: { title: string; company: string; deadline: string; source: string }) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [deadline, setDeadline] = useState("");
  const [source, setSource] = useState("");
  const [showCompany, setShowCompany] = useState(false);
  const [showDeadline, setShowDeadline] = useState(false);
  const [showSource, setShowSource] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) {
      onClose();
      return;
    }
    onAdd({ title: title.trim(), company: company.trim(), deadline, source });
  };

  return (
    <div
      className="rounded-xl p-3 mb-2.5"
      style={{ background: "#1F2A22", border: "1px solid rgba(52,211,153,.2)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-4 h-4 text-white/40" />
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
            if (e.key === "Escape") onClose();
          }}
          placeholder="Type a name..."
          className="bg-transparent text-white text-sm placeholder-white/40 focus:outline-none flex-1"
        />
      </div>

      {showCompany ? (
        <div className="flex items-center gap-2 mb-1.5">
          <Building2 className="w-3.5 h-3.5 text-white/40" />
          <input
            autoFocus
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company name"
            className="bg-transparent text-white/80 text-xs placeholder-white/30 focus:outline-none flex-1"
          />
        </div>
      ) : (
        <button
          onClick={() => setShowCompany(true)}
          className="flex items-center gap-2 text-white/40 text-xs mb-1.5 hover:text-white/60"
        >
          <Building2 className="w-3.5 h-3.5" /> Add Company
        </button>
      )}

      {showDeadline ? (
        <div className="flex items-center gap-2 mb-1.5">
          <Calendar className="w-3.5 h-3.5 text-white/40" />
          <input
            autoFocus
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="bg-transparent text-white/80 text-xs focus:outline-none flex-1 [color-scheme:dark]"
          />
        </div>
      ) : (
        <button
          onClick={() => setShowDeadline(true)}
          className="flex items-center gap-2 text-white/40 text-xs mb-1.5 hover:text-white/60"
        >
          <Calendar className="w-3.5 h-3.5" /> Add Deadline
        </button>
      )}

      {showSource ? (
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-white/40" />
          <select
            autoFocus
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="bg-transparent text-white/80 text-xs focus:outline-none flex-1"
          >
            <option value="" style={{ background: "#1B1F24" }}>
              Select source
            </option>
            {sourceOptions.map((s) => (
              <option key={s} value={s} style={{ background: "#1B1F24" }}>
                {s}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <button
          onClick={() => setShowSource(true)}
          className="flex items-center gap-2 text-white/40 text-xs mb-2 hover:text-white/60"
        >
          <Sparkles className="w-3.5 h-3.5" /> Add Source
        </button>
      )}

      <div className="flex gap-2 mt-2">
        <button
          onClick={onClose}
          className="flex-1 h-8 rounded-lg text-xs font-medium text-white/70"
          style={{ background: "#2A2E35" }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 h-8 rounded-lg text-xs font-semibold text-black/85"
          style={{ background: "linear-gradient(135deg, #F2C744 0%, #E4572E 100%)" }}
        >
          Add
        </button>
      </div>
    </div>
  );
}