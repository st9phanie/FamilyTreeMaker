import { useEffect, useState } from 'react'
import CountryPicker from '../ui/countryPicker'
import ImagePicker from '../ui/ImagePicker'
import TabLayout from './TabLayout'
import { useUserState } from '@/utils/store'
import { Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { changeUserImage, updateUser } from '@/lib/functions'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '../ui/input'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'react-router-dom'

const PersonalInfoTab = () => {
    const { user, loading, fetchUser } = useUserState()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showResetModal, setShowResetModal] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();


    const [formData, setFormData] = useState<User>({
        photo: null,
        name: "",
        country: null,
        email: ""
    });

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updatePassword = async () => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) alert(error.message);
        else {
            alert("Password updated!");
            setShowResetModal(false);
        }
    };

    useEffect(() => {
        if (searchParams.get("reset") === "true") {
            setShowResetModal(true);
        }
    }, [searchParams]);

    const handleClose = () => {
        setShowResetModal(false);
        setSearchParams({});
    };


    useEffect(() => {
        if (user) {
            setFormData({
                photo: user.photo || null,
                name: user.name || "",
                country: user.country || null,
                email: user.email || ""
            });
        }
    }, [user]);


    const profileItems = [
        { name: "Name", value: formData?.name, type: "text" },
        { name: "Email", value: formData?.email, type: "email" }
    ]

    const handleSubmit = async () => {
        try {
            setIsLoading(true)

            const userData = {
                ...formData,
                name: formData.name?.trim(),
                email: formData.email?.trim(),
                country: formData.country,
                photo: formData.photo instanceof File ? user?.photo : formData.photo
            };

            let response;
            if (user) {
                response = await updateUser(userData);

                if (formData.photo instanceof File) {
                    const imagePayload = new FormData();
                    imagePayload.append("photo", formData.photo);
                    await changeUserImage(imagePayload);
                }
            }

            if (response.status == "success") await fetchUser();
        } catch (error) {
            console.error("Failed to save user", error);
        } finally {
            setIsLoading(false)
        }
    };

    if (loading) return <TabLayout><Loader2 className='animate-spin size-10' /></TabLayout>;
    if (!user) return <TabLayout>No user found. Please log in.</TabLayout>;

    return (
        <TabLayout>
            <div className='flex flex-col w-full h-full items-center '>
                <h1 className='text-2xl text-start w-[600px] '>Personal Info</h1>

                <div className='flex flex-col  justify-center py-5 lg:w-[600px] gap-y-5 '>

                    <div className='flex flex-col justify-between items-center mt-2 w-full '>
                        <ImagePicker currentPhoto={formData.photo} setPhoto={(value) => handleChange("photo", value)} />
                        <span className='my-2 text-sm text-primary'>Profile Picture</span>
                    </div>

                    <hr className=' my-2 border-sidebar-border w-full' />
                    {
                        profileItems.map((i, k) => (
                            <div key={k} className='flex flex-row justify-between items-center w-full '>
                                <span className='w-1/3 font-semibold my-2 text-base text-primary'>{i.name}</span>
                                <input type={i.type} placeholder={i.name} value={i.value || ""} onChange={(e) => handleChange(i.name.toLowerCase(), e.target.value)} className='w-2/3 border-b py-1 px-2 active:outline-none outline-none cursor-pointer ' />
                            </div>

                        ))
                    }

                    <div className='flex flex-row justify-between items-center w-full '>
                        <span className='w-1/3 my-2 text-base text-primary font-semibold'>Country</span>
                        <CountryPicker label='' country={formData.country} setCountry={(value) => handleChange("country", value)} setCity={() => { }} className='w-[400px] ' />
                    </div>

                    <Button className='w-1/3 mt-10 place-self-end' disabled={isLoading} onClick={handleSubmit}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isLoading ? "Saving..." : "Save"}</Button>
                </div>
            </div>

            <Dialog open={showResetModal} onOpenChange={handleClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enter New Password</DialogTitle>
                    </DialogHeader>
                    <Input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Button onClick={updatePassword}>Update Password</Button>
                </DialogContent>
            </Dialog>
        </TabLayout>
    )
}

export default PersonalInfoTab