// Home.tsx
import Family from '@/components/workspace/FamilyTree'; // Ensure Node is exported and imported
import { useEffect, useState } from 'react';
import SidebarContainer from '@/components/workspace/SidebarContainer';
import { fetchFamilyMembers } from '@/lib/functions';
import { toMemberNode } from '@/lib/helperfunctions';
import { ChevronsLeftIcon, ChevronsRightIcon, Loader2 } from 'lucide-react';
import { useSidebar } from '@/utils/store';

type Props = {
  id?: number;
}

const Workspace = ({ id }: Props) => {
  const [dataFromChild, setDataFromChild] = useState<number>(1);
  const [familyMembers, setFamilyMembers] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPerson, setSelectedPerson] = useState<Person>();
  const { isOpen, toggle } = useSidebar()

  const handleDataFromChild = (data: number) => {
    setDataFromChild(data);
    console.log('Data received from child:', data);
  };

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
      const data = await fetchFamilyMembers(id);
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
  }, [id]); // Dependency array: loadMembers runs whenever 'id' changes

  useEffect(() => {
    if (familyMembers.length > 0) {
      const person = familyMembers.find(m => m.id === dataFromChild);
      setSelectedPerson(person || familyMembers[0]);
    }
  }, [familyMembers, dataFromChild]);

  // Show a loading state while fetching
  if (loading) {
    return (
      <div className='flex justify-center items-center h-[calc(100vh-60px)] mt-[60px]'>
        <Loader2 className='animate-spin size-10 text-teal-600' />
      </div>
    );
  }


  return (
    <div className='flex flex-row min-h-screen'>

      {/* Sidebar container with fixed width (e.g., w-[360px]) and set height */}
      {selectedPerson && (
        <div className={isOpen ? `hidden md:flex w-[360px]` : "w-0"}>
          <SidebarContainer person={selectedPerson!} refresh={refreshMembers} />
        </div>)}

      <main className='grow h-[calc(100vh-60px)] mt-[60px] p-5 overflow-hidden'>
        {isOpen ?
          (<button className=' absolute top-20 z-10 cursor-pointer'
            onClick={toggle}>
            <ChevronsLeftIcon className='text-teal-900 ' />
          </button>)
          : <button className='absolute top-20 z-10 cursor-pointer'
            onClick={toggle}>
            <ChevronsRightIcon className='text-teal-900 ' />
          </button>}

        <Family nodes={toMemberNode(familyMembers)} onSend={handleDataFromChild} />
      </main>
    </div>
  );
}

export default Workspace;