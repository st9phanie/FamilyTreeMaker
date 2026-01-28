import { updatePerson } from '@/lib/functions';
import PersonForm from './PersonForm';
import { useWorkspaceStore } from '@/utils/store';

type Props = {
    onBack: () => void;
}

const EditPerson = ({ onBack }: Props) => {

    const { selectedPerson, refresh } = useWorkspaceStore()

    const onSaveClick = async (formData: Partial<Person>) => {
        if (!selectedPerson) return
        const data = await updatePerson(selectedPerson.id!, { ...formData })
        if (data.status == "success") {
            refresh(selectedPerson.family_id!);
            return data.person;
        }

        return null
    }

    return (
        <PersonForm title={`Edit ${selectedPerson?.firstname}`} onBack={onBack} onSave={onSaveClick} />
    )
}

export default EditPerson

