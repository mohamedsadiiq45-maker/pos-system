import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import CategoryPage from './components/CategoryPage';
import AddCategoryPage from './components/AddCategoryPage';
import EditCategoryPage from './components/EditCategoryPage';
import ProductPage from './components/ProductPage';
import AddProductPage from './components/AddProductPage';
import EditProductPage from './components/EditProductPage';
import SupplierPage from './components/SupplierPage';
import AddSupplierPage from './components/AddSupplierPage';
import EditSupplierPage from './components/EditSupplierPage';
import SalesPage from './components/SalesPage';
import NewSalePage from './components/NewSalePage';
import InventoryPage from './components/InventoryPage';
import UserPage from './components/UserPage';
import AddUserPage from './components/AddUserPage';
import EditUserPage from './components/EditUserPage';
import SalesReportPage from './components/SalesReportPage';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';
import MediaPage from './components/MediaPage';
import StorefrontPage from './components/StorefrontPage';
import SlidersPage from './components/SlidersPage';
import DealsPage from './components/DealsPage';
import BrandsPage from './components/BrandsPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <App />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'categories',
            element: <CategoryPage />,
          },
          {
            path: 'categories/new',
            element: <AddCategoryPage />,
          },
          {
            path: 'categories/edit/:id',
            element: <EditCategoryPage />,
          },
          {
            path: 'products',
            element: <ProductPage />,
          },
          {
            path: 'products/new',
            element: <AddProductPage />,
          },
          {
            path: 'products/edit/:id',
            element: <EditProductPage />,
          },
          {
            path: 'suppliers',
            element: <SupplierPage />,
          },
          {
            path: 'suppliers/new',
            element: <AddSupplierPage />,
          },
          {
            path: 'suppliers/edit/:id',
            element: <EditSupplierPage />,
          },
          {
            path: 'sales',
            element: <SalesPage />,
          },
          {
            path: 'sales/new',
            element: <NewSalePage />,
          },
          {
            path: 'inventory',
            element: <InventoryPage />,
          },
          {
            path: 'users',
            element: <UserPage />,
          },
          {
            path: 'users/new',
            element: <AddUserPage />,
          },
          {
            path: 'users/edit/:id',
            element: <EditUserPage />,
          },
          {
            path: 'reports/sales',
            element: <SalesReportPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
          {
            path: 'media',
            element: <MediaPage />,
          },
          {
            path: 'storefront',
            element: <StorefrontPage />,
          },
          {
            path: 'storefront/sliders',
            element: <SlidersPage />,
          },
          {
            path: 'storefront/deals',
            element: <DealsPage />,
          },
          {
            path: 'storefront/brands',
            element: <BrandsPage />,
          },
        ],
      },
    ],
  },
]);

export default router;

