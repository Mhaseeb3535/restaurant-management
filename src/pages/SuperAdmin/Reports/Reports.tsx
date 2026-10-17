import { useState } from "react";
import { Badge, Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { FaDownload, FaFilePdf, FaFileExcel, FaFileAlt } from "react-icons/fa";

interface Report {
  id: number;
  title: string;
  type: string;
  period: string;
  generatedDate: string;
  status: "Ready" | "Generating" | "Failed";
  size: string;
}

function Reports() {
  const [reportType, setReportType] = useState("sales");
  const [reportPeriod, setReportPeriod] = useState("monthly");

  const reports: Report[] = [
    { id: 1, title: "Sales Report - July 2026", type: "Sales", period: "Monthly", generatedDate: "25 Jul 2026", status: "Ready", size: "2.4 MB" },
    { id: 2, title: "Financial Summary Q2 2026", type: "Financial", period: "Quarterly", generatedDate: "01 Jul 2026", status: "Ready", size: "1.8 MB" },
    { id: 3, title: "Staff Attendance Report", type: "HR", period: "Monthly", generatedDate: "25 Jul 2026", status: "Ready", size: "856 KB" },
    { id: 4, title: "Customer Feedback Analysis", type: "Customer", period: "Monthly", generatedDate: "24 Jul 2026", status: "Generating", size: "-" },
    { id: 5, title: "Inventory Stock Report", type: "Inventory", period: "Weekly", generatedDate: "23 Jul 2026", status: "Ready", size: "1.2 MB" },
    { id: 6, title: "Tax Summary - Q2 2026", type: "Financial", period: "Quarterly", generatedDate: "15 Jul 2026", status: "Ready", size: "3.1 MB" },
    { id: 7, title: "Annual Performance 2025", type: "Analytics", period: "Yearly", generatedDate: "01 Jan 2026", status: "Ready", size: "5.6 MB" },
  ];

  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      alert(`New ${reportPeriod} ${reportType} report has been generated!`);
    }, 2000);
  };

  return (
    <>
      <h2 className="mb-4">Reports</h2>

      <Row className="mb-4">
        <Col lg={8}>
          <Card className="shadow border-0 rounded-4">
            <Card.Body>
              <h5 className="mb-4"><FaFileAlt className="me-2" /> Generate New Report</h5>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Report Type</Form.Label>
                    <Form.Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                      <option value="sales">Sales Report</option>
                      <option value="financial">Financial Report</option>
                      <option value="staff">Staff Report</option>
                      <option value="inventory">Inventory Report</option>
                      <option value="customer">Customer Report</option>
                      <option value="tax">Tax Report</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Period</Form.Label>
                    <Form.Select value={reportPeriod} onChange={(e) => setReportPeriod(e.target.value)}>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>&nbsp;</Form.Label>
                    <Button
                      variant="warning"
                      className="w-100"
                      onClick={handleGenerate}
                      disabled={generating}
                    >
                      {generating ? "Generating..." : "Generate Report"}
                    </Button>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="shadow border-0 rounded-4 text-center h-100">
            <Card.Body className="d-flex flex-column justify-content-center">
              <h1 className="text-warning mb-0">{reports.length}</h1>
              <h6 className="text-muted">Total Reports</h6>
              <small className="text-success">{reports.filter((r) => r.status === "Ready").length} ready to download</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow border-0 rounded-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">Generated Reports</h5>
            <Form.Select style={{ width: "150px" }} defaultValue="All">
              <option>All Types</option>
              <option>Sales</option>
              <option>Financial</option>
              <option>HR</option>
              <option>Inventory</option>
            </Form.Select>
          </div>

          <Table hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Report Title</th>
                <th>Type</th>
                <th>Period</th>
                <th>Generated</th>
                <th>Size</th>
                <th>Status</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td><strong>{report.title}</strong></td>
                  <td><Badge bg="info">{report.type}</Badge></td>
                  <td>{report.period}</td>
                  <td>{report.generatedDate}</td>
                  <td>{report.size}</td>
                  <td>
                    <Badge bg={report.status === "Ready" ? "success" : report.status === "Generating" ? "warning" : "danger"}>
                      {report.status}
                    </Badge>
                  </td>
                  <td>
                    {report.status === "Ready" ? (
                      <div className="d-flex gap-1">
                        <Button variant="outline-danger" size="sm" title="Download PDF">
                          <FaFilePdf />
                        </Button>
                        <Button variant="outline-success" size="sm" title="Download Excel">
                          <FaFileExcel />
                        </Button>
                        <Button variant="outline-primary" size="sm" title="Download">
                          <FaDownload />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
}

export default Reports;

