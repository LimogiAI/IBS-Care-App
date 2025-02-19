import { Card, CardContent, Typography, Box } from "@mui/material";

interface Condition {
  id: string;
  code: string;
  recordedDate: string;
  clinicalStatus: string;
  verificationStatus: string;
}

interface ConditionsListProps {
  conditions: Condition[];
}

const ConditionsList = ({ conditions }: ConditionsListProps) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Medical Conditions
        </Typography>
        {conditions.length > 0 ? (
          conditions.map((condition) => (
            <Box
              key={condition.id}
              sx={{
                mb: 2,
                p: 1,
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              <Typography>
                <strong>Condition:</strong> {condition.code}
              </Typography>
              <Typography>
                <strong>Recorded Date:</strong>{" "}
                {new Date(condition.recordedDate).toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>Status:</strong> {condition.clinicalStatus}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography>No conditions available.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ConditionsList;
