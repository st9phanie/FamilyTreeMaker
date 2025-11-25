import PersonSidebar from "@/pages/PersonSidebar";
import { useState } from "react";
import AddSibling from "./AddSibling";
import EditPerson from "./EditPerson";

const SidebarContainer = ({ person, refresh }: { person: Person; refresh: () => void; }) => {
    const [currentSidebar, setCurrentSidebar] = useState<"main" | "sibling" | "edit">("main");
    const name = [person.firstname, person.middlename, person.lastname].filter(Boolean).join(" ")

    return (
        <>
            {currentSidebar === "main" && (
                <PersonSidebar
                    name={name}
                    onAddSibling={() => setCurrentSidebar("sibling")}
                    onEditDetails={() => setCurrentSidebar("edit")}
                    refresh={refresh}
                    person={person}
                />
            )}

            {currentSidebar === "sibling" && (
                <AddSibling
                    name={name}
                    person={person}
                    onBack={() => setCurrentSidebar("main")}
                    refresh={refresh}

                />
            )}

            {currentSidebar === "edit" && (
                <EditPerson
                    refresh={refresh}
                    onBack={() => setCurrentSidebar("main")}
                    person={person}
                />
            )}
        </>
    );
};

export default SidebarContainer;
