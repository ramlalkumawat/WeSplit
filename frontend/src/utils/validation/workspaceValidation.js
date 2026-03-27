const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const parseMemberEmails = (value) =>
  value
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)

export const validateGroupForm = ({ description, memberEmails, name }) => {
  const errors = {}
  const normalizedName = name.trim()
  const normalizedDescription = description.trim()
  const parsedMemberEmails = parseMemberEmails(memberEmails)

  if (!normalizedName) {
    errors.name = 'Group name is required.'
  } else if (normalizedName.length < 2) {
    errors.name = 'Group name must be at least 2 characters.'
  } else if (normalizedName.length > 60) {
    errors.name = 'Group name cannot exceed 60 characters.'
  }

  if (normalizedDescription.length > 220) {
    errors.description = 'Description cannot exceed 220 characters.'
  }

  if (parsedMemberEmails.length > 20) {
    errors.memberEmails = 'You can invite up to 20 members at a time.'
  } else if (parsedMemberEmails.some((email) => !emailPattern.test(email))) {
    errors.memberEmails = 'Enter valid email addresses separated by commas.'
  }

  return {
    errors,
    memberEmails: parsedMemberEmails,
  }
}

export const validateMemberEmail = (value) => {
  const normalizedEmail = value.trim().toLowerCase()

  if (!normalizedEmail) {
    return 'Member email is required.'
  }

  if (!emailPattern.test(normalizedEmail)) {
    return 'Please enter a valid email address.'
  }

  return ''
}

export const normalizeMemberEmail = (value) => value.trim().toLowerCase()
