import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
} from '@mui/material';
import { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  category: {
    name: string;
  };
  sold: number;
  imageUrl?: string;
}

function TopSellingProducts() {
  const [topProducts, setTopProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch('http://localhost:3001/api/products/top', { headers });
      if (response.ok) {
        const data = await response.json();
        setTopProducts(data);
      }
    };
    fetchTopProducts();
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Top Selling Products
        </Typography>
        <List>
          {topProducts.map((product) => (
            <ListItem key={product.id}>
              <ListItemAvatar>
                <Avatar src={product.imageUrl || 'https://via.placeholder.com/150'} variant="rounded" />
              </ListItemAvatar>
              <ListItemText
                primary={product.name}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                      label={product.category.name}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Sold: {product.sold}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default TopSellingProducts;
