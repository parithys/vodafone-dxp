/** New Home Connection is its own journey: the route it continues on, with the customer already identified. */
const HOME_CONNECTION_ROUTE = '/fixed-line-fibre/new-fixed-line-wizard-contact-step';
export const homeConnectionRoute = (ctx: { flow: 'new' | 'existing'; existingCustomerId: string | undefined }) =>
  ctx.flow === 'existing' && ctx.existingCustomerId ? `/fibre-home/start-connection/existing/${ctx.existingCustomerId}` : HOME_CONNECTION_ROUTE;
