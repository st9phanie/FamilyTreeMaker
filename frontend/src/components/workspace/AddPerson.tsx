import { addPerson } from '@/lib/functions';
import PersonForm from './PersonForm';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorkspaceStore } from '@/utils/store';


interface ApiResponse {
  status: string;
  person?: Person;
}

const AddPerson = () => {
    const { id: familyId } = useParams();
    const { refresh } = useWorkspaceStore();
    const navigate = useNavigate();

    const onBack = () => {
        navigate(`/family`);
    };

    const onSaveClick = async (formData: Person) => {
        try {
            const data = await addPerson({ ...formData, family_id: familyId }) as ApiResponse;
            
            if (data.status === "success" && data.person) {
                await refresh(familyId!);  

                navigate(`/family/${familyId}`);
                
                const id = data.person.id;
                return id;
            }
        } catch (error) {
            console.error("Error adding person:", error);
            throw error;
        }
    };

    return (
        <PersonForm 
            title="Add Family Member" 
            onBack={onBack} 
            onSave={onSaveClick} 
        />
    );
};

export default AddPerson

