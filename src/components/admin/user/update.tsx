/* eslint-disable react-hooks/exhaustive-deps */
import { updateUserAPI } from "@/services/api";
import { App, Divider, Form, Input, Modal, type FormProps } from "antd";
import { useEffect, useState } from "react";

interface IProps {
  openModalUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  refreshTable: () => void;
  setDataUpdate: (v: IUserTable | null) => void;
  dataUpdate: IUserTable | null;
}

type FieldType = {
  _id: string;
  email: string;
  fullName: string;
  phone: string;
};
const UpdateUser = (props: IProps) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    refreshTable,
    setDataUpdate,
    dataUpdate,
  } = props;

  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();

  const [form] = Form.useForm();

  useEffect(() => {
    if (dataUpdate) {
     //update fields
      form.setFieldsValue({
        _id: dataUpdate._id,
        fullName: dataUpdate.fullName,
        email: dataUpdate.email,
        phone: dataUpdate.phone,
      });
    }
  }, [dataUpdate]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    //lay gia tri
    const { _id, fullName, phone} = values;
    setIsSubmit(true);
    const res = await updateUserAPI(_id, fullName, phone);
    if(res && res.data){
     message.success('Update user successfully')
     form.resetFields();
     setOpenModalUpdate(false);
     setDataUpdate(null);
     refreshTable();
    }
    else{
     notification.error({
      message: 'An error has occurred',
      description: res.message
     })
    }
    setIsSubmit(false)
  };
  return (
   <>
       <Modal
        title="Update new user"
        open={openModalUpdate}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setOpenModalUpdate(false);
          setDataUpdate(null);
          form.resetFields();
        }}
        okText={"Update"}
        cancelText={"Cancel"}
        confirmLoading={isSubmit}
      >
        <Divider />

        <Form
          form={form}
          name="basic"
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
           hidden
            labelCol={{ span: 24 }}
            label="_id"
            name="_id"
            rules={[{ required: true, message: "Please input _id!" }]}
          >
            <Input disabled/>
          </Form.Item>

          <Form.Item<FieldType>
            labelCol={{ span: 24 }}
            label="Email"
            name="email"
            rules={[
             { required: true, message: "Please input your password!" },
              {type: "email", message: "Email is not in the correct format."}
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item<FieldType>
            labelCol={{ span: 24 }}
            label="Full name"
            name="fullName"
            rules={[{ required: true, message: "Please input your full name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            labelCol={{ span: 24 }}
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
   </>
  );
};

export default UpdateUser;
