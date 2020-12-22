import React from 'react';
import { Breadcrumbs, BreadcrumbsCrumbProp } from '../../components';
import styles from './common.module.css';

export type CommonProps = {
  title?: string;
  actions?: React.ReactElement;
  breadcrumbs?: BreadcrumbsCrumbProp[];
};

export const Common: React.FC<CommonProps> = ({ title = null, actions = null, breadcrumbs, children }) => (
  <>
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {breadcrumbs && <Breadcrumbs className={styles.breadcrumbs} crumbs={breadcrumbs} />}
      </div>
      <div>{actions}</div>
    </div>
    <div className={styles.body}>{children}</div>
  </>
);
