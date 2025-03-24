import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventory, totalStockValue, lowStockProducts, outOfStockProducts, totalOrders, pendingOrders, orderStatus, revenue, topProducts, orderTrends, paymentMethods] = await Promise.all([
          axios.get('http://localhost:6565/api/vendor/products/inventory').catch(() => null),
          axios.get('http://localhost:6565/api/vendor/products/total-stock-value').catch(() => null),
          axios.get('http://localhost:6565/api/vendor/products/low-stock').catch(() => null),
          axios.get('http://localhost:6565/api/vendor/products/out-of-stock').catch(() => null),
          axios.get('http://localhost:6565/api/orders/count').catch(() => null),
          axios.get('http://localhost:6565/api/orders/pending').catch(() => null),
          axios.get('http://localhost:6565/api/orders/status-breakdown').catch(() => null),
          axios.get('http://localhost:6565/api/orders/revenue').catch(() => null),
          axios.get('http://localhost:6565/api/orders/top-products').catch(() => null),
          axios.get('http://localhost:6565/api/orders/trends').catch(() => null),
          axios.get('http://localhost:6565/api/orders/payment-methods').catch(() => null)
        ]);

        setData({
          totalStockValue: totalStockValue?.data?.totalStockValue || 0,
          totalProducts: inventory?.data?.length || 0,
          lowStockAlerts: lowStockProducts?.data?.length || 0,
          outOfStockItems: outOfStockProducts?.data?.length || 0,
          totalOrders: totalOrders?.data?.count || 0,
          pendingOrders: pendingOrders?.data?.count || 0,
          orderStatus: orderStatus?.data || {},
          revenue: revenue?.data?.totalRevenue || 0,
          topProducts: topProducts?.data || [],
          orderTrends: orderTrends?.data || [],
          paymentMethods: paymentMethods?.data || {}
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
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        {[{ title: 'Total Stock Value', value: `$${(data?.totalStockValue || 0).toFixed(2)}` },
          { title: 'Total Products', value: data?.totalProducts || 0 },
          { title: 'Low Stock Alerts', value: data?.lowStockAlerts || 0 },
          { title: 'Out of Stock Items', value: data?.outOfStockItems || 0 },
          { title: 'Total Orders', value: data?.totalOrders || 0 },
          { title: 'Pending Orders', value: data?.pendingOrders || 0 },
          { title: 'Total Revenue', value: `$${(data?.revenue || 0).toFixed(2)}` }]
          .map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card sx={{ textAlign: 'center', p: 2, borderRadius: 2, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">{item.title}</Typography>
                    <Typography variant="h5" color="primary">{item.value}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;