import { useEffect, useMemo, useState } from "react";
import { Layout } from "../components/Layout";
import { DidYouApplyModal } from "../components/DidYouApplyModal";
import { AddApplicationModal } from "../components/AddApplicationModal";
import { ApplicationDetailModal, FullApplication } from "../components/ApplicationDetailModal";
import { QuickAddColumnForm } from "../components/QuickAddColumnForm";
import {
  useGetApplications,
  useUpdateApplicationStatus,
  useUpdateApplication,
  useApplyJob,
} from "../hooks/use-api";
import { Badge, Button, Skeleton } from "../components/ui";
import {
  Briefcase,
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle,
  Target,
  Plus,
  LayoutGrid,
  Circle,
  List as ListIcon,
} from "lucide-react";
import {
  STATUS_BUCKETS,
  bucketForStatus,
  BUCKET_DEFAULT_STATUS,
  StatusBucket,
} from "../components/statusBuckets";

type Tab = "status" | "pending" | "all";

export function Applications() {
  const { data: response, isLoading: isAppsLoading } = useGetApplications();
  const updateStatusMutation = useUpdateApplicationStatus();
  const updateApplicationMutation = useUpdateApplication();
  const applyMutation = useApplyJob();

  const applications = response?.applications || [];
  const [showAddModal, setShowAddModal] = useState(false);
  const [tab, setTab] = useState<Tab>("status");
  const [selectedApp, setSelectedApp] = useState<FullApplication | null>(null);
  const [openQuickAdd, setOpenQuickAdd] = useState<StatusBucket | null>(null);

  // Calculate statistics (unchanged)
  const stats = useMemo(() => {
    const total = applications.length;
    const applied = applications.filter((app) => app.status === "applied").length;
    const interview = applications.filter((app) => app.status.includes("interview")).length;
    const offer = applications.filter((app) => app.status.includes("offer")).length;
    const rejected = applications.filter((app) => app.status === "rejected").length;

    return { total, applied, interview, offer, rejected };
  }, [applications]);

  const statusOptions = [
    { value: "applied", label: "Applied", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
    { value: "pending", label: "Pending", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
    { value: "interview_scheduled", label: "Interview Scheduled", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
    { value: "interview_completed", label: "Interview Completed", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
    { value: "offer_received", label: "Offer Received", color: "bg-green-500/20 text-green-300 border-green-500/30" },
    { value: "rejected", label: "Rejected", color: "bg-red-500/20 text-red-300 border-red-500/30" },
  ];

  const getStatusColor = (status: string) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option ? option.color : "bg-gray-500/20 text-gray-300 border-gray-500/30";
  };

  const handleStatusChange = (appId: string, newStatus: string) => {
    updateStatusMutation.mutate({
      id: appId,
      status: newStatus,
      note: `Status changed to ${statusOptions.find((opt) => opt.value === newStatus)?.label}`,
    });
  };

  // Group applications into the 6 Status-board buckets
  const grouped = useMemo(() => {
    const groups: Record<StatusBucket, any[]> = {
      never_applied: [],
      pending: [],
      applied: [],
      ongoing: [],
      offered: [],
      rejected: [],
    };
    applications.forEach((app: any) => groups[bucketForStatus(app.status)].push(app));
    return groups;
  }, [applications]);

  const visibleApplications = useMemo(() => {
    if (tab === "pending") return grouped.pending;
    return applications; // "all"
  }, [tab, grouped, applications]);

  // ---- Save edits from the detail modal ----
  const handleSaveDetail = (id: string, fields: Partial<FullApplication>) => {
    updateApplicationMutation.mutate(
      { id, ...fields },
      {
        onError: () => {
          alert("Couldn't save changes — check your connection and try again.");
        },
      }
    );
  };

  // ---- Quick-add from a Status column's + button ----
  const handleQuickAdd = (
    bucket: StatusBucket,
    fields: { title: string; company: string; deadline: string; source: string }
  ) => {
    const status = BUCKET_DEFAULT_STATUS[bucket] || "applied";
    applyMutation.mutate(
      {
        jobId: Date.now().toString(),
        title: fields.title,
        company: fields.company || "Unknown",
        status,
        deadline: fields.deadline,
        source: fields.source,
      } as any,
      {
        onSuccess: () => {
          setOpenQuickAdd(null);
        },
      }
    );
  };

  // Pending application popup (unchanged)
  const pendingKey = "smart-ai:pendingApplication";
  const [pending, setPending] = useState<null | {
    jobId: string;
    title: string;
    company: string;
  }>(null);
  const [pendingOpen, setPendingOpen] = useState(false);

  const loadPending = () => {
    try {
      const raw = localStorage.getItem(pendingKey);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (!parsed?.jobId) return false;

      setPending({
        jobId: String(parsed.jobId),
        title: String(parsed.title || ""),
        company: String(parsed.company || ""),
      });
      setPendingOpen(true);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    loadPending();

    const onFocus = () => {
      loadPending();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Reusable detailed card (clickable → opens detail modal) ----
  const renderApplicationCard = (app: any) => (
    <div
      key={app.id}
      onClick={() => setSelectedApp(app)}
      className="bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/[0.07] transition-colors duration-150"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="font-bold text-white text-lg">{app.title}</div>
            {app.jobLink && (
              <a
                href={app.jobLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Calendar className="w-4 h-4" />
              </a>
            )}
          </div>
          <div className="text-white/60 text-sm mb-3">{app.company}</div>

          {/* Status Dropdown */}
          <div className="mb-3" onClick={(e) => e.stopPropagation()}>
            <label className="text-white/60 text-xs block mb-1">Status:</label>
            <select
              value={app.status}
              onChange={(e) => handleStatusChange(app.id, e.target.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${getStatusColor(
                app.status
              )}`}
              disabled={updateStatusMutation.isPending}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Applied Date */}
          <div className="text-white/40 text-xs mb-3">
            Applied: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Unknown"}
          </div>

          {/* Notes Section */}
          {app.notes && (
            <div className="mb-3">
              <label className="text-white/60 text-xs block mb-1">Notes:</label>
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-white/80 text-sm">
                {app.notes}
              </div>
            </div>
          )}

          {/* Timeline */}
          {app.timeline && app.timeline.length > 0 && (
            <div className="pt-3 border-t border-white/10">
              <div className="text-white/60 text-xs mb-2">Timeline:</div>
              <div className="space-y-1">
                {app.timeline.slice(0, 4).map((event: any, idx: number) => (
                  <div key={idx} className="flex items-start text-xs text-white/50">
                    <span className="mr-2 mt-0.5">
                      {event.status.includes("applied") && "📝"}
                      {event.status.includes("interview") && "🎯"}
                      {event.status.includes("offer") && "🎉"}
                      {event.status === "rejected" && "❌"}
                    </span>
                    <div className="flex-1">
                      <div className="capitalize">{event.status.replace("_", " ")}</div>
                      <div className="text-white/40">{new Date(event.date).toLocaleDateString()}</div>
                      {event.note && <div className="text-white/30 italic">{event.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ---- Compact card used inside Status kanban columns (also clickable) ----
  const renderCompactCard = (app: any) => {
    const bucket = bucketForStatus(app.status);
    const { cardBg, cardBorder } = STATUS_BUCKETS[bucket];
    return (
      <div
        key={app.id}
        onClick={() => setSelectedApp(app)}
        className="rounded-xl p-3.5 mb-2.5 cursor-pointer hover:brightness-110 transition-[filter] duration-150"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <div className="text-white font-semibold text-[15px] leading-snug mb-1">{app.title}</div>
        <div className="text-sm font-medium mb-1.5" style={{ color: "#F0A868" }}>
          {app.company}
        </div>
        <div className="text-xs text-white/50">
          {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Unknown"}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto text-white">
        <header className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Briefcase className="w-8 h-8 mr-3 text-blue-400" />
                Application Tracker
              </h1>
              <p className="text-white/70 mt-2">Track your job application progress</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Application
              </Button>
              <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-2">
                Total: {stats.total}
              </Badge>
            </div>
          </div>

          {/* Statistics Cards — unchanged */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-5">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs">Applied</p>
                  <p className="text-white text-xl font-bold">{stats.applied}</p>
                </div>
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs">Interview</p>
                  <p className="text-white text-xl font-bold">{stats.interview}</p>
                </div>
                <div className="bg-yellow-500/20 p-2 rounded-lg">
                  <Target className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs">Offer</p>
                  <p className="text-white text-xl font-bold">{stats.offer}</p>
                </div>
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs">Rejected</p>
                  <p className="text-white text-xl font-bold">{stats.rejected}</p>
                </div>
                <div className="bg-red-500/20 p-2 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs">Success Rate</p>
                  <p className="text-white text-xl font-bold">
                    {stats.total > 0 ? Math.round((stats.offer / stats.total) * 100) : 0}%
                  </p>
                </div>
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs — Status / Pending / All Applications */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTab("status")}
              className="flex items-center gap-2 px-4 h-9 rounded-full text-sm font-medium transition-colors duration-150"
              style={{
                background: tab === "status" ? "#2A2E35" : "transparent",
                color: tab === "status" ? "#fff" : "rgba(255,255,255,.55)",
              }}
            >
              <LayoutGrid className="w-4 h-4" />
              Status
            </button>
            <button
              onClick={() => setTab("pending")}
              className="flex items-center gap-2 px-4 h-9 rounded-full text-sm font-medium transition-colors duration-150"
              style={{
                background: tab === "pending" ? "#2A2E35" : "transparent",
                color: tab === "pending" ? "#fff" : "rgba(255,255,255,.55)",
              }}
            >
              <Circle className="w-4 h-4" />
              Pending
            </button>
            <button
              onClick={() => setTab("all")}
              className="flex items-center gap-2 px-4 h-9 rounded-full text-sm font-medium transition-colors duration-150"
              style={{
                background: tab === "all" ? "#2A2E35" : "transparent",
                color: tab === "all" ? "#fff" : "rgba(255,255,255,.55)",
              }}
            >
              <ListIcon className="w-4 h-4" />
              All Applications
            </button>
          </div>
        </header>

        {isAppsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full rounded-2xl bg-white/10" />
            ))}
          </div>
        ) : applications.length === 0 && tab !== "status" ? (
          <div className="text-center py-24 bg-white/10 backdrop-blur-md rounded-3xl">
            <h3 className="text-xl">No applications yet</h3>
            <p className="text-white/60 mt-2 text-sm">
              Apply from the Jobs page (or recommendations below).
            </p>
          </div>
        ) : tab === "status" ? (
          // ---- Status board: 6 columns, each with a + quick-add button ----
          <div className="flex gap-4 overflow-x-auto pb-2">
            {(Object.keys(STATUS_BUCKETS) as StatusBucket[]).map((key) => {
              const config = STATUS_BUCKETS[key];
              const items = grouped[key];
              const canAdd = key !== "never_applied";
              return (
                <div key={key} className="flex-shrink-0 w-72">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: config.dot }} />
                    <span className="text-sm font-semibold text-white">{config.label}</span>
                    <span className="text-xs text-white/40">{items.length}</span>
                    {canAdd && (
                      <button
                        onClick={() => setOpenQuickAdd(openQuickAdd === key ? null : key)}
                        className="ml-auto w-5 h-5 flex items-center justify-center rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors duration-150"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {openQuickAdd === key && (
                    <QuickAddColumnForm
                      onAdd={(fields) => handleQuickAdd(key, fields)}
                      onClose={() => setOpenQuickAdd(null)}
                    />
                  )}

                  <div className="max-h-[65vh] overflow-y-auto pr-1">
                    {items.length === 0 ? (
                      <div
                        className="text-xs text-white/30 px-1 py-4 text-center rounded-lg border border-dashed"
                        style={{ borderColor: "rgba(255,255,255,.08)" }}
                      >
                        Nothing here
                      </div>
                    ) : (
                      items.map((app) => renderCompactCard(app))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : visibleApplications.length === 0 ? (
          <div className="text-center py-24 bg-white/10 backdrop-blur-md rounded-3xl">
            <h3 className="text-xl">
              {tab === "pending" ? "No pending applications" : "No applications yet"}
            </h3>
          </div>
        ) : (
          <div className="space-y-4">{visibleApplications.map((app: any) => renderApplicationCard(app))}</div>
        )}
      </div>

      <DidYouApplyModal
        isOpen={pendingOpen}
        onClose={() => {
          setPendingOpen(false);
          if (pending) {
            localStorage.removeItem(pendingKey);
            setPending(null);
          }
        }}
        jobTitle={pending?.title || ""}
        company={pending?.company || ""}
      />

      <AddApplicationModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />

      <ApplicationDetailModal
        application={selectedApp}
        onClose={() => setSelectedApp(null)}
        onSave={handleSaveDetail}
      />
    </Layout>
  );
}