import { useState } from 'react';
import { addParent } from '@/lib/functions';
import Combobox from '../ui/combobox';
import PersonForm from './PersonForm';
import { useWorkspaceStore } from '@/utils/store';

type Props = {
    name: string | undefined;
    onBack: () => void;
}

const AddParent = ({ name, onBack }: Props) => {
    const [parent, setParent] = useState<number | null>(null)

    const {
        familyMembers,
        refresh,
        selectedPerson
    } = useWorkspaceStore();

    if (!selectedPerson) return;

    const onSaveClick = async (formData: Partial<Person>) => {

        const isUsingExistingParent = !!parent;

        if (!isUsingExistingParent) return;

        let data;

        // CASE 1 — user picked existing parent (their name)
        if (isUsingExistingParent) {
            data = await addParent(selectedPerson.id!,
                familyMembers.find(m => m.id === parent)!
            );
        }

        // CASE 2 — user is creating a new parent
        else {
            data = await addParent(selectedPerson.id!, {
                ...formData,
                family_id: selectedPerson.family_id,
            });
        }

        if (data?.status === "success") {
            refresh(selectedPerson.family_id!);
            return data.person;
        }

        return null;
    };


    const family = familyMembers
        .slice()
        .sort((a, b) => a.id! - b.id!)
        .map(f => ({
            id: f.id!,
            label: `${f.firstname!} ${f.middlename!} ${f.lastname!} (${f.birth || "?"})`
        }));


    return (
        <PersonForm title={`Parent of ${name}`} onBack={onBack} onSave={onSaveClick}>
            <div>
                <p className='text-gray-500 text-sm'>Add existing person as parent:</p>
                <Combobox list={family} listType='selectedPerson' setValue={setParent} />
                <hr className='mt-7' />
            </div>
        </PersonForm>
    )
}

export default AddParent