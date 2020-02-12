
export const RoleMap={
    Administrator : '管理员',
    Customer : '客户',
    Collaborator : '合作者'
}


export const EnumRoleType = {
    ADMIN: 'Administrator',
    DEFAULT: 'Customer',
    COLLABORATOR: 'Collaborator'
}

export const userPermission = {
    DEFAULT: {
        visit: ['1', '2', '21', '7', '5', '51', '52', '53'],
        role: EnumRoleType.DEFAULT,
    },
    ADMIN: {
        role: EnumRoleType.ADMIN,
    },
    COLLABORATOR: {
        role: EnumRoleType.COLLABORATOR,
    },
}