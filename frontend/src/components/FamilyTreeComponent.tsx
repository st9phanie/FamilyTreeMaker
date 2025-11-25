import { fetchFamilyMembers, updatePerson } from "@/lib/functions";
import { cache, useEffect, useRef, useState } from "react";
import { Loader2} from "lucide-react";

const editForm = function () {
  this.nodeId = null;
};

type Props = {
  id: number;
};

const DEFAULT_PERSON: Person = {
  id: 0,
  firstname: "",
  sex: "U",
  status: "U",
};

export const FamilyTreeComponent = ({ id }: Props) => {
  const [familyMembers, setFamilyMembers] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  const treeRef = useRef<HTMLDivElement | null>(null);
  const treeInstance = useRef<any>(null);

  const [open, setOpen] = useState(false);
  const [person, setPerson] = useState<Person | undefined>();
  const [originalPerson, setOriginalPerson] = useState<Person | undefined>();

  const loadMembers = cache(async () => {
    try {
      setLoading(true);
      const data = await fetchFamilyMembers(id);
      setFamilyMembers(data || []);
    } catch (err) {
      console.error("Failed:", err);
      setFamilyMembers([]);
    } finally {
      setLoading(false);
    }
  });

  // Helper to compute changed fields
  const getChangedFields = (original: Person, updated: Person): Partial<Person> => {
    const changes: Partial<Person> = {};
    for (const key in updated) {
      if (updated[key as keyof Person] !== original[key as keyof Person]) {
        changes[key as keyof Person] = updated[key as keyof Person];
      }
    }
    return changes;
  };

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

  // Load members
  useEffect(() => {
    loadMembers();
  }, [id]);

  // Initialize tree
  useEffect(() => {
    if (!window.FamilyTree || !treeRef.current || familyMembers.length === 0) return;

    const FamilyTree = window.FamilyTree;
    treeInstance.current?.destroy?.();

    editForm.prototype.init = function (obj: any) {
      this.obj = obj;
    };

    editForm.prototype.show = function (nodeId: number) {
      const member = familyMembers.find((m) => m.id === nodeId);
      const personToSet = member ? member : { ...DEFAULT_PERSON, id: nodeId };
      setPerson(personToSet);
      setOriginalPerson(personToSet); // Store original for diffing
      setOpen(true);
    };

    editForm.prototype.hide = function () {
      setOpen(false);
    };

    const family = new FamilyTree(document.getElementById("tree"), {
      mouseScrool: FamilyTree.action.scroll,
      padding: 20,
      template: "tommy",
      scaleInitial: FamilyTree.match.boundary,
      toolbar: { zoom: true, fit: true },
      editUI: new editForm(),
      nodeBinding: { field_0: "name" },
      nodes: familyMembers.map((m) => ({
        id: m.id,
        pids: Array.isArray(m.partner_id)
          ? m.partner_id
          : m.partner_id
            ? [m.partner_id]
            : [],
        name: `${m.firstname} ${m.middlename || ""} ${m.lastname}`.trim(),
        gender: m.sex === "F" ? "female" : m.sex === "M" ? "male" : "U",
        mid: m.pid1,
        fid: m.pid2,
      })),
    });

    treeInstance.current = family;
    return () => family.destroy?.();
  }, [familyMembers]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500 flex justify-center w-full items-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    );
  }

  if (!loading && familyMembers.length === 0) {
    familyMembers.push(DEFAULT_PERSON)
  }

  return (
    <>
      <div
        ref={treeRef}
        id="tree"
        style={{ width: "100%", height: "calc(100vh - 60px)", overflow: "hidden" }}
      />


    </>
  );
};

export default FamilyTreeComponent;
