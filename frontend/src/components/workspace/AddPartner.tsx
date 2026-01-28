import { addPartner } from '@/lib/functions';
import PersonForm from './PersonForm';
import { useWorkspaceStore } from '@/utils/store';

type Props = {
    name: string | undefined;
    onBack: () => void;
}

const AddPartner = ({ name, onBack }: Props) => {

    const {
        refresh,
        selectedPerson
    } = useWorkspaceStore();

    if (!selectedPerson) return;

    const onSaveClick = async (formData: Partial<Person>) => {
        const data = await addPartner(selectedPerson.id!, {
            ...formData,
            family_id: selectedPerson.family_id,
            partner_id: [selectedPerson.id!]
        })
        if (data?.status === "success") {
            refresh(selectedPerson.family_id!);
            return data.person;
        }

        return null;
    };


    return (
        <PersonForm title={`Partner of ${name}`} onBack={onBack} onSave={onSaveClick} >
        </PersonForm>
    )
}

export default AddPartner