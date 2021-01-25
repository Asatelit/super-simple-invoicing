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
import { MappedEstimate, Settings, Item, DataCollection } from 'types';

export interface EstimateProps {
  estimate: MappedEstimate;
  settings: Settings;
  items: DataCollection<Item>;
}

export const Estimate = ({ estimate, settings, items }: EstimateProps) => {
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
          <Typography variant="h4" align="right" className="mb-4">
            ESTIMATE
          </Typography>
          <Typography variant="body1" align="right">
            {settings.companyName}
          </Typography>
          <Typography variant="body2" display="block" align="right">
            {settings.addressLine1}
          </Typography>
          <Typography variant="body2" display="block" align="right">
            {settings.addressLine2}
          </Typography>
          <Typography variant="body2" display="block" align="right">
            {settings.addressCity}, {settings.addressZip}
          </Typography>
          <Typography variant="body2" display="block" align="right">
            {settings.addressState}
          </Typography>
          <Typography variant="body2" display="block" align="right">
            {settings.addressCountry}
          </Typography>
          <Divider className="my-4" />
        </Grid>
        <Grid item xs={6}>
          {estimate.customer && (
            <>
              <Typography variant="body2" color="textSecondary" display="block" gutterBottom>
                BILL TO
              </Typography>
              <Typography variant="body1" display="block" gutterBottom>
                {estimate.customer?.name}
              </Typography>
              <Typography variant="body2" display="block" gutterBottom>
                {estimate.customer?.billingAddressLine1}
              </Typography>
              <Typography variant="body2" display="block" gutterBottom>
                {estimate.customer?.billingAddressLine2}
              </Typography>
              <Typography variant="body2" display="block" gutterBottom>
                {estimate.customer?.billingCity}, {estimate.customer?.billingZip}
              </Typography>
              <Typography variant="body2" display="block" gutterBottom>
                {estimate.customer?.billingState}
              </Typography>
              <Typography variant="body2" display="block" gutterBottom>
                {estimate.customer?.billingCountry}
              </Typography>
            </>
          )}
        </Grid>
        <Grid item xs={6}>
          <>
            <Typography variant="body2" display="block" align="right" gutterBottom>
              Estimate Number: <span className="ml-3">{estimate.estimateNumber}</span>
            </Typography>
            <Typography variant="body2" display="block" align="right" gutterBottom>
              Estimate Date: <span className="ml-3">{format(estimate.estimateDate, 'MM/dd/yyyy')}</span>
            </Typography>
            {estimate.expiryDate && (
              <Typography variant="body2" display="block" align="right" gutterBottom>
                Expires On: <span className="ml-3">{format(estimate.expiryDate, 'MM/dd/yyyy')}</span>
              </Typography>
            )}
            <Typography variant="body2" display="block" align="right" gutterBottom>
              Grand Total: <b className="ml-3">{formatMoney(estimate.total)}</b>
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
                {estimate.lineItems.map((row, index) => (
                  <TableRow key={`${row.itemId}_${index}`}>
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
                  <TableCell align="right">{formatMoney(estimate.subTotal)}</TableCell>
                </TableRow>
                {!!estimate.discountValue && (
                  <TableRow>
                    <TableCell colSpan={1}>Discount</TableCell>
                    <TableCell align="right">
                      {estimate.discountType === 'fixed'
                        ? formatMoney(estimate.discountValue)
                        : `${estimate.discountValue}%`}
                    </TableCell>
                    <TableCell align="right">{formatMoney(estimate.discountAmount)}</TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell align="right">{formatMoney(estimate.total)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Paper>
  );
};
