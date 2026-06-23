import { deleteBookAPI, getBooksAPI } from "@/services/api";
import {
  DeleteTwoTone,
  EditTwoTone,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  ProTable,
  type ActionType,
  type ProColumns,
} from "@ant-design/pro-components";
import { App, Button, message, notification, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { CSVLink } from "react-csv";
import DetailBook from "./detail";
import CreateBook from "./create";
import UpdateBook from "./update";

type TSearch = {
  mainText: string;
  author: string;
  updateAt: string;
  updateAtRange: string;
  price: number;
};

const TableBook = () => {
  const actionRef = useRef<ActionType>();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
    page: 0,
  });
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState<IBookTable | null>(null);

  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

  const [currentDataTable, setCurrentDataTable] = useState<IBookTable[]>([]);

  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<IBookTable | null>(null);

  const [isDeleteBook, setIsDeleteBook] = useState<boolean>(false);
  const { message, notification } = App.useApp();

  const handleDeleteBook = async (_id: string) => {
    setIsDeleteBook(true);
    const res = await deleteBookAPI(_id);
    if (res && res.data) {
      message.success("Delete users successfully");
      refreshTable();
    } else {
      notification.error({
        message: "An error has occurred.",
        description: res.message,
      });
    }
    setIsDeleteBook(false);
  };
  // const { message, notification } = App.useApp();

  const columns: ProColumns<IBookTable>[] = [
    {
      title: "Id",
      dataIndex: "_id",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <a
            onClick={() => {
              setDataViewDetail(entity);
              setOpenViewDetail(true);
            }}
            href="#"
          >
            {entity._id}
          </a>
        );
      },
    },
    {
      title: "Tên sách",
      dataIndex: "mainText",
    },
    {
      title: "Thể loại",
      dataIndex: "category",
    },
    {
      title: "Tác giả",
      dataIndex: "author",
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      sorter: true,
      render(dom, entity, index, action, schema) {
        return (
          <>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(entity.price)}
          </>
        );
      },
    },

    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      sorter: true,
      valueType: "date",
      hideInSearch: true,
    },

    {
      title: "Action",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <>
            <EditTwoTone
              twoToneColor="#f57800"
              style={{ cursor: "pointer", marginRight: 15 }}
              onClick={() => {
                setDataUpdate(entity);
                setOpenModalUpdate(true);
              }}
            />

            <Popconfirm
              placement="leftTop"
              title="Confirm deletion of user"
              description="Are you sure to delete user?"
              onConfirm={() => handleDeleteBook(entity._id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ loading: isDeleteBook }}
            >
              <span style={{ cursor: "pointer", margin: "0 20px" }}>
                <DeleteTwoTone
                  twoToneColor="#ff4d4f"
                  style={{ cursor: "pointer" }}
                />
              </span>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  return (
    <>
      <ProTable<IBookTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          // console.log(params, sort, filter);

          let query = "";
          if (params) {
            query += `current=${params.current}&pageSize=${params.pageSize}`;
            if (params.mainText) {
              query += `&mainText=/${params.mainText}/i`;
            }
            if (params.author) {
              query += `&author=/${params.author}/i`;
            }
          }

          //default

          if (sort && sort.createdAt) {
            query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`;
          } else query += `&sort=-createdAt`;

          const res = await getBooksAPI(query);
          if (res.data) {
            setMeta(res.data.meta);
            setCurrentDataTable(res.data?.result ?? []);
          }
          return {
            // data: data.data,
            data: res.data?.result,
            page: 1,
            success: true,
            total: res.data?.meta.total,
          };
        }}
        rowKey="_id"
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]}-{range[1]} of {total} rows
              </div>
            );
          },
        }}
        headerTitle="Table book"
        toolBarRender={() => [
          <CSVLink data={currentDataTable} filename="export-book.csv">
            <Button icon={<ExportOutlined />} type="primary">
             Export
            </Button>
          </CSVLink>,

          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModalCreate(true);
            }}
            type="primary"
          >
            Add new
          </Button>,
        ]}
      />

      <DetailBook
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      <CreateBook
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />

      <UpdateBook
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        refreshTable={refreshTable}
        setDataUpdate={setDataUpdate}
        dataUpdate={dataUpdate}
      />
    </>
  );
};

export default TableBook;
