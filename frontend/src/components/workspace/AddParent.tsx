import { useState } from 'react';
import { addParent } from '@/lib/functions';
import Combobox from '../ui/combobox';
import PersonForm from './PersonForm';

type Props = {
    person: Person;
    name: string | undefined;
    onBack: () => void;
    refresh: () => void;
    family: Person[];
}

const AddParent = ({ family, person, name, onBack, refresh }: Props) => {
    const [parent, setParent] = useState<number | null>(null)


    const onSaveClick = async (formData: Partial<Person>) => {

        const isUsingExistingParent = !!parent;

        if (!isUsingExistingParent) return;

        let data;

        // CASE 1 — user picked existing parent (their name)
        if (isUsingExistingParent) {
            data = await addParent(person.id!,
                family.find(m => m.id === parent)!
            );
        }

        // CASE 2 — user is creating a new parent
        else {
            data = await addParent(person.id!, {
                ...formData,
                family_id: person.family_id,
            });
        }

        if (data?.status === "success") refresh();
    };


    const familyMembers = family
        .slice()
        .sort((a, b) => a.id! - b.id!)
        .map(f => ({
            id: f.id!,
            label: `${f.firstname!} ${f.middlename!} ${f.lastname!} (${f.birth || "?"})`
        }));


    return (
        <PersonForm title={`Parent of ${name}`} onBack={onBack} onSave={onSaveClick}>
            <div>
                <p className='text-teal-900 text-sm'>Add existing person as parent:</p>
                <Combobox list={familyMembers} listType='person' setValue={setParent} />
                <hr className='mt-7' />
            </div>
        </PersonForm>
    )
}

export default AddParent