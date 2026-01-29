import { Button } from '@/components/ui/button';
import { deletePerson } from '@/lib/functions';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import SidebarLayout from './SidebarLayout';
import { useTheme, useWorkspaceStore } from '@/utils/store';

type Props = {
    name: string | undefined;
    onAddSibling: () => void;
    onEditDetails: () => void;
    onAddChild: () => void;
    onAddParent: () => void;
    onAddPartner: () => void;
}

const PersonSidebar = ({ name, onAddSibling, onEditDetails, onAddChild, onAddParent, onAddPartner }: Props) => {
    const [loading, setLoading] = useState<boolean>(false)
    const { selectedPerson, refresh } = useWorkspaceStore()

    const {isDarkMode} = useTheme()

    if (!selectedPerson) return

    const onDelete = async () => {
        try {
            setLoading(true)
            const data = await deletePerson(selectedPerson.id!)

            if (data.status == "success") {
                refresh(selectedPerson.family_id!);
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
        <SidebarLayout>

            <div className='flex flex-col gap-y-2 '>
                <img src={selectedPerson.photo || "/blackdefaultpfp.jpg"} className=' size-24 place-self-center rounded-full border-2 border-sidebar-border ' />
                <p className='text-center text-md text-primary font-medium mt-5'>{name}</p>
                <p className='text-center text-sm text-text-primary-foreground '>{selectedPerson.birth} </p>
                <div className='border-sidebar-border border-t h-1 w-full my-5 rounded-t-full' />

                <Button variant="secondary" className='' onClick={onEditDetails}>Edit profile</Button>
                <div className='flex flex-row justify-between gap-x-1'>
                    <Button variant="secondary" className='flex-1 '>Contact</Button>
                    <Button variant="secondary" className='flex-1 '>Notes</Button>
                </div>
            </div>

            <div className=''>
                <p className='text-start text-sm text-primary mb-5'>Add relatives:</p>
                <div className=' gap-y-2 grid grid-cols-2 gap-x-1 '>
                    <Button variant="secondary" className='' onClick={onAddParent}>Parent</Button>
                    <Button variant="secondary" className='' onClick={onAddPartner}>Partner</Button>
                    <Button variant="secondary" className='' onClick={onAddSibling}>Sibling</Button>
                    <Button variant="secondary" className='' onClick={onAddChild}>Child</Button>
                </div>
            </div>

            <div className='flex flex-col justify-center'>
                <div className='border-sidebar-border border-t h-1 w-full rounded-t-full' />
                <Button variant="link" disabled={loading} className=' text-red-700 dark:text-rose-700  cursor-pointer transition duration-400' onClick={onDelete}>
                    <Trash2 className='' />
                    Delete Person
                </Button>
            </div>

        </SidebarLayout>
    )
}

export default PersonSidebar 