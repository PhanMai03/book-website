/* eslint-disable @typescript-eslint/no-unused-vars */
import { deleteUserAPI, getUsersAPI } from "@/services/api";
import { dateRangeValidate } from "@/services/helper";
import {
  PlusOutlined,
  EditTwoTone,
  DeleteTwoTone,
  ExportOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import {
  ProTable,
  type ActionType,
  type ProColumns,
} from "@ant-design/pro-components";
import { App, Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import DetailUser from "./detail";
import CreateUser from "./create";
import ImportUser from "./data/import";
import { CSVLink } from "react-csv";
import UpdateUser from "./update";
import dayjs from "dayjs";

type TSearch = {
  fullName: string;
  email: string;
  createdAt: string;
  createdAtRange: string;
};

const TableUser = () => {
  const actionRef = useRef<ActionType>();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
    page: 0,
  });

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);

  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [openModalImport, setOpenModalImport] = useState<boolean>(false);

  const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([]);

  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);

  const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);
  const { message, notification } = App.useApp();

  const handleDeleteUser = async (_id: string) => {
    setIsDeleteUser(true);
    const res = await deleteUserAPI(_id);
    if (res && res.data) {
      message.success("Delete user successfully");
      refreshTable();
    } else {
      notification.error({
        message: "An error has occurred.",
        description: res.message,
      });
    }
    setIsDeleteUser(false);
  };

  const columns: ProColumns<IUserTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
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
      title: "Full Name",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      copyable: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
      // render(dom, entity, index, action, schema) {
      //   return(
      //     <>
      //     {dayjs(entity.createdAt).format("DD-MM-YYYY")}
      //     </>
      //   )
      // },
    },
    {
      title: "Created At",
      dataIndex: "createdAtRange",
      valueType: "dateRange",
      hideInTable: true,
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
              onConfirm={() => handleDeleteUser(entity._id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ loading: isDeleteUser }}
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
      <ProTable<IUserTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          // console.log(params, sort, filter);

          let query = "";
          if (params) {
            query += `current=${params.current}&pageSize=${params.pageSize}`;
            if (params.email) {
              query += `&email=/${params.email}/i`;
            }
            if (params.fullName) {
              query += `&fullName=/${params.fullName}/i`;
            }

            const createDateRange = dateRangeValidate(params.createdAtRange);
            if (createDateRange) {
              query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
            }
          }

          //default

          if (sort && sort.createdAt) {
            query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`;
          } else query += `&sort=-createdAt`;

          const res = await getUsersAPI(query);
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
        headerTitle="Table user"
        toolBarRender={() => [
          <CSVLink data={currentDataTable} filename="export-user.csv">
            <Button icon={<ExportOutlined />} type="primary">
              Export
            </Button>
          </CSVLink>,

          <Button
            icon={<CloudUploadOutlined />}
            onClick={() => {
              setOpenModalImport(true);
            }}
            type="primary"
          >
            Import
          </Button>,

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

      <DetailUser
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      <CreateUser
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />

      <ImportUser
        openModalImport={openModalImport}
        setOpenModalImport={setOpenModalImport}
        refreshTable={refreshTable}
      />

      <UpdateUser
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        refreshTable={refreshTable}
        setDataUpdate={setDataUpdate}
        dataUpdate={dataUpdate}
      />
    </>
  );
};

export default TableUser;
