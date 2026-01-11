import { Edit, EllipsisVertical, Loader2, Users, X } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { updateFamilyCardName } from "@/lib/functions";
import { useState } from "react";

type Props = {
  name: string | "Unnamed";
  memberCount?: number;
  id: string;
}

const FamilyCard = ({ name, memberCount = 0, id }: Props) => {
  const navigate = useNavigate();
  const [new_name, setNewName] = useState<string>(name)
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const handleOpenModal = () => {
    setOpen(!open);
  };

  const updateName = async () => {
    setLoading(true);
    try {
      const response = await updateFamilyCardName(id, new_name);

      if (response.status === "success") {
        setOpen(false);
      }
    } catch (error) {
      console.error("Failed to update:", error);
    } finally {
      setLoading(false); // 2. Stop loading regardless of success/fail
    }
  };

  const GoTo = () => {
    navigate(`/family/${id}`);
  };

  return (
    <div className='flex flex-col shadow-sm bg-teal-600 py-4  text-white h-40 w-[250px] gap-y-3 justify-between'>
      <div>

        {open
          ?
          <div className="flex flex-row items-center text-white px-4 ">
            <input placeholder="Enter new name" value={new_name} className="bg-white border-b-2 border-teal-950 text-teal-950 py-1 px-2 flex-1 min-w-0 mr-2 " onChange={(e) => setNewName(e.target.value)} />
            <X className="size-5  shrink-0 cursor-pointer " onClick={() => setOpen(false)} />
          </div>
          :
          <p className="px-4 text-xl font-bold tracking-wide drop-shadow-sm">
            {new_name}
          </p>
        }

        <div className="flex items-center px-4 mt-1 text-sm text-teal-950">
          <Users className="w-4 h-4 mr-2" />
          {memberCount === 0 ? (
            <span className="">0 members</span>
          ) : (
            <span>{memberCount} member{memberCount > 1 ? "s" : ""}</span>
          )}
        </div>
      </div>

      <div className="flex  flex-row justify-between items-center mt-3 w-full">
        {open
          ?
          <Button className="ml-4 hover:bg-teal-900" onClick={updateName} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save new name"
            )}            </Button>
          :
          <Button className="ml-2  rounded-full cursor-pointer hover:bg-teal-700/20" size="icon-sm" variant="ghost" title="Edit Family" onClick={GoTo}>
            <Edit className="size-5 text-white " />
          </Button>
        }
        <DropdownMenu>
          <DropdownMenuTrigger className="p-1 mr-2  cursor-pointer hover:bg-teal-700/20 rounded-full ">
            <EllipsisVertical className="size-5 " />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleOpenModal} className="text-teal-950 cursor-pointer">Edit Name</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { }} className="text-red-600 focus:text-red-600 focus:bg-red-600/10 cursor-pointer">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>

    </div>
  )
}

export default FamilyCard