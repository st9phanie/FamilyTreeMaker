import { useEffect, useRef } from "react";

declare global {
  interface Window {
    FamilyTree: any;
  }
}

export const FamilyTreeComponent = () => {
  const treeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 1. Load the FamilyTree.js script dynamically if not already loaded
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

    // 2. Initialize the tree
    const initTree = () => {
      if (!window.FamilyTree || !treeRef.current) return;

      const FamilyTree = window.FamilyTree;

      const family = new FamilyTree(treeRef.current, {
        mouseScrool: FamilyTree.action.scroll,
        padding: 20,
        template: "tommy",
        scaleInitial: FamilyTree.match.boundary,
        toolbar: {
          zoom: true,
          fit: true,
        },
        nodeBinding: {
          field_0: "name",
        },
        nodes: [
          { id: 1, pids: [2], name: "Amber McKenzie", gender: "female" },
          { id: 2, pids: [1], name: "Ava Field", gender: "male" },
          { id: 3, mid: 1, fid: 2, name: "Peter Stevens", gender: "male" },
          { id: 4, mid: 1, fid: 2, name: "Savin Stevens", gender: "male" },
          { id: 5, mid: 1, fid: 2, name: "Emma Stevens", gender: "female" },
        ],
      });

      return family;
    };

    // 3. Run it
    let treeInstance: any;
    loadScript()
      .then(() => {
        treeInstance = initTree();
      })
      .catch(console.error);

    // 4. Cleanup
    return () => {
      treeInstance?.destroy?.();
    };
  }, []);

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