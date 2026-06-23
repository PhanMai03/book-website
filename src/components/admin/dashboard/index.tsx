/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDashboardAPI } from "@/services/api";
import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [dataDashboard, setDataDashboard] = useState({
    countOrder: 0,
    countUser: 0,
    countBook: 0,
  });

  useEffect(() => {
    const initDashboard = async () => {
      const res = await getDashboardAPI();
      if (res && res.data) setDataDashboard(res.data);
    };
    initDashboard();
  }, []);

  return (
    <Row gutter={[40, 40]}>
      <Col span={8}>
        <Card title="" bordered={false}>
          <Statistic title="Tong users" value={dataDashboard.countUser} />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="" bordered={false}>
          <Statistic title="Tong don hang" value={dataDashboard.countOrder} />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="" bordered={false}>
          <Statistic title="Tong Books" value={dataDashboard.countBook} />
        </Card>
      </Col>
    </Row>
  );
};

export default AdminDashboard;
