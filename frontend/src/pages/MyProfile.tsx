import PersonalInfoTab from "@/components/profile-page/PersonalInfoTab"
import SecurityTab from "@/components/profile-page/SecurityTab"
import Sidebar from "@/components/profile-page/Sidebar"
import { useState } from "react"



const MyProfile = () => {
  const [tab, setTab] = useState<"info" | "sec">("info")

  return (
    <div className="flex bg-secondary h-[calc(100vh-40px)] mt-[40px] flex-row">
      <Sidebar setTab={setTab} />
    {
      tab === "info" ? <PersonalInfoTab/> : <SecurityTab/>
    }
    </div>
  )
}

export default MyProfile