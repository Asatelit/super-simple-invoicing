import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Container } from '@material-ui/core';
import { FlexGridFilter } from '@grapecity/wijmo.react.grid.filter';
import { FlexGrid, FlexGridColumn } from '@grapecity/wijmo.react.grid';
import { Common } from 'layouts';
import { BreadcrumbsCrumbProp } from 'components';
import { Item } from '../../types';
import { Routes } from 'enums';
import styles from './items.module.css';

export type ItemsProps = {
  breadcrumbs?: BreadcrumbsCrumbProp[];
  items: Item[];
};

export const Items: React.FC<ItemsProps> = ({ breadcrumbs, items }) => {
  const renderActions = (
    <Button variant="contained" color="primary" component={RouterLink} to={Routes.ItemsCreate}>
      New Item
    </Button>
  );

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Common title="Items" breadcrumbs={breadcrumbs} actions={renderActions}>
        <FlexGrid
          autoGenerateColumns={false}
          allowAddNew={false}
          allowDelete
          allowPinning="SingleColumn"
          newRowAtTop
          showMarquee
          selectionMode="MultiRange"
          validateEdits={false}
          itemsSource={items}
        >
          <FlexGridFilter />
          <FlexGridColumn header="Name" binding="name" width="*" />
          <FlexGridColumn header="Unit" binding="unitId" width={130} />
          <FlexGridColumn header="Price" binding="price" format="c2" width={130} />
        </FlexGrid>
      </Common>
    </Container>
  );
};
