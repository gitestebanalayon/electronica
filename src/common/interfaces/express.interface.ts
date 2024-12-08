import { Request } from 'express'; // Importar Request

declare global {
    namespace Express {
      interface Request {
        user?: {
          id: number;
          email: string;
          groupId: string[];
          permissions: {
            create: boolean;
            read: boolean;
            update: boolean;
            delete: boolean;
          };
          is_root: boolean;
          is_staff: boolean;
          iat: number;
          exp: number;
        };
      }
    }
  }