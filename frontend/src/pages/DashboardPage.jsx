import { useState } from 'react'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import ExpenseComposer from '../components/dashboard/ExpenseComposer'
import GroupSidebar from '../components/dashboard/GroupSidebar'
import GroupWorkspace from '../components/dashboard/GroupWorkspace'
import OverviewCards from '../components/dashboard/OverviewCards'
import Button from '../components/ui/Button'
import StatusBanner from '../components/ui/StatusBanner'
import { useAuth } from '../hooks/useAuth'
import { useDashboardData } from '../hooks/useDashboardData'

export default function DashboardPage() {
  const { logout, user } = useAuth()
  const {
    addExpense,
    addMember,
    createGroup,
    feedback,
    groups,
    isLoadingGroupDetail,
    isMutating,
    overview,
    removeMember,
    selectedGroupDetail,
    selectedGroupId,
    setFeedback,
    setSelectedGroupId,
  } = useDashboardData()
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    memberEmails: '',
  })
  const [memberEmail, setMemberEmail] = useState('')
  const [isExpenseComposerOpen, setIsExpenseComposerOpen] = useState(false)

  const handleGroupFormChange = (event) => {
    const { name, value } = event.target
    setGroupForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const handleCreateGroup = async (event) => {
    event.preventDefault()

    try {
      await createGroup({
        name: groupForm.name,
        description: groupForm.description,
        memberEmails: groupForm.memberEmails
          .split(',')
          .map((email) => email.trim())
          .filter(Boolean),
      })
      setGroupForm({
        name: '',
        description: '',
        memberEmails: '',
      })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message,
      })
    }
  }

  const handleAddMember = async (event) => {
    event.preventDefault()

    if (!memberEmail.trim()) {
      return
    }

    try {
      await addMember(memberEmail.trim())
      setMemberEmail('')
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message,
      })
    }
  }

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Remove this member from the group?')) {
      return
    }

    try {
      await removeMember(memberId)
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message,
      })
    }
  }

  const handleAddExpense = async (payload) => {
    try {
      await addExpense(payload)
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message,
      })
      throw error
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-8rem] top-[6rem] h-72 w-72 rounded-full bg-primary/18 blur-3xl" />
        <div className="absolute right-[-6rem] top-[-2rem] h-80 w-80 rounded-full bg-violet-400/24 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-[35%] h-80 w-80 rounded-full bg-cyan-300/18 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <DashboardHeader user={user} onLogout={logout} />

        <StatusBanner tone={feedback?.type || 'info'} message={feedback?.message} />

        <div className="mt-6">
          <OverviewCards overview={overview} />
        </div>

        <main className="mt-6 grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <GroupSidebar
            form={groupForm}
            groups={groups}
            isMutating={isMutating}
            onChange={handleGroupFormChange}
            onSelectGroup={setSelectedGroupId}
            onSubmit={handleCreateGroup}
            selectedGroupId={selectedGroupId}
          />

          <GroupWorkspace
            currentUserId={user?.id}
            detail={selectedGroupDetail}
            isLoading={isLoadingGroupDetail}
            isMutating={isMutating}
            memberEmail={memberEmail}
            onMemberEmailChange={(event) => setMemberEmail(event.target.value)}
            onOpenExpenseComposer={() => setIsExpenseComposerOpen(true)}
            onRemoveMember={handleRemoveMember}
            onSubmitMember={handleAddMember}
          />
        </main>
      </div>

      {selectedGroupDetail?.group ? (
        <div className="fixed bottom-6 right-6 z-20">
          <Button onClick={() => setIsExpenseComposerOpen(true)}>Add Expense</Button>
        </div>
      ) : null}

      <ExpenseComposer
        key={`${selectedGroupDetail?.group?.id || 'group'}-${isExpenseComposerOpen ? 'open' : 'closed'}`}
        currentUserId={user?.id}
        isOpen={isExpenseComposerOpen}
        isSubmitting={isMutating}
        members={selectedGroupDetail?.group?.members || []}
        onClose={() => setIsExpenseComposerOpen(false)}
        onSubmit={handleAddExpense}
      />
    </div>
  )
}
