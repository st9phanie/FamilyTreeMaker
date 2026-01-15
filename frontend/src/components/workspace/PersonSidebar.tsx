import { Button } from '@/components/ui/button';
import { deletePerson } from '@/lib/functions';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

type Props = {
    person: Person;
    name: string | undefined;
    onAddSibling: () => void;
    onEditDetails: () => void;
    onAddChild: () => void;
    onAddParent: () => void;
    onAddPartner: () => void;
    refresh: () => void;
}

const PersonSidebar = ({ person, name, onAddSibling, onEditDetails, refresh, onAddChild, onAddParent, onAddPartner }: Props) => {
    const [loading, setLoading] = useState<boolean>(false)

    const onDelete = async () => {
        try {
            setLoading(true)
            const data = await deletePerson(person.id!)

            console.log(data);
            if (data.status == "success") {
                refresh();
            } else {
                setLoading(false);
            }
        } catch (err) {
            console.error("Failed to update:", err);
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className={`w-[360px] h-[calc(100vh-40px)] border-r border-r-gray-300 px-5 flex flex-col top-[40px] fixed py-10 justify-between`}>

            <div className='flex flex-col gap-y-2 '>
                <img src={person.photo || "/defaultpfp.jpg"} className=' size-24 place-self-center rounded-full border-2 border-gray-200 ' />
                <p className='text-center text-md te xt-teal-900 font-medium mt-5'>{name}</p>
                <p className='text-center text-sm text-gray-400 '>{person.birth} </p>
                <hr className='border-gray-300 my-5' />

                <Button variant="ghost" className='border text-white bg-teal-900 border-teal-900 rounded-none' onClick={onEditDetails}>Edit profile</Button>
                <div className='flex flex-row justify-between gap-x-1'>
                    <Button variant="ghost" className='border flex-1 rounded-none border-teal-900 bg-white text-teal-900'>Contact</Button>
                    <Button variant="ghost" className='border flex-1 rounded-none border-teal-900 bg-white text-teal-900'>Notes</Button>
                </div>
            </div>

            {/* <hr className='border-gray-300 ' /> */}

            <div className=''>
                <p className='text-start text-sm text-teal-900 mb-5'>Add relatives:</p>
                <div className=' gap-y-2 grid grid-cols-2 gap-x-1 '>
                    <Button variant="ghost" className='border rounded-none border-teal-900  bg-white text-teal-900' onClick={onAddParent}>Parent</Button>
                    <Button variant="ghost" className='border rounded-none border-teal-900 bg-white text-teal-900' onClick={onAddPartner}>Partner</Button>
                    <Button variant="ghost" className='border rounded-none border-teal-900 bg-white text-teal-900' onClick={onAddSibling}>Sibling</Button>
                    <Button variant="ghost" className='border rounded-none border-teal-900 bg-white text-teal-900' onClick={onAddChild}>Child</Button>
                </div>
            </div>

            <div className='flex flex-col justify-center'>
                <hr className='border-gray-300 mb-2' />
                <Button variant="link" disabled={loading} className=' rounded-none text-red-700  cursor-pointer transition duration-400' onClick={onDelete}>
                    <Trash2 className='' />
                    Delete Person
                </Button>
            </div>

        </div>
    )
}

export default PersonSidebar 