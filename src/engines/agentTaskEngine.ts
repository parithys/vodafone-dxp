// Agent 360 ATV-02/AAV-02: "display assigned tasks... only for the
// logged-in agent." Both Dashboard.tsx's tile counts and TaskListView.tsx's
// list use this same predicate so the two never drift - a task with no
// owner yet is everyone's queue to pick up; once assigned, it belongs to
// that one agent and drops out of everyone else's view.
export function isVisibleToAgent(assignedAgentId: string | null | undefined, currentAgentId: string | undefined): boolean {
  if (!assignedAgentId) return true;
  return assignedAgentId === currentAgentId;
}
