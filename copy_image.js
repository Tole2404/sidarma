const fs = require('fs');
try {
  fs.copyFileSync(
    "C:\\Users\\Acer\\.gemini\\antigravity-ide\\brain\\a1f8cdf8-bfd2-40db-bdc4-f04dab43f2aa\\login_cover_1783404677636.png",
    "c:\\SIDARMA\\public\\login_cover.png"
  );
  console.log("Image copied successfully!");
} catch (e) {
  console.error("Error copying file:", e);
  process.exit(1);
}
