// src/HealthCheck.tsx
import { Box, Typography } from "@mui/material";

const HealthCheck = () => {
  const isApiHealthy = true; // You can fetch this dynamically if needed

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {isApiHealthy ? "OK" : "Error"}
      </Typography>
      <Typography variant="body1">
        {isApiHealthy ? "The application is running." : "The application has issues."}
      </Typography>
    </Box>
  );
};

export default HealthCheck;
