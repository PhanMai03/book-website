/* eslint-disable @typescript-eslint/no-unused-vars */
import { getHistoryAPI } from "@/services/api";
import { FORMATE_DATE_VN } from "@/services/helper";
import { App, Divider, Drawer, Table, Tag } from "antd";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const HistoryPage = () => {
  const [dataHistory, setDataHistory] = useState<IHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [dataDetail, setDataDetail] = useState<IHistory | null>(null);

  const { notification } = App.useApp();

  const columns: TableProps<IHistory>["columns"] = [
    {
      title: "STT",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      render: (item) => dayjs(item).format(FORMATE_DATE_VN),
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalPrice",
      render: (item) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(item),
    },
    {
      title: "Trạng thái",
      render: () => (
        <Tag color="green">
          Thành công
        </Tag>
      ),
    },
    {
      title: "Chi tiết",
      key: "action",
      render: (_, record) => (
        <a
          onClick={(e) => {
            e.preventDefault();
            setOpenDetail(true);
            setDataDetail(record);
          }}
        >
          Xem chi tiết
        </a>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await getHistoryAPI();

        if (res?.data) {
          setDataHistory(res.data);
        } else {
          notification.error({
            message: "Đã có lỗi xảy ra",
            description: Array.isArray(res?.message)
              ? res.message.join(", ")
              : res?.message,
          });
        }
      } catch (error) {
        notification.error({
          message: "Đã có lỗi xảy ra",
          description: "Không thể lấy lịch sử mua hàng",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ margin: 50 }}>
      <div>Lịch sử mua hàng</div>

      <Divider />

      <Table
        bordered
        columns={columns}
        dataSource={dataHistory}
        rowKey="id"
        loading={loading}
      />

      <Drawer
        title="Chi tiết đơn hàng"
        open={openDetail}
        onClose={() => {
          setOpenDetail(false);
          setDataDetail(null);
        }}
      >
        {dataDetail?.detail?.map((item, index) => (
          <ul key={index}>
            <li>Tên sách: {item.bookName}</li>

            <li>Số lượng: {item.quantity}</li>

            <Divider />
          </ul>
        ))}
      </Drawer>
    </div>
  );
};

export default HistoryPage;