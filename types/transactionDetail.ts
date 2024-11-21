import { z } from 'zod';
import { transactionDetailSchema } from '@/schemas/transactionDetail';

export type TransactionDetailType = z.infer<typeof transactionDetailSchema>;

