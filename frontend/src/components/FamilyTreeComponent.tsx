import { fetchFamilyMembers } from "@/lib/functions";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    FamilyTree: any;
  }
}

type FamilyMember = {
  id: number;
  firstname: string;
  pid1?: number;
  pid2?: number;
  partner_id?: number[];
  sex: string;
};

type Props = {
  id: number;
};

export const FamilyTreeComponent = ({ id }: Props) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const treeRef = useRef<HTMLDivElement | null>(null);
  const treeInstance = useRef<any>(null);

  // Load Balkan JS script once
  useEffect(() => {
    const loadScript = () =>
      new Promise<void>((resolve, reject) => {
        if (window.FamilyTree) return resolve();
        const script = document.createElement("script");
        script.src = "https://balkan.app/js/FamilyTree.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load FamilyTree.js"));
        document.body.appendChild(script);
      });

    loadScript().catch(console.error);
  }, []);

  // Fetch family members
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await fetchFamilyMembers(id);
        if (data) setFamilyMembers(data);
      } catch (err) {
        console.error("Failed to load family members:", err);
      }
    };
    loadMembers();
  }, [id]);

  // Initialize or refresh tree
  useEffect(() => {
    if (!window.FamilyTree || !treeRef.current || familyMembers.length === 0) return;

    // Destroy any previous instance
    treeInstance.current?.destroy?.();

    const FamilyTree = window.FamilyTree;

    treeInstance.current = new FamilyTree(treeRef.current, {
      mouseScroll: FamilyTree.action.scroll,
      padding: 20,
      template: "tommy",
      nodeTreeMenu: true,

      scaleInitial: FamilyTree.match.boundary,
      toolbar: {
        zoom: true,
        fit: true,
      },
      nodeBinding: {
        field_0: "name",
      },
      nodes: familyMembers.map((m) => ({
        id: m.id,
        pids: m.partner_id ?? [],
        name: m.firstname,
        gender: m.sex === "F" ? "female" : m.sex === "M" ? "male" : "Undisclosed",
        mid: m.pid1,
        fid: m.pid2,
      })),
    });

    return () => {
      treeInstance.current?.destroy?.();
    };
  }, [familyMembers]);

  if (familyMembers.length === 0) {
    return <div className="text-center mt-10 text-gray-500">Loading family tree...</div>;
  }

  return (
    <div
      ref={treeRef}
      id="tree"
      style={{
        width: "100%",
        height: "calc(100vh - 60px)",
        overflow: "hidden",
      }}
    />
  );
};

export default FamilyTreeComponent;
