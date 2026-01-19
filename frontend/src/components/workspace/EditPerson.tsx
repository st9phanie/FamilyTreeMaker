import { updatePerson } from '@/lib/functions';
import PersonForm from './PersonForm';

type Props = {
    person: Person;
    onBack: () => void;
    refresh: () => void;
}

const EditPerson = ({ person, onBack, refresh }: Props) => {

    const onSaveClick = async (formData: Partial<Person>) => {
        const data = await updatePerson(person.id!, { ...formData })
        console.log(data);
        if (data.status == "success") refresh();
    }

    return (
        <PersonForm title={`Edit ${person.firstname}`} onBack={onBack} onSave={onSaveClick}>


        </PersonForm>
    )
}

export default EditPerson

