import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, CircularProgress, Divider } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventory, totalStockValue, lowStockProducts, outOfStockProducts, totalOrders, pendingOrders] = await Promise.all([
          axios.get('http://localhost:6565/api/vendor/products/inventory').catch(() => null),
          axios.get('http://localhost:6565/api/vendor/products/total-stock-value').catch(() => null),
          axios.get('http://localhost:6565/api/vendor/products/low-stock').catch(() => null),
          axios.get('http://localhost:6565/api/vendor/products/out-of-stock').catch(() => null),
          axios.get('http://localhost:6565/api/orders/count').catch(() => null),
          axios.get('http://localhost:6565/api/orders/pending').catch(() => null),
        ]);

        setData({
          totalStockValue: totalStockValue?.data?.totalStockValue || 0,
          totalProducts: inventory?.data?.length || 0,
          lowStockAlerts: lowStockProducts?.data?.length || 0,
          outOfStockItems: outOfStockProducts?.data?.length || 0,
          totalOrders: totalOrders?.data?.count || 0,
          pendingOrders: pendingOrders?.data?.count || 0,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
  if (error) return <Typography color="error" textAlign="center">{error}</Typography>;

  return (
    <div className="">
    <Container maxWidth="md">
      <motion.div whileHover={{ scale: 1.02 }}>
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 4 }}>
          <CardContent>

            {/* First Row: Total Stock Value, Total Products, Low Stock Alerts */}
            <Grid container spacing={2} textAlign="center">
              <Grid item xs={4}>
                <Typography variant="h6" fontWeight="bold">Total Stock Value</Typography>
                <Typography variant="h5" color="primary">{(data?.totalStockValue || 0).toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6" fontWeight="bold">Total Products</Typography>
                <Typography variant="h5" color="primary">{data?.totalProducts || 0}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6" fontWeight="bold">Low Stock Alerts</Typography>
                <Typography variant="h5" color="error">{data?.lowStockAlerts || 0}</Typography>
              </Grid>
            </Grid>

            {/* Horizontal Divider */}
            <Divider sx={{ my: 2 }} />

            {/* Second Row: Out of Stock Items, Total Orders, Pending Orders */}
            <Grid container spacing={2} textAlign="center">
              <Grid item xs={4}>
                <Typography variant="h6" fontWeight="bold">Out of Stock Items</Typography>
                <Typography variant="h5" color="secondary">{data?.outOfStockItems || 0}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6" fontWeight="bold">Total Orders</Typography>
                <Typography variant="h5" color="primary">{data?.totalOrders || 0}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6" fontWeight="bold">Pending Orders</Typography>
                <Typography variant="h5" color="warning.main">{data?.pendingOrders || 0}</Typography>
              </Grid>
            </Grid>

          </CardContent>
        </Card>
      </motion.div>
    </Container>
    </div>
  );
};

export default Dashboard;
