import { AnySchema } from 'yup';

export default function validate(schema: AnySchema, data: any) {
  return schema.validate(data);
}
