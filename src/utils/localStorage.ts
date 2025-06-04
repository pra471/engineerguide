import { User, Resource, Category } from '../types';

// Initialize local storage with sample data if empty
export const initializeLocalStorage = (): void => {
  // Initialize users if not exist
  if (!localStorage.getItem('users')) {
    const defaultUsers: User[] = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123', // In a real app, this would be hashed
        role: 'admin',
      },
      {
        id: '2',
        username: 'user',
        email: 'user@example.com',
        password: 'user123', // In a real app, this would be hashed
        role: 'user',
      },
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }

  // Initialize categories if not exist
  if (!localStorage.getItem('categories')) {
    const defaultCategories: Category[] = [
      {
        id: '1',
        name: 'Mathematics',
        description: 'Essential mathematics for engineering',
        iconName: 'Calculator',
      },
      {
        id: '2',
        name: 'Physics',
        description: 'Applied physics for engineering students',
        iconName: 'Atom',
      },
      {
        id: '3',
        name: 'Computer Science',
        description: 'Programming and computing fundamentals',
        iconName: 'Code',
      },
      {
        id: '4',
        name: 'Mechanical Engineering',
        description: 'Principles of mechanical engineering',
        iconName: 'Cog',
      },
    ];
    localStorage.setItem('categories', JSON.stringify(defaultCategories));
  }

  // Initialize resources if not exist
  if (!localStorage.getItem('resources')) {
    const defaultResources: Resource[] = [
      {
        id: '1',
        title: 'Calculus Fundamentals',
        description: 'Essential calculus concepts for engineers',
        category: '1',
        content: 'This guide covers derivatives, integrals, and their applications in engineering problems.',
        imageUrl: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg',
        downloadable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Mechanics and Motion',
        description: 'Understanding forces and motion in engineering',
        category: '2',
        content: 'Learn about Newton\'s laws, momentum, and energy conservation principles.',
        imageUrl: 'https://images.pexels.com/photos/2432221/pexels-photo-2432221.jpeg',
        downloadable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Introduction to Python',
        description: 'Python programming for engineering applications',
        category: '3',
        content: 'Get started with Python, a versatile language for data analysis and automation.',
        imageUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
        downloadable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        title: 'Thermodynamics Principles',
        description: 'Understanding energy transfer and conversion',
        category: '4',
        content: 'This guide covers the laws of thermodynamics and their applications.',
        imageUrl: 'https://images.pexels.com/photos/247763/pexels-photo-247763.jpeg',
        downloadable: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem('resources', JSON.stringify(defaultResources));
  }

  // Initialize current user if not exist
  if (!localStorage.getItem('currentUser')) {
    localStorage.setItem('currentUser', '');
  }
};

// User related functions
export const getUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const addUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
};

export const authenticateUser = (identifier: string, password: string): User | null => {
  const users = getUsers();
  // Allow login by email or username
  const user = users.find(
    (u) => (u.username === identifier || u.email === identifier) && u.password === password
  );
  return user || null;
};

export const setCurrentUser = (user: User | null): void => {
  localStorage.setItem('currentUser', user ? JSON.stringify(user) : '');
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('currentUser');
  return user && user !== '' ? JSON.parse(user) : null;
};

export const logout = (): void => {
  localStorage.setItem('currentUser', '');
};

// Category related functions
export const getCategories = (): Category[] => {
  const categories = localStorage.getItem('categories');
  return categories ? JSON.parse(categories) : [];
};

export const getCategoryById = (id: string): Category | undefined => {
  const categories = getCategories();
  return categories.find(category => category.id === id);
};

export const addCategory = (category: Omit<Category, 'id'>): Category => {
  const categories = getCategories();
  const newCategory: Category = {
    ...category,
    id: Date.now().toString(),
  };
  
  categories.push(newCategory);
  localStorage.setItem('categories', JSON.stringify(categories));
  return newCategory;
};

export const updateCategory = (id: string, updates: Partial<Category>): Category | null => {
  const categories = getCategories();
  const index = categories.findIndex(category => category.id === id);
  
  if (index === -1) return null;
  
  const updatedCategory = { ...categories[index], ...updates };
  categories[index] = updatedCategory;
  
  localStorage.setItem('categories', JSON.stringify(categories));
  return updatedCategory;
};

export const deleteCategory = (id: string): boolean => {
  let categories = getCategories();
  const initialLength = categories.length;
  
  categories = categories.filter(category => category.id !== id);
  
  if (categories.length === initialLength) return false;
  
  localStorage.setItem('categories', JSON.stringify(categories));
  return true;
};

// Resource related functions
export const getResources = (): Resource[] => {
  const resources = localStorage.getItem('resources');
  return resources ? JSON.parse(resources) : [];
};

export const getResourceById = (id: string): Resource | undefined => {
  const resources = getResources();
  return resources.find(resource => resource.id === id);
};

export const getResourcesByCategory = (categoryId: string): Resource[] => {
  const resources = getResources();
  return resources.filter(resource => resource.category === categoryId);
};

export const addResource = (resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>): Resource => {
  const resources = getResources();
  const now = new Date().toISOString();
  
  const newResource: Resource = {
    ...resource,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now,
  };
  
  resources.push(newResource);
  localStorage.setItem('resources', JSON.stringify(resources));
  return newResource;
};

export const updateResource = (id: string, updates: Partial<Resource>): Resource | null => {
  const resources = getResources();
  const index = resources.findIndex(resource => resource.id === id);
  
  if (index === -1) return null;
  
  const updatedResource = {
    ...resources[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  resources[index] = updatedResource;
  localStorage.setItem('resources', JSON.stringify(resources));
  return updatedResource;
};

export const deleteResource = (id: string): boolean => {
  let resources = getResources();
  const initialLength = resources.length;
  
  resources = resources.filter(resource => resource.id !== id);
  
  if (resources.length === initialLength) return false;
  
  localStorage.setItem('resources', JSON.stringify(resources));
  return true;
};

export const toggleDownloadable = (id: string): Resource | null => {
  const resources = getResources();
  const index = resources.findIndex(resource => resource.id === id);
  
  if (index === -1) return null;
  
  const updatedResource = {
    ...resources[index],
    downloadable: !resources[index].downloadable,
    updatedAt: new Date().toISOString(),
  };
  
  resources[index] = updatedResource;
  localStorage.setItem('resources', JSON.stringify(resources));
  return updatedResource;
};