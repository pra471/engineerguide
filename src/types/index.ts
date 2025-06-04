export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  imageUrl?: string;
  downloadable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  iconName: string;
}