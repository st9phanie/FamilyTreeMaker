import Family from '@/components/workspace/FamilyTree'; // Ensure Node is exported and imported
import { useCallback, useEffect, useMemo, useState } from 'react';
import SidebarContainer from '@/components/workspace/SidebarContainer';
import { fetchFamilyMembers } from '@/lib/functions';
import { retryFetch, toMemberNode } from '@/lib/helperfunctions';
import { ChevronsLeftIcon, ChevronsRightIcon, Loader2 } from 'lucide-react';
import { useSidebar } from '@/utils/store';

type Props = {
  id?: string;
}

const Workspace = ({ id }: Props) => {
  const [dataFromChild, setDataFromChild] = useState<number>(1);
  const [familyMembers, setFamilyMembers] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPerson, setSelectedPerson] = useState<Person>();
  const { isOpen, toggle } = useSidebar();

  const nodes = useMemo(() => toMemberNode(familyMembers), [familyMembers]);

  const handleDataFromChild = useCallback((data: number) => {
    setDataFromChild(data);
    console.log('Data received from child:', data);
  }, []);

  const refreshMembers = () => {
    loadMembers();
  };

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
      <div className='fixed min-h-max top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <Loader2 className='animate-spin size-10 text-teal-600' />
      </div>
    );
  }

  if (!nodes || nodes.length === 0) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-40px)] mt-[40px] ">
        No family members found.
      </div>
    );
  }

  return (
    <div className='flex flex-row min-h-screen'>
      {selectedPerson && (
        <div className={isOpen ? `hidden md:flex w-[360px]` : "w-0"}>
          <SidebarContainer family={familyMembers} person={selectedPerson!} refresh={refreshMembers} />
        </div>)}



      <main className='grow h-[calc(100vh-40px)] mt-[40px] p-5 overflow-hidden'>
        {/* {isOpen ?
          (<button className=' absolute top-15 z-10 cursor-pointer'
            onClick={toggle}>
            <ChevronsLeftIcon className='text-teal-900 ' />
          </button>)
          : <button className='absolute top-15 z-10 cursor-pointer'
            onClick={toggle}>
            <ChevronsRightIcon className='text-teal-900 ' />
          </button>} */}

        <Family nodes={nodes} onSend={handleDataFromChild} />
      </main>
    </div>
  );
}

export default Workspace;