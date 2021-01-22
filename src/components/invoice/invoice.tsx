import React from 'react';
import { format } from 'date-fns';
import { formatMoney } from 'accounting';
import {
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { MappedInvoice, Settings, DataCollection, Item } from 'types';

export interface InvoiceProps {
  invoice: MappedInvoice;
  settings: Settings;
  items: DataCollection<Item>;
}

export const Invoice = ({ invoice, items, settings }: InvoiceProps) => {
  return (
    <Paper
      variant="elevation"
      style={{
        height: 'calc(100vh - 200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'start',
        overflow: 'auto',
        padding: '48px',
      }}
    >
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h4" align="right" className="mb-4" gutterBottom>
            INVOICE
          </Typography>
          <Typography variant="body1" align="right" gutterBottom>
            {settings.companyName}
          </Typography>
          <Typography variant="body2" display="block" align="right" gutterBottom>
            {settings.addressLine1}
          </Typography>
          <Typography variant="body2" display="block" align="right" gutterBottom>
            {settings.addressLine2}
          </Typography>
          <Typography variant="body2" display="block" align="right" gutterBottom>
            {settings.addressCity}, {settings.addressZip}
          </Typography>
          <Typography variant="body2" display="block" align="right" gutterBottom>
            {settings.addressState}
          </Typography>
          <Typography variant="body2" display="block" align="right" gutterBottom>
            {settings.addressCountry}
          </Typography>
          <Divider className="my-4" />
        </Grid>
        <Grid item xs={6}>
          {invoice.customer && (
            <>
              <Typography variant="body2" color="textSecondary" display="block" gutterBottom>
                BILL TO
              </Typography>
              <Typography variant="body1" display="block" gutterBottom>
                {invoice.customer?.name}
              </Typography>
              <Typography variant="body2" display="block" gutterBottom>
                {invoice.customer?.billingAddressLine1}
              </Typography>
              <Typography variant="body2" display="block" gutterBottom>
                {invoice.customer?.billingAddressLine2}
              </Typography>
              <Typography variant="body2" display="block" gutterBottom>
                {invoice.customer?.billingCity}, {invoice.customer?.billingZip}
              </Typography>
              <Typography variant="body2" display="block" gutterBottom>
                {invoice.customer?.billingState}
              </Typography>
              <Typography variant="body2" display="block" gutterBottom>
                {invoice.customer?.billingCountry}
              </Typography>
            </>
          )}
        </Grid>
        <Grid item xs={6}>
          <>
            <Typography variant="body2" display="block" align="right" gutterBottom>
              Invoice Number: <span className="ml-3">{invoice.invoiceNumber}</span>
            </Typography>
            <Typography variant="body2" display="block" align="right" gutterBottom>
              Invoice Date: <span className="ml-3">{format(invoice.invoiceDate, 'MM/dd/yyyy')}</span>
            </Typography>
            <Typography variant="body2" display="block" align="right" gutterBottom>
              Payment Due: <span className="ml-3">{format(invoice.dueDate, 'MM/dd/yyyy')}</span>
            </Typography>
          </>
        </Grid>
        <Grid item xs={12}>
          <TableContainer className="mt-4">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoice.lineItems.map((row, index) => (
                  <TableRow key={row.itemId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell component="th" scope="row">
                      {items[row.itemId].name}
                    </TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                    <TableCell align="right">{formatMoney(row.price)}</TableCell>
                    <TableCell align="right">{formatMoney(row.amount)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell rowSpan={3} />
                  <TableCell rowSpan={3} />
                  <TableCell colSpan={2}>Subtotal</TableCell>
                  <TableCell align="right">{formatMoney(invoice.subTotal)}</TableCell>
                </TableRow>
                {!!invoice.discountValue && (
                  <TableRow>
                    <TableCell colSpan={1}>Discount</TableCell>
                    <TableCell align="right">
                      {invoice.discountType === 'fixed'
                        ? formatMoney(invoice.discountValue)
                        : `${invoice.discountValue}%`}
                    </TableCell>
                    <TableCell align="right">{formatMoney(invoice.discountAmount)}</TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell align="right">{formatMoney(invoice.total)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Paper>
  );
};
