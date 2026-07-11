import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase, Link, FileText, MapPin, DollarSign, Star, Calendar, Bell, User, Mail, Globe } from "lucide-react";
import { useState } from "react";
import { useApplyJob } from "../hooks/use-api";
import { Button } from "./ui";

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" }
];

const sourceOptions = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "company", label: "Company Site" },
  { value: "referral", label: "Referral" },
  { value: "indeed", label: "Indeed" },
  { value: "other", label: "Other" }
];

const initialFormData = {
  title: "",
  company: "",
  jobLink: "",
  location: "",
  status: "applied",
  priority: "medium",
  deadline: "",
  followUp: "",
  salary: "",
  source: "linkedin",
  contactPerson: "",
  contactEmail: "",
  notes: ""
};

// Shared classes so every input/select/textarea stays visually identical and compact
const fieldClass =
  "w-full h-12 px-3.5 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none transition-colors duration-150";
const fieldStyle = {
  background: "#23272F",
  border: "1px solid #3B414B"
};
const fieldFocusStyle = {
  borderColor: "#F2C744",
  boxShadow: "0 0 0 1px #F2C744"
};

function FieldLabel({ icon: Icon, children, required }: { icon?: any; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="flex items-center gap-1.5 text-white/70 text-xs font-medium mb-1.5">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
      {required && <span className="text-[#F2C744]">*</span>}
    </label>
  );
}

export function AddApplicationModal({ isOpen, onClose }: AddApplicationModalProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const applyMutation = useApplyJob();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.company) {
      alert("Please fill in at least job title and company name");
      return;
    }

    applyMutation.mutate(
      {
        jobId: Date.now().toString(),
        title: formData.title,
        company: formData.company,
        jobLink: formData.jobLink,
        location: formData.location,
        status: formData.status,
        priority: formData.priority,
        deadline: formData.deadline,
        followUp: formData.followUp,
        salary: formData.salary,
        source: formData.source,
        contactPerson: formData.contactPerson,
        contactEmail: formData.contactEmail,
        notes: formData.notes
      } as any,
      {
        onSuccess: () => {
          setFormData(initialFormData);
          onClose();
        }
      }
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getFieldStyle = (fieldName: string) => ({
    ...fieldStyle,
    ...(focusedField === fieldName ? fieldFocusStyle : {})
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 12 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className="relative w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "#1B1F24",
              border: "1px solid rgba(255,255,255,.06)",
              boxShadow: "0 25px 60px rgba(0,0,0,.45)"
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,.06)" }}>
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-lg"
                  style={{ background: "linear-gradient(135deg, #F2C744 0%, #E4572E 100%)" }}
                >
                  <Briefcase className="w-4.5 h-4.5 text-black/80" />
                </div>
                <h2 className="text-lg font-semibold text-white">Add New Application</h2>
              </div>
              <button
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors duration-150"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3.5">
                  {/* Job Title */}
                  <div>
                    <FieldLabel required>Job Title</FieldLabel>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      onFocus={() => setFocusedField("title")}
                      onBlur={() => setFocusedField(null)}
                      className={fieldClass}
                      style={getFieldStyle("title")}
                      placeholder="e.g. Senior React Developer"
                      required
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <FieldLabel required>Company</FieldLabel>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      onFocus={() => setFocusedField("company")}
                      onBlur={() => setFocusedField(null)}
                      className={fieldClass}
                      style={getFieldStyle("company")}
                      placeholder="e.g. Google, Microsoft"
                      required
                    />
                  </div>

                  {/* URL */}
                  <div>
                    <FieldLabel icon={Link}>URL</FieldLabel>
                    <input
                      type="url"
                      value={formData.jobLink}
                      onChange={(e) => handleInputChange("jobLink", e.target.value)}
                      onFocus={() => setFocusedField("jobLink")}
                      onBlur={() => setFocusedField(null)}
                      className={fieldClass}
                      style={getFieldStyle("jobLink")}
                      placeholder="https://careers.company.com/job/123"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <FieldLabel icon={MapPin}>Location</FieldLabel>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      onFocus={() => setFocusedField("location")}
                      onBlur={() => setFocusedField(null)}
                      className={fieldClass}
                      style={getFieldStyle("location")}
                      placeholder="e.g. Bangalore, Remote"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <FieldLabel>Status</FieldLabel>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      onFocus={() => setFocusedField("status")}
                      onBlur={() => setFocusedField(null)}
                      className={fieldClass}
                      style={getFieldStyle("status")}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <FieldLabel icon={Star}>Priority</FieldLabel>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleInputChange("priority", e.target.value)}
                      onFocus={() => setFocusedField("priority")}
                      onBlur={() => setFocusedField(null)}
                      className={fieldClass}
                      style={getFieldStyle("priority")}
                    >
                      {priorityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Deadline */}
                  <div>
                    <FieldLabel icon={Calendar}>Deadline</FieldLabel>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange("deadline", e.target.value)}
                      onFocus={() => setFocusedField("deadline")}
                      onBlur={() => setFocusedField(null)}
                      className={fieldClass + " [color-scheme:dark]"}
                      style={getFieldStyle("deadline")}
                    />
                  </div>

                  {/* Follow-up */}
                  <div>
                    <FieldLabel icon={Bell}>Follow-up</FieldLabel>
                    <input
                      type="date"
                      value={formData.followUp}
                      onChange={(e) => handleInputChange("followUp", e.target.value)}
                      onFocus={() => setFocusedField("followUp")}
                      onBlur={() => setFocusedField(null)}
                      className={fieldClass + " [color-scheme:dark]"}
                      style={getFieldStyle("followUp")}
                    />
                  </div>

                  {/* Salary */}
                  <div>
                    <FieldLabel icon={DollarSign}>Salary</FieldLabel>
                    <input
                      type="text"
                      value={formData.salary}
                      onChange={(e) => handleInputChange("salary", e.target.value)}
                      onFocus={() => setFocusedField("salary")}
                      onBlur={() => setFocusedField(null)}
                      className={fieldClass}
                      style={getFieldStyle("salary")}
                      placeholder="e.g. 6-8 LPA"
                    />
                  </div>

                  {/* Source */}
                  <div>
                    <FieldLabel icon={Globe}>Source</FieldLabel>
                    <select
                      value={formData.source}
                      onChange={(e) => handleInputChange("source", e.target.value)}
                      onFocus={() => setFocusedField("source")}
                      onBlur={() => setFocusedField(null)}
                      className={fieldClass}
                      style={getFieldStyle("source")}
                    >
                      {sourceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Contact Person */}
                  <div>
                    <FieldLabel icon={User}>Contact Person</FieldLabel>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                      onFocus={() => setFocusedField("contactPerson")}
                      onBlur={() => setFocusedField(null)}
                      className={fieldClass}
                      style={getFieldStyle("contactPerson")}
                      placeholder="e.g. Priya Sharma"
                    />
                  </div>

                  {/* Contact Email */}
                  <div>
                    <FieldLabel icon={Mail}>Contact Email</FieldLabel>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                      onFocus={() => setFocusedField("contactEmail")}
                      onBlur={() => setFocusedField(null)}
                      className={fieldClass}
                      style={getFieldStyle("contactEmail")}
                      placeholder="hr@company.com"
                    />
                  </div>

                  {/* Notes - full width */}
                  <div className="md:col-span-2">
                    <FieldLabel icon={FileText}>Notes</FieldLabel>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      onFocus={() => setFocusedField("notes")}
                      onBlur={() => setFocusedField(null)}
                      className={fieldClass + " !h-24 py-2.5 resize-none"}
                      style={getFieldStyle("notes")}
                      rows={3}
                      placeholder="HR call done, Asked DSA questions, Technical round completed..."
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="h-11 px-5 rounded-lg text-sm font-medium text-white/80 hover:text-white transition-colors duration-150"
                  style={{ background: "#2A2E35" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applyMutation.isPending}
                  className="h-11 px-6 rounded-lg text-sm font-semibold text-black/85 transition-opacity duration-150 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #F2C744 0%, #E4572E 100%)" }}
                >
                  {applyMutation.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}