import { Card } from "react-bootstrap";
import type { ReactNode } from "react";

interface Props {
  title: string;
  value: string;
  icon: ReactNode;
  color: string;
}

function SummaryCard({
  title,
  value,
  icon,
  color,
}: Props) {
  return (
    <Card className="shadow rounded-4 border-0">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6>{title}</h6>
            <h3>{value}</h3>
          </div>

          <div className={`text-${color}`}>
            {icon}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default SummaryCard;