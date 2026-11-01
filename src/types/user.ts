export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  company: string;
  jobTitle: string;
  avatar: string;
  bio: string;
  createdAt?: string;
}

export type UserFormData = Omit<User, 'id' | 'createdAt'>;

export interface UsersState {
  items: User[];
  selectedUser: User | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  actionError: string | null;
  page: number;
  rowsPerPage: number;
}