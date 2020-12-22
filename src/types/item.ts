export type Item = {
  createdAt: string;
  description: string | null;
  id: string;
  isDeleted: boolean;
  name: string;
  price: number;
  taxesIds: string[];
  unitId: string | null;
  updatedAt: string;
};
