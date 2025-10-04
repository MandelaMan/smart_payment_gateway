export const ROLES = {
  ADMIN: 1,
  SHAREHOLDER: 2,
  CUSTOMER: 3,
  STAFF: 4,
};

export function roleText(roleId) {
  switch (roleId) {
    case ROLES.ADMIN:
      return "Administrator";
    case ROLES.SHAREHOLDER:
      return "shareholder";
    case ROLES.CUSTOMER:
      return "Customer";
    case ROLES.STAFF:
      return "Staff";
    default:
      return "/";
  }
}

export function homeForRole(roleId) {
  switch (roleId) {
    case ROLES.ADMIN:
      return "/dashboard";
    case ROLES.SHAREHOLDER:
      return "/dashboard/shareholder";
    case ROLES.CUSTOMER:
      return "/dashboard/customer";
    case ROLES.STAFF:
      return "/dashboard/staff";
    default:
      return "/";
  }
}
