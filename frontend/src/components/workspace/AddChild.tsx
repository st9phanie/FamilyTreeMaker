import { useState } from 'react';
import { addChild } from '@/lib/functions';
import Combobox from '../ui/combobox';
import PersonForm from './PersonForm';

type Props = {
    person: Person;
    name: string | undefined;
    onBack: () => void;
    refresh: () => void;
    family: Person[];

}

const AddChild = ({ person, name, onBack, refresh, family }: Props) => {
    const [parent, setParent] = useState<number | null>(null)


    const handleSave = async (formData: Partial<Person>) => {
        const res = await addChild(person.id!, { ...formData, family_id: person.family_id, pid1: person.id, pid2: parent })

        if (res?.status === "success") refresh();

    };

    const familyMembers = family
        .slice()
        .sort((a, b) => a.id! - b.id!)
        .map(f => ({
            id: f.id!,
            label: `${f.firstname!} ${f.middlename!} ${f.lastname!} (${f.birth || "?"})`
        }));

    return (
        <PersonForm title={`Child of ${name}`} onBack={onBack} onSave={handleSave}>
            <div>
                <p className='text-teal-900 text-sm mb-2'>Add existing person as the second parent of the child:</p>
                <Combobox list={familyMembers} listType='person' setValue={setParent} />
                <hr className='mt-7' />
            </div>
        </PersonForm >
    );


}

export default AddChild


