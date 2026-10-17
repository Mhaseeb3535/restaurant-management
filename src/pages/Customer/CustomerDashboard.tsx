import { useEffect, useState, type ReactNode } from "react";
import { Container, Row, Col, Card, Spinner, Table } from "react-bootstrap";
import {
    FaShoppingBag,
    FaCalendarCheck,
    FaClock,
    FaBell
} from "react-icons/fa";
import CustomerOrdersChart from "../../components/Dashboard/CustomerOrdersChart";
import FavoritesPie from "../../components/Dashboard/FavoritesPie";
import api from "../../services/api";
import { useNotifications } from "../../context/NotificationContext";

const iconMap: Record<string, ReactNode> = {
    FaShoppingBag: <FaShoppingBag size={28} />,
    FaCalendarCheck: <FaCalendarCheck size={28} />,
    FaClock: <FaClock size={28} />,
    FaBell: <FaBell size={28} />
};

function CustomerDashboard() {
    const { unreadCount, notifications } = useNotifications();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<Array<{
        id: number;
        total: number | string;
        status: string;
        created_at: string;
    }>>([]);
    const [reservations, setReservations] = useState<Array<{
        id: number;
        status: string;
        date: string;
    }>>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [ordersRes, reservationsRes] = await Promise.all([
                    api.get("/orders"),
                    api.get("/reservations"),
                ]);
                setOrders(ordersRes.data || []);
                setReservations(reservationsRes.data || []);
            } catch (error) {
                console.error("Failed to load customer dashboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const orderCountByMonth = orders.reduce<Record<string, number>>((acc, order) => {
        const key = new Date(order.created_at).toLocaleDateString(undefined, {
            month: "short",
            year: "2-digit",
        });
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.entries(orderCountByMonth).map(([month, total]) => ({
        month,
        orders: total,
    }));

    const statusColors: Record<string, string> = {
        Pending: "#f59e0b",
        Approved: "#3b82f6",
        Preparing: "#6366f1",
        Ready: "#8b5cf6",
        Delivered: "#22c55e",
        Cancelled: "#ef4444",
        Rejected: "#dc2626",
        "Refund Requested": "#f97316",
        Refunded: "#111827",
    };

    const statusSummary = Object.entries(
        orders.reduce<Record<string, number>>((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {})
    ).map(([name, value]) => ({
        name,
        value,
        color: statusColors[name] || "#6b7280",
    }));

    const totalSpent = orders.reduce((sum, order) => {
        const value = typeof order.total === "number" ? order.total : parseFloat(order.total);
        return sum + (Number.isFinite(value) ? value : 0);
    }, 0);

    const cards = [
        { title: "Orders", total: orders.length, icon: "FaShoppingBag", color: "primary" },
        { title: "Reservations", total: reservations.length, icon: "FaCalendarCheck", color: "success" },
        {
            title: "Active Orders",
            total: orders.filter((order) => ["Pending", "Approved", "Preparing", "Ready"].includes(order.status)).length,
            icon: "FaClock",
            color: "danger",
        },
        { title: "Notifications", total: unreadCount, icon: "FaBell", color: "warning" }
    ];

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="warning" />
                <p className="mt-3 mb-0">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <Container className="py-4">
            <h2 className="fw-bold mb-4">Welcome to your dashboard</h2>
            <Row className="mb-4">
                {cards.map((item, index) => (
                    <Col lg={3} md={6} key={index}>
                        <Card className="shadow border-0 rounded-4 mb-4">
                            <Card.Body className="d-flex align-items-center gap-3">
                                <div className={`bg-${item.color} bg-opacity-25 p-3 rounded-3`}>
                                    <div className={`text-${item.color}`}>
                                        {iconMap[item.icon]}
                                    </div>
                                </div>
                                <div>
                                    <h6 className="text-muted mb-0">{item.title}</h6>
                                    <h2 className="fw-bold mb-0">{item.total}</h2>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Row>
                <Col lg={7} className="mb-4 mb-lg-0">
                    <CustomerOrdersChart
                        data={
                            chartData.length > 0
                                ? chartData
                                : [{ month: "Now", orders: 0 }]
                        }
                    />
                </Col>
                <Col lg={5}>
                    <FavoritesPie
                        title="Order Status Breakdown"
                        data={
                            statusSummary.length > 0
                                ? statusSummary
                                : [{ name: "No orders", value: 1, color: "#d1d5db" }]
                        }
                    />
                </Col>
            </Row>
            <Row className="mt-4">
                <Col lg={5} className="mb-4 mb-lg-0">
                    <Card className="shadow border-0 rounded-4 h-100">
                        <Card.Body>
                            <h5 className="mb-3">Spending Snapshot</h5>
                            <div className="mb-4">
                                <small className="text-muted d-block">Total spent</small>
                                <h2 className="fw-bold text-warning mb-0">${totalSpent.toFixed(2)}</h2>
                            </div>
                            <div className="d-grid gap-3">
                                <div>
                                    <small className="text-muted d-block">Confirmed reservations</small>
                                    <strong>{reservations.filter((reservation) => reservation.status === "Confirmed").length}</strong>
                                </div>
                                <div>
                                    <small className="text-muted d-block">Delivered orders</small>
                                    <strong>{orders.filter((order) => order.status === "Delivered").length}</strong>
                                </div>
                                <div>
                                    <small className="text-muted d-block">Unread notifications</small>
                                    <strong>{unreadCount}</strong>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={7}>
                    <Card className="shadow border-0 rounded-4 h-100">
                        <Card.Body>
                            <h5 className="mb-3">Recent Updates</h5>
                            {notifications.length === 0 ? (
                                <p className="text-muted mb-0">You have no recent updates yet.</p>
                            ) : (
                                <Table responsive borderless className="align-middle mb-0">
                                    <tbody>
                                        {notifications.slice(0, 5).map((notification) => (
                                            <tr key={notification.id}>
                                                <td style={{ width: 170 }}>
                                                    <small className="text-muted">
                                                        {new Date(notification.created_at).toLocaleString()}
                                                    </small>
                                                </td>
                                                <td>
                                                    <strong>{notification.title}</strong>
                                                    <div className="text-muted small">{notification.message}</div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default CustomerDashboard;

