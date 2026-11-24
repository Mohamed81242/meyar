import { Tour } from "goguide";
export const toursConfig: Record<string, Tour> = {
    "dashboard-main": {
        id: "dashboard-main",
        steps: [
            {
                selector: "#dashboard-header-container",
                titleKey: "shared:tour.dashboard.header.title",
                contentKey: "shared:tour.dashboard.header.content",
                placement: "bottom",
            },
            {
                selector: "#sidebar-container",
                titleKey: "shared:tour.dashboard.sidebar.title",
                contentKey: "shared:tour.dashboard.sidebar.content",
                placement: "right",
            },
            {
                selector: "#dashboard-stats-container",
                titleKey: "shared:tour.dashboard.stats.title",
                contentKey: "shared:tour.dashboard.stats.content",
                placement: "top",
            },
            {
                selector: "#period-selector-container",
                titleKey: "shared:tour.dashboard.period.title",
                contentKey: "shared:tour.dashboard.period.content",
                placement: "bottom",
            },
        ],
    },
    "service-catalog": {
        id: "service-catalog",
        steps: [
            {
                selector: "#catalog-tabs-container",
                titleKey: "shared:tour.catalog.tabs.title",
                contentKey: "shared:tour.catalog.tabs.content",
                placement: "bottom",
            },
            {
                selector: "#catalog-new-service-btn",
                titleKey: "shared:tour.catalog.create.title",
                contentKey: "shared:tour.catalog.create.content",
                placement: "bottom",
            },
            {
                selector: "#catalog-search-filters",
                titleKey: "shared:tour.catalog.filters.title",
                contentKey: "shared:tour.catalog.filters.content",
                placement: "bottom",
            },
            {
                selector: "#catalog-list-table",
                titleKey: "shared:tour.catalog.grid.title",
                contentKey: "shared:tour.catalog.grid.content",
                placement: "top",
            },
        ],
    },
    "sla-configuration": {
        id: "sla-configuration",
        steps: [
            {
                selector: "#sla-list-table",
                titleKey: "shared:tour.sla.table.title",
                contentKey: "shared:tour.sla.table.content",
                placement: "top",
            },
            {
                selector: "#sla-search-filters",
                titleKey: "shared:tour.sla.filters.title",
                contentKey: "shared:tour.sla.filters.content",
                placement: "bottom",
            },
            {
                selector: "#sla-new-btn",
                titleKey: "shared:tour.sla.create.title",
                contentKey: "shared:tour.sla.create.content",
                placement: "bottom",
            },
        ],
    },
    contracts: {
        id: "contracts",
        steps: [
            {
                selector: "#contracts-tabs",
                titleKey: "shared:tour.contracts.tabs.title",
                contentKey: "shared:tour.contracts.tabs.content",
                placement: "bottom",
            },
            {
                selector: "#contracts-toolbar",
                titleKey: "shared:tour.contracts.toolbar.title",
                contentKey: "shared:tour.contracts.toolbar.content",
                placement: "bottom",
            },
            {
                selector: "#contracts-table",
                titleKey: "shared:tour.contracts.table.title",
                contentKey: "shared:tour.contracts.table.content",
                placement: "top",
            },
        ],
    },
    media: {
        id: "media",
        steps: [
            {
                selector: "#media-header",
                titleKey: "shared:tour.media.header.title",
                contentKey: "shared:tour.media.header.content",
                placement: "bottom",
            },
            {
                selector: "#media-upload-btn",
                titleKey: "shared:tour.media.upload.title",
                contentKey: "shared:tour.media.upload.content",
                placement: "bottom",
            },
            {
                selector: "#media-files-grid",
                titleKey: "shared:tour.media.files.title",
                contentKey: "shared:tour.media.files.content",
                placement: "top",
            },
        ],
    },
    "organizations-main": {
        id: "organizations-main",
        steps: [
            {
                selector: "#orgs-tabs",
                titleKey: "shared:tour.orgs.tabs.title",
                contentKey: "shared:tour.orgs.tabs.content",
                placement: "bottom",
            },
            {
                selector: "#orgs-table",
                titleKey: "shared:tour.orgs.table.title",
                contentKey: "shared:tour.orgs.table.content",
                placement: "top",
            },
            {
                selector: "#orgs-new-btn",
                titleKey: "shared:tour.orgs.new.title",
                contentKey: "shared:tour.orgs.new.content",
                placement: "bottom",
            },
        ],
    },
    "organizations-details": {
        id: "organizations-details",
        steps: [
            {
                selector: "#org-details-header",
                titleKey: "shared:tour.orgDetails.header.title",
                contentKey: "shared:tour.orgDetails.header.content",
                placement: "bottom",
            },
            {
                selector: "#org-details-tabs",
                titleKey: "shared:tour.orgDetails.tabs.title",
                contentKey: "shared:tour.orgDetails.tabs.content",
                placement: "bottom",
            },
            {
                selector: "#org-details-content",
                titleKey: "shared:tour.orgDetails.content.title",
                contentKey: "shared:tour.orgDetails.content.content",
                placement: "top",
            },
        ],
    },
  
    "people-main": {
        id: "people-main",
        steps: [
            {
                selector: "#people-tabs",
                titleKey: "shared:tour.people.tabs.title",
                contentKey: "shared:tour.people.tabs.content",
                placement: "bottom",
            },
            {
                selector: "#people-toolbar",
                titleKey: "shared:tour.people.toolbar.title",
                contentKey: "shared:tour.people.toolbar.content",
                placement: "bottom",
            },
            {
                selector: "#people-table",
                titleKey: "shared:tour.people.table.title",
                contentKey: "shared:tour.people.table.content",
                placement: "top",
            },
        ],
    },
    "people-details": {
        id: "people-details",
        steps: [
            {
                selector: "#people-details-card",
                titleKey: "shared:tour.peopleDetails.card.title",
                contentKey: "shared:tour.peopleDetails.card.content",
                placement: "bottom",
            },
            {
                selector: "#people-details-activity",
                titleKey: "shared:tour.peopleDetails.activity.title",
                contentKey: "shared:tour.peopleDetails.activity.content",
                placement: "top",
            },
        ],
    },
    "teams-main": {
        id: "teams-main",
        steps: [
            {
                selector: "#teams-tabs",
                titleKey: "shared:tour.teams.tabs.title",
                contentKey: "shared:tour.teams.tabs.content",
                placement: "bottom",
            },
            {
                selector: "#teams-toolbar",
                titleKey: "shared:tour.teams.toolbar.title",
                contentKey: "shared:tour.teams.toolbar.content",
                placement: "bottom",
            },
            {
                selector: "#teams-grid",
                titleKey: "shared:tour.teams.grid.title",
                contentKey: "shared:tour.teams.grid.content",
                placement: "top",
            },
        ],
    },
    "teams-details": {
        id: "teams-details",
        steps: [
            {
                selector: "#teams-details-header",
                titleKey: "shared:tour.teamsDetails.header.title",
                contentKey: "shared:tour.teamsDetails.header.content",
                placement: "bottom",
            },
            {
                selector: "#teams-details-members",
                titleKey: "shared:tour.teamsDetails.members.title",
                contentKey: "shared:tour.teamsDetails.members.content",
                placement: "top",
            },
        ],
    },
    "roles-permissions": {
        id: "roles-permissions",
        steps: [
            {
                selector: "#roles-tabs",
                titleKey: "shared:tour.roles.tabs.title",
                contentKey: "shared:tour.roles.tabs.content",
                placement: "bottom",
            },
            {
                selector: "#roles-matrix-table",
                titleKey: "shared:tour.roles.matrix.title",
                contentKey: "shared:tour.roles.matrix.content",
                placement: "top",
            },
        ],
    },
    settings: {
        id: "settings",
        steps: [
            {
                selector: "#settings-sidebar",
                titleKey: "shared:tour.settings.sidebar.title",
                contentKey: "shared:tour.settings.sidebar.content",
                placement: "right",
            },
            {
                selector: "#settings-navbar",
                titleKey: "shared:tour.settings.navbar.title",
                contentKey: "shared:tour.settings.navbar.content",
                placement: "bottom",
            },
            {
                selector: "#settings-content-viewport",
                titleKey: "shared:tour.settings.viewport.title",
                contentKey: "shared:tour.settings.viewport.content",
                placement: "center",
            },
        ],
    },
    projects: {
        id: "projects",
        steps: [
            {
                selector: "#projects-sidebar",
                titleKey: "shared:tour.projects.sidebar.title",
                contentKey: "shared:tour.projects.sidebar.content",
                placement: "right",
            },
            {
                selector: "#projects-navbar",
                titleKey: "shared:tour.projects.navbar.title",
                contentKey: "shared:tour.projects.navbar.content",
                placement: "bottom",
            },
            {
                selector: "#projects-content-viewport",
                titleKey: "shared:tour.projects.viewport.title",
                contentKey: "shared:tour.projects.viewport.content",
                placement: "center",
            },
        ],
    },
    classification: {
        id: "classification",
        steps: [
            {
                selector: "#classification-tabs",
                titleKey: "shared:tour.classification.tabs.title",
                contentKey: "shared:tour.classification.tabs.content",
                placement: "bottom",
            },
            {
                selector: "#catalog-new-service-btn",
                titleKey: "shared:tour.classification.add.title",
                contentKey: "shared:tour.classification.add.content",
                placement: "bottom",
            },
            {
                selector: "#classification-view-toggle",
                titleKey: "shared:tour.classification.view.title",
                contentKey: "shared:tour.classification.view.content",
                placement: "bottom",
            },
            {
                selector: "#classification-tree",
                titleKey: "shared:tour.classification.tree.title",
                contentKey: "shared:tour.classification.tree.content",
                placement: "top",
            },
        ],
    },
    "knowledge-base": {
        id: "knowledge-base",
        steps: [
            {
                selector: "#kb-search",
                titleKey: "shared:tour.kb.search.title",
                contentKey: "shared:tour.kb.search.content",
                placement: "bottom",
            },
            {
                selector: "#kb-filter-toggle",
                titleKey: "shared:tour.kb.filters.title",
                contentKey: "shared:tour.kb.filters.content",
                placement: "bottom",
            },
            {
                selector: "#kb-view-toggle",
                titleKey: "shared:tour.kb.view.title",
                contentKey: "shared:tour.kb.view.content",
                placement: "bottom",
            },
            {
                selector: "#kb-create-btn",
                titleKey: "shared:tour.kb.create.title",
                contentKey: "shared:tour.kb.create.content",
                placement: "bottom",
            },
            {
                selector: "#kb-table",
                titleKey: "shared:tour.kb.table.title",
                contentKey: "shared:tour.kb.table.content",
                placement: "top",
            },
        ],
    },
    incidents: {
        id: "incidents",
        steps: [
            {
                selector: "#incidents-search",
                titleKey: "shared:tour.incidents.search.title",
                contentKey: "shared:tour.incidents.search.content",
                placement: "bottom",
            },
            {
                selector: "#incidents-status-filter",
                titleKey: "shared:tour.incidents.status.title",
                contentKey: "shared:tour.incidents.status.content",
                placement: "bottom",
            },
            {
                selector: "#incidents-filter-toggle",
                titleKey: "shared:tour.incidents.filters.title",
                contentKey: "shared:tour.incidents.filters.content",
                placement: "bottom",
            },
            {
                selector: "#incidents-view-toggle",
                titleKey: "shared:tour.incidents.view.title",
                contentKey: "shared:tour.incidents.view.content",
                placement: "bottom",
            },
            {
                selector: "#incidents-create-btn",
                titleKey: "shared:tour.incidents.create.title",
                contentKey: "shared:tour.incidents.create.content",
                placement: "bottom",
            },
            {
                selector: "#incidents-table",
                titleKey: "shared:tour.incidents.table.title",
                contentKey: "shared:tour.incidents.table.content",
                placement: "top",
            },
        ],
    },
    problems: {
        id: "problems",
        steps: [
            {
                selector: "#problems-table",
                titleKey: "shared:tour.problems.table.title",
                contentKey: "shared:tour.problems.table.content",
                placement: "top",
            },
            {
                selector: "#problems-search",
                titleKey: "shared:tour.problems.search.title",
                contentKey: "shared:tour.problems.search.content",
                placement: "bottom",
            },
            {
                selector: "#problems-status-filter",
                titleKey: "shared:tour.problems.status.title",
                contentKey: "shared:tour.problems.status.content",
                placement: "bottom",
            },
            {
                selector: "#problems-filter-toggle",
                titleKey: "shared:tour.problems.filters.title",
                contentKey: "shared:tour.problems.filters.content",
                placement: "bottom",
            },
            {
                selector: "#problems-view-toggle",
                titleKey: "shared:tour.problems.view.title",
                contentKey: "shared:tour.problems.view.content",
                placement: "bottom",
            },
            {
                selector: "#problems-create-btn",
                titleKey: "shared:tour.problems.create.title",
                contentKey: "shared:tour.problems.create.content",
                placement: "bottom",
            },
        ],
    },
    changes: {
        id: "changes",
        steps: [
            {
                selector: "#changes-search",
                titleKey: "shared:tour.changes.search.title",
                contentKey: "shared:tour.changes.search.content",
                placement: "bottom",
            },
            {
                selector: "#changes-status-pills",
                titleKey: "shared:tour.changes.status.title",
                contentKey: "shared:tour.changes.status.content",
                placement: "bottom",
            },
            {
                selector: "#changes-view-toggle",
                titleKey: "shared:tour.changes.view.title",
                contentKey: "shared:tour.changes.view.content",
                placement: "bottom",
            },
            {
                selector: "#changes-create-btn",
                titleKey: "shared:tour.changes.create.title",
                contentKey: "shared:tour.changes.create.content",
                placement: "bottom",
            },
            {
                selector: "#changes-table",
                titleKey: "shared:tour.changes.table.title",
                contentKey: "shared:tour.changes.table.content",
                placement: "top",
            },
        ],
    },
    "service-requests": {
        id: "service-requests",
        steps: [
            {
                selector: "#requests-search",
                titleKey: "shared:tour.requests.search.title",
                contentKey: "shared:tour.requests.search.content",
                placement: "bottom",
            },
            {
                selector: "#requests-view-toggle",
                titleKey: "shared:tour.requests.view.title",
                contentKey: "shared:tour.requests.view.content",
                placement: "bottom",
            },
            {
                selector: "#requests-create-btn",
                titleKey: "shared:tour.requests.create.title",
                contentKey: "shared:tour.requests.create.content",
                placement: "bottom",
            },
            {
                selector: "#requests-table",
                titleKey: "shared:tour.requests.table.title",
                contentKey: "shared:tour.requests.table.content",
                placement: "top",
            },
        ],
    },
    contacts: {
        id: "contacts",
        steps: [
            {
                selector: "#contacts-search",
                titleKey: "shared:tour.contacts.search.title",
                contentKey: "shared:tour.contacts.search.content",
                placement: "bottom",
            },
            {
                selector: "#contacts-vip-toggle",
                titleKey: "shared:tour.contacts.vip.title",
                contentKey: "shared:tour.contacts.vip.content",
                placement: "bottom",
            },
            {
                selector: "#contacts-filter-toggle",
                titleKey: "shared:tour.contacts.filters.title",
                contentKey: "shared:tour.contacts.filters.content",
                placement: "bottom",
            },
            {
                selector: "#contacts-create-btn",
                titleKey: "shared:tour.contacts.create.title",
                contentKey: "shared:tour.contacts.create.content",
                placement: "bottom",
            },
            {
                selector: "#contacts-table",
                titleKey: "shared:tour.contacts.table.title",
                contentKey: "shared:tour.contacts.table.content",
                placement: "top",
            },
        ],
    },
    partners: {
        id: "partners",
        steps: [
            {
                selector: "#partners-tabs",
                titleKey: "shared:tour.partners.tabs.title",
                contentKey: "shared:tour.partners.tabs.content",
                placement: "bottom",
            },
            {
                selector: "#partners-new-btn",
                titleKey: "shared:tour.partners.new.title",
                contentKey: "shared:tour.partners.new.content",
                placement: "bottom",
            },
            {
                selector: "#partners-toolbar",
                titleKey: "shared:tour.partners.toolbar.title",
                contentKey: "shared:tour.partners.toolbar.content",
                placement: "bottom",
            },
            {
                selector: "#partners-table",
                titleKey: "shared:tour.partners.table.title",
                contentKey: "shared:tour.partners.table.content",
                placement: "top",
            },
        ],
    },
};
