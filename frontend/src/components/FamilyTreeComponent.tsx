import { fetchFamilyMembers } from "@/lib/functions";
import { useEffect, useRef, useState } from "react";
import { PersonForm } from "./PersonForm";

declare global {
  interface Window {
    FamilyTree: any;
  }
}

// Custom edit form prototype (outside component)
const editForm = function () {
  this.nodeId = null;
};

type FamilyMember = {
  id: number;
  firstname: string;
  lastname?: string;
  middlename?: string;
  pid1?: number;
  pid2?: number;
  partner_id?: number[];
  sex: "M" | "F" | "U";
};

type Props = {
  id: number;
};

export const FamilyTreeComponent = ({ id }: Props) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const treeRef = useRef<HTMLDivElement | null>(null);
  const treeInstance = useRef<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [person, setPerson] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    governorate: "",
    district: "",
    area: "",
    dob: undefined,
    dod: undefined,
    sex: "Undisclosed",
    status: "Unknown",
    photo: null,
    deathGovernorate: "",
    deathArea: "",
    deathDistrict: "",
  });

  const handleSave = () => {
    console.log("Saving person:", person);
    // insert into Supabase, API, etc.
  };

  // Load Balkan FamilyTree script
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

  // Initialize FamilyTree
  useEffect(() => {
    if (!window.FamilyTree || !treeRef.current || familyMembers.length === 0) return;

    const FamilyTree = window.FamilyTree;

    // Destroy old tree if re-rendered
    treeInstance.current?.destroy?.();

    // --- Initialize edit form prototype ---
    editForm.prototype.init = function (obj: any) {
      const that = this;
      this.obj = obj;
      this.editForm = document.getElementById("editForm");
      // this.nameInput = document.getElementById("name") as HTMLInputElement;
      // this.cancelButton = document.getElementById("cancel")!;
      // this.saveButton = document.getElementById("save")!;

      //   this.cancelButton.addEventListener("click", function () {
      //     that.hide();
      //   });

      //   this.saveButton.addEventListener("click", function () {
      //     const node = family.get(that.nodeId);
      //     node.name = that.nameInput.value;
      //     family.updateNode(node);
      //     that.hide();
      //   });
    };

    editForm.prototype.show = function (nodeId: number) {
      this.hide();
      this.nodeId = nodeId;

      const left = document.body.offsetWidth / 2 - 150;
      this.editForm.style.display = "block";
      this.editForm.style.left = left + "px";
      document.getElementById("editForm_title")!.innerHTML = "Edit";

      const node = family.get(nodeId);
      
      //this.nameInput.value = node.name || "";
    };

    editForm.prototype.hide = function () {
      this.editForm.style.display = "none";
    };

    // --- Initialize FamilyTree instance ---
    const family = new FamilyTree(treeRef.current, {
      mouseScrool: FamilyTree.action.scroll,
      padding: 20,
      template: "tommy",
      scaleInitial: FamilyTree.match.boundary,
      toolbar: {
        zoom: true,
        fit: true,
      },
      editUI: new editForm(), // use our custom edit form
      nodeBinding: {
        field_0: "name",
      },
      nodes: familyMembers.map((m) => ({
        id: m.id,
        pids: m.partner_id ?? [],
        name: `${m.firstname} ${m.middlename || ""} ${m.lastname}`.trim(),
        gender: m.sex === "F" ? "female" : m.sex === "M" ? "male" : "undisclosed",
        mid: m.pid1,
        fid: m.pid2,
      })),
    });

    treeInstance.current = family;

    return () => {
      family.destroy?.();
    };
  }, [familyMembers]);

  if (familyMembers.length === 0) {
    return <div className="text-center mt-10 text-gray-500">Loading family tree...</div>;
  }

  return (
    <>
      {/* Family tree container */}
      <div
        ref={treeRef}
        id="tree"
        style={{
          width: "100%",
          height: "calc(100vh - 60px)",
          overflow: "hidden",
        }}
      />

      {/* Edit Form HTML (needed for editForm prototype) */}
      <div
        id="editForm"
        className="h-[calc(100vh-60px)] top-[60px] border-l border-[#7CB937] w-100  fixed right-0 bg-white z-999 px-4 overflow-y-scroll"
        hidden={open}
      >

        <PersonForm
          person={familyMembers[0]}
          onChange={() => { }}
          onSubmit={handleSave}
          onCancel={() => { }} />
      </div>
    </>
  );
};

export default FamilyTreeComponent;

// <label>Name</label>
// <input
//   id="name"
//   type="text"
//   style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
// />

// <div style={{ textAlign: "right", marginTop: "10px" }}>
//   <button id="cancel" style={{ marginRight: "10px" }}>
//     Cancel
//   </button>
//   <button id="save">Save</button>
// </div>