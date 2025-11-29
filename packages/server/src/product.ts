import { Router } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all products
router.get('/', async (req, res) => {
  const products = await prisma.product.findMany({
    include: { category: true, supplier: true },
  });
  res.json(products);
});

router.get('/summary', async (req, res) => {
  const today = new Date();
  const last30Days = new Date(today.setDate(today.getDate() - 30));
  const previous30Days = new Date(new Date().setDate(new Date().getDate() - 60));

  const totalProductsSoldLast30Days = await prisma.saleItem.aggregate({
    _sum: {
      quantity: true,
    },
    where: {
      sale: {
        createdAt: {
          gte: last30Days,
        },
      },
    },
  });

  const totalProductsSoldPrevious30Days = await prisma.saleItem.aggregate({
    _sum: {
      quantity: true,
    },
    where: {
      sale: {
        createdAt: {
          gte: previous30Days,
          lt: last30Days,
        },
      },
    },
  });

  const currentSold = totalProductsSoldLast30Days._sum.quantity || 0;
  const previousSold = totalProductsSoldPrevious30Days._sum.quantity || 0;

  const growth = previousSold > 0 ? ((currentSold - previousSold) / previousSold) * 100 : currentSold > 0 ? 100 : 0;

  res.json({ totalProductsSold: currentSold, growth });
});

router.get('/top', async (req, res) => {
  const topProducts = await prisma.saleItem.groupBy({
    by: ['productId'],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take: 5,
  });

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: topProducts.map((p) => p.productId),
      },
    },
    include: {
      category: true,
    },
  });

  const productMap = products.reduce((acc, product) => {
    acc[product.id] = product;
    return acc;
  }, {} as Record<number, (typeof products)[0]>);

  const result = topProducts.map((p) => {
    const product = productMap[p.productId];
    return {
      ...product,
      sold: p._sum.quantity,
    };
  });

  res.json(result);
});

// Get a single product
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: { category: true, supplier: true },
  });
  res.json(product);
});

// Create a new product
router.post('/', async (req, res) => {
      const { name, description, price, cost, quantity, categoryId, supplierId, imageUrl, isFeatured, isNewArrival } = req.body;
    try {
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          cost,
          quantity,
          categoryId,
          supplierId,
          imageUrl,
          isFeatured: isFeatured || false,
          isNewArrival: isNewArrival || false,
        },
    });
    res.json(product);
  } catch (error: any) {
    if (error.code === 'P2002') { // Unique constraint violation
      res.status(400).json({ message: 'Product with this name already exists.' });
    } else if (error.code === 'P2003') { // Foreign key constraint violation
      res.status(400).json({ message: 'Invalid category or supplier ID.' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while creating the product.' });
    }
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, cost, quantity, categoryId, supplierId, imageUrl, isFeatured, isNewArrival } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price,
        cost,
        quantity,
        categoryId,
        supplierId,
        imageUrl,
        isFeatured,
        isNewArrival,
      },
    });
    res.json(product);
  } catch (error: any) {
    if (error.code === 'P2002') { // Unique constraint violation
      res.status(400).json({ message: 'Product with this name already exists.' });
    } else if (error.code === 'P2003') { // Foreign key constraint violation
      res.status(400).json({ message: 'Invalid category or supplier ID.' });
    } else if (error.code === 'P2025') { // Record to update not found
      res.status(404).json({ message: 'Product not found.' });
    }
    else {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while updating the product.' });
    }
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({
    where: { id: parseInt(id) },
  });
  res.json({ message: 'Product deleted' });
});

export default router;
