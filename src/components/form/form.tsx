import React, { Fragment, ReactElement, ReactNode } from 'react';
import { Box, Divider, Grid, GridProps, Paper, Typography } from '@material-ui/core';

export type FormDataProp = {
  action?: ReactNode;
  elements: { gridProps: GridProps; children: ReactElement }[];
  label: string;
  subtitle?: string;
};

export type FormProps = {
  id?: string;
  data: FormDataProp[];
  subtitle?: string;
  onSubmit?: (event: React.FormEvent) => void;
};

export const Form = ({ data, id = 'Form', onSubmit = () => null }: FormProps) => (
  <Paper style={{ padding: '48px', marginBottom: '48px' }}>
    <form id={id} onSubmit={onSubmit}>
      {data.map(({ action, label, elements, subtitle }, groupKey) => (
        <React.Fragment key={`FormGroup${groupKey}`}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            style={{ marginBottom: '24px' }}
          >
            <div>
              <Typography display="block" variant="h6">
                {label}
              </Typography>
              {subtitle && (
                <Typography
                  display="block"
                  variant="body1"
                  color="textSecondary"
                  style={{ margin: '12px 0 24px' }}
                >
                  {subtitle}
                </Typography>
              )}
            </div>
            {action}
          </Box>
          <Grid container spacing={3}>
            <Fragment>
              {elements.map(({ gridProps, children }, elementKey) => (
                <Grid key={`FormGroup${groupKey}-FormControl${elementKey}`} {...gridProps}>
                  {children}
                </Grid>
              ))}
            </Fragment>
          </Grid>
          {groupKey < data.length - 1 && <Divider style={{ margin: '42px 0' }} />}
        </React.Fragment>
      ))}
      <button type="submit" hidden />
    </form>
  </Paper>
);
