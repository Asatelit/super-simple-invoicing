import React, { useState, useEffect, useContext } from 'react';
import {
  PdfDocument,
  PdfFont,
  PdfTextHorizontalAlign,
  IPdfTextDrawSettings,
} from '@grapecity/wijmo.pdf';
import { formatMoney } from 'accounting';
import { ExpensesReportData } from 'types';
import { appContext } from 'hooks';

export interface ExpensesReportProps {
  formatedDateRange: string;
  data: ExpensesReportData;
}

export const ExpensesReport = ({ formatedDateRange, data }: ExpensesReportProps) => {
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
    text('Expenses Report', { font: headerFont, align: PdfTextHorizontalAlign.Center }, 0, doc.y);
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();

    Object.keys(data.data).forEach((key) => {
      const line = data.data[key];
      const lineY = doc.y;
      text(key, { font: bolderFont, align: PdfTextHorizontalAlign.Left }, 0, lineY);
      text(formatMoney(line), { font: regularFont, align: PdfTextHorizontalAlign.Right }, 350, lineY);
      doc.moveDown();
    });

    // Total
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    const totalY = doc.y;
    text('Total Sales', { font: bolderFont, align: PdfTextHorizontalAlign.Left }, 0, totalY);
    text(formatMoney(data.totalExpense), { font: bolderFont, align: PdfTextHorizontalAlign.Right }, 350, totalY);
    doc.moveDown();

    doc.end();
  }, [formatedDateRange, data, settings]);

  return <iframe src={src} frameBorder="0" width="100%" height="100%" title="PDF Expenses Report" />;
};
