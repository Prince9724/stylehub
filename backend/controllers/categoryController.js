import Category from '../models/Category.js';

// ========================================
// @desc    Create Category
// @route   POST /api/categories
// @access  Admin Only
// ========================================
export const createCategory = async (req, res) => {
  try {
    const { name, description, image, parentCategory, order } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists'
      });
    }

    // Create category
    const category = await Category.create({
      name,
      description,
      image,
      parentCategory: parentCategory || null,
      order: order || 0
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// ========================================
// @desc    Get All Categories
// @route   GET /api/categories
// @access  Public
// ========================================
export const getAllCategories = async (req, res) => {
  try {
    const { isActive, parentCategory } = req.query;

    // Build filter
    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    if (parentCategory !== undefined) {
      filter.parentCategory = parentCategory === 'null' ? null : parentCategory;
    }

    const categories = await Category.find(filter)
      .sort({ order: 1, name: 1 })
      .populate('parentCategory', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Categories fetched successfully',
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// ========================================
// @desc    Get Single Category
// @route   GET /api/categories/:id
// @access  Public
// ========================================
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id)
      .populate('parentCategory', 'name slug');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category fetched successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// ========================================
// @desc    Get Category by Slug
// @route   GET /api/categories/slug/:slug
// @access  Public
// ========================================
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug })
      .populate('parentCategory', 'name slug');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category fetched successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// ========================================
// @desc    Update Category
// @route   PUT /api/categories/:id
// @access  Admin Only
// ========================================
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, parentCategory, isActive, order } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if name already exists (excluding current category)
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category name already exists'
        });
      }
    }

    // Update fields
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (parentCategory !== undefined) category.parentCategory = parentCategory;
    if (isActive !== undefined) category.isActive = isActive;
    if (order !== undefined) category.order = order;

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// ========================================
// @desc    Delete Category
// @route   DELETE /api/categories/:id
// @access  Admin Only
// ========================================
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has subcategories
    const subcategories = await Category.find({ parentCategory: id });
    if (subcategories.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with subcategories. Delete subcategories first.'
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};