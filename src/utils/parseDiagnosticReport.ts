import { FHIRDiagnosticReport, ParsedDiagnosticReport } from "../types/FHIRDiagnosticReport";



export default function parseDiagnosticReport(report: FHIRDiagnosticReport): ParsedDiagnosticReport {
    // Use the first coding's display if available, else fallback
    const reportName =
      report.code?.coding?.[0]?.display ??
      report.code?.coding?.[0]?.code ??
      'Unknown Diagnostic Report';
  
    return {
      id: report.id ?? 'unknown',
      reportName,
      status: report.status ?? 'unknown',
      effectiveDateTime: report.effectiveDateTime ?? 'N/A',
      issued: report.issued ?? 'N/A',
      conclusion: report.conclusion ?? 'N/A',
    };
  }
  