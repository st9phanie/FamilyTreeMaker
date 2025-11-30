import PersonSidebar from "@/components/workspace/PersonSidebar";
import { useState } from "react";
import AddSibling from "./AddSibling";
import EditPerson from "./EditPerson";
import AddChild from "./AddChild";
import AddParent from "./AddParent";
import AddPartner from "./AddPartner";

const SidebarContainer = ({ person, refresh }: { person: Person; refresh: () => void; }) => {
    const [currentSidebar, setCurrentSidebar] = useState<"main" | "sibling" | "edit" | "child" | "parent" | "partner">("main");
    const name = [person.firstname, person.middlename, person.lastname].filter(Boolean).join(" ")

    return (
        <>
            {currentSidebar === "main" && (
                <PersonSidebar
                    name={name}
                    onAddSibling={() => setCurrentSidebar("sibling")}
                    onEditDetails={() => setCurrentSidebar("edit")}
                    onAddChild={() => setCurrentSidebar("child")}
                    onAddParent={() => setCurrentSidebar("parent")}
                    onAddPartner={() => setCurrentSidebar("partner")}

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

            {currentSidebar === "child" && (
                <AddChild
                    name={name}
                    refresh={refresh}
                    onBack={() => setCurrentSidebar("main")}
                    person={person}
                />
            )}
            {currentSidebar === "parent" && (
                <AddParent
                    name={name}
                    refresh={refresh}
                    onBack={() => setCurrentSidebar("main")}
                    person={person}
                />
            )}
            {currentSidebar === "partner" && (
                <AddPartner
                    name={name}
                    refresh={refresh}
                    onBack={() => setCurrentSidebar("main")}
                    person={person}
                />
            )}
        </>
    );
};

export default SidebarContainer;
