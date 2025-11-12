import { Faq } from "../../models/faqSchema.js";
import { faqValidation } from "../../validations/faqValidations.js";


// Create FAQ
export const createFaq = async (req, res) => {
    try {
        const { error, value } = faqValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                status: false, 
                message: error.details[0].message 
            });
        }

        const newFaq = new Faq({
            question: value.question,
            answer: value.answer,
            category: value.category,
            assignedTo: value.assignedTo
        });

        const savedFaq = await newFaq.save();

        res.status(201).json({
            status: true,
            message: "FAQ created successfully",
            data: savedFaq
        });

    } catch (error) {
        console.error("Error creating FAQ:", error);
        res.status(500).json({ 
            status: false,
            message: "Internal server error",
            error: error.message 
        });
    }
};

// Get all FAQs with optional pagination
export const getFaqs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const faqs = await Faq.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalFaqs = await Faq.countDocuments();

    res.status(200).json({
      status: true,
      currentPage: page,
      totalPages: Math.ceil(totalFaqs / limit),
      totalFaqs,
      data: faqs
    });
  } catch (err) {
    res.status(500).json({ 
      status: false,
      message: err.message 
    });
  }
};

// Get FAQs by type (role) with pagination
export const getFaqsByType = async (req, res) => {
  try {
    const { role } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!role) {
      return res.status(400).json({
        status: false,
        message: "Role parameter is required"
      });
    }

    if (!['user', 'merchant'].includes(role)) {
      return res.status(400).json({
        status: false,
        message: "Role must be either 'user' or 'merchant'"
      });
    }

    const filter = { assignedTo: role };
    
    const faqs = await Faq.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalFaqs = await Faq.countDocuments(filter);

    res.status(200).json({
      status: true,
      currentPage: page,
      totalPages: Math.ceil(totalFaqs / limit),
      totalFaqs,
      data: faqs
    });
  } catch (err) {
    res.status(500).json({ 
      status: false,
      message: err.message 
    });
  }
};

// Get FAQs by type and category with pagination
export const getFaqsByTypeAndCategory = async (req, res) => {
  try {
    const { role, category } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (role) {
      if (!['user', 'merchant'].includes(role)) {
        return res.status(400).json({
          status: false,
          message: "Role must be either 'user' or 'merchant'"
        });
      }
      filter.assignedTo = role;
    }
    if (category) filter.category = category;

    const faqs = await Faq.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalFaqs = await Faq.countDocuments(filter);

    res.status(200).json({
      status: true,
      currentPage: page,
      totalPages: Math.ceil(totalFaqs / limit),
      totalFaqs,
      data: faqs
    });
  } catch (err) {
    res.status(500).json({ 
      status: false,
      message: err.message 
    });
  }
};

// Get Single FAQ
export const getFaqById = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ 
        status: false,
        message: "FAQ not found" 
      });
    }
    res.status(200).json({
      status: true,
      data: faq
    });
  } catch (err) {
    res.status(500).json({ 
      status: false,
      message: err.message 
    });
  }
};

// Update FAQ
export const updateFaq = async (req, res) => {
  try {
    const { error, value } = faqValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        status: false, 
        message: error.details[0].message 
      });
    }

    const faq = await Faq.findByIdAndUpdate(
      req.params.id, 
      {
        question: value.question,
        answer: value.answer,
        category: value.category,
        assignedTo: value.assignedTo
      }, 
      { new: true, runValidators: true }
    );
    
    if (!faq) {
      return res.status(404).json({ 
        status: false,
        message: "FAQ not found" 
      });
    }
    
    res.status(200).json({
      status: true,
      message: "FAQ updated successfully",
      data: faq
    });
  } catch (err) {
    res.status(500).json({ 
      status: false,
      message: err.message 
    });
  }
};

// Delete FAQ
export const deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ 
        status: false,
        message: "FAQ not found" 
      });
    }
    res.status(200).json({ 
      status: true,
      message: "FAQ deleted successfully" 
    });
  } catch (err) {
    res.status(500).json({ 
      status: false,
      message: err.message 
    });
  }
};

// get By Status 
export const getByStatus = async (req,res) => {
    try {
        const { isActive } = req.body
        console.log("is",isActive)
        const statusData = await Faq.findOne({isActive})
        res.status(200)
        .json({
            status : 200,
            data : statusData,
            message : "success"
        })
    } catch (error) {
        res.status(500).json({Error : error})
    }
}