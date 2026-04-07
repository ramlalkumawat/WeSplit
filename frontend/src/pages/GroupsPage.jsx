import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ExpenseComposer from '../components/dashboard/ExpenseComposer'
import GroupSidebar from '../components/dashboard/GroupSidebar'
import GroupWorkspace from '../components/dashboard/GroupWorkspace'
import OverviewCards from '../components/dashboard/OverviewCards'
import SettlementComposer from '../components/dashboard/SettlementComposer'
import PageMeta from '../components/seo/PageMeta'
import Button from '../components/ui/Button'
import Panel from '../components/ui/Panel'
import { getButtonClasses } from '../components/ui/buttonStyles'
import { useAuth } from '../hooks/useAuth'
import { useDashboardData } from '../hooks/useDashboardData'
import {
  buildGroupWhatsAppShareText,
  buildSettlementReminderText,
  shareMessageOnWhatsApp,
} from '../utils/whatsappShare'
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
    recordSettlement,
    removeMember,
    setFeedback,
    selectedGroupDetail,
    selectedGroupId,
    setSelectedGroupId,
  } = useDashboardData()
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    currency: 'INR',
    memberEmails: '',
  })
  const [groupErrors, setGroupErrors] = useState({})
  const [memberEmail, setMemberEmail] = useState('')
  const [memberError, setMemberError] = useState('')
  const [isExpenseComposerOpen, setIsExpenseComposerOpen] = useState(false)
  const [isSettlementComposerOpen, setIsSettlementComposerOpen] = useState(false)
  const [selectedSettlementId, setSelectedSettlementId] = useState('')

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
        currency: validation.currency,
        memberEmails: validation.memberEmails,
        name: groupForm.name.trim(),
      })

      setGroupErrors({})
      setGroupForm({
        name: '',
        description: '',
        currency: 'INR',
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

  const handleOpenSettlementComposer = (settlementId) => {
    setSelectedSettlementId(settlementId || selectedGroupDetail?.settlements?.[0]?.id || '')
    setIsSettlementComposerOpen(true)
  }

  const handleShareResult = async (message, successMessage) => {
    try {
      const result = await shareMessageOnWhatsApp(message)

      setFeedback({
        type: 'success',
        message:
          result.status === 'copied'
            ? 'WhatsApp popup was blocked, so the message was copied for you to paste manually.'
            : successMessage,
      })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message,
      })
    }
  }

  const handleShareGroupSummary = async () => {
    await handleShareResult(
      buildGroupWhatsAppShareText(selectedGroupDetail),
      'WhatsApp share opened with the latest split summary and group link.',
    )
  }

  const handleShareSettlementReminder = async (settlementId) => {
    const settlement = selectedGroupDetail?.settlements?.find((item) => item.id === settlementId)

    if (!settlement) {
      setFeedback({
        type: 'error',
        message: 'That settlement reminder is no longer available. Refresh and try again.',
      })
      return
    }

    await handleShareResult(
      buildSettlementReminderText({
        detail: selectedGroupDetail,
        settlement,
      }),
      'WhatsApp reminder opened with the split amount and group link.',
    )
  }

  return (
    <div className="space-y-8">
      <PageMeta
        description="Manage shared groups, add expenses, review balances, and record settlements inside the Wesplit workspace."
        title="Groups Workspace | Wesplit"
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(18rem,22rem)]">
        <Panel className="p-7 md:p-8">
          <p className="section-badge">Groups Workspace</p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Run every group from one focused shared-finance workspace.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Create groups, invite members, review analytics, add expenses, and record
            completed settlements without leaving the protected product flow.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              className={getButtonClasses({
                variant: 'secondary',
                className: 'w-full sm:w-auto',
              })}
              to="/dashboard"
            >
              Back to Dashboard
            </Link>
            {selectedGroupDetail?.group ? (
              <Button
                className="relative z-10 w-full sm:w-auto"
                onClick={() => setIsExpenseComposerOpen(true)}
              >
                Add Expense
              </Button>
            ) : null}
            {selectedGroupDetail?.group ? (
              <Button
                className="w-full sm:w-auto"
                disabled={!selectedGroupDetail?.settlements?.length}
                onClick={() => handleOpenSettlementComposer('')}
                variant="secondary"
              >
                Record Settlement
              </Button>
            ) : null}
          </div>
        </Panel>

        <Panel className="p-6">
          <p className="eyebrow">Workspace notes</p>
          <div className="mt-5 space-y-4">
            {[
              'Group balances now reflect both expenses and recorded settlements.',
              'Category-aware analytics explain where shared spend is coming from.',
              'Create, invite, expense, and settlement flows all share loading and validation states.',
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

      <main className="grid gap-6 xl:grid-cols-[minmax(18rem,22rem)_minmax(0,1fr)] xl:items-start">
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
          onOpenSettlementComposer={handleOpenSettlementComposer}
          onRemoveMember={handleRemoveMember}
          onShareGroupSummary={handleShareGroupSummary}
          onShareSettlementReminder={handleShareSettlementReminder}
          onSubmitMember={handleAddMember}
        />
      </main>

      <ExpenseComposer
        key={`${selectedGroupDetail?.group?.id || 'group'}-${isExpenseComposerOpen ? 'open' : 'closed'}`}
        currentUserId={user?.id}
        currency={selectedGroupDetail?.group?.currency || 'INR'}
        isOpen={isExpenseComposerOpen}
        isSubmitting={isMutating}
        members={selectedGroupDetail?.group?.members || []}
        onClose={() => setIsExpenseComposerOpen(false)}
        onSubmit={addExpense}
      />

      <SettlementComposer
        key={`${selectedGroupDetail?.group?.id || 'group'}-${selectedSettlementId || 'default'}-${
          isSettlementComposerOpen ? 'open' : 'closed'
        }`}
        currency={selectedGroupDetail?.group?.currency || 'INR'}
        initialSuggestionId={selectedSettlementId}
        isOpen={isSettlementComposerOpen}
        isSubmitting={isMutating}
        onClose={() => setIsSettlementComposerOpen(false)}
        onSubmit={recordSettlement}
        suggestions={selectedGroupDetail?.settlements || []}
      />
    </div>
  )
}
