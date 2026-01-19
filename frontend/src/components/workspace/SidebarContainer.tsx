import { useState, useMemo } from "react";
import PersonSidebar from "@/components/workspace/PersonSidebar";
import AddSibling from "./AddSibling";
import EditPerson from "./EditPerson";
import AddChild from "./AddChild";
import AddParent from "./AddParent";
import AddPartner from "./AddPartner";
import AddPerson from "./AddPerson";

type SidebarView = "main" | "sibling" | "edit" | "child" | "parent" | "partner" | "none";

const SidebarContainer = ({ person, refresh, family }: { person?: Person; refresh: () => void; family: Person[] }) => {
    const [view, setView] = useState<SidebarView>("main");

    const name = useMemo(() => 
        [person?.firstname, person?.middlename, person?.lastname].filter(Boolean).join(" "), 
    [person]);

    if (!person) {
        return <AddPerson onBack={() => setView("main")} refresh={refresh} />;
    }

    // 2. Define shared props to avoid repetition
    const commonProps = { 
        person, 
        name, 
        refresh, 
        family, 
        onBack: () => setView("main") 
    };

    switch (view) {
        case "sibling": return <AddSibling {...commonProps} />;
        case "edit":    return <EditPerson {...commonProps} />;
        case "child":   return <AddChild {...commonProps} />;
        case "parent":  return <AddParent {...commonProps} />;
        case "partner": return <AddPartner {...commonProps} />;
        default:
            return (
                <PersonSidebar
                    {...commonProps}
                    onAddSibling={() => setView("sibling")}
                    onEditDetails={() => setView("edit")}
                    onAddChild={() => setView("child")}
                    onAddParent={() => setView("parent")}
                    onAddPartner={() => setView("partner")}
                />
            );
    }
};

export default SidebarContainer;