import { Card, CardContent, Typography, Box } from "@mui/material";
import { IBSAssessment } from "../types/ibs";

interface IBSAnalysisProps {
  analysis: IBSAssessment;
}

const IBSAnalysis = ({ analysis }: IBSAnalysisProps) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          AI-based IBS Analysis
        </Typography>
        <Typography>
          <strong>Overall Summary:</strong> {analysis.overallNarrativeSummary}
        </Typography>
        <Box mt={2}>
          <Typography variant="subtitle1">
            Clinical Assessment
          </Typography>
          <Typography>
            <strong>ROME IV Met:</strong>{" "}
            {analysis.clinicalAssessment.romeIVCriteriaMet ? "Yes" : "No"}
          </Typography>
          <Typography>
            <strong>IBS-SSS Total Score:</strong>{" "}
            {analysis.clinicalAssessment.ibsSSS.totalScore.value} (
            {analysis.clinicalAssessment.ibsSSS.totalScore.interpretation})
          </Typography>
          <Typography>
            <strong>IBS Subtype:</strong>{" "}
            {analysis.clinicalAssessment.ibsSubtype.classification}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default IBSAnalysis;
