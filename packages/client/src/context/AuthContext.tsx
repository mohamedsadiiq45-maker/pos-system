import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define user roles
export type UserRole = 'admin' | 'manager' | 'cashier' | 'inventory' | 'inventory_manager' | 'viewer';

// Define permissions for each feature
export interface Permissions {
  // Dashboard
  viewDashboard: boolean;
  
  // POS
  accessPOS: boolean;
  applyDiscount: boolean;
  
  // Products
  viewProducts: boolean;
  addProduct: boolean;
  editProduct: boolean;
  deleteProduct: boolean;
  
  // Categories
  viewCategories: boolean;
  addCategory: boolean;
  editCategory: boolean;
  deleteCategory: boolean;
  
  // Inventory
  viewInventory: boolean;
  adjustStock: boolean;
  
  // Sales
  viewSales: boolean;
  viewSalesHistory: boolean;
  
  // Suppliers
  viewSuppliers: boolean;
  addSupplier: boolean;
  editSupplier: boolean;
  deleteSupplier: boolean;
  
  // Users
  viewUsers: boolean;
  addUser: boolean;
  editUser: boolean;
  deleteUser: boolean;
  
  // Reports
  viewReports: boolean;
  
  // Settings
  manageSettings: boolean;
}

// Role-based permissions configuration
const rolePermissions: Record<UserRole, Permissions> = {
  admin: {
    viewDashboard: true,
    accessPOS: true,
    applyDiscount: true,
    viewProducts: true,
    addProduct: true,
    editProduct: true,
    deleteProduct: true,
    viewCategories: true,
    addCategory: true,
    editCategory: true,
    deleteCategory: true,
    viewInventory: true,
    adjustStock: true,
    viewSales: true,
    viewSalesHistory: true,
    viewSuppliers: true,
    addSupplier: true,
    editSupplier: true,
    deleteSupplier: true,
    viewUsers: true,
    addUser: true,
    editUser: true,
    deleteUser: true,
    viewReports: true,
    manageSettings: true,
  },
  manager: {
    viewDashboard: true,
    accessPOS: true,
    applyDiscount: true,
    viewProducts: true,
    addProduct: true,
    editProduct: true,
    deleteProduct: false,
    viewCategories: true,
    addCategory: true,
    editCategory: true,
    deleteCategory: false,
    viewInventory: true,
    adjustStock: true,
    viewSales: true,
    viewSalesHistory: true,
    viewSuppliers: true,
    addSupplier: true,
    editSupplier: true,
    deleteSupplier: false,
    viewUsers: true,
    addUser: false,
    editUser: false,
    deleteUser: false,
    viewReports: true,
    manageSettings: false,
  },
  cashier: {
    viewDashboard: false,
    accessPOS: true,
    applyDiscount: false,
    viewProducts: true,
    addProduct: false,
    editProduct: false,
    deleteProduct: false,
    viewCategories: true,
    addCategory: false,
    editCategory: false,
    deleteCategory: false,
    viewInventory: false,
    adjustStock: false,
    viewSales: true,
    viewSalesHistory: true,
    viewSuppliers: false,
    addSupplier: false,
    editSupplier: false,
    deleteSupplier: false,
    viewUsers: false,
    addUser: false,
    editUser: false,
    deleteUser: false,
    viewReports: false,
    manageSettings: false,
  },
  inventory: {
    viewDashboard: true,
    accessPOS: false,
    applyDiscount: false,
    viewProducts: true,
    addProduct: true,
    editProduct: true,
    deleteProduct: false,
    viewCategories: true,
    addCategory: true,
    editCategory: true,
    deleteCategory: false,
    viewInventory: true,
    adjustStock: true,
    viewSales: false,
    viewSalesHistory: false,
    viewSuppliers: true,
    addSupplier: true,
    editSupplier: true,
    deleteSupplier: false,
    viewUsers: false,
    addUser: false,
    editUser: false,
    deleteUser: false,
    viewReports: false,
    manageSettings: false,
  },
  inventory_manager: {
    viewDashboard: true,
    accessPOS: false,
    applyDiscount: false,
    viewProducts: true,
    addProduct: true,
    editProduct: true,
    deleteProduct: false,
    viewCategories: true,
    addCategory: true,
    editCategory: true,
    deleteCategory: false,
    viewInventory: true,
    adjustStock: true,
    viewSales: false,
    viewSalesHistory: false,
    viewSuppliers: true,
    addSupplier: true,
    editSupplier: true,
    deleteSupplier: false,
    viewUsers: false,
    addUser: false,
    editUser: false,
    deleteUser: false,
    viewReports: false,
    manageSettings: false,
  },
  viewer: {
    viewDashboard: true,
    accessPOS: false,
    applyDiscount: false,
    viewProducts: true,
    addProduct: false,
    editProduct: false,
    deleteProduct: false,
    viewCategories: true,
    addCategory: false,
    editCategory: false,
    deleteCategory: false,
    viewInventory: true,
    adjustStock: false,
    viewSales: true,
    viewSalesHistory: true,
    viewSuppliers: true,
    addSupplier: false,
    editSupplier: false,
    deleteSupplier: false,
    viewUsers: false,
    addUser: false,
    editUser: false,
    deleteUser: false,
    viewReports: true,
    manageSettings: false,
  },
};

interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  permissions: Permissions;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  hasPermission: (permission: keyof Permissions) => boolean;
}

const defaultPermissions: Permissions = rolePermissions.viewer;

const AuthContext = createContext<AuthContextType>({
  user: null,
  permissions: defaultPermissions,
  isLoading: true,
  login: () => {},
  logout: () => {},
  hasPermission: () => false,
});

// Decode JWT token to get user info
const decodeToken = (token: string): { userId: number; role: UserRole } | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permissions>(defaultPermissions);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserInfo = async (token: string) => {
    const decoded = decodeToken(token);
    if (!decoded) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/users/${decoded.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        const userRole = (userData.role || 'cashier') as UserRole;
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name || userData.email,
          role: userRole,
        });
        setPermissions(rolePermissions[userRole] || defaultPermissions);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    fetchUserInfo(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setPermissions(defaultPermissions);
  };

  const hasPermission = (permission: keyof Permissions): boolean => {
    return permissions[permission] || false;
  };

  return (
    <AuthContext.Provider value={{ user, permissions, isLoading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const getRoleName = (role: UserRole): string => {
  const names: Record<UserRole, string> = {
    admin: 'Administrator',
    manager: 'Manager',
    cashier: 'Cashier',
    inventory: 'Inventory Manager',
    inventory_manager: 'Inventory Manager',
    viewer: 'Viewer',
  };
  return names[role] || role;
};

