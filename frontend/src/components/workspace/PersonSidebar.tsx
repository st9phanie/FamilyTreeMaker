import { Button } from '@/components/ui/button';
import { deletePerson } from '@/lib/functions';
import { Home, Mail, Pen, Sidebar, Text } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const PersonSidebar = ({ person, name, onAddSibling, onEditDetails, refresh, onAddChild,onAddParent,onAddPartner }: Props) => {

    const onDelete = async () => {
        const data = await deletePerson(person.id!)
        console.log(data);
        if (data.status == "success") refresh();
    }

    return (
        <div className='w-[360px] h-[calc(100vh-60px)]
 border-r-2 border-r-emerald-900 px-5 flex flex-col gap-y-5 top-[60px] fixed bg-emerald-100/20 overflow-y-scroll py-5'>
            <div className='flex flex-row justify-between gap-x-2 items-center'>
                <Link to="/home"><Home className='text-emerald-900'/></Link>
                <p className='text-center text-md text-emerald-900'>{name}</p>
                <Sidebar className='text-emerald-900' />

            </div>
            <img src={person.photo || "/defaultpfp.jpg"} className='size-30 place-self-center' />
            <div className='flex flex-col gap-y-2'>
                <Button className='border border-b-3 border-slate-900' onClick={onEditDetails}><Pen />Personal details</Button>
                <Button className='border border-b-3 border-slate-900'><Mail />Contact information</Button>
                <Button className='border border-b-3 border-slate-900'><Text /> Biography</Button>
            </div>

            <hr className='border-slate-600 ' />
                            <p className='text-center text-md'>Add relatives:</p>

            <div className=' gap-y-2 grid grid-cols-2 gap-x-2'>
                <Button className='border border-b-3 border-slate-900' onClick={onAddParent}>Parent</Button>
                <Button className='border border-b-3 border-slate-900' onClick={onAddPartner}>Partner</Button>
                <Button className='border border-b-3 border-slate-900' onClick={onAddSibling}>Sibling</Button>
                <Button className='border border-b-3 border-slate-900' onClick={onAddChild}>Child</Button>
            </div>

            <hr className='border-slate-300 ' />
            <Button variant="destructive" className='border border-b-3 border-amber-950' onClick={onDelete}>Delete Person</Button>
        </div>
    )
}

export default PersonSidebar 