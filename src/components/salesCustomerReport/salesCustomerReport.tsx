import React, { useState, useEffect, useContext } from 'react';
import {
  PdfDocument,
  PdfFont,
  PdfPen,
  PdfSolidBrush,
  PdfTextHorizontalAlign,
  IPdfTextDrawSettings,
} from '@grapecity/wijmo.pdf';
import { SalesByCustomer } from 'types';
import { appContext } from 'hooks';

export interface SalesCustomerReportProps {
  formatedDateRange: string;
  data: SalesByCustomer;
}

export const SalesCustomerReport = ({ formatedDateRange, data }: SalesCustomerReportProps) => {
  const [src, setSrc] = useState('');
  const { state } = useContext(appContext);

  const { settings } = state;

  useEffect(() => {
    const doc = new PdfDocument({
      pageSettings: {
        margins: {
          left: 36,
          right: 36,
          top: 36,
          bottom: 36,
        },
      },
      ended: (sender, args) => {
        const url = URL.createObjectURL(new Blob(args.chunks, { type: 'application/pdf' }));
        setSrc(url);
      },
    });

    const regularFont = new PdfFont();
    regularFont.family = 'sans-serif';
    regularFont.size = 12;

    const bolderFont = new PdfFont();
    bolderFont.family = 'sans-serif';
    bolderFont.size = 12;
    bolderFont.weight = 'bold';

    const headerFont = new PdfFont();
    headerFont.family = 'sans-serif';
    headerFont.size = 16;
    headerFont.weight = 'bold';

    const text = (val: string, options?: IPdfTextDrawSettings, x?: number, y?: number): any =>
      doc.drawText(val, x, y, options);

    // Company Name & Date
    const companyNameDateY = doc.y;
    text(
      settings.companyName,
      { font: regularFont, align: PdfTextHorizontalAlign.Left },
      0,
      companyNameDateY,
    );
    text(
      formatedDateRange,
      { font: regularFont, align: PdfTextHorizontalAlign.Right },
      250,
      companyNameDateY,
    );
    doc.moveDown();
    // Header
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    text('Sales Report: By Customer', { font: headerFont, align: PdfTextHorizontalAlign.Center }, 0, doc.y);
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();

    Object.keys(data.data).forEach((key) => {
      const lines = data.data[key];
      // Customer name
      text(key, { font: bolderFont, align: PdfTextHorizontalAlign.Left }, 0, doc.y);
      doc.moveDown();
      // Iterate Lines
      lines.forEach((line) => {
        const lineY = doc.y;
        const lineLabel = `${line.date} ${line.number}`;
        text(lineLabel, { font: regularFont, align: PdfTextHorizontalAlign.Left, brush: new PdfSolidBrush('#909090') }, 0, lineY);
        text(line.amount, { font: regularFont, align: PdfTextHorizontalAlign.Right }, 350, lineY);
      });
      // Divider
      doc.moveDown();
      doc.paths.moveTo(0, doc.y).lineTo(doc.width, doc.y).stroke(new PdfPen('#CCCCCC', 1));
      doc.moveDown();
    });

    // Total
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    const totalY = doc.y;
    text('Total Sales', { font: bolderFont, align: PdfTextHorizontalAlign.Left }, 0, totalY);
    text(data.totalAmount, { font: bolderFont, align: PdfTextHorizontalAlign.Right }, 350, totalY);
    doc.moveDown();


    doc.end();
  }, [formatedDateRange, data, settings]);

  return <iframe src={src} frameBorder="0" width="100%" height="100%" title="PDF Sales Customer Report" />;
};
