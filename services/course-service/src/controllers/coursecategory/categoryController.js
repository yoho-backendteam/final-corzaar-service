// CREATE
export const createCategory = async (req, res) => {
  const { error, value } = createCategorySchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details.map(err => err.message)
    });
  }

  try {
    const category = new Category(value);
    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating category",
      error: err.message
    });
  }
};


// GET ALL (pagination)
export const getCategories = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      Category.find({ is_deleted: false })
        .sort("-createdAt")
        .skip(skip)
        .limit(limit),

      // FIXED: count only non-deleted
      Category.countDocuments({ is_deleted: false })
    ]);

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching categories",
      error: err.message
    });
  }
};


// GET ONE
export const getCategoryById = async (req, res) => {
  const id = req.params.id;

  try {
    const category = await Category.findOne({ uuid: id, is_deleted: false });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category fetched",
      data: category
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching category",
      error: err.message
    });
  }
};


// UPDATE
export const updateCategory = async (req, res) => {
  const id = req.params.id;

  const { error, value } = updateCategorySchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details.map(err => err.message)
    });
  }

  try {
    const category = await Category.findOneAndUpdate(
      { uuid: id, is_deleted: false },
      value,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating category",
      error: err.message
    });
  }
};


// DELETE (soft delete)
export const deleteCategory = async (req, res) => {
  const id = req.params.id;

  try {
    const category = await Category.findOneAndUpdate(
      { uuid: id, is_deleted: false },
      { is_deleted: true },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: category
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting category",
      error: err.message
    });
  }
};
