import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Container } from '@material-ui/core';
import { FlexGridFilter } from '@grapecity/wijmo.react.grid.filter';
import { FlexGrid, FlexGridColumn } from '@grapecity/wijmo.react.grid';
import { Common } from 'layouts';
import { BreadcrumbsCrumbProp } from 'components';
import { Payment } from 'types';
import { Routes } from 'enums';
import styles from './payments.module.css';

export type PaymentsProps = {
  breadcrumbs?: BreadcrumbsCrumbProp[];
  payments: Payment[];
};

export const Payments: React.FC<PaymentsProps> = ({ breadcrumbs, payments }) => {
  const renderActions = (
    <Button variant="contained" color="primary" component={RouterLink} to={Routes.PaymentsCreate}>
      New Payment
    </Button>
  );

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Common title="Payments" breadcrumbs={breadcrumbs} actions={renderActions}>
        <FlexGrid
          allowAddNew={false}
          autoGenerateColumns={false}
          allowDelete={false}
          allowPinning="SingleColumn"
          newRowAtTop
          showMarquee
          selectionMode="MultiRange"
          validateEdits={false}
          itemsSource={payments}
        >
          <FlexGridFilter />
          <FlexGridColumn header="Date" binding="paymentDate" format="MMM d yyyy" width={230} />
          <FlexGridColumn header="Payment Number" binding="paymentNumber" width={130} />
          <FlexGridColumn header="Customer" binding="customerId" width="*" />
          <FlexGridColumn header="Payment Mode" binding="paymentMode" width={130} />
          <FlexGridColumn header="Invoice" binding="invoiceId" width={130} />
          <FlexGridColumn header="Amount" binding="amount" format="c2" width={130} />
        </FlexGrid>
      </Common>
    </Container>
  );
};
