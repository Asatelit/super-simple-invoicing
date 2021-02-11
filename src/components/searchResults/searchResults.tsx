import React, { useMemo } from 'react';
import { generatePath } from 'react-router-dom';
import { Box, Paper, List, Divider, Typography } from '@material-ui/core';
import { Customer, Item, Estimate, Invoice, Payment, Expense } from 'types';
import { Routes } from 'enums';
import { ListItemNavLink } from '../listItemNavLink/listItemNavLink';

export interface SearchResultsProps {
  searchTerm: string;
  customers: Customer[];
  items: Item[];
  estimate: Estimate[];
  invoices: Invoice[];
  payments: Payment[];
  expenses: Expense[];
}

export const SearchResults = ({
  searchTerm,
  customers,
  items,
  estimate,
  invoices,
  payments,
  expenses,
}: SearchResultsProps) => {
  const checkIsIncludes = (str: string, term: string) => str.toLowerCase().includes(term.toLowerCase());

  const data = {
    customers: useMemo(
      () =>
        customers.filter(
          (c) => checkIsIncludes(c.name, searchTerm) || checkIsIncludes(c.contactName, searchTerm),
        ),
      [customers, searchTerm],
    ),
    items: useMemo(() => items.filter((i) => checkIsIncludes(i.name, searchTerm)), [items, searchTerm]),
    estimate: useMemo(() => estimate.filter((i) => checkIsIncludes(i.estimateNumber, searchTerm)), [
      estimate,
      searchTerm,
    ]),
    invoices: useMemo(() => invoices.filter((i) => checkIsIncludes(i.invoiceNumber, searchTerm)), [
      invoices,
      searchTerm,
    ]),
    payment: useMemo(() => payments.filter((i) => checkIsIncludes(i.paymentNumber, searchTerm)), [
      payments,
      searchTerm,
    ]),
    expenses: useMemo(() => expenses.filter((i) => checkIsIncludes(i.expenseCategory, searchTerm)), [
      expenses,
      searchTerm,
    ]),
  };

  if (searchTerm.length < 3) {
    return null;
  }

  const render = {
    customers: () =>
      data.customers.map((customer) => (
        <ListItemNavLink
          key={`customer_${customer.id}`}
          to={generatePath(Routes.CustomersView, { id: customer.id })}
          primary={customer.name}
          secondary={customer.contactName}
        />
      )),
    items: () =>
      data.items.map((item) => (
        <ListItemNavLink
          key={`customer_${item.id}`}
          to={generatePath(Routes.ItemsEdit, { id: item.id })}
          primary={item.name}
          secondary={item.description}
        />
      )),
  };

  return (
    <Box position="absolute" width="100%" maxHeight="calc(100vh - 100px)" marginTop="0.25rem">
      <Paper elevation={10}>
        <Box overflow="auto">
          <Box margin="0.5rem 1rem" display="flex" justifyContent="space-between">
            <Typography variant="h5">Customers</Typography>
            <Typography variant="body2">{`${data.customers.length} of ${customers.length}`}</Typography>
          </Box>
          {!!data.customers.length && (
            <List dense disablePadding>
              {render.customers()}
            </List>
          )}
          <Divider />
          <Box margin="0.5rem 1rem" display="flex" justifyContent="space-between">
            <Typography variant="h5">Items</Typography>
            <Typography variant="body2">{`${data.items.length} of ${items.length}`}</Typography>
          </Box>
          {!!data.items.length && (
            <List dense disablePadding>
              {render.items()}
            </List>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
