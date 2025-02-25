import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Loader } from "lucide-react";

interface RomeIVDashboardProps {
  patientId: string;
}

const RomeIVDashboard: React.FC<RomeIVDashboardProps> = ({ patientId }) => {
  const accessToken = sessionStorage.getItem("access_token") || "";
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) {
      setError("Patient ID is missing.");
      setLoading(false);
      return;
    }

    const fetchResponses = async () => {
      setLoading(true);
      setError(null);

      const apiUrl = `https://app.meldrx.com/api/fhir/3eb16078-78c9-4b9f-9974-ea89dbb34c71/QuestionnaireResponse?subject=Patient/${patientId}`;

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Accept: "application/fhir+json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching responses. Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("📩 Retrieved Responses:", responseData);

        if (responseData.entry) {
          setResponses(responseData.entry.map((entry: any) => entry.resource));
        } else {
          setResponses([]);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [patientId]);

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>📊 Rome IV Questionnaire Responses</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader className="animate-spin" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : responses.length === 0 ? (
          <p>No responses found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Answer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map((response, index) =>
                response.item.map((item: any) => (
                  <TableRow key={`${index}-${item.linkId}`}>
                    <TableCell>{item.linkId.replace(/_/g, " ")}</TableCell>
                    <TableCell>{item.answer[0]?.valueString || "N/A"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default RomeIVDashboard;
