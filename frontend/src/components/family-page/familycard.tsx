import { Edit, EllipsisVertical, Users } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { DropdownMenu,DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

type Props = {
  name: string | "Unnamed";
  memberCount?: number;
  id: string;
}

const FamilyCard = ({ name, memberCount = 0, id }: Props) => {
  const navigate = useNavigate();



  const GoTo = () => {
    navigate(`/family/${id}`);
  };

  return (
    <div className='flex flex-col bg-teal-600 p-4 text-white h-40 w-[250px] gap-y-3 shadow-lg justify-between'>
      <div>

        <p className="text-xl font-bold tracking-wide drop-shadow-sm">
          {name}
        </p>

        <div className="flex items-center mt-1 text-sm text-teal-950">
          <Users className="w-4 h-4 mr-2" />
          {memberCount === 0 ? (
            <span>0 members</span>
          ) : (
            <span>{memberCount} member{memberCount > 1 ? "s" : ""}</span>
          )}
        </div>
      </div>


      <div className="flex  flex-row justify-between items-center mt-3 w-full">
        <Button className="rounded-full cursor-pointer hover:bg-teal-700/20" size="icon-sm" variant="ghost" title="Edit Family" onClick={GoTo}><Edit className="size-5 text-white " /></Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="p-1 cursor-pointer hover:bg-teal-700/20 rounded-full ">
            <EllipsisVertical className="size-5 " />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => { }} className="text-teal-950 cursor-pointer">Edit Name</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { }} className="text-red-600 focus:text-red-600 focus:bg-red-600/10 cursor-pointer">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>

    </div>
  )
}

export default FamilyCard