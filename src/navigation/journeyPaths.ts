/** Where the Existing Customer flow of New Connection lives (journey started from Customer Details). */
export const existingCustomerPath = (customerId: string) => `/mobile/start-connection/existing/${customerId}`;

/** The same, for New Home Connection (Fibre, Fixed-Line, FWA, 5G Home). */
export const existingHomeCustomerPath = (customerId: string) => `/fibre-home/start-connection/existing/${customerId}`;
