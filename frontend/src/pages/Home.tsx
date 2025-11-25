// Home.tsx
import Family from '@/components/workspace/FamilyTree'; // Ensure Node is exported and imported
import { useEffect, useState } from 'react';
import SidebarContainer from '@/components/workspace/SidebarContainer';
import { fetchFamilyMembers } from '@/lib/functions';
import { toMemberNode } from '@/lib/helperfunctions';
import { Loader2 } from 'lucide-react';

type Props = {
  id?: number;
}

const Home = ({ id=1 }: Props) => {
  const [dataFromChild, setDataFromChild] = useState<number>(1);
  const [familyMembers, setFamilyMembers] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleDataFromChild = (data: number) => {
    setDataFromChild(data);
    console.log('Data received from child:', data);
  };

  const refreshMembers = () => {
  loadMembers(); // reload from backend
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

  // Show a loading state while fetching
  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader2 className='animate-spin size-10 text-emerald-600' />
      </div>
    );
  } 


  return (
    <div className='flex flex-row min-h-screen'>

      {/* Sidebar container with fixed width (e.g., w-[360px]) and set height */}
      <div className='hidden md:flex w-[360px]'>
        <SidebarContainer person={familyMembers.find((node) => node.id === dataFromChild)} refresh={refreshMembers} />
      </div>

      {/* Main content area takes up remaining space and scrolls */}
      <main className='grow h-[calc(100vh-60px)] mt-[60px] p-5 overflow-hidden'>
        <Family nodes={toMemberNode(familyMembers)} onSend={handleDataFromChild} />
      </main>
    </div>
  );
}

export default Home;