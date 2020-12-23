export type Item = {
  createdAt: Date;
  description: string;
  id: string;
  isDeleted: boolean;
  name: string;
  price: number;
  taxesIds: string[];
  unit: string;
  updatedAt: Date;
};
