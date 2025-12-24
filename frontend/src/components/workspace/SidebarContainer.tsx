import PersonSidebar from "@/components/workspace/PersonSidebar";
import { useEffect, useState } from "react";
import AddSibling from "./AddSibling";
import EditPerson from "./EditPerson";
import AddChild from "./AddChild";
import AddParent from "./AddParent";
import AddPartner from "./AddPartner";
import { useSidebar } from "@/utils/store";

const SidebarContainer = ({ person, refresh, family }: { person: Person; refresh: () => void; family: Person[] }) => {
    const [currentSidebar, setCurrentSidebar] = useState<"main" | "sibling" | "edit" | "child" | "parent" | "partner" | "none">("main");
    const name = [person.firstname, person.middlename, person.lastname].filter(Boolean).join(" ")
    const { isOpen } = useSidebar()

    useEffect(() => {
        if (!isOpen) {
            setCurrentSidebar("none");
        } else if (currentSidebar === "none") {
            setCurrentSidebar("main");
        }
    }, [isOpen]);

    if (!isOpen || currentSidebar === "none") {
        return null;
    }

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
                    family={family}
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
                    family={family}
                    onBack={() => setCurrentSidebar("main")}
                    person={person}
                />
            )}
            {currentSidebar === "parent" && (
                <AddParent
                    name={name}
                    refresh={refresh}
                    family={family}
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
