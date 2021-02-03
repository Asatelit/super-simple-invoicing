import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { formatMoney } from 'accounting';
import { PdfDocument, PdfFont, PdfPen, PdfTextHorizontalAlign, IPdfTextDrawSettings } from '@grapecity/wijmo.pdf';
import { Color } from '@grapecity/wijmo';
import { Payment as PaymentType, Settings } from 'types';

export interface PaymentProps {
  settings: Settings;
  payment: PaymentType;
}

export const Payment = ({ payment, settings }: PaymentProps) => {
  const [src, setSrc] = useState('');

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

    const text = (val: string, options?: IPdfTextDrawSettings, x?: number, y?: number): any => doc.drawText(val, x, y, options);

    // Company Name
    text(settings.companyName, { font: bolderFont, align: PdfTextHorizontalAlign.Right });
    if (settings.companyName) doc.moveDown();
    // Address Line 1
    text(settings.addressLine1, { font: regularFont, align: PdfTextHorizontalAlign.Right });
    if (settings.addressLine1) doc.moveDown();
    // Address Line 2
    text(settings.addressLine2, { font: regularFont, align: PdfTextHorizontalAlign.Right });
    if (settings.addressLine2) doc.moveDown();
    // City, State
    text(settings.addressCity, { font: regularFont, align: PdfTextHorizontalAlign.Right });
    if (settings.addressCity) doc.moveDown();
    // Country, ZIP
    text(`${settings.addressCountry} ${settings.addressZip}`, { font: regularFont, align: PdfTextHorizontalAlign.Right });
    if (settings.addressCountry || settings.addressZip) doc.moveDown();
    // Phone
    text(settings.phone, { font: regularFont, align: PdfTextHorizontalAlign.Right });
    if (settings.phone) doc.moveDown();
    // Divider
    doc.moveDown();
    doc.paths.moveTo(0, doc.y).lineTo(doc.width, doc.y).stroke(new PdfPen(new Color('#EEEEEE'), 0.1));
    doc.moveDown();
    // Header
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    text('Payment Receipt', { font: headerFont, align: PdfTextHorizontalAlign.Center });
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    // Payment Date
    const PaymentDateY = doc.y;
    text('Payment Date', { font: regularFont, align: PdfTextHorizontalAlign.Left, width: 100 }, 250, PaymentDateY);
    text(format(payment.paymentDate, 'MM/dd/yyyy'), { font: regularFont, align: PdfTextHorizontalAlign.Right }, 350, PaymentDateY);
    doc.moveDown();
    // Payment Number
    const PaymentNumberY = doc.y;
    text('Payment Number', { font: regularFont, align: PdfTextHorizontalAlign.Left }, 250, PaymentNumberY);
    text(payment.paymentNumber, { font: regularFont, align: PdfTextHorizontalAlign.Right }, 350, PaymentNumberY);
    doc.moveDown();
    // Payment Mode
    const PaymentModeY = doc.y;
    text('Payment Mode', { font: regularFont, align: PdfTextHorizontalAlign.Left }, 250, PaymentModeY);
    text(payment.paymentMode || '-', { font: regularFont, align: PdfTextHorizontalAlign.Right }, 350, PaymentModeY);
    doc.moveDown();
    // Amount Received
    const PaymentAmountY = doc.y;
    text('Amount Received', { font: bolderFont, align: PdfTextHorizontalAlign.Left }, 250, PaymentAmountY);
    text(formatMoney(payment.amount), { font: bolderFont, align: PdfTextHorizontalAlign.Right }, 350, PaymentAmountY);
    doc.moveDown();


    doc.end();
  }, [payment, settings]);

  return <iframe src={src} frameBorder="0" width="100%" height="100%" title="PDF Payment Receipt" />;
};
