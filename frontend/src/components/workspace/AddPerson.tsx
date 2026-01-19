import { addPerson } from '@/lib/functions';
import PersonForm from './PersonForm';
import { useParams } from 'react-router-dom';

type Props = {
    refresh: () => void;
}

const AddPerson = ({ refresh }: Props) => {

    const { id: familyId } = useParams();


    const onSaveClick = async (formData: Partial<Person>) => {
        const data = await addPerson({ ...formData, family_id: familyId })
        console.log(data);
        if (data.status == "success") refresh()
    }

    return (
        <PersonForm title={`Add Person`} onBack={()=>{}} onSave={onSaveClick}>

        </PersonForm>

    )
}

export default AddPerson

