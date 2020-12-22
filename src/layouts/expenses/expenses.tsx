import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Container } from '@material-ui/core';
import { FlexGridFilter } from '@grapecity/wijmo.react.grid.filter';
import { FlexGrid, FlexGridColumn } from '@grapecity/wijmo.react.grid';
import { Common } from 'layouts';
import { BreadcrumbsCrumbProp } from 'components';
import { Expense } from 'types';
import { Routes } from 'enums';
import styles from './expenses.module.css';

export type ExpensesProps = {
  breadcrumbs?: BreadcrumbsCrumbProp[];
  expenses: Expense[];
};

export const Expenses: React.FC<ExpensesProps> = ({ breadcrumbs, expenses }) => {
  const renderActions = (
    <Button variant="contained" color="primary" component={RouterLink} to={Routes.ExpensesCreate}>
      New Expense
    </Button>
  );

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Common title="Expenses" breadcrumbs={breadcrumbs} actions={renderActions}>
        <FlexGrid
          allowAddNew={false}
          autoGenerateColumns={false}
          allowDelete={false}
          allowPinning="SingleColumn"
          newRowAtTop
          showMarquee
          selectionMode="MultiRange"
          validateEdits={false}
          itemsSource={expenses}
        >
          <FlexGridFilter />
          <FlexGridColumn header="Date" binding="expenseDate" format="MMM d yyyy" width={230} />
          <FlexGridColumn header="Category" binding="expenseCategoryId" width={130} />
          <FlexGridColumn header="Customer" binding="customerId" width="*" />
          <FlexGridColumn header="Note" binding="notes" width={130} />
          <FlexGridColumn header="Amount" binding="amount" format="c2" width={130} />
        </FlexGrid>
      </Common>
    </Container>
  );
};
