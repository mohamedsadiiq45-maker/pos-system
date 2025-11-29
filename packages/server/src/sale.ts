import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all sales
router.get('/', async (req, res) => {
  const { startDate, endDate } = req.query;

  let where = {};
  if (startDate && endDate) {
    where = {
      createdAt: {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      },
    };
  }

  const sales = await prisma.sale.findMany({
    where,
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
  res.json(sales);
});

router.get('/summary', async (req, res) => {
  const today = new Date();
  const last30Days = new Date(today.setDate(today.getDate() - 30));
  const previous30Days = new Date(new Date().setDate(new Date().getDate() - 60));

  const totalSalesLast30Days = await prisma.sale.aggregate({
    _sum: {
      total: true,
    },
    where: {
      createdAt: {
        gte: last30Days,
      },
    },
  });

  const totalSalesPrevious30Days = await prisma.sale.aggregate({
    _sum: {
      total: true,
    },
    where: {
      createdAt: {
        gte: previous30Days,
        lt: last30Days,
      },
    },
  });

  const currentSales = totalSalesLast30Days._sum.total || 0;
  const previousSales = totalSalesPrevious30Days._sum.total || 0;

  const growth = previousSales > 0 ? ((currentSales - previousSales) / previousSales) * 100 : currentSales > 0 ? 100 : 0;

  res.json({ total: currentSales, growth });
});

router.get('/recent', async (req, res) => {
  const sales = await prisma.sale.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
  res.json(sales);
});

router.get('/today', async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const totalSales = await prisma.sale.aggregate({
    _sum: {
      total: true,
    },
    where: {
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });
  res.json({ total: totalSales._sum.total || 0 });
});

router.get('/net-profit', async (req, res) => {
  const today = new Date();
  const last30Days = new Date(new Date().setDate(new Date().getDate() - 30));
  const previous30Days = new Date(new Date().setDate(new Date().getDate() - 60));

  const calculateNetProfit = async (startDate: Date, endDate?: Date) => {
    const where: any = {
      sale: {
        createdAt: {
          gte: startDate,
        },
      },
    };
    if (endDate) {
      where.sale.createdAt.lt = endDate;
    }

    const saleItems = await prisma.saleItem.findMany({
      where,
      include: {
        product: true,
      },
    });

    const totalRevenue = saleItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalCost = saleItems.reduce((acc, item) => acc + item.product.cost * item.quantity, 0);

    return totalRevenue - totalCost;
  };

  const netProfitLast30Days = await calculateNetProfit(last30Days);
  const netProfitPrevious30Days = await calculateNetProfit(previous30Days, last30Days);

  const growth = netProfitPrevious30Days > 0 ? ((netProfitLast30Days - netProfitPrevious30Days) / netProfitPrevious30Days) * 100 : netProfitLast30Days > 0 ? 100 : 0;

  res.json({ netProfit: netProfitLast30Days, growth });
});

router.get('/daily', async (req, res) => {
  const { period = 'weekly', categoryId } = req.query;

  let gte;
  if (period === 'monthly') {
    gte = new Date(new Date().setDate(new Date().getDate() - 30));
  } else {
    gte = new Date(new Date().setDate(new Date().getDate() - 7));
  }

  const where: any = {
    createdAt: {
      gte,
    },
  };

  if (categoryId) {
    where.items = {
      some: {
        product: {
          categoryId: parseInt(categoryId as string),
        },
      },
    };
  }

  const sales = await prisma.sale.findMany({
    where,
    orderBy: {
      createdAt: 'asc',
    },
  });

  const dailySales = sales.reduce((acc: any, sale) => {
    const date = sale.createdAt.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += sale.total;
    return acc;
  }, {});

  const formattedSales = Object.keys(dailySales).map((date) => ({
    date,
    total: dailySales[date],
  }));

  const total = formattedSales.reduce((acc, sale) => acc + sale.total, 0);
  const average = total / formattedSales.length || 0;


  res.json({ sales: formattedSales, average });
});

// Create a new sale
router.post('/', async (req, res) => {
  const { items, total, discount = 0, paymentMethod = 'Cash' } = req.body;

  try {
    const sale = await prisma.sale.create({
      data: {
        total,
        discount,
        paymentMethod,
        items: {
          create: items.map((item: any) => ({
            quantity: item.quantity,
            price: item.price,
            product: {
              connect: { id: item.productId },
            },
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Update product quantities
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    res.json(sale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;
