const Credential = require("../models/credentials.model");
const Earning = require("../models/earnings.model");
const Expense = require("../models/expense.model");
const Lead = require("../models/leads.model");
const Project = require("../models/projects.model");
const User = require("../models/user.model");

exports.getStats = async (req, res) => {
  try {
    // Total number of credentials
    const totalCredentials = await Credential.countDocuments();

    // Total amount of earnings
    const earningsAggregate = await Earning.aggregate([
      {
        $match: {
          amount: { $ne: null, $ne: "" },
          $expr: { $eq: [{ $type: "$amount" }, "string"] } // Ensure amount is a string
        }
      },
      {
        $group: {
          _id: null,
          totalEarnings: {
            $sum: {
              $cond: [
                { $regexMatch: { input: "$amount", regex: /^[0-9]+(\.[0-9]+)?$/ } },
                { $toDouble: "$amount" },
                0
              ]
            }
          }
        }
      }
    ]);
    const totalEarnings = earningsAggregate[0]?.totalEarnings || 0;

    // Total amount of expenses
    const expensesAggregate = await Expense.aggregate([
      {
        $match: {
          amount: { $ne: null, $ne: "" },
          $expr: { $eq: [{ $type: "$amount" }, "string"] }
        }
      },
      {
        $group: {
          _id: null,
          totalExpenses: {
            $sum: {
              $cond: [
                { $regexMatch: { input: "$amount", regex: /^[0-9]+(\.[0-9]+)?$/ } },
                { $toDouble: "$amount" },
                0
              ]
            }
          }
        }
      }
    ]);
    const totalExpenses = expensesAggregate[0]?.totalExpenses || 0;

    // Total number of leads by status
    const leadStatuses = ["Email Sent", "Not Applied", "No Response", "Failed", "Success"];
    const leadsByStatus = await Lead.aggregate([
      { $match: { status: { $in: leadStatuses } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { status: "$_id", count: 1, _id: 0 } }
    ]);
    const totalLeads = leadsByStatus.reduce((sum, lead) => sum + lead.count, 0);
    const leadsBreakdown = leadStatuses.reduce((acc, status) => {
      const found = leadsByStatus.find(item => item.status === status);
      acc[status.replace(/\s+/g, '')] = found ? found.count : 0;
      return acc;
    }, {});

    // Total number of projects by status
    const projectStatuses = ["Canceled", "In Progress", "Completed"];
    const projectsByStatus = await Project.aggregate([
      { $match: { status: { $in: projectStatuses } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { status: "$_id", count: 1, _id: 0 } }
    ]);
    const totalProjects = projectsByStatus.reduce((sum, project) => sum + project.count, 0);
    const projectsBreakdown = projectStatuses.reduce((acc, status) => {
      const found = projectsByStatus.find(item => item.status === status);
      acc[status.replace(/\s+/g, '')] = found ? found.count : 0;
      return acc;
    }, {});

    // Total number of users, admins, and super admins
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ isAdmin: true });
    const totalSuperAdmins = await User.countDocuments({ isAdmin: true, isSuperAdmin: true });

    // Compile response
    const stats = {
      totalCredentials,
      totalEarnings,
      totalExpenses,
      totalLeads,
      leadsBreakdown,
      totalProjects,
      projectsBreakdown,
      totalUsers,
      totalAdmins,
      totalSuperAdmins
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};