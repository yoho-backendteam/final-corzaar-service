import File from "../models/file.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const uploadToCloudinary = (fileBuffer, resourceType) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};





export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { mimetype, size, originalname, buffer } = req.file;
    const type = mimetype.startsWith("image") ? "image" : "video";

   
    if (type === "image" && size > 1 * 1024 * 1024)
      return res.status(400).json({ error: "Image must be ≤ 1MB" });
    if (type === "video" && size > 20 * 1024 * 1024)
      return res.status(400).json({ error: "Video must be ≤ 20MB" });

    const uploadResult = await uploadToCloudinary(buffer, type);

    const newFile = await File.create({
      fileName: originalname,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileType: type,
      fileSize: size
    });

    res.status(201).json({ message: "File uploaded successfully", file: newFile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};









export const getAllFiles = async (req, res) => {
  try {
    const files = await File.find({ isDelete: false }).sort({ createdAt: -1 });

    const filesWithLink = files.map(file => ({
      ...file._doc,
      fileLink: `filelink/${file._id}`, 
    }));

    res.json(filesWithLink);
  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




export const getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    const fileWithLink = {
      ...file._doc,
      fileLink: `filelink/${file._id}`,
    };

    res.status(200).json(fileWithLink);
  } catch (err) {
    console.error("Error fetching file:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};







export const updateFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    await cloudinary.uploader.destroy(file.publicId, { resource_type: file.fileType });

    const { mimetype, size, originalname, buffer } = req.file;
    const type = mimetype.startsWith("image") ? "image" : "video";

    const uploadResult = await uploadToCloudinary(buffer, type);

    file.fileUrl = uploadResult.secure_url;
    file.publicId = uploadResult.public_id;
    file.fileName = originalname;
    file.fileType = type;
    file.fileSize = size;
    await file.save();

    res.json({ message: "File updated successfully", file });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};









export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });
    await cloudinary.uploader.destroy(file.publicId, { resource_type: file.fileType });
    file.isDelete = true;
    file.isActive = false;
    file.deletedAt = new Date();
    await file.save();

    res.json({ message: "File marked as deleted successfully" });
  } catch (err) {
    console.error("Delete file error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
