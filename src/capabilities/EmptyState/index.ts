// Empty State: the one way to say "nothing here". The implementation lives with the primitives (components/primitives/EmptyState.tsx) so tables,
// pickers and patterns can use it without reaching up into capabilities; it is the capability's public API here, for journeys and screens.
// The picture, spacing and layout are fixed; the title, message and action are the scenario's own.
export { EmptyState, EMPTY_STATE_ICON } from '../../components/primitives/EmptyState';
