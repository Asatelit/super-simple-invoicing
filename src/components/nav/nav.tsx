import React, { ReactElement } from 'react';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DashboardIcon from '@material-ui/icons/Dashboard';
import StarIcon from '@material-ui/icons/Star';
import PeopleIcon from '@material-ui/icons/People';
import InvoicesIcon from '@material-ui/icons/Description';
import PaymentsIcon from '@material-ui/icons/CreditCard';
import ExpensesIcon from '@material-ui/icons/AttachMoney';
import SettingsIcon from '@material-ui/icons/Settings';
import ReportsIcon from '@material-ui/icons/BarChart';
import { ListItemNavLink } from '../listItemNavLink/listItemNavLink';
import { Routes } from '../../enums';

export type NavItem = {
  icon: ReactElement;
  label: string;
  route: string;
};

export type NavGroup = NavItem[];

const navGroups: NavGroup[] = [
  [
    { icon: <DashboardIcon />, label: 'Dashboard', route: Routes.Dashboard },
    { icon: <PeopleIcon />, label: 'Customers', route: Routes.CustomersList },
    { icon: <StarIcon />, label: 'Items', route: Routes.ItemsList },
  ],
  [
    { icon: <AssignmentIcon />, label: 'Estimates', route: Routes.EstimatesList },
    { icon: <InvoicesIcon />, label: 'Invoices', route: Routes.InvoicesList },
    { icon: <PaymentsIcon />, label: 'Payments', route: Routes.PaymentsList },
    { icon: <ExpensesIcon />, label: 'Expenses', route: Routes.ExpensesList },
  ],
  [
    { icon: <ReportsIcon />, label: 'Reports', route: Routes.Reports },
    { icon: <SettingsIcon />, label: 'Settings', route: Routes.Settings },
  ],
];

export const navItems = navGroups.map((group, groupIndex) => (
  <div key={`nav-group_${groupIndex}`}>
    {group.map((item, itemIndex) => (
      <ListItemNavLink key={`nav-item_${itemIndex}`} to={item.route} primary={item.label} icon={item.icon} />
    ))}
  </div>
));
