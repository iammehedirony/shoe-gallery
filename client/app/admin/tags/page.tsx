"use client";

import { useState } from "react";

export default function TagsPage() {
  const [tags, setTags] = useState([
    { id: 1, name: "Best Selling", slug: "best-selling" },
    { id: 2, name: "New Arrival", slug: "new-arrival" },
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Tags Management</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10 mb-8">
        <h2 className="font-bold mb-4">Create New Tag</h2>
        <div className="flex gap-4">
          <input type="text" placeholder="Tag Name" className="flex-1 border p-3 rounded" />
          <button className="bg-brand text-white px-6 py-3 rounded font-bold">Create Tag</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-black/10 overflow-x-auto">
        <table className="w-full text-left min-w-[500px]">
          <thead className="bg-gray-50 text-ink/70">
            <tr>
              <th className="p-4">Tag Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag.id} className="border-b">
                <td className="p-4 font-medium">{tag.name}</td>
                <td className="p-4 text-ink/60">{tag.slug}</td>
                <td className="p-4">
                  <button className="text-brand font-bold mr-4">Edit</button>
                  <button className="text-red-500 font-bold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
