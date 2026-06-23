
import { getOrdersAPI } from "@/services/api";
import {
  ProTable,
  type ActionType,
  type ProColumns,
} from "@ant-design/pro-components";
import { useRef, useState } from "react";

type TSearch = {
  name?: string;
  address?: string;
};

const TableOrder = () => {
  const actionRef = useRef<ActionType>();

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    page: 0,
  });

  const columns: ProColumns<IOrderTable>[] = [
    {
      title: "ID",
      dataIndex: "_id",
      hideInSearch: true,
      width: 220,
      render: (_, record) => {
        return <a>{record._id}</a>;
      },
    },

    {
      title: "Full Name",
      dataIndex: "name",
    },

    {
      title: "Address",
      dataIndex: "address",
    },

    {
      title: "Phone",
      dataIndex: "phone",
      hideInSearch: true,
    },

    {
      title: "Payment",
      dataIndex: "type",
      hideInSearch: true,
      width: 100,
    },

    {
      title: "Total Price",
      dataIndex: "totalPrice",
      hideInSearch: true,
      sorter: true,
      render: (_, record) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(record.totalPrice),
    },

    {
      title: "Created At",
      dataIndex: "createdAt",
      valueType: "dateTime",
      hideInSearch: true,
      sorter: true,
    },
  ];

  return (
    <ProTable<IOrderTable, TSearch>
      columns={columns}
      actionRef={actionRef}
      rowKey="_id"
      cardBordered
      headerTitle="Table Orders"
      search={{
        labelWidth: 100,
      }}
      pagination={{
        current: meta.current,
        pageSize: meta.pageSize,
        showSizeChanger: true,
        total: meta.total,
        showTotal: (total, range) => (
          <div>
            {range[0]}-{range[1]} trên {total} rows
          </div>
        ),
      }}
      request={async (params, sort) => {
        let query = `current=${params.current}&pageSize=${params.pageSize}`;

        // Search Name
        if (params.name) {
          query += `&name=/${params.name}/i`;
        }

        // Search Address
        if (params.address) {
          query += `&address=/${params.address}/i`;
        }

        // Sort CreatedAt
        if (sort.createdAt) {
          query += `&sort=${
            sort.createdAt === "ascend"
              ? "createdAt"
              : "-createdAt"
          }`;
        } else {
          query += "&sort=-createdAt";
        }

        const res = await getOrdersAPI(query);

        if (res?.data) {
          setMeta(res.data.meta);
        }

        return {
          data: res.data?.result ?? [],
          success: true,
          total: res.data?.meta.total ?? 0,
        };
      }}
      toolBarRender={false}
    />
  );
};

export default TableOrder;

