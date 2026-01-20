import { useState } from 'react';
import { addChild } from '@/lib/functions';
import Combobox from '../ui/combobox';
import PersonForm from './PersonForm';
import { useWorkspaceStore } from '@/utils/store';

type Props = {
    name: string | undefined;
    onBack: () => void;

}

const AddChild = ({ name, onBack }: Props) => {
    const [parent, setParent] = useState<number | null>(null)

        const {
            familyMembers,
            refresh,
            selectedPerson
        } = useWorkspaceStore();

    if (!selectedPerson) return;

    const handleSave = async (formData: Partial<Person>) => {
        const res = await addChild(selectedPerson.id!, { ...formData, family_id: selectedPerson.family_id, pid1: selectedPerson.id, pid2: parent })

        if (res?.status === "success") refresh(selectedPerson.family_id!);

    };

    const family = familyMembers
        .slice()
        .sort((a, b) => a.id! - b.id!)
        .map(f => ({
            id: f.id!,
            label: `${f.firstname!} ${f.middlename!} ${f.lastname!} (${f.birth || "?"})`
        }));

    return (
        <PersonForm title={`Child of ${name}`} onBack={onBack} onSave={handleSave}>
            <div>
                <p className='text-teal-900 text-sm mb-2'>Add existing selectedPerson as the second parent of the child:</p>
                <Combobox list={family} listType='selectedPerson' setValue={setParent} />
                <hr className='mt-7' />
            </div>
        </PersonForm >
    );


}

export default AddChild


