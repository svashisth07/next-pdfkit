import type { NextApiRequest, NextApiResponse } from "next";
import PDFDocument, { font } from "pdfkit";
import { fetchCrimeArrestData } from "./api";

const chartWidth = 472;
const chartHeight = 110;
const chartX = 74;
const chartY = 152;

const buildPDF = async (res: NextApiResponse) => {
  // build line chart with pdfkit
  const data = await fetchCrimeArrestData();
  const doc = new PDFDocument({
    size: "A4",
    margin: 20,
  });
  doc.on("data", (chunk) => res.write(chunk));
  doc.on("end", () => res.end());

  // Add the logo image to the header
  const logoImgPath = "./public/logo.png";
  doc.image(logoImgPath, 20, 20, { width: 96, height: 16 });
  // Draw a bottom border on the header
  const borderGradient = doc.linearGradient(90, 0, 44, 100);
  borderGradient.stop(0, "#005DFF").stop(0.44, "#00A3FF").stop(1, "#21DDFF");
  doc
    .strokeColor(borderGradient)
    .moveTo(20, 50)
    .lineTo(doc.page.width - 20, 50)
    .lineWidth(2)
    .stroke();

  // Add the location png
  const locationImgPath = "./public/location-share.png";
  doc.image(locationImgPath, 20, 80, { width: 16, height: 16 });
  // add legend with horizontal lines
  doc.fontSize(10).text("Crimes", 40, 84);
  const lineGradient = doc.linearGradient(90, 0, 44, 100);
  lineGradient.stop(0, "#005DFF").stop(0.44, "#00A3FF").stop(1, "#21DDFF");
  doc
    .strokeColor(lineGradient)
    .moveTo(84, 88)
    .lineTo(doc.page.width - 20, 88)
    .lineWidth(2)
    .stroke();

  // create a rectangle chart container section with border radius 8px
  doc
    .roundedRect(20, 100, doc.page.width - 40, 84 + chartHeight, 8)
    .lineWidth(1)
    .fillAndStroke("#F2F4F5", "#F2F4F5");

  // add the chart title with background strip
  doc
    .roundedRect(20, 100, doc.page.width - 40, 24, 8)
    .fillAndStroke("#E8EEFB", "#E8EEFB");
  doc
    .fontSize(9)
    .fillColor("#1463FF")
    .text("Burglary", 38, 108, { width: 100, align: "left" });

  doc
    .roundedRect(40, 132, doc.page.width - 70, 152, 8)
    .fillAndStroke("#FFF", "#FFF");

  doc
    .moveTo(chartX, chartY + chartHeight)
    .lineTo(chartX + chartWidth, chartY + chartHeight)
    .stroke("#BAC2DB");

  // Draw the y-axis
  doc
    .moveTo(chartX, chartY - 5)
    .lineTo(chartX, chartY + chartHeight)
    .stroke("#BAC2DB");

  // Draw the chart data
  const values = data.map((d) => d.arrests);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue;
  const xStep = chartWidth / (data.length - 1);
  const yStep = chartHeight / valueRange;

  // add labels for y-axis left
  const yLabelValues = [0, 25, 50, 75, 100];
  for (let i = 0; i < yLabelValues.length; i++) {
    const yLabelY =
      chartY + chartHeight - yLabelValues[i] * (chartHeight / 100);
    const label = Math.round(maxValue * (yLabelValues[i] / 100));
    doc
      .fillColor("#BAC2DB")
      .fontSize(8)
      .text(label.toString(), chartX - 44, yLabelY - 5, {
        width: 40,
        align: "right",
      });
    // draw x-axis line
    doc
      .moveTo(chartX, yLabelY)
      .lineTo(chartX + chartWidth, yLabelY)
      .stroke("#BAC2DB");
  }

  // labels for x-axis bottom
  doc
    .fontSize(8)
    .fillColor("#BAC2DB")
    .text(data[0].year.toString(), chartX, chartY + chartHeight + 5, {
      width: 20,
      align: "center",
    });

  doc
    .lineWidth(2)
    .moveTo(chartX, chartY + chartHeight - (values[0] - minValue) * yStep);
  for (let i = 1; i < data.length; i++) {
    const x = chartX + i * xStep;
    const y = chartY + chartHeight - (values[i] - minValue) * yStep;
    // Add a labels for x-axis bottom
    doc
      .fontSize(8)
      .fillColor("#BAC2DB")
      .text(data[i].year.toString(), x - 10, chartY + chartHeight + 5, {
        width: 20,
        align: "center",
      });
    doc.lineTo(x, y);
  }
  doc.stroke("#1463FF");

  //add vertical text on y-axis
  doc
    .rotate(-90, { origin: [26, 220] })
    .fontSize(9)
    .fillColor("#1E1E1E")
    .text("Arrests", 26, 220);

  doc.end();
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment; filename=test.pdf",
  });
  buildPDF(stream);
}
