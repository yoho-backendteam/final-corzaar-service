import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import Handlebars from "handlebars";

export const generateEnrollmentPDFBuffer = async (enrollment) => {
  try {
    Handlebars.registerHelper("calcTotal", function (price, discount) {
      const p = Number(price) || 0;
      const d = Number(discount) || 0;
      return p - d;
    });

    Handlebars.registerHelper("formatDate", function (dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    });

   
    const templatePath = path.join(process.cwd(), "src", "pdf", "enrollmentTemplate.html");
    const templateFile = fs.readFileSync(templatePath, "utf8");
    const template = Handlebars.compile(templateFile);

    const html = template({ enrollment: enrollment.toObject() });

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });


    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();
    return pdfBuffer; 
  } catch (err) {
    console.error("PDF Generation Error:", err);
    throw err;
  }
};
