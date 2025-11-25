import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

type Props = {
    nodes: MemberNode[];
    onSend: (id:number)=>void;
};

export const Family = ({ nodes, onSend }: Props) => {
    const [loading, setLoading] = useState(true);
    const treeRef = useRef<HTMLDivElement | null>(null);
    const treeInstance = useRef<any>(null);
    const [selectedNode, setSelectedNode] = useState(1)

    // Load FamilyTree.js script
    useEffect(() => {
        const loadScript = () =>
            new Promise<void>((resolve, reject) => {
                if (window.FamilyTree) return resolve();
                // Load JS
                const script = document.createElement("script");
                script.src = "https://balkan.app/js/FamilyTree.js";
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error("Failed to load FamilyTree.js"));
                document.body.appendChild(script);
            });

        loadScript()
            .then(() => setLoading(false))
            .catch(console.error);

        
    }, []);

    // Initialize tree **after script has loaded**
    useEffect(() => {
        if (loading || !window.FamilyTree || !treeRef.current) return;

        const FamilyTree = window.FamilyTree;

        treeInstance.current?.destroy?.();

        const family = new FamilyTree(treeRef.current, {
            mouseScrool: FamilyTree.action.scroll,
            padding: 20,
            template: "tommy",
            scaleInitial: 0.8,
            nodeMouseClick: FamilyTree.action.none,
            toolbar: { zoom: true, fit: true },
            nodeBinding: { field_0: "name" },
            nodes: nodes,
        });

        treeInstance.current = family;

        family.on("click", (sender, args) => {
            setSelectedNode(args.node.id)
            onSend(args.node.id)
        });

        return () => family.destroy?.();
    }, [loading, nodes]);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-full text-gray-500">
                <Loader2 className="w-10 h-10 animate-spin" />
            </div>
        );
    }

    return (
        <div
            ref={treeRef}
            id="tree"
            style={{ width: "100%", height: "calc(100vh - 60px)", overflow: "hidden" }}
        />
    );
};

export default Family;
