import React, { Fragment, ReactElement } from 'react';
import { Divider, Grid, GridProps, Paper, Typography } from '@material-ui/core';

export type FormDataProp = {
  label: string;
  elements: { gridProps: GridProps; children: ReactElement }[];
};

export type FormProps = {
  id?: string;
  data: FormDataProp[];
  onSubmit?: (event: React.FormEvent) => void;
};

export const Form = ({ data, id = 'Form', onSubmit = () => null }: FormProps) => (
  <Paper style={{ padding: '48px', marginBottom: '48px' }}>
    <form id={id} onSubmit={onSubmit}>
      {data.map(({ label, elements }, groupKey) => (
        <React.Fragment key={`FormGroup${groupKey}`}>
          <Typography variant="h6" style={{ marginBottom: '24px' }}>
            {label}
          </Typography>
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
