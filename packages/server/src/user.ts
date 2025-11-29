import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const router = Router();
const prisma = new PrismaClient();

// Get all users
router.get('/', async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  res.json(users);
});

// Get user summary
router.get('/summary', async (req, res) => {
  const today = new Date();
  const last30Days = new Date(today.setDate(today.getDate() - 30));
  const previous30Days = new Date(new Date().setDate(new Date().getDate() - 60));

  const totalUsersLast30Days = await prisma.user.count({
    where: {
      createdAt: {
        gte: last30Days,
      },
    },
  });

  const totalUsersPrevious30Days = await prisma.user.count({
    where: {
      createdAt: {
        gte: previous30Days,
        lt: last30Days,
      },
    },
  });

  const growth = totalUsersPrevious30Days > 0 ? ((totalUsersLast30Days - totalUsersPrevious30Days) / totalUsersPrevious30Days) * 100 : totalUsersLast30Days > 0 ? 100 : 0;

  const totalUsers = await prisma.user.count();

  res.json({ totalUsers, growth });
});

// Get available roles
router.get('/roles', async (req, res) => {
  const roles = [
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full access to all features',
      permissions: ['dashboard', 'pos', 'products', 'categories', 'inventory', 'sales', 'suppliers', 'users', 'reports', 'settings'],
    },
    {
      id: 'manager',
      name: 'Manager',
      description: 'Manage products, inventory, and view reports',
      permissions: ['dashboard', 'pos', 'products', 'categories', 'inventory', 'sales', 'suppliers', 'reports'],
    },
    {
      id: 'cashier',
      name: 'Cashier / POS Operator',
      description: 'Process sales and view inventory only',
      permissions: ['dashboard', 'pos', 'inventory'],
    },
    {
      id: 'inventory_manager',
      name: 'Inventory Manager',
      description: 'Manage products, categories, suppliers and inventory',
      permissions: ['dashboard', 'products', 'categories', 'inventory', 'suppliers'],
    },
    {
      id: 'viewer',
      name: 'Viewer',
      description: 'Read-only access to dashboard and reports',
      permissions: ['dashboard', 'reports'],
    },
  ];
  res.json(roles);
});

// Get a single user
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  res.json(user);
});

// Create a new user
router.post('/', async (req, res) => {
  const { email, password, name, role = 'cashier' } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    res.json(user);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ message: 'User with this email already exists' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Failed to create user' });
    }
  }
});

// Update a user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { email, name, password, role } = req.body;

  let data: any = { email, name };
  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }
  if (role) {
    data.role = role;
  }

  try {
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(user);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ message: 'User with this email already exists' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Failed to update user' });
    }
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

export default router;
