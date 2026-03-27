import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ExpenseComposer from '../components/dashboard/ExpenseComposer'
import GroupSidebar from '../components/dashboard/GroupSidebar'
import GroupWorkspace from '../components/dashboard/GroupWorkspace'
import OverviewCards from '../components/dashboard/OverviewCards'
import Button from '../components/ui/Button'
import Panel from '../components/ui/Panel'
import { getButtonClasses } from '../components/ui/buttonStyles'
import { useAuth } from '../hooks/useAuth'
import { useDashboardData } from '../hooks/useDashboardData'
import {
  normalizeMemberEmail,
  validateGroupForm,
  validateMemberEmail,
} from '../utils/validation/workspaceValidation'

export default function GroupsPage() {
  const navigate = useNavigate()
  const { groupId } = useParams()
  const { user } = useAuth()
  const {
    addExpense,
    addMember,
    createGroup,
    groups,
    isLoadingGroupDetail,
    isLoadingGroups,
    isMutating,
    overview,
    removeMember,
    selectedGroupDetail,
    selectedGroupId,
    setSelectedGroupId,
  } = useDashboardData()
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    memberEmails: '',
  })
  const [groupErrors, setGroupErrors] = useState({})
  const [memberEmail, setMemberEmail] = useState('')
  const [memberError, setMemberError] = useState('')
  const [isExpenseComposerOpen, setIsExpenseComposerOpen] = useState(false)

  useEffect(() => {
    if (groupId && groupId !== selectedGroupId) {
      setSelectedGroupId(groupId)
    }
  }, [groupId, selectedGroupId, setSelectedGroupId])

  useEffect(() => {
    if (!groupId && selectedGroupId) {
      navigate(`/groups/${selectedGroupId}`, { replace: true })
    }
  }, [groupId, navigate, selectedGroupId])

  useEffect(() => {
    if (!groupId || !groups.length) {
      return
    }

    const groupExists = groups.some((group) => group.id === groupId)

    if (!groupExists && selectedGroupId) {
      navigate(`/groups/${selectedGroupId}`, { replace: true })
    }
  }, [groupId, groups, navigate, selectedGroupId])

  const handleGroupFormChange = (event) => {
    const { name, value } = event.target

    setGroupErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }))
    setGroupForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const handleCreateGroup = async (event) => {
    event.preventDefault()

    const validation = validateGroupForm(groupForm)

    if (Object.keys(validation.errors).length > 0) {
      setGroupErrors(validation.errors)
      return
    }

    try {
      const data = await createGroup({
        description: groupForm.description.trim(),
        memberEmails: validation.memberEmails,
        name: groupForm.name.trim(),
      })

      setGroupErrors({})
      setGroupForm({
        name: '',
        description: '',
        memberEmails: '',
      })
      navigate(`/groups/${data.group.id}`)
    } catch {
      // Feedback is handled globally in the shared dashboard data context.
    }
  }

  const handleMemberChange = (event) => {
    setMemberError('')
    setMemberEmail(event.target.value)
  }

  const handleAddMember = async (event) => {
    event.preventDefault()

    const validationError = validateMemberEmail(memberEmail)

    if (validationError) {
      setMemberError(validationError)
      return
    }

    try {
      await addMember(normalizeMemberEmail(memberEmail))
      setMemberEmail('')
      setMemberError('')
    } catch {
      // Feedback is handled globally in the shared dashboard data context.
    }
  }

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Remove this member from the group?')) {
      return
    }

    try {
      await removeMember(memberId)
    } catch {
      // Feedback is handled globally in the shared dashboard data context.
    }
  }

  const openSelectedGroup = (nextGroupId) => {
    navigate(`/groups/${nextGroupId}`)
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_360px]">
        <Panel className="p-7 md:p-8">
          <p className="section-badge">Groups Workspace</p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Manage every group from one focused operating view.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Create groups, invite members, review live balances, and add fresh expenses
            without leaving the protected product workspace.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link className={getButtonClasses({ variant: 'secondary' })} to="/dashboard">
              Back to Dashboard
            </Link>
            {selectedGroupDetail?.group ? (
              <Button onClick={() => setIsExpenseComposerOpen(true)}>Add Expense</Button>
            ) : null}
          </div>
        </Panel>

        <Panel className="p-6">
          <p className="eyebrow">Workspace notes</p>
          <div className="mt-5 space-y-4">
            {[
              'Route-protected pages stay behind JWT authentication.',
              'Group detail selection works cleanly across desktop and mobile.',
              'Create, invite, and expense actions now have clearer validation states.',
            ].map((note) => (
              <div
                key={note}
                className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600"
              >
                {note}
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <OverviewCards overview={overview} />

      <main className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <GroupSidebar
          errors={groupErrors}
          form={groupForm}
          groups={groups}
          isLoading={isLoadingGroups}
          isMutating={isMutating}
          onChange={handleGroupFormChange}
          onSelectGroup={openSelectedGroup}
          onSubmit={handleCreateGroup}
          selectedGroupId={selectedGroupId}
        />

        <GroupWorkspace
          currentUserId={user?.id}
          detail={selectedGroupDetail}
          isLoading={isLoadingGroupDetail}
          isMutating={isMutating}
          memberEmail={memberEmail}
          memberError={memberError}
          onMemberEmailChange={handleMemberChange}
          onOpenExpenseComposer={() => setIsExpenseComposerOpen(true)}
          onRemoveMember={handleRemoveMember}
          onSubmitMember={handleAddMember}
        />
      </main>

      <ExpenseComposer
        key={`${selectedGroupDetail?.group?.id || 'group'}-${isExpenseComposerOpen ? 'open' : 'closed'}`}
        currentUserId={user?.id}
        isOpen={isExpenseComposerOpen}
        isSubmitting={isMutating}
        members={selectedGroupDetail?.group?.members || []}
        onClose={() => setIsExpenseComposerOpen(false)}
        onSubmit={addExpense}
      />
    </div>
  )
}
