import { FastifyInstance } from "fastify";

let applications: any[] = [];

export async function registerApplicationRoutes(app: FastifyInstance) {

  // ✅ GET ALL APPLICATIONS
  app.get("/api/applications", async () => {
    return {
      applications,
    };
  });

  // ✅ CREATE APPLICATION (THIS WAS MISSING)
  app.post("/api/applications", async (req, reply) => {
    const body = req.body as any;

    const newApp = {
      id: Date.now().toString(),
      jobId: body.jobId,
      title: body.title,
      company: body.company,
      status: body.status || "applied",
      appliedAt: new Date().toISOString(),
      notes: body.notes || "",
      jobLink: body.jobLink || "",
      timeline: [
        {
          status: body.status || "applied",
          date: new Date().toISOString(),
          note: "Application submitted"
        },
      ],
    };

    applications.unshift(newApp);

    return {
      success: true,
      application: newApp,
    };
  });

  // Requirement alias: POST /api/apply (same behavior as creating an application)
  app.post("/api/apply", async (req, reply) => {
    const body = req.body as any;

    const newApp = {
      id: Date.now().toString(),
      jobId: body.jobId,
      title: body.title,
      company: body.company,
      status: body.status || "applied",
      appliedAt: new Date().toISOString(),
      notes: body.notes || "",
      jobLink: body.jobLink || "",
      timeline: [
        {
          status: body.status || "applied",
          date: new Date().toISOString(),
          note: "Application submitted"
        },
      ],
    };

    applications.unshift(newApp);

    return {
      success: true,
      application: newApp,
    };
  });

  // ✅ UPDATE APPLICATION STATUS
  app.patch("/api/applications/:id/status", async (req, reply) => {
    const { id } = req.params as { id: string };
    const { status, note } = req.body as { status: string; note?: string };

    const idx = applications.findIndex((a) => a.id === id);
    if (idx === -1) {
      return reply.status(404).send({ error: "Application not found" });
    }

    const current = applications[idx];
    current.status = status;
    current.timeline = Array.isArray(current.timeline) ? current.timeline : [];
    current.timeline.unshift({
      status,
      date: new Date().toISOString(),
      note: note || `Status changed to ${status}`
    });

    applications[idx] = current;
    return reply.send({ success: true, application: current });
  });

  // ✅ UPDATE APPLICATION (for notes and other fields)
  app.patch("/api/applications/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = req.body as any;

    const idx = applications.findIndex((a) => a.id === id);
    if (idx === -1) {
      return reply.status(404).send({ error: "Application not found" });
    }

    const current = applications[idx];
    
    // Update allowed fields
    if (body.notes !== undefined) current.notes = body.notes;
    if (body.jobLink !== undefined) current.jobLink = body.jobLink;
    if (body.title !== undefined) current.title = body.title;
    if (body.company !== undefined) current.company = body.company;

    applications[idx] = current;
    return reply.send({ success: true, application: current });
  });
}