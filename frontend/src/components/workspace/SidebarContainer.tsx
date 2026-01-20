import { useState, useMemo } from "react";
import PersonSidebar from "@/components/workspace/PersonSidebar";
import AddSibling from "./AddSibling";
import EditPerson from "./EditPerson";
import AddChild from "./AddChild";
import AddParent from "./AddParent";
import AddPartner from "./AddPartner";
import AddPerson from "./AddPerson";
import { useWorkspaceStore } from "@/utils/store";

type SidebarView = "main" | "sibling" | "edit" | "child" | "parent" | "partner" | "none";

const SidebarContainer = () => {
    const [view, setView] = useState<SidebarView>("main");

    const person = useWorkspaceStore((state) => state.selectedPerson);

    const name = useMemo(() =>
        [person?.firstname, person?.middlename, person?.lastname].filter(Boolean).join(" "),
        [person]);

    if (!person) {
        return <AddPerson />;
    }

    // 2. Define shared props to avoid repetition
    const commonProps = {
        name,
        onBack: () => setView("main")
    };

    switch (view) {
        case "sibling": return <AddSibling {...commonProps} />;
        case "edit": return <EditPerson {...commonProps} />;
        case "child": return <AddChild {...commonProps} />;
        case "parent": return <AddParent {...commonProps} />;
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