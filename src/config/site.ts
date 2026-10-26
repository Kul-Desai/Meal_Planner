export const siteConfig = {
  name: "Meal Planner",
  description: "Plan weeknight dinners and shop from one simple list.",
  homePath: "/plan",
  publicPaths: ["/", "/login", "/privacy", "/terms"] as const,
} as const;
