import { ArrowLeft, IdCard, Lock, } from "lucide-react"
import { useState } from "react";
import { Link } from "react-router-dom";

const listItems = [

  { title: "Dashboard", icon: ArrowLeft, link: '/family' },
  { title: "Personal Info", icon: IdCard, link: '', name: "info" },
  { title: "Security & Sign in", icon: Lock, link: "", name: "sec" },
]

const Sidebar = ({ setTab }: { setTab: (tab: "info" | "sec") => void; }) => {

  const [page, setPage] = useState<"info" | "sec">("info")

  return (
    <div className='w-[360px] h-[calc(100vh-40px)] bg-secondary text-primary border-r border-sidebar-border flex flex-col px-5 top-[40px] fixed py-5 justify-between'>

      <ul className="gap-y-5 flex flex-col">
        {listItems.map((i, k) => {
          const Icon = i.icon;
          return (

            <li key={k} >
              <Link
                to={i.link}
                onClick={() => {
                  if (i.name) {
                    const target = i.name as "info" | "sec";
                    setPage(target);
                    setTab(target);
                  }
                  }}
                  className = {`flex flex-row items-center px-5 hover:bg-primary/10  rounded-2xl py-3 cursor-pointer gap-x-3 transition-colors ${i.name === page ? "bg-muted-foreground text-white" : ""} `
                }
              >
                <Icon className="font-thin" />
                {i.title}
              </Link>
            </li>

          )
        }
        )}
      </ul>
    </div >
  )
}

export default Sidebar