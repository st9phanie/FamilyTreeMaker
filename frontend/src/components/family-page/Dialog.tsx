import { X } from 'lucide-react'
import { Button } from '../ui/button';

type Props = {
  ref: any;
  setOpen: () => void;
}

const Dialog = ({ ref, setOpen }: Props) => {
  return (
    <div className='flex fixed w-full h-full bg-black/40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center '>

      <div ref={ref} className="flex flex-col gap-4 w-100  bg-teal-950 p-5">
        <div className='flex flex-row justify-between items-center'>
          <p className='font-medium'>Change Name</p>
          <X onClick={setOpen} className='cursor-pointer' />
        </div>

        <input placeholder='Enter a new name' className='text-teal-950 mt-3 bg-white rounded-none p-2' />
        <Button variant="secondary">Save Changes</Button>
      </div>
    </div>
  )
}

export default Dialog