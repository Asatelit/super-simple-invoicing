import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Container } from '@material-ui/core';
import { FlexGridFilter } from '@grapecity/wijmo.react.grid.filter';
import { FlexGrid, FlexGridColumn } from '@grapecity/wijmo.react.grid';
import { Common } from 'layouts';
import { BreadcrumbsCrumbProp } from 'components';
import { Estimate } from 'types';
import { Routes } from 'enums';
import styles from './estimatesList.module.css';

export type EstimatesListProps = {
  breadcrumbs?: BreadcrumbsCrumbProp[];
  estimates: Estimate[];
};

export const EstimatesList: React.FC<EstimatesListProps> = ({ breadcrumbs, estimates }) => {
  const renderActions = (
    <Button variant="contained" color="primary" component={RouterLink} to={Routes.EstimatesCreate}>
      New Estimate
    </Button>
  );

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Common title="Estimates" breadcrumbs={breadcrumbs} actions={renderActions}>
        <FlexGrid
          allowAddNew={false}
          autoGenerateColumns={false}
          allowDelete={false}
          allowPinning="SingleColumn"
          newRowAtTop
          showMarquee
          selectionMode="MultiRange"
          validateEdits={false}
          itemsSource={estimates}
        >
          <FlexGridFilter />
          <FlexGridColumn header="Date" binding="estimateDate" format="MMM d yyyy" width={230} />
          <FlexGridColumn header="Customer" binding="customerId" width="*" />
          <FlexGridColumn header="Status" binding="status" width={130} />
          <FlexGridColumn header="Amount Due" binding="total" format="c2" width={130} />
        </FlexGrid>
      </Common>
    </Container>
  );
};
