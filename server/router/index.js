const rootRouter = require("./root-auth.route");
const adminRouter = require("./admin-auth.route");
const credsRouter = require("./credential.route");
const leadsRouter = require("./leads.route");
const projectsRouter = require("./projects.route");
const expenseRouter = require("./expense.route");

module.exports = [
    { path: "/api/admin/auth", router: adminRouter },

    { path: "/api/root/auth", router: rootRouter },
    { path: "/api/root/credentials", router: credsRouter },
    { path: "/api/root/leads", router: leadsRouter },
    { path: "/api/root/projects", router: projectsRouter },
    { path: "/api/root/expense", router: expenseRouter },
];