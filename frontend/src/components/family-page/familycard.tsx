import { Edit, EllipsisVertical, Loader2, Users, X } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { deleteFamily, updateFamilyCardName } from "@/lib/functions";
import { useState } from "react";

type Props = {
  name: string | "Unnamed";
  memberCount?: number;
  id: string;
  onRefresh: () => void;
}

const FamilyCard = ({ name, memberCount = 0, id, onRefresh }: Props) => {
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
      setLoading(false);
    }
  };

  const delete_family = async () => {
    setLoading(true);
    try {
      const response = await deleteFamily(id)
      if (response.status === "success") {
        onRefresh();
      }
    } catch (error) {
      console.error("Failed to delete family:", error);

    } finally {
      setLoading(false);
    }
  }

  const GoTo = () => {
    navigate(`/family/${id}`);
  };

  return (
    <div className='rounded-lg flex flex-col shadow-sm text-sm  bg-teal-800 py-4  text-white h-35 w-[200px] gap-y-3 justify-between'>
      <div>

        {open
          ?
          <div className="flex flex-row items-center text-white px-4 ">
            <input placeholder="Enter new name" value={new_name} className="rounded-lg bg-white text-primary py-1 px-2 flex-1 min-w-0 mr-2 mb-1 " onChange={(e) => setNewName(e.target.value)} />
            <X className="size-5 -mr-1 shrink-0 cursor-pointer " onClick={() => setOpen(false)} />
          </div>
          :
          <p className="px-4 text-base font-semibold tracking-wide drop-shadow-sm">
            {new_name}
          </p>
        }

        <div className="flex items-center px-4 mt-1 text-xs text-primary">
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
          <Button size="sm" className="ml-4  hover:bg-teal-900 text-xs " onClick={updateName} disabled={loading}>
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
            <DropdownMenuItem onClick={handleOpenModal} className="text-primary cursor-pointer">Edit Name</DropdownMenuItem>
            <DropdownMenuItem onClick={delete_family} className="text-red-600 focus:text-red-600 focus:bg-red-600/10 cursor-pointer">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>

    </div>
  )
}

export default FamilyCard