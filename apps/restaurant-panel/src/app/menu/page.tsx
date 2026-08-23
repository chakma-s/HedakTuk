"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Loader2, X, Check, Utensils, AlertCircle } from "lucide-react";
import { fetchAPI } from "@/lib/api";

interface MenuCategory {
  id: string;
  name: string;
  sortOrder: number;
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  category?: { id: string; name: string };
  categoryId?: string;
  price: number;
  isVeg: boolean;
  isAvailable: boolean;
  preparationTimeMinutes?: number;
}

export default function MenuEditorPage() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Modal States
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<MenuItem | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    isVeg: true,
    isAvailable: true,
    preparationTimeMinutes: "15",
  });
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Get my restaurant
      const myRestaurants = await fetchAPI('/restaurants');
      const myRestaurant = myRestaurants?.data?.[0];
      if (!myRestaurant) {
        setLoading(false);
        return;
      }
      setRestaurantId(myRestaurant.id);

      // 2. Fetch categories & items in parallel
      const [catsRes, itemsRes] = await Promise.all([
        fetchAPI(`/restaurants/${myRestaurant.id}/menu/categories`),
        fetchAPI(`/restaurants/${myRestaurant.id}/menu/items`),
      ]);

      if (catsRes) setCategories(catsRes);
      if (itemsRes) setItems(itemsRes);
    } catch (err: any) {
      console.error("Failed to load menu data:", err);
      showNotification("Failed to load menu. Please refresh.", "error");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      categoryId: categories[0]?.id || "",
      price: "",
      isVeg: true,
      isAvailable: true,
      preparationTimeMinutes: "15",
    });
    setShowItemModal(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      categoryId: item.category?.id || item.categoryId || categories[0]?.id || "",
      price: item.price.toString(),
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      preparationTimeMinutes: (item.preparationTimeMinutes || 15).toString(),
    });
    setShowItemModal(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantId || !formData.name || !formData.price || !formData.categoryId) {
      showNotification("Please fill in all required fields.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        categoryId: formData.categoryId,
        price: parseFloat(formData.price),
        isVeg: formData.isVeg,
        isAvailable: formData.isAvailable,
        preparationTimeMinutes: parseInt(formData.preparationTimeMinutes, 10) || 15,
      };

      if (editingItem) {
        // Update existing item
        await fetchAPI(`/restaurants/${restaurantId}/menu/items/${editingItem.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        showNotification(`Updated "${payload.name}" successfully!`);
      } else {
        // Create new item
        await fetchAPI(`/restaurants/${restaurantId}/menu/items`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        showNotification(`Added "${payload.name}" to menu!`);
      }

      setShowItemModal(false);
      await loadData();
    } catch (err: any) {
      console.error("Save error:", err);
      showNotification(err.message || "Failed to save item.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!restaurantId || !showDeleteModal) return;
    setIsSubmitting(true);
    try {
      await fetchAPI(`/restaurants/${restaurantId}/menu/items/${showDeleteModal.id}`, {
        method: "DELETE",
      });
      showNotification(`Deleted "${showDeleteModal.name}"`);
      setShowDeleteModal(null);
      await loadData();
    } catch (err: any) {
      console.error("Delete error:", err);
      showNotification(err.message || "Failed to delete item.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    if (!restaurantId) return;
    try {
      const updatedStatus = !item.isAvailable;
      await fetchAPI(`/restaurants/${restaurantId}/menu/items/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isAvailable: updatedStatus }),
      });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isAvailable: updatedStatus } : i))
      );
      showNotification(
        `"${item.name}" marked as ${updatedStatus ? "Available" : "Out of Stock"}`
      );
    } catch (err: any) {
      console.error("Availability toggle error:", err);
      showNotification("Failed to update status.", "error");
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantId || !newCategoryName.trim()) return;

    setIsSubmitting(true);
    try {
      await fetchAPI(`/restaurants/${restaurantId}/menu/categories`, {
        method: "POST",
        body: JSON.stringify({
          name: newCategoryName.trim(),
          sortOrder: categories.length + 1,
        }),
      });
      showNotification(`Category "${newCategoryName}" created!`);
      setNewCategoryName("");
      setShowCategoryModal(false);
      await loadData();
    } catch (err: any) {
      console.error("Create category error:", err);
      showNotification(err.message || "Failed to create category.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.category?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      item.category?.id === selectedCategory ||
      item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col relative">
      {/* Toast Notification */}
      {feedbackMsg && (
        <div
          className={`absolute top-0 right-0 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium transition-all ${
            feedbackMsg.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {feedbackMsg.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          {feedbackMsg.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Menu Editor</h1>
          <p className="text-muted">Manage your restaurant's dishes, pricing, and categories.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center gap-2 bg-surface hover:bg-surface-alt border border-border text-foreground font-bold py-2 px-4 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Category
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm"
          >
            <Plus size={18} />
            Add New Dish
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-surface border border-border rounded-xl flex flex-col flex-1 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border bg-surface-alt flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input
              type="text"
              placeholder="Search dishes or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
            >
              <option value="all">All Categories ({items.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-alt sticky top-0 border-b border-border text-muted">
                <tr>
                  <th className="px-6 py-4 font-bold">Dish Name</th>
                  <th className="px-6 py-4 font-bold">Category</th>
                  <th className="px-6 py-4 font-bold">Price</th>
                  <th className="px-6 py-4 font-bold">Stock Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-alt/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center border ${
                            item.isVeg ? "border-green-600" : "border-red-600"
                          }`}
                          title={item.isVeg ? "Vegetarian" : "Non-Vegetarian"}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.isVeg ? "bg-green-600" : "bg-red-600"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{item.name}</p>
                          {item.description && (
                            <p className="text-xs text-muted line-clamp-1">{item.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {item.category?.name || "Uncategorized"}
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">₹{item.price}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleAvailability(item)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          item.isAvailable
                            ? "bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20"
                            : "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20"
                        }`}
                      >
                        {item.isAvailable ? "● Available" : "○ Out of Stock"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-muted hover:text-primary hover:bg-surface rounded transition-colors"
                          title="Edit Dish"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(item)}
                          className="p-1.5 text-muted hover:text-red-500 hover:bg-surface rounded transition-colors"
                          title="Delete Dish"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted">
                      <Utensils className="mx-auto w-10 h-10 mb-2 opacity-30" />
                      <p className="font-medium">No dishes found.</p>
                      <p className="text-xs mt-1">Click "Add New Dish" to create your first item.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add / Edit Dish Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-surface-alt">
              <h2 className="text-lg font-bold text-foreground">
                {editingItem ? "Edit Dish" : "Add New Dish"}
              </h2>
              <button
                onClick={() => setShowItemModal(false)}
                className="text-muted hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                  Dish Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paneer Butter Masala"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the ingredients or preparation..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    placeholder="250"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                    Food Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isVeg: true })}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                        formData.isVeg
                          ? "bg-green-500/10 border-green-500 text-green-500"
                          : "border-border text-muted hover:border-foreground"
                      }`}
                    >
                      Veg
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isVeg: false })}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                        !formData.isVeg
                          ? "bg-red-500/10 border-red-500 text-red-500"
                          : "border-border text-muted hover:border-foreground"
                      }`}
                    >
                      Non-Veg
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                    Preparation Time (mins)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="15"
                    value={formData.preparationTimeMinutes}
                    onChange={(e) =>
                      setFormData({ ...formData, preparationTimeMinutes: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <label htmlFor="isAvailable" className="text-sm font-medium text-foreground cursor-pointer">
                  Available for ordering immediately
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-4 py-2 bg-surface hover:bg-surface-alt border border-border rounded-lg text-sm font-bold text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-primary hover:bg-orange-600 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  {editingItem ? "Save Changes" : "Create Dish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-surface-alt">
              <h2 className="text-lg font-bold text-foreground">Add New Category</h2>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-muted hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Desserts, Beverages, Starters"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 bg-surface hover:bg-surface-alt border border-border rounded-lg text-sm font-bold text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newCategoryName.trim()}
                  className="px-4 py-2 bg-primary hover:bg-orange-600 text-white rounded-lg text-sm font-bold flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Delete Dish?</h3>
            <p className="text-sm text-muted mb-6">
              Are you sure you want to remove <strong className="text-foreground">"{showDeleteModal.name}"</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 bg-surface hover:bg-surface-alt border border-border rounded-lg text-sm font-bold text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteItem}
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold flex items-center gap-2"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
