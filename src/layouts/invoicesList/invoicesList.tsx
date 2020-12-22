import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Container } from '@material-ui/core';
import { FlexGridFilter } from '@grapecity/wijmo.react.grid.filter';
import { FlexGrid, FlexGridColumn } from '@grapecity/wijmo.react.grid';
import { Common } from 'layouts';
import { BreadcrumbsCrumbProp } from 'components';
import { Invoice } from 'types';
import { Routes } from 'enums';
import styles from './invoicesList.module.css';

export type InvoicesListProps = {
  breadcrumbs?: BreadcrumbsCrumbProp[];
  invoices: Invoice[];
};

export const InvoicesList: React.FC<InvoicesListProps> = ({ breadcrumbs, invoices }) => {
  const renderActions = (
    <Button variant="contained" color="primary" component={RouterLink} to={Routes.EstimatesCreate}>
      New Invoice
    </Button>
  );

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Common title="Invoices" breadcrumbs={breadcrumbs} actions={renderActions}>
        <FlexGrid
          allowAddNew={false}
          autoGenerateColumns={false}
          allowDelete={false}
          allowPinning="SingleColumn"
          newRowAtTop
          showMarquee
          selectionMode="MultiRange"
          validateEdits={false}
          itemsSource={invoices}
        >
          <FlexGridFilter />
          <FlexGridColumn header="Date" binding="invoiceDate" format="MMM d yyyy" width={230} />
          <FlexGridColumn header="Number" binding="invoiceNumber" width={130} />
          <FlexGridColumn header="Customer" binding="customerId" width="*" />
          <FlexGridColumn header="Status" binding="status" width={130} />
          <FlexGridColumn header="Paid Status" binding="paidStatus" width={130} />
          <FlexGridColumn header="Amount Due" binding="total" format="c2" width={130} />
        </FlexGrid>
      </Common>
    </Container>
  );
};
