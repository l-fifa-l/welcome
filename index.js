const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Name and image path
const name = 'Vivek';
const imagePath = path.resolve(__dirname, 'assets', 'onboarding.png');
const imageData = fs.readFileSync(imagePath);
const base64Image = imageData.toString('base64');

// Base HTML content function
const baseHtmlContent = (daysRemaining) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background-color: #f0f0f0; /* Set a light gray background */
    }
    .container {
      position: relative;
      width: 1000px;
      height: 360px;
      overflow: hidden;
      border: 1px solid #ddd;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .background-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      object-fit: cover;
    }
    .content {
      position: absolute;
      top: 20px;
      left: 20px;
      text-align: left;
      color: black; /* Text color on top of the image */
      padding: 20px;
      border-radius: 5px;
    }
    h2 {
      margin: 0;
      font-size: 2.5em;
    }
    p {
      margin: 5px 0 0;
      font-size: 2.5em;
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="data:image/png;base64,${base64Image}" class="background-img" alt="Background Image">
    <div class="content">
      <h2>Welcome, ${name}</h2>
      <p>${daysRemaining} days until you join Google</p>
    </div>
  </div>
</body>
</html>
`;

// Directory to save screenshots
const saveDirectory = 'screenshots';

// Ensure the directory exists
if (!fs.existsSync(saveDirectory)) {
    fs.mkdirSync(saveDirectory);
}

// Total number of days to take screenshots
const totalDays = 60;

// Function to take screenshot for a given day
async function takeScreenshot(day) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        // Navigate to a blank page to ensure the network is idle before setting content
        await page.goto('about:blank', { waitUntil: 'networkidle0' });

        // Generate HTML content for the current day
        const htmlContent = baseHtmlContent(day);

        // Set the HTML content
        await page.setContent(htmlContent);

        // Set the viewport size to ensure the content is fully visible
        await page.setViewport({ width: 1000, height: 360, deviceScaleFactor: 2 });

        // Generate filename for the screenshot
        const filename = path.join(saveDirectory, `days_remaining_${day}.png`);

        // Take screenshot and save it
        await page.screenshot({ path: filename, fullPage: true });
        console.log(`Screenshot saved as ${filename}`);
    } catch (error) {
        console.error('Error occurred while taking screenshot:', error);
    } finally {
        // Close the browser
        await browser.close();
    }
}

// Main function to loop through each day and take screenshots
async function main() {
    try {
        for (let day = totalDays; day >= 0; day--) {
            await takeScreenshot(day);
        }
        console.log('All screenshots taken.');
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

// Run the main function
main();
