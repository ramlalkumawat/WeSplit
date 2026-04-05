const AppError = require('../utils/appError')
const asyncHandler = require('../utils/asyncHandler')
const { logSecurityEvent } = require('../utils/securityLogger')
const { getGroupByIdForUser } = require('../services/groupService')

const resolveGroupRole = (group, userId) => {
  if (group.createdBy._id.toString() === userId) {
    return 'admin'
  }

  const membership = group.members.find((member) => member.user._id.toString() === userId)
  return membership?.role || null
}

const authorizeGroupMember = asyncHandler(async (req, res, next) => {
  const group = await getGroupByIdForUser(req.params.groupId, req.user.id)
  const role = resolveGroupRole(group, req.user.id)

  if (!role) {
    throw new AppError('You are not allowed to access this group', 403)
  }

  req.groupAccess = {
    groupId: group._id.toString(),
    role,
  }
  req.group = group

  next()
})

const authorizeGroupAdmin = (req, res, next) => {
  if (req.groupAccess?.role !== 'admin') {
    logSecurityEvent({
      event: 'group_admin_access_denied',
      req,
      details: {
        groupId: req.params.groupId,
        role: req.groupAccess?.role || null,
      },
    })

    throw new AppError('Only group admins can manage this action', 403)
  }

  next()
}

module.exports = {
  authorizeGroupAdmin,
  authorizeGroupMember,
}
