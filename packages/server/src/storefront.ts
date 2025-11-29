import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==================== SLIDERS ====================

// Get all sliders (public - for storefront)
router.get('/sliders', async (req, res) => {
  const activeOnly = req.query.active === 'true';
  const sliders = await prisma.slider.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: { order: 'asc' },
  });
  res.json(sliders);
});

// Get single slider
router.get('/sliders/:id', async (req, res) => {
  const slider = await prisma.slider.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  res.json(slider);
});

// Create slider
router.post('/sliders', async (req, res) => {
  try {
    const slider = await prisma.slider.create({
      data: req.body,
    });
    res.json(slider);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create slider' });
  }
});

// Update slider
router.put('/sliders/:id', async (req, res) => {
  try {
    const slider = await prisma.slider.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(slider);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update slider' });
  }
});

// Delete slider
router.delete('/sliders/:id', async (req, res) => {
  await prisma.slider.delete({
    where: { id: parseInt(req.params.id) },
  });
  res.json({ message: 'Slider deleted' });
});

// ==================== PROMO BANNERS ====================

router.get('/promo-banners', async (req, res) => {
  const activeOnly = req.query.active === 'true';
  const position = req.query.position as string;
  const banners = await prisma.promoBanner.findMany({
    where: {
      ...(activeOnly && { isActive: true }),
      ...(position && { position }),
    },
    orderBy: { order: 'asc' },
  });
  res.json(banners);
});

router.get('/promo-banners/:id', async (req, res) => {
  const banner = await prisma.promoBanner.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  res.json(banner);
});

router.post('/promo-banners', async (req, res) => {
  try {
    const banner = await prisma.promoBanner.create({
      data: req.body,
    });
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create promo banner' });
  }
});

router.put('/promo-banners/:id', async (req, res) => {
  try {
    const banner = await prisma.promoBanner.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update promo banner' });
  }
});

router.delete('/promo-banners/:id', async (req, res) => {
  await prisma.promoBanner.delete({
    where: { id: parseInt(req.params.id) },
  });
  res.json({ message: 'Promo banner deleted' });
});

// ==================== DEALS ====================

router.get('/deals', async (req, res) => {
  const activeOnly = req.query.active === 'true';
  const now = new Date();
  const deals = await prisma.deal.findMany({
    where: activeOnly ? {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
    } : undefined,
    include: {
      product: {
        include: { category: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(deals);
});

router.get('/deals/:id', async (req, res) => {
  const deal = await prisma.deal.findUnique({
    where: { id: parseInt(req.params.id) },
    include: {
      product: {
        include: { category: true },
      },
    },
  });
  res.json(deal);
});

router.post('/deals', async (req, res) => {
  try {
    const deal = await prisma.deal.create({
      data: {
        ...req.body,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
      },
      include: {
        product: {
          include: { category: true },
        },
      },
    });
    res.json(deal);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create deal' });
  }
});

router.put('/deals/:id', async (req, res) => {
  try {
    const deal = await prisma.deal.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...req.body,
        ...(req.body.startDate && { startDate: new Date(req.body.startDate) }),
        ...(req.body.endDate && { endDate: new Date(req.body.endDate) }),
      },
      include: {
        product: {
          include: { category: true },
        },
      },
    });
    res.json(deal);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update deal' });
  }
});

router.delete('/deals/:id', async (req, res) => {
  await prisma.deal.delete({
    where: { id: parseInt(req.params.id) },
  });
  res.json({ message: 'Deal deleted' });
});

// ==================== FEATURED SECTIONS ====================

router.get('/featured-sections', async (req, res) => {
  const activeOnly = req.query.active === 'true';
  const sections = await prisma.featuredSection.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: { order: 'asc' },
  });
  
  // Populate items for each section
  const populatedSections = await Promise.all(
    sections.map(async (section) => {
      const itemIds = section.itemIds.split(',').filter(Boolean).map(Number);
      let items: any[] = [];
      
      if (section.type === 'products' && itemIds.length > 0) {
        items = await prisma.product.findMany({
          where: { id: { in: itemIds } },
          include: { category: true },
        });
      } else if (section.type === 'categories' && itemIds.length > 0) {
        items = await prisma.category.findMany({
          where: { id: { in: itemIds } },
        });
      }
      
      return { ...section, items };
    })
  );
  
  res.json(populatedSections);
});

router.get('/featured-sections/:id', async (req, res) => {
  const section = await prisma.featuredSection.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  res.json(section);
});

router.post('/featured-sections', async (req, res) => {
  try {
    const section = await prisma.featuredSection.create({
      data: req.body,
    });
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create featured section' });
  }
});

router.put('/featured-sections/:id', async (req, res) => {
  try {
    const section = await prisma.featuredSection.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update featured section' });
  }
});

router.delete('/featured-sections/:id', async (req, res) => {
  await prisma.featuredSection.delete({
    where: { id: parseInt(req.params.id) },
  });
  res.json({ message: 'Featured section deleted' });
});

// ==================== BRANDS ====================

router.get('/brands', async (req, res) => {
  const activeOnly = req.query.active === 'true';
  const brands = await prisma.brand.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: { order: 'asc' },
  });
  res.json(brands);
});

router.get('/brands/:id', async (req, res) => {
  const brand = await prisma.brand.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  res.json(brand);
});

router.post('/brands', async (req, res) => {
  try {
    const brand = await prisma.brand.create({
      data: req.body,
    });
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create brand' });
  }
});

router.put('/brands/:id', async (req, res) => {
  try {
    const brand = await prisma.brand.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update brand' });
  }
});

router.delete('/brands/:id', async (req, res) => {
  await prisma.brand.delete({
    where: { id: parseInt(req.params.id) },
  });
  res.json({ message: 'Brand deleted' });
});

// ==================== FEATURES ====================

router.get('/features', async (req, res) => {
  const activeOnly = req.query.active === 'true';
  const features = await prisma.feature.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: { order: 'asc' },
  });
  res.json(features);
});

router.get('/features/:id', async (req, res) => {
  const feature = await prisma.feature.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  res.json(feature);
});

router.post('/features', async (req, res) => {
  try {
    const feature = await prisma.feature.create({
      data: req.body,
    });
    res.json(feature);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create feature' });
  }
});

router.put('/features/:id', async (req, res) => {
  try {
    const feature = await prisma.feature.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(feature);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update feature' });
  }
});

router.delete('/features/:id', async (req, res) => {
  await prisma.feature.delete({
    where: { id: parseInt(req.params.id) },
  });
  res.json({ message: 'Feature deleted' });
});

// ==================== STORE INFO ====================

router.get('/store-info', async (req, res) => {
  const info = await prisma.storeInfo.findMany();
  // Convert to object format
  const infoObj = info.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {} as Record<string, string>);
  res.json(infoObj);
});

router.put('/store-info', async (req, res) => {
  try {
    const updates = Object.entries(req.body);
    await Promise.all(
      updates.map(([key, value]) =>
        prisma.storeInfo.upsert({
          where: { key },
          update: { value: value as string },
          create: { key, value: value as string },
        })
      )
    );
    res.json({ message: 'Store info updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update store info' });
  }
});

// ==================== AGGREGATED STOREFRONT DATA ====================

router.get('/homepage', async (req, res) => {
  const now = new Date();
  
  const [
    sliders,
    promoBanners,
    deals,
    featuredSections,
    brands,
    features,
    storeInfo,
    newArrivals,
    featuredProducts,
    topProducts,
    categories,
  ] = await Promise.all([
    prisma.slider.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
    prisma.promoBanner.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
    prisma.deal.findMany({
      where: { isActive: true, startDate: { lte: now }, endDate: { gte: now } },
      include: { product: { include: { category: true } } },
    }),
    prisma.featuredSection.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
    prisma.brand.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
    prisma.feature.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
    prisma.storeInfo.findMany(),
    prisma.product.findMany({
      where: { isNewArrival: true },
      include: { category: true },
      take: 10,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.findMany({
      where: { isFeatured: true },
      include: { category: true },
      take: 10,
    }),
    // Get top selling products
    prisma.saleItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    }),
    prisma.category.findMany({
      where: { parentId: null },
      include: { _count: { select: { products: true } } },
    }),
  ]);

  // Get product details for top products
  const topProductIds = topProducts.map(p => p.productId);
  const topProductDetails = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    include: { category: true },
  });

  // Populate featured sections
  const populatedSections = await Promise.all(
    featuredSections.map(async (section) => {
      const itemIds = section.itemIds.split(',').filter(Boolean).map(Number);
      let items: any[] = [];
      
      if (section.type === 'products' && itemIds.length > 0) {
        items = await prisma.product.findMany({
          where: { id: { in: itemIds } },
          include: { category: true },
        });
      } else if (section.type === 'categories' && itemIds.length > 0) {
        items = await prisma.category.findMany({
          where: { id: { in: itemIds } },
          include: { _count: { select: { products: true } } },
        });
      }
      
      return { ...section, items };
    })
  );

  res.json({
    sliders,
    promoBanners,
    deals,
    featuredSections: populatedSections,
    brands,
    features,
    storeInfo: storeInfo.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, string>),
    newArrivals,
    featuredProducts,
    topProducts: topProductDetails,
    categories,
  });
});

export default router;

