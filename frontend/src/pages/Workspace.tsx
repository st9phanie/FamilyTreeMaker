import Family from '@/components/workspace/FamilyTree'; // Ensure Node is exported and imported
import { useCallback, useEffect, useMemo, useState } from 'react';
import SidebarContainer from '@/components/workspace/SidebarContainer';
import { fetchFamilyMembers } from '@/lib/functions';
import { retryFetch, toMemberNode } from '@/lib/helperfunctions';
import { Loader2 } from 'lucide-react';
import { useSidebar } from '@/utils/store';

type Props = {
  id?: string;
}

const Workspace = ({ id }: Props) => {
  const [dataFromChild, setDataFromChild] = useState<number>(1);
  const [familyMembers, setFamilyMembers] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPerson, setSelectedPerson] = useState<Person>();
  const { isOpen } = useSidebar();

  const nodes = useMemo(() => toMemberNode(familyMembers), [familyMembers]);

  const handleDataFromChild = useCallback((data: number) => {
    setDataFromChild(data);
    console.log('Data received from child:', data);
  }, []);

  const loadMembers = async () => {
    if (!id) {
      setFamilyMembers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await retryFetch(() => fetchFamilyMembers(id), 3, 800);
      setFamilyMembers(data);
    } catch (err) {
      console.error("Failed to load family members:", err);
      setFamilyMembers([]);
    } finally {
      setLoading(false);
    }
  };


  const refreshMembers = (shouldDeselect = false) => {
    if (shouldDeselect) {
      setDataFromChild(0);
      setSelectedPerson(undefined);
    }
    loadMembers();
  };

  // 2. Adjust the selection effect to be more defensive
  useEffect(() => {
    if (familyMembers.length > 0) {
      const person = familyMembers.find(m => m.id === dataFromChild);
      setSelectedPerson(person);
    } else {
      setSelectedPerson(undefined);
    }
  }, [familyMembers, dataFromChild]);

  // EFFECT 1: Load members when 'id' changes
  useEffect(() => {
    loadMembers();
  }, [id]);

  useEffect(() => {
    if (familyMembers.length > 0) {
      const person = familyMembers.find(m => m.id === dataFromChild);
      setSelectedPerson(person || familyMembers[0]);
    }
  }, [familyMembers, dataFromChild]);

  // Show a loading state while fetching
  if (loading) {
    return (
      <div className='min-h-max top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <Loader2 className='animate-spin size-10 text-teal-600' />
      </div>
    );
  }


  return (
    <div className="flex flex-row min-h-screen">
      <div className={isOpen ? `hidden md:flex w-[360px]` : "w-0"}>
        {/* pass person as optional */}
        <SidebarContainer
          family={familyMembers}
          person={selectedPerson}
          refresh={() => refreshMembers(true)} // Pass true to deselect on delete
        />
      </div>

      {!nodes || nodes.length === 0 ? (
        <main className="flex grow justify-center items-center h-[calc(100vh-40px)] mt-[40px]">
          No family members found.
        </main>
      ) : (
        <main className='grow h-[calc(100vh-40px)] mt-[40px] p-5 overflow-hidden'>
          <Family nodes={nodes} onSend={handleDataFromChild} />
        </main>
      )}
    </div>
  );
}

export default Workspace;