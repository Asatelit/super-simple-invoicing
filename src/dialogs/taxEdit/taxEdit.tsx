import React, { useEffect, useState, FormEvent } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  GridProps,
  Switch,
  TextField,
  TextFieldProps,
} from '@material-ui/core';
import { TaxActionsAddProps, TaxActionsUpdateProps } from 'actions';
import { AppActions, Tax } from 'types';
import { Routes } from 'enums';
import { Form, FormDataProp } from 'components';

export type TaxEditDialogProps = {
  actions: AppActions;
  taxes?: Tax[];
};

export const TaxEditDialog = ({ actions, taxes }: TaxEditDialogProps) => {
  const history = useHistory();
  const { id } = useParams<{ id?: string }>();
  const [data, setData] = useState<TaxActionsAddProps | TaxActionsUpdateProps>({ name: '' });

  useEffect(() => {
    if (!taxes) return;
    // Get data for editing
    const tax = taxes.find((item) => item.id === id);
    if (tax) {
      setData(tax);
    } else {
      history.replace(Routes.Admin);
      toast.error('The requested resource was not found.');
    }
  }, [taxes, history, id]);

  const handlers = {
    // Close dialog
    closeDialog: () => {
      history.goBack();
    },
    // Submit
    submit: (event: FormEvent) => {
      console.info({ event, data });
      event.preventDefault();
      if (taxes) {
        actions.taxes.update(data as TaxActionsUpdateProps); // Update tax
      } else {
        actions.taxes.add(data as TaxActionsAddProps); // Create tax
      }
      handlers.closeDialog();
    },
    // Data update helper
    updateData: (value: Partial<Tax>) => setData({ ...data, ...value }),
  };

  const getCommonTextFieldProps = (id: string): TextFieldProps => ({
    id: `TaxEditDialogForm${id}`,
    name: id,
    fullWidth: true,
    size: 'small',
    variant: 'outlined',
  });

  const gridProps: GridProps = { item: true, sm: 12 };

  const formData: FormDataProp[] = [
    {
      elements: [
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('Name')}
              required
              label="Name"
              value={data.name ?? ''}
              onChange={(e) => handlers.updateData({ name: e.target.value })}
            />
          ),
        },
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('Percent')}
              required
              label="Percent"
              value={data.percent ?? ''}
              onChange={(e) => handlers.updateData({ percent: parseInt(e.target.value, 10) })}
            />
          ),
        },
        {
          gridProps,
          children: (
            <TextField
              {...getCommonTextFieldProps('Description')}
              label="Description"
              value={data.description ?? ''}
              onChange={(e) => handlers.updateData({ description: e.target.value })}
            />
          ),
        },
        {
          gridProps,
          children: (
            <FormControlLabel
              label="Compound Tax"
              control={
                <Switch
                  checked={data.compoundTax ?? false}
                  onChange={(e) => handlers.updateData({ compoundTax: e.target.checked })}
                  color="primary"
                  id="TaxEditDialogFormCompoundTax"
                  name="TaxEditDialogFormCompoundTax"
                  inputProps={{ 'aria-label': 'Compound Tax' }}
                />
              }
            />
          ),
        },
      ],
    },
  ];

  return (
    <>
      <DialogTitle id="form-dialog-title">{taxes ? 'Edit Tax' : 'Add Tax'}</DialogTitle>
      <DialogContent dividers>
        <Form
          id="EditTaxDialogForm"
          data={formData}
          onSubmit={handlers.submit}
          paper={false}
          gutter={false}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handlers.closeDialog} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handlers.submit}
          color="primary"
          variant="contained"
          type="submit"
          form="EditTaxDialogForm"
        >
          {taxes ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </>
  );
};
