import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Default settings
const defaultSettings: Record<string, string> = {
  shopName: 'Super Electronics',
  shopTagline: 'Your Electronics Partner',
  shopEmail: 'contact@superelectronics.com',
  shopPhone: '+253 77 00 00 00',
  shopAddress: 'Djibouti City, Djibouti',
  shopWebsite: 'www.superelectronics.com',
  currency: 'DJF',
  currencySymbol: 'DJF',
  taxRate: '0',
  taxEnabled: 'false',
  receiptFooter: 'Thank you for shopping with us!',
  lowStockThreshold: '10',
  logoUrl: '/logo.svg',
};

// Get all settings
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.settings.findMany();
    
    // Merge with defaults
    const settingsMap: Record<string, string> = { ...defaultSettings };
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    
    res.json(settingsMap);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

// Get a single setting
router.get('/:key', async (req, res) => {
  const { key } = req.params;
  
  try {
    const setting = await prisma.settings.findUnique({
      where: { key },
    });
    
    if (setting) {
      res.json({ key: setting.key, value: setting.value });
    } else if (defaultSettings[key]) {
      res.json({ key, value: defaultSettings[key] });
    } else {
      res.status(404).json({ message: 'Setting not found' });
    }
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ message: 'Failed to fetch setting' });
  }
});

// Update settings (bulk)
router.put('/', async (req, res) => {
  const settings = req.body;
  
  try {
    // Update each setting
    const updates = Object.entries(settings).map(([key, value]) =>
      prisma.settings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );
    
    await Promise.all(updates);
    
    // Return updated settings
    const allSettings = await prisma.settings.findMany();
    const settingsMap: Record<string, string> = { ...defaultSettings };
    allSettings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    
    res.json(settingsMap);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
});

// Update a single setting
router.put('/:key', async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  
  try {
    const setting = await prisma.settings.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
    
    res.json(setting);
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ message: 'Failed to update setting' });
  }
});

// Reset settings to defaults
router.post('/reset', async (req, res) => {
  try {
    await prisma.settings.deleteMany();
    res.json(defaultSettings);
  } catch (error) {
    console.error('Error resetting settings:', error);
    res.status(500).json({ message: 'Failed to reset settings' });
  }
});

export default router;

