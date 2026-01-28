import { addPerson } from '@/lib/functions';
import PersonForm from './PersonForm';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorkspaceStore } from '@/utils/store';


const AddPerson = () => {

    const { id: familyId } = useParams();
    const { refresh } = useWorkspaceStore()

    const navigate = useNavigate()

    const onBack = () =>{
        navigate("/family")
    }

    const onSaveClick = async (formData: Partial<Person>) => {
        const data = await addPerson({ ...formData, family_id: familyId })
        if (data.status == "success") refresh(familyId!)
    }

    return (
        <PersonForm title={`Add Person`} onBack={onBack} onSave={onSaveClick} />


    )
}

export default AddPerson

