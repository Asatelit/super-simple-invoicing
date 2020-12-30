import React, { Fragment, ReactElement, ReactNode } from 'react';
import { Box, Divider, Grid, GridProps, Paper, Typography, Button } from '@material-ui/core';

export type FormDataProp = {
  action?: ReactNode;
  elements: { gridProps: GridProps; children: ReactElement | null }[];
  label?: string;
  subtitle?: string;
};

export type FormProps = {
  id?: string;
  data: FormDataProp[];
  className?: string;
  gutter?: boolean;
  paper?: boolean;
  submit?: string;
  subtitle?: string;
  onSubmit?: (event: React.FormEvent) => void;
};

export const Form = ({
  data,
  submit,
  id = 'Form',
  paper = true,
  gutter = true,
  className = '',
  onSubmit = () => null,
}: FormProps) => {
  const style = gutter ? { padding: '48px', marginBottom: '48px' } : {};

  const renderForm = (
    <form id={id} className={className} onSubmit={onSubmit}>
      {data.map(({ action, label, elements, subtitle }, groupKey) => (
        <React.Fragment key={`FormGroup${groupKey}`}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            style={{ marginBottom: '24px' }}
          >
            <div>
              {label && (
                <Typography display="block" variant="h6">
                  {label}
                </Typography>
              )}
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
              {elements.map(({ gridProps, children }, elementKey) =>
                children ? (
                  <Grid key={`FormGroup${groupKey}-FormControl${elementKey}`} {...gridProps}>
                    {children}
                  </Grid>
                ) : null,
              )}
            </Fragment>
          </Grid>
          {groupKey < data.length - 1 && <Divider style={{ margin: '42px 0' }} />}
        </React.Fragment>
      ))}
      <Button type="submit" hidden={!submit} variant="contained" color="primary" className="mt-4">
        {submit}
      </Button>
    </form>
  );

  return paper ? <Paper style={style}>{renderForm}</Paper> : <>{renderForm}</>;
};
