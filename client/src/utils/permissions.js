export const permissions = {
  Admin: {
    canViewMembers: true,
    canCreateMember: true,
    canUpdateMember: true,
    canDeleteMember: true,

    canViewAttendance: true,
    canCreateAttendance: true,
    canUpdateAttendance: true,

    canAccessSettings: true,
  },

  Supervisor: {
    canViewMembers: true,
    canCreateMember: true,
    canUpdateMember: true,
    canDeleteMember: false,

    canViewAttendance: true,
    canCreateAttendance: true,
    canUpdateAttendance: true,

    canAccessSettings: false,
  },

  User: {
    canViewMembers: true,
    canCreateMember: false,
    canUpdateMember: false,
    canDeleteMember: false,

    canViewAttendance: false,
    canCreateAttendance: false,
    canUpdateAttendance: false,

    canAccessSettings: false,
  },
  
};

export const hasPermission = (role, action) => {
  if (!role || !permissions[role]) return false;

  return Boolean(permissions[role][action]);
};