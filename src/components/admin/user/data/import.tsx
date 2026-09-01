/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { App, Modal, notification, Table, Upload } from "antd";
import Exceljs from "exceljs";
import { useState } from "react";
import { bulkCreateUserAPI } from "@/services/api";
import templateFile from "assets/template/user.xlsx?url";

const { Dragger } = Upload;

interface IProps {
  openModalImport: boolean;
  setOpenModalImport: (v: boolean) => void;
  refreshTable: () => void;
}
interface IDataImport {
  id?: number;
  fullName: string;
  email: string;
  phone: string;
}

const ImportUser = (props: IProps) => {
  const { openModalImport, setOpenModalImport, refreshTable } = props;

  const { message } = App.useApp();
  const [dataImport, setDataImport] = useState<IDataImport[]>([]);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const propsUpload: UploadProps = {
    name: "file",
    multiple: false,
    // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',

    // https://stackoverflow.com/questions/11832930/html-input-file-accept-attribute-file-type-csv
    accept:
      ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    customRequest({ onSuccess }) {
      setTimeout(() => {
        if (onSuccess) onSuccess("ok");
      }, 1000);
    },

    async onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (status === "done") {
        // console.log(info);
        message.success(`${info.file.name} file uploaded successfully.`);
        if (info.fileList && info.fileList.length > 0) {
          //lay file = Take out file
          const file = info.fileList[0].originFileObj!;

          const workbook = new Exceljs.Workbook();
          const arrayBuffer = await file.arrayBuffer();
          await workbook.xlsx.load(arrayBuffer);

          const jsonData: IDataImport[] = [];
          workbook.worksheets.forEach(function (sheet) {
            const firstRow = sheet.getRow(1);
            if (!firstRow.cellCount) return;

            const keys = firstRow.values as unknown[];

            sheet.eachRow((row, rowNumber) => {
              if (rowNumber === 1) return;

              const values = row.values as unknown[];
              const obj: Record<string, unknown> = {};
              for (let i = 1; i < keys.length; i++) {
                obj[String(keys[i] ?? `column${i}`)] = values[i];
              }

              const formattedRow: IDataImport = {
                fullName: String(obj.fullName ?? ""),
                email: String(obj.email ?? ""),
                phone: String(obj.phone ?? ""),
              };

              if (formattedRow.fullName || formattedRow.email || formattedRow.phone) {
                jsonData.push(formattedRow);
              }
            });
          });

          setDataImport(
            jsonData.map((item, index) => ({
              ...item,
              id: index + 1,
            }))
          );
        }
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(_e) {
      // console.log("Dropped files", _e.dataTransfer.files);
    },
  };

  const handleImport = async () => {
    setIsSubmit(true);
    const dataSubmit = dataImport.map((item) => ({
      fullName: item.fullName,
      email: item.email,
      phone: item.phone,
      password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD,
    }));

    const res = await bulkCreateUserAPI(dataSubmit);
    if (res.data) {
      notification.success({
        message: "Bulk Create Users",
        description: `Success = ${res.data.countSuccess}. Error = ${res.data.countError}`,
      });
    }
    setIsSubmit(false);
    setOpenModalImport(false);
    setDataImport([]);
    refreshTable();
  };

  return (
    <>
      <Modal
        title="Basic Modal"
        width={"50vw"}
        open={openModalImport}
        onOk={() => handleImport()}
        onCancel={() => {
          setOpenModalImport(false);
          setDataImport([]);
        }}
        okText="Import data"
        okButtonProps={{
          disabled: dataImport.length > 0 ? false : true,
          loading: isSubmit,
        }}
        //do not close when click outside
        maskClosable={false}
        destroyOnClose={true}
      >
        <Dragger {...propsUpload}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or upload. Only accept .csv, .xls, .xlsx &nbsp;
            <a
              onClick={(e) => e.stopPropagation()}
              href={templateFile}
              download
            >
              Download Sample File
            </a>
          </p>
        </Dragger>
        <div style={{ paddingTop: 20 }}>
          <Table
            rowKey={"id"}
            title={() => <span>Data Upload: </span>}
            dataSource={dataImport}
            columns={[
              { dataIndex: "fullName", title: "Name" },
              { dataIndex: "email", title: "Email" },
              { dataIndex: "phone", title: "Phone" },
            ]}
          />
        </div>
      </Modal>
    </>
  );
};
export default ImportUser;
