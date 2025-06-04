import React, { useState, useEffect } from 'react';
import { Category } from '../../types';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../../utils/localStorage';
import Button from '../common/Button';
import { Edit, Trash, Save, X, Plus } from 'lucide-react';

const CategoryAdminPanel: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({ name: '', description: '', iconName: '' });
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingCategory) return;
    setEditingCategory({ ...editingCategory, [e.target.name]: e.target.value });
  };

  const handleEditSave = () => {
    if (!editingCategory) return;
    const updated = updateCategory(editingCategory.id, editingCategory);
    if (updated) {
      setCategories(getCategories());
      setEditingCategory(null);
    }
  };

  const handleDelete = (id: string) => {
    deleteCategory(id);
    setCategories(getCategories());
  };

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleAddSave = () => {
    if (!newCategory.name || !newCategory.description || !newCategory.iconName) return;
    addCategory({
      name: newCategory.name,
      description: newCategory.description,
      iconName: newCategory.iconName,
    });
    setCategories(getCategories());
    setNewCategory({ name: '', description: '', iconName: '' });
    setShowAdd(false);
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-md p-6 max-w-2xl mx-auto mt-8 border border-blue-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-100">Manage Categories</h2>
        <Button onClick={() => setShowAdd(!showAdd)}>
          <Plus className="h-4 w-4 mr-1" /> Add Category
        </Button>
      </div>
      {showAdd && (
        <div className="mb-6 p-4 border rounded bg-gray-800">
          <input
            name="name"
            placeholder="Name"
            value={newCategory.name}
            onChange={handleAddChange}
            className="border p-2 rounded mr-2 mb-2 bg-gray-900 text-gray-100"
          />
          <input
            name="description"
            placeholder="Description"
            value={newCategory.description}
            onChange={handleAddChange}
            className="border p-2 rounded mr-2 mb-2 bg-gray-900 text-gray-100"
          />
          <input
            name="iconName"
            placeholder="Icon Name"
            value={newCategory.iconName}
            onChange={handleAddChange}
            className="border p-2 rounded mr-2 mb-2 bg-gray-900 text-gray-100"
          />
          <Button onClick={handleAddSave}>
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
          <Button variant="outline" onClick={() => setShowAdd(false)}>
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
        </div>
      )}
      <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden shadow-md">
        <thead className="bg-gray-800 text-gray-200">
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Description</th>
            <th className="py-2 px-4 text-left">Icon</th>
            <th className="py-2 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td className="py-2 px-4 text-gray-100">
                {editingCategory?.id === cat.id ? (
                  <input
                    name="name"
                    value={editingCategory.name}
                    onChange={handleEditChange}
                    className="border p-1 rounded bg-gray-800 text-gray-100"
                  />
                ) : (
                  cat.name
                )}
              </td>
              <td className="py-2 px-4 text-gray-100">
                {editingCategory?.id === cat.id ? (
                  <input
                    name="description"
                    value={editingCategory.description}
                    onChange={handleEditChange}
                    className="border p-1 rounded bg-gray-800 text-gray-100"
                  />
                ) : (
                  cat.description
                )}
              </td>
              <td className="py-2 px-4 text-gray-100">
                {editingCategory?.id === cat.id ? (
                  <input
                    name="iconName"
                    value={editingCategory.iconName}
                    onChange={handleEditChange}
                    className="border p-1 rounded bg-gray-800 text-gray-100"
                  />
                ) : (
                  cat.iconName
                )}
              </td>
              <td className="py-2 px-4 text-right">
                {editingCategory?.id === cat.id ? (
                  <>
                    <Button onClick={handleEditSave}>
                      <Save className="h-4 w-4 mr-1" /> Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingCategory(null)}>
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => handleEdit(cat)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(cat.id)}>
                      <Trash className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryAdminPanel;
