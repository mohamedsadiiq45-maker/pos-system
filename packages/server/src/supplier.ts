import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all suppliers with product count
router.get('/', async (req, res) => {
  const suppliers = await prisma.supplier.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: 'asc' },
  });
  res.json(suppliers);
});

// Get a single supplier with products
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const supplier = await prisma.supplier.findUnique({
    where: { id: parseInt(id) },
    include: {
      products: true,
      _count: {
        select: { products: true },
      },
    },
  });
  res.json(supplier);
});

// Create a new supplier
router.post('/', async (req, res) => {
  const { name, contact, email, address } = req.body;
  try {
    const supplier = await prisma.supplier.create({
      data: { name, contact, email, address },
    });
    res.json(supplier);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ message: 'Supplier with this name already exists.' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while creating the supplier.' });
    }
  }
});

// Update a supplier
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, contact, email, address } = req.body;
  try {
    const supplier = await prisma.supplier.update({
      where: { id: parseInt(id) },
      data: { name, contact, email, address },
    });
    res.json(supplier);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ message: 'Supplier with this name already exists.' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while updating the supplier.' });
    }
  }
});

// Delete a supplier
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Check if supplier has products
    const supplier = await prisma.supplier.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { products: true } } },
    });

    if (supplier && supplier._count.products > 0) {
      return res.status(400).json({
        message: `Cannot delete supplier. It has ${supplier._count.products} product(s) assigned.`,
      });
    }

    await prisma.supplier.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Supplier deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete supplier.' });
  }
});

export default router;
