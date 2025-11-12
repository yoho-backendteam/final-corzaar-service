import cron from "node-cron";
import File from "../models/file.js";
import cloudinary from "../config/cloudinary.js";



cron.schedule("0 0 * * *", async () => {
  try {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); 
    const oldFiles = await File.find({
      createdAt: { $lt: cutoff },
      isDelete: false, 
      isActive: true,  
    });

    for (const file of oldFiles) {
      
      await cloudinary.uploader.destroy(file.publicId, {
        resource_type: file.fileType,
      });

      
      file.isDelete = true;
      file.isActive = false;
      file.deletedAt = new Date();
      await file.save();
    }

    console.log(`Auto-marked ${oldFiles.length} old files as deleted`);
  } catch (error) {
    console.error(" Error in auto-delete cron job:", error);
  }
});

