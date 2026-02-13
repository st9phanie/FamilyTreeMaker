import { useUserState } from '@/utils/store'
import TabLayout from './TabLayout'
import { Loader2, TriangleAlert } from 'lucide-react'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'


const SecurityTab = () => {

  const { user, loading, clearUser } = useUserState();

  const navigate = useNavigate();

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    clearUser();
    console.log(error);
    navigate("/login");
  }

  const handlePasswordReset = async () => {
    if (!user?.email) return;

    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/FamilyTreeMaker/profile`,
    });

    if (error) alert(error.message);
    else alert("Check your email for the reset link!");
  };



  if (loading) return <TabLayout><Loader2 className='animate-spin size-10' /></TabLayout>;
  if (!user) return <TabLayout>No user found. Please log in.</TabLayout>;

  return (
    <TabLayout>
      <div className='flex flex-col w-full h-full  items-center '>
        <h1 className='text-2xl text-start w-[600px] mb-5'>Security & Sign In Info</h1>

        <div className='flex flex-col justify-center py-5 lg:w-[600px] gap-y-5 my-5'>
          <div className='flex flex-row w-full justify-between items-center'>

            <span className='font-semibold'>Password</span>

            <Button className='w-1/3' variant="outline" onClick={handlePasswordReset}>Change password</Button>

          </div>

          <div className='flex flex-row w-full justify-between items-center'>
            <span className='font-semibold'>Log out</span>
            <Button className='w-1/3' variant="outline" onClick={signOut}>Log out</Button>
          </div>

          <p className='text-red-600 text-xl font-semibold mt-5'>Delete account</p>
          <hr />
          <p className='text-sm text-primary/50 flex items-center'><TriangleAlert className='size-5 mr-3' /> Once you delete your account, there is no going back. Please be certain.</p>
          <Button className='bg-red-700 text-white hover:bg-red-600 w-1/3' >Delete Account</Button>
        </div>
      </div>
    </TabLayout>
  )
}

export default SecurityTab