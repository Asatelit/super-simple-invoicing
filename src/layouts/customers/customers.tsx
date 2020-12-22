import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Button } from '@material-ui/core';
import { FlexGridFilter } from '@grapecity/wijmo.react.grid.filter';
import { FlexGrid, FlexGridColumn } from '@grapecity/wijmo.react.grid';
import { Common } from 'layouts';
import { BreadcrumbsCrumbProp } from 'components';
import { Customer } from 'types';
import { Routes } from 'enums';
import styles from './customers.module.css';

export type CustomersProps = {
  customers: Customer[];
  breadcrumbs?: BreadcrumbsCrumbProp[];
};

export const Customers: React.FC<CustomersProps> = ({ breadcrumbs, customers }) => {
  const renderActions = (
    <Button variant="contained" color="primary" component={RouterLink} to={Routes.CustomersCreate}>
      New Customer
    </Button>
  );

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Common title="Customers" breadcrumbs={breadcrumbs} actions={renderActions}>
        <FlexGrid
          allowAddNew={false}
          autoGenerateColumns={false}
          allowDelete
          allowPinning="SingleColumn"
          newRowAtTop
          showMarquee
          selectionMode="MultiRange"
          validateEdits={false}
          itemsSource={customers}
        >
          <FlexGridFilter />
          <FlexGridColumn header="Display Name" binding="name" width="*" />
          <FlexGridColumn header="Contact Name" binding="contactName" width={230} />
          <FlexGridColumn header="Phone" binding="phone" width={130} />
        </FlexGrid>
      </Common>
    </Container>
  );
};
