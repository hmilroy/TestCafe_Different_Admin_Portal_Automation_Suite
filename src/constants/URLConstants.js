let BASE_LOCAL = 'https://35.16p5.209.43/data/';
let BASE = process.env.BASE ? process.env.BASE : 'http://localhost:3001/';
let BASE_URL = BASE + 'api/v1/';
let GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID : '658980007035-h6u57ldem3q9vk6eq36mov1hq8uimbfk.apps.googleusercontent.com'; // Dev
// let GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID : '658980007035-b6rdm5m050n1fh8edg3v7q7md4t57seu.apps.googleusercontent.com'; // QA
let OWNER_PORTAL = process.env.OWNER_PORTAL ? process.env.OWNER_PORTAL : 'http://localhost:3000/';
export default {
  BASE_URL: BASE_LOCAL,
  SEARCH_URL: BASE_LOCAL + 'searchresults.json',
  PROPERTY_MAINTENANCE_URL: BASE_LOCAL + 'maintenanceproject.json',
  USER_TYPE: BASE_LOCAL + 'usertypes.json',
  TRADIE_CATEGORY: BASE_LOCAL + 'tradiecategory.json',
  PERSON: BASE_LOCAL + 'person.json',
  PROPERTY: BASE_LOCAL + 'property.json',
  AUTO_SUGGEST: BASE_LOCAL + 'autosuggest.json',
  LOGIN_URL: BASE_URL + 'user/login',
  PROFILE: BASE_URL + 'user/profile',
  SEARCH_ALL: BASE_URL + 'search/all',
  SEARCH_USER: BASE_URL + 'search/user',
  SEARCH_PROPERTY: BASE_URL + 'search/property',
  RECURRING_BILLS: BASE_URL + 'recurring-bill/',
  PROPERTY_KEYS: BASE_URL + 'key/',
  ADD_PROPERTY: BASE_URL + 'property',
  ADD_PERSON: BASE_URL + 'user',
  FIND_PERSON: BASE_URL + 'person/',
  ALL_PROPERTY: BASE_URL + 'property-all/ownership,tenancy,takeover',
  FIND_PROPERTY: BASE_URL + 'property/',
  RENT_UPDATE_PROPERTY: BASE_URL + 'property/rent-detail/',
  AUTO_COMPLETE: BASE_URL + 'property/auto-complete/local',
  AUTO_COMPLETE_GLOBAL: BASE_URL + 'property/auto-complete/v2/global',
  GET_QUOTE_DETAILS: BASE + 'support/maintenance/quote/',
  PUT_QUOTE_DETAILS: BASE + 'support/maintenance/submit/quote',
  PUT_QUOTE_COMPLETE: BASE + 'support/maintenance/submit/quote/completed',
  GET_ALL_MAINTENANCE: BASE_URL + 'maintenance/request/all/',
  GET_PROPERTY_MAINTENANCE: BASE_URL + 'maintenance/request/',
  GET_PROPERTY_DOCUMENT: BASE_URL + 'document/',
  GET_PROPERTY_STATEMENT: BASE_URL + 'statement-all/',
  UPLOAD_STATEMENT: BASE_URL + 'statement/',
  GET_DOCUMENT_CATEGORY: BASE_URL + 'document/category',
  RESEND_SIGNUP_EMAIL: BASE_URL + 'owner/signup/resend-email',
  GET_INSPECTORS: BASE_URL + 'inspection/get-inspectors',
  GET_INSPECTION: BASE_URL + 'inspection/',
  GET_ALL_INSPECTIONS: BASE_URL + 'inspection-all/',
  GOOGLE_LOGIN_URL: BASE_URL + 'user/google-login/web/adminPortal',
  GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID,
  GET_USER_PAYMENT_INFO: BASE_URL + 'user/payment-type/',
  TAKEOVER: BASE_URL + 'property-take-over',
  TAKEOVER_BOND_REFERENCE: BASE_URL + 'property-take-over/update-bond-reference-number',
  TAKEOVER_DOCUMENT: BASE_URL + 'property-take-over/document',
  TAKEOVER_TENANT_INSPECTION: BASE_URL + 'property-take-over/tenant-inspection',
  OWNER_PORTAL: OWNER_PORTAL,
  GENERATE_OWNER_LOGIN_HASH: BASE_URL + 'user/login-hash/',
  PAYMENT: BASE_URL + 'payments/',
  VACANCY: BASE_URL + 'property-vacancy/',
  HOLINDG_DEPOSIT: BASE_URL + 'payments/holding-deposit',
  PAYMENTS: {
    ALL: BASE_URL + 'payments-all/'
  },
  REPORTS: {
    LEASE_RENEWALS: BASE_URL + 'report-all/lease-renewals',
    LANDLORD_INSURANCE: BASE_URL + 'report-all/landlord-insurance',
    PROPERTIES_WON: BASE_URL + 'report-all/properties-won',
    UPCOMING_OPEN_HOMES: BASE_URL + 'report-all/upcoming-open-homes',
    PROPERTIES_AVAILABLE_TO_LET: BASE_URL + 'report-all/properties-available-to-let',
    GET_SHOWN_BY_LIST: BASE_URL + 'user-all/1',
    PROPERTIES_OPEN_VERBALS: BASE_URL + 'report-all/open-verbals'
  },
  OPEN_HOME: BASE_URL + 'open-home',
  LEASE: {
    GET: BASE_URL + 'lease/property/',
    ADD: BASE_URL + 'lease/',
    DELETE: BASE_URL + 'lease/',
    UPDATE: BASE_URL + 'lease/'
  }
}
