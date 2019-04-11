export default {
    TAKE_OVER: {
        CONFIRM: {
            CONFIRM_HAS_TENANT_AT_MANAGEMENT_START: "confirm_has_tenant_at_management_start",
            CONFIRM_MANAGEMENT_START_DATE: "confirm_management_start_date",
            SEND_TILE: "send_tile",
            ADD_BOND_TRANSFER_DOCUMENT: "add_bond_transfer_document",
            ADD_TENANT: "add_tenant",
            SCHEDULE_TENANT_INSPECTION: "schedule_tenant_inspection",
            ADD_LEASE: "add_lease",
            SETUP_RECURRING_BILLS: "setup_recurring_bills",
            ADD_KEY_DOCUMENTS: "add_key_documents",
            ADD_TO_PROPERTY_ME: "add_to_property_me",
            CONFIRM_BOND_REFERENCE_NUMBER: "confirm_bond_reference_number"
        },
        DOCUMENT: {
            CATEGORY_ID: {
                LEASE_AGREEMENT: {
                    ID: 52,
                    FIELD: "lease_document_id",
                    FILE_NAME: "lease_document"
                },
                BOND_TRANSFER: {
                    ID: 66,
                    FIELD: "bond_transfer_document_id",
                    FILE_NAME: "bond_transfer_document"
                },
                APPLICATION: {
                    ID: 56,
                    FIELD: "application_document_id",
                    FILE_NAME: "application_document"
                },
                PRIOR_TENANT_LEDGER: {
                    ID: 57,
                    FIELD: "prior_tenant_ledger_document_id",
                    FILE_NAME: "prior_tenant_ledger_document"
                }
            }
        },
        CHECKBOX_STATUS: {
            UNCHECKED: 0,
            CHECKED: 1,
            DISABLED: 2
        }
    },
    HOLDING_DEPOSITS: {
        STATUS: {
            FAILED: 'FAILED',
            SUCCESS: 'SUCCESS',
            FRESH: 'FRESH'
        }
    },
    KEYS: {
        LEASING: "Leasing",
        MANAGEMENT: "Management",
        TENANT: "Tenant"
    },
    GOOGLE:{
      MAP_API_KEY: "AIzaSyCKcD8H5o9xJzUtoPBH85u5Wx2puk2islQ"
    }
}
