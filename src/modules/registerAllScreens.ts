// Importing this registers every implemented screen (each module's screens/index.ts calls registerScreen()), so any host - the Vite
// router, the Next.js app - sees the same built set without knowing which screens exist.
import './lead-management/screens';
import './mobile-prepaid/screens';
import './fixed-line-fibre/screens';
import './fwa-5g-home/screens';
import './mobile-postpaid/screens';
import './enterprise-iot-b2b/screens';
import './order-management/screens';
import './mnp-fnp-porting/screens';
import './identity-customer-management/screens';
import './sim-number-management/screens';
import './trouble-ticketing-complaints/screens';
import './pre-to-post-migration/screens';
