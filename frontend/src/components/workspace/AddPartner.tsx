import { addPartner } from '@/lib/functions';
import PersonForm from './PersonForm';

type Props = {
    person: Person;
    name: string | undefined;
    onBack: () => void;
    refresh: () => void;
    family: Person[];
}

const AddPartner = ({ person, name, onBack, refresh }: Props) => {

    const onSaveClick = async (formData: Partial<Person>) => {
        const data = await addPartner(person.id!, {
            ...formData,
            family_id: person.family_id,
            partner_id: [person.id!]
        })
        if (data?.status === "success") {
            refresh();
        }
    };


    return (
        <PersonForm title={`Partner of ${name}`} onBack={onBack} onSave={onSaveClick} >
        </PersonForm>
    )
}

export default AddPartner