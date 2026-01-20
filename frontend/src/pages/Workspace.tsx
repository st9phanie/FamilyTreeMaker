import Family from '@/components/workspace/FamilyTree'; 
import {  useEffect, useMemo, useState } from 'react';
import SidebarContainer from '@/components/workspace/SidebarContainer';
import { fetchFamilyMembers } from '@/lib/functions';
import { retryFetch, toMemberNode } from '@/lib/helperfunctions';
import { Loader2 } from 'lucide-react';
import { useSidebar, useWorkspaceStore } from '@/utils/store';

type Props = {
  id?: string;
}

const Workspace = ({ id }: Props) => {
  const {
    familyMembers,
    refresh,
    loading,
    selectPersonById
  } = useWorkspaceStore();

  const { isOpen } = useSidebar();

  const nodes = useMemo(() => toMemberNode(familyMembers), [familyMembers]);

  useEffect(() => {
    if(id)
    refresh(id);
  }, [id,refresh]);

  if (loading) {
    return (
      <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <Loader2 className='animate-spin size-10 text-teal-600' />
      </div>
    );
  }

  return (
    <div className="flex flex-row min-h-screen">
      <div className={isOpen ? `hidden md:flex w-[360px]` : "w-0"}>
        <SidebarContainer />
      </div>

      {!nodes || nodes.length === 0 ? (
        <main className="flex grow justify-center items-center h-[calc(100vh-40px)] mt-[40px]">
          No family members found.
        </main>
      ) : (
        <main className='grow h-[calc(100vh-40px)] mt-[40px] p-5 overflow-hidden'>
          <Family nodes={nodes} onSend={(memberId) => selectPersonById(memberId)} />
        </main>
      )}
    </div>
  );
}

export default Workspace;