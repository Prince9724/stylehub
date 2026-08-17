import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ✅ Sortable Product Item
const SortableProductItem = ({ product, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <span className="cursor-grab mr-2 text-gray-400">☰</span>
          <img src={product.thumbnail} alt={product.name} className="h-10 w-10 object-cover rounded" />
          <div className="ml-4">{product.name}</div>
        </div>
      </td>
      <td className="px-6 py-4">₹{product.price}</td>
      <td className="px-6 py-4">{product.quantity}</td>
      <td className="px-6 py-4">{product.category?.name}</td>
      <td className="px-6 py-4">
        <button onClick={() => onEdit(product)} className="text-blue-600 hover:text-blue-900 mr-2">
          Edit
        </button>
        <button onClick={() => onDelete(product._id)} className="text-red-600 hover:text-red-900">
          Delete
        </button>
      </td>
    </tr>
  );
};

// ✅ Main Component
const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = products.findIndex((p) => p._id === active.id);
      const newIndex = products.findIndex((p) => p._id === over.id);
      setProducts(arrayMove(products, oldIndex, newIndex));
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Manage Products</h1>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={products.map(p => p._id)}
          strategy={verticalListSortingStrategy}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Stock</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <SortableProductItem
                  key={product._id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>
    </div>
  );
};