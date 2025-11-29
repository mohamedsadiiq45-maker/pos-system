import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all categories with parent/child relationships
router.get('/', async (req, res) => {
  const categories = await prisma.category.findMany({
    include: {
      parent: true,
      children: true,
      _count: {
        select: { products: true },
      },
    },
    orderBy: [
      { parentId: 'asc' },
      { name: 'asc' },
    ],
  });
  res.json(categories);
});

// Get only parent categories (for dropdown)
router.get('/parents', async (req, res) => {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: true,
    },
    orderBy: { name: 'asc' },
  });
  res.json(categories);
});

// Get a single category with its children
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const category = await prisma.category.findUnique({
    where: { id: parseInt(id) },
    include: {
      parent: true,
      children: true,
      products: true,
    },
  });
  res.json(category);
});

// Create a new category
router.post('/', async (req, res) => {
  const { name, parentId, imageUrl } = req.body;
  try {
    const category = await prisma.category.create({
      data: {
        name,
        imageUrl,
        parentId: parentId ? parseInt(parentId) : null,
      },
      include: {
        parent: true,
      },
    });
    res.json(category);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ message: 'Category with this name already exists.' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while creating the category.' });
    }
  }
});

// Update a category
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, parentId, imageUrl } = req.body;
  
  // Prevent setting self as parent
  if (parentId && parseInt(parentId) === parseInt(id)) {
    return res.status(400).json({ message: 'Category cannot be its own parent.' });
  }
  
  try {
    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        name,
        imageUrl,
        parentId: parentId ? parseInt(parentId) : null,
      },
      include: {
        parent: true,
        children: true,
      },
    });
    res.json(category);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ message: 'Category with this name already exists.' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while updating the category.' });
    }
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // First, update children to remove parent reference
    await prisma.category.updateMany({
      where: { parentId: parseInt(id) },
      data: { parentId: null },
    });
    
    // Then delete the category
    await prisma.category.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Category deleted' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete category. It may have products assigned.' });
  }
});

export default router;
