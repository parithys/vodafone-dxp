/** A new task reference (TASK-nnnnnn). A journey takes one when it starts, and keeps it if it is saved as a draft. */
export const newTaskId = (): string => `TASK-${Date.now().toString().slice(-6)}`;
