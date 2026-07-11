// Central place that maps whatever status string the backend/DB actually stores
// into the 6 buckets shown in the Status board. Keeping this in one file means
// if you rename a backend status later, you only fix it here.

export type StatusBucket =
  | "never_applied"
  | "pending"
  | "applied"
  | "ongoing"
  | "offered"
  | "rejected";

export const STATUS_BUCKETS: Record<
  StatusBucket,
  { label: string; dot: string; cardBg: string; cardBorder: string }
> = {
  never_applied: {
    label: "Never Applied",
    dot: "#9CA3AF",
    cardBg: "#23262B",
    cardBorder: "rgba(255,255,255,.06)"
  },
  pending: {
    label: "Pending",
    dot: "#A78BFA",
    cardBg: "#2A2140",
    cardBorder: "rgba(167,139,250,.15)"
  },
  applied: {
    label: "Applied",
    dot: "#34D399",
    cardBg: "#16241F",
    cardBorder: "rgba(52,211,153,.15)"
  },
  ongoing: {
    label: "Ongoing",
    dot: "#F59E0B",
    cardBg: "#2B2117",
    cardBorder: "rgba(245,158,11,.15)"
  },
  offered: {
    label: "Offered",
    dot: "#60A5FA",
    cardBg: "#182236",
    cardBorder: "rgba(96,165,250,.15)"
  },
  rejected: {
    label: "Rejected",
    dot: "#F87171",
    cardBg: "#2B1A1D",
    cardBorder: "rgba(248,113,113,.15)"
  }
};

// Every raw status string your backend has used across different files
// (applications.ts, AddApplicationModal.tsx, DidYouApplyModal.tsx) gets
// normalized here. Add new raw values on the left as you find them.
export function bucketForStatus(status: string | undefined | null): StatusBucket {
  switch (status) {
    case "applied":
    case "applied_earlier":
      return "applied";
    case "pending":
      return "pending";
    case "interview":
    case "interview_scheduled":
    case "interview_completed":
      return "ongoing";
    case "offer":
    case "offer_received":
      return "offered";
    case "rejected":
      return "rejected";
    case undefined:
    case null:
    case "":
      return "never_applied";
    default:
      return "never_applied";
  }
}

// Tag pill colors for the small source/origin badge on each card
// ("College", "Website", "Linkedin", "NIC", "Prosple"...)
export function tagColor(tag?: string): { bg: string; text: string } {
  const t = (tag || "").toLowerCase();
  if (t === "college") return { bg: "rgba(52,211,153,.15)", text: "#6EE7B7" };
  if (t === "website") return { bg: "rgba(96,165,250,.15)", text: "#93C5FD" };
  if (t === "linkedin") return { bg: "rgba(167,139,250,.2)", text: "#C4B5FD" };
  return { bg: "rgba(255,255,255,.08)", text: "rgba(255,255,255,.7)" };
}

// When you hit "+" on a Status column, this is the raw status the new
// application gets saved with. "never_applied" has no entry — you can't
// directly create a "never applied" application, those come from saved jobs.
export const BUCKET_DEFAULT_STATUS: Partial<Record<StatusBucket, string>> = {
  pending: "pending",
  applied: "applied",
  ongoing: "interview_scheduled",
  offered: "offer_received",
  rejected: "rejected"
};