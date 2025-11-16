import { fetchFamilyMembers } from "@/lib/functions";
import { cache, useEffect, useRef, useState } from "react";
import { PersonForm } from "./PersonForm";
import { Loader2, LoaderIcon, X } from "lucide-react";

declare global {
  interface Window {
    FamilyTree: any;
  }
}

// Custom edit form prototype (outside component)
const editForm = function () {
  this.nodeId = null;
};

type Props = {
  id: number;
};

// --- ADDED: Default Person Object for Initialization ---
const DEFAULT_PERSON: Person = {
  id: 0,
  firstname: "",
  sex: "U",
  status: "U", // Default status
};


export const FamilyTreeComponent = ({ id }: Props) => {
  const [familyMembers, setFamilyMembers] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  const treeRef = useRef<HTMLDivElement | null>(null);
  const treeInstance = useRef<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [person, setPerson] = useState<Person | undefined>();

  const loadMembers = cache(async () => {
    try {
      setLoading(true);
      const data = await fetchFamilyMembers(id);
      setFamilyMembers(data || []);
    } catch (err) {
      console.error("Failed:", err);
      setFamilyMembers([]);   // Or handle errors differently
    } finally {
      setLoading(false);
    }
  });


  const handleSave = () => {
    // console.log("Saving person:", person); // Use 'person' state here for saving logic
    setOpen(false); // --- FIX 3: Close form on save ---
    loadMembers();
  };

  const onCancel = () => {
    setOpen(false);
  };

  // 1. Script Loading
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

  // 2. Data Loading
  useEffect(() => {
    loadMembers();
  }, [id]);

  // 3. Tree Initialization and Custom Edit Form Logic
  useEffect(() => {
    if (!window.FamilyTree || !treeRef.current || familyMembers.length === 0) return;
    const FamilyTree = window.FamilyTree;
    treeInstance.current?.destroy?.();

    // ------------------------------------ EDIT FORM PROTOTYPE ----------------------------------------------
    editForm.prototype.init = function (obj: any) {
      this.obj = obj;
      // editForm does not need to access the DOM element here anymore, 
      // as the component handles the rendering.
    };

    editForm.prototype.show = function (nodeId: number) {
      this.nodeId = nodeId;
      // Find the member or initialize a new one (using existing ID for editing)
      const memberToEdit = familyMembers.find(m => m.id === nodeId);

      // Use the found member, or create a new person object if adding a new node
      const personToSet = memberToEdit
        ? memberToEdit
        : { ...DEFAULT_PERSON, id: nodeId }; // For new nodes, Balkan may pass a temporary ID.

      setPerson(personToSet);
      setOpen(true);
    };

    editForm.prototype.hide = function () {
      setOpen(false);
    }
    // ------------------------------------ END EDIT FORM PROTOTYPE ------------------------------------------

    const family = new FamilyTree(document.getElementById("tree"), {
      mouseScrool: FamilyTree.action.scroll,
      padding: 20,
      template: "tommy",
      scaleInitial: FamilyTree.match.boundary,
      toolbar: {
        zoom: true,
        fit: true,
      },
      editUI: new editForm(),
      nodeBinding: {
        field_0: "name",
      },
      nodes: familyMembers.map((m) => ({
        id: m.id,
        pids: Array.isArray(m.partner_id)
          ? m.partner_id
          : (m.partner_id ? [m.partner_id] : []),
        name: `${m.firstname} ${m.middlename || ""} ${m.lastname}`.trim(),
        gender: m.sex === "F" ? "female" : m.sex === "M" ? "male" : "U",
        mid: m.pid1,
        fid: m.pid2,
      })),
    });


    treeInstance.current = family;

    return () => {
      family.destroy?.();
    };
  }, [familyMembers]);

  if (loading) {
    return <div className="text-center mt-10 text-gray-500 flex justify-center w-full items-center">
      <Loader2 className="size-10 animate-spin" />
    </div>;
  }

  if (!loading && familyMembers.length === 0) {
    return <div className="text-center mt-10 text-gray-500">No family members yet.</div>;
  }


  return (
    <>
      <div
        ref={treeRef}
        id="tree"
        style={{
          width: "100%",
          height: "calc(100vh - 60px)",
          overflow: "hidden",
        }}
      />

      <div
        className={`h-[calc(100vh-60px)] top-[60px] border-l border-lime-700 w-full md:w-1/3 py-5 fixed right-0 bg-white z-50 px-4 overflow-y-scroll transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-end">
          <X className="size-6 text-red-600 cursor-pointer" onClick={onCancel} />
        </div>

        {person && (
          <div className="mt-4">
            <PersonForm
              person={person}
              onChange={setPerson as (updater: (prev: Person) => Person) => void}
              onSubmit={handleSave}
              onCancel={onCancel}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default FamilyTreeComponent;