import { Router, type IRouter } from "express";
import {
  db,
  projects,
  quoteRequests,
  contactMessages,
  events,
  services,
  teamMembers,
} from "@workspace/db";
import { desc, eq, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats/dashboard", async (_req, res) => {
  const [allProjects, allQuotes, allContacts, allEvents, allServices, allTeam] = await Promise.all([
    db.select().from(projects),
    db.select().from(quoteRequests).orderBy(desc(quoteRequests.createdAt)),
    db.select().from(contactMessages),
    db.select().from(events),
    db.select().from(services),
    db.select().from(teamMembers),
  ]);

  const activeProjects = allProjects.filter(
    (p) => p.status === "en_cours" || p.status === "actif",
  ).length;
  const pendingQuotes = allQuotes.filter((q) => q.status === "nouveau").length;

  const grouped = await db
    .select({ category: projects.category, count: sql<number>`count(*)::int` })
    .from(projects)
    .groupBy(projects.category);

  res.json({
    totalProjects: allProjects.length,
    activeProjects,
    totalQuotes: allQuotes.length,
    pendingQuotes,
    totalContactMessages: allContacts.length,
    totalEvents: allEvents.length,
    totalServices: allServices.length,
    totalTeamMembers: allTeam.length,
    recentQuotes: allQuotes.slice(0, 5).map((q) => ({
      ...q,
      createdAt: q.createdAt.toISOString(),
    })),
    projectsByCategory: grouped,
  });
});

router.get("/stats/public", async (_req, res) => {
  const [allProjects, allEvents, allQuotes] = await Promise.all([
    db.select().from(projects),
    db.select().from(events),
    db.select().from(quoteRequests),
  ]);
  const completed = allProjects.filter(
    (p) => p.status === "termine" || p.status === "livré" || p.status === "completed",
  ).length;
  const active = allProjects.filter(
    (p) => p.status === "en_cours" || p.status === "actif",
  ).length;
  const uniqueClients = new Set(allProjects.map((p) => p.client)).size;
  const totalClients = uniqueClients + new Set(allQuotes.map((q) => q.email)).size;
  res.json({
    projectsCompleted: completed || allProjects.length,
    clientsServed: totalClients || allProjects.length,
    activeWorksites: active,
    eventsOrganized: allEvents.length,
  });
});

// suppress unused import warning
void eq;

export default router;
