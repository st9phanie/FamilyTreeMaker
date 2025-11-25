// useFamilyTree.ts

import { useEffect, useRef } from "react";

// Define the shape of the data needed by the tree
type FamilyTreeNode = {
  id: number;
  pids: number[];
  name: string;
  gender: string;
  mid?: number;
  fid?: number;
};

// Define the custom edit form handler type
type EditFormHandler = {
  init: (obj: any) => void;
  show: (nodeId: number) => void;
  hide: () => void;
};

// Define the hook's arguments
type UseFamilyTreeProps = {
  containerId: string;
  familyMembers: Person[];
  onNodeEdit: (person: Person) => void;
};

export const useFamilyTree = ({ containerId, familyMembers, onNodeEdit }: UseFamilyTreeProps) => {
  const treeInstance = useRef<any>(null);

  // Load FamilyTree.js script
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

  // Initialize tree
  useEffect(() => {
    if (!window.FamilyTree || familyMembers.length === 0) return;
    
    // Destroy previous instance
    treeInstance.current?.destroy?.();

    const FamilyTree = window.FamilyTree;

    // 1. Custom Edit Form Logic
    class CustomEditForm implements EditFormHandler {
        nodeId: number | null = null;
        obj: any;

        init(obj: any) { this.obj = obj; }
        
        show(nodeId: number) {
            this.nodeId = nodeId;
            const member = familyMembers.find((m) => m.id === nodeId);
            // Assuming DEFAULT_PERSON is defined outside or passed in
            const personToSet = member ? member : { id: nodeId, firstname: "", sex: "U", status: "U" };
            onNodeEdit(personToSet); // Use callback to notify parent component
        }
        
        hide() { /* No need to explicitly close from here, parent handles it */ }
    }


    // 2. Data Transformation
    const nodes: FamilyTreeNode[] = familyMembers.map((m) => ({
      id: m.id,
      pids: Array.isArray(m.partner_id) ? m.partner_id : (m.partner_id ? [m.partner_id] : []),
      name: `${m.firstname} ${m.middlename || ""} ${m.lastname}`.trim(),
      gender: m.sex === "F" ? "female" : m.sex === "M" ? "male" : "U",
      mid: m.pid1,
      fid: m.pid2,
    }));

    // 3. Tree Initialization
    const family = new FamilyTree(document.getElementById(containerId), {
      mouseScrool: FamilyTree.action.scroll,
      padding: 20,
      template: "tommy",
      scaleInitial: FamilyTree.match.boundary,
      toolbar: { zoom: true, fit: true },
      editUI: new CustomEditForm(), // Use the class instance
      nodeBinding: { field_0: "name" },
      nodes: nodes,
    });

    treeInstance.current = family;
    
    return () => family.destroy?.();
  }, [familyMembers, containerId, onNodeEdit]); // Dependencies include familyMembers and the callback

  return treeInstance;
};