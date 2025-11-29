import { useState, useEffect, useCallback } from 'react';
import { HomepageData } from '../types';
import { getApiUrl } from '../config';

const defaultData: HomepageData = {
  sliders: [],
  promoBanners: [],
  deals: [],
  featuredSections: [],
  brands: [],
  features: [],
  storeInfo: {},
  newArrivals: [],
  featuredProducts: [],
  topProducts: [],
  categories: [],
};

export const useHomepage = () => {
  const [data, setData] = useState<HomepageData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomepage = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl('/api/storefront/homepage'));
      if (!response.ok) throw new Error('Failed to fetch homepage data');
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Keep existing data on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomepage();
  }, [fetchHomepage]);

  return { data, loading, error, refetch: fetchHomepage };
};

