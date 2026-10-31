// Pagination: the one way to page a list (the page maths, the "Showing a-b of N" summary, the numbered pager). The implementation lives with the
// primitives (components/primitives/Pagination.tsx, Pager.tsx) so components can use it without reaching up into capabilities; it is the
// Pagination capability's public API here, for journeys, workspaces and screens.
export * from '../../components/primitives/Pagination';
export { Pager } from '../../components/primitives/Pager';
