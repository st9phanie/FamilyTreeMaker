import React, { useState } from "react";

type EditModalProps = {
  node: any | null;
  onSave: (updatedNode: any) => void;
  onClose: () => void;
};

export function EditPerson({ node, onSave, onClose }: EditModalProps) {
  const [name, setName] = useState(node?.name || "");
  const [title, setTitle] = useState(node?.title || "");

  // Update form when a different node is opened
  React.useEffect(() => {
    if (node) {
      setName(node.name || "");
      setTitle(node.title || "");
    }
  }, [node]);

  if (!node) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-[300px] shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Edit Node</h2>
        <label className="block text-sm mb-1">Name</label>
        <input
          className="border w-full p-2 rounded mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="block text-sm mb-1">Title</label>
        <input
          className="border w-full p-2 rounded mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="text-gray-600 hover:underline">
            Cancel
          </button>
          <button
            onClick={() => onSave({ ...node, name, title })}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
