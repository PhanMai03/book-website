import { useState } from "react";
import { App, Form, Input, Divider } from "antd";
import type { FormProps } from "antd";
import { createUserAPI } from "@/services/api";
import { Modal } from "antd";

interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
}

type FieldType = {
  fullName: string;
  password: string;
  email: string;
  phone: string;
};
const CreateUser = (props: IProps) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();

  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);
    //lay gia tri
    const { fullName, email, password, phone } = values;
    const res = await createUserAPI(fullName, password, email, phone);

    //sucess
    if (res && res.data) {
      message.success("Create User successfully");
      form.resetFields();
      //close modal
      setOpenModalCreate(false);
      refreshTable();
    } else {
      notification.error({
        message: "An error has occurred.",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };

  return (
    <>
      <Modal
        title="Add new user"
        open={openModalCreate}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setOpenModalCreate(false);
          form.resetFields();
        }}
        okText={"Create new"}
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
            labelCol={{ span: 24 }}
            label="Username"
            name="fullName"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            labelCol={{ span: 24 }}
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType>
            labelCol={{ span: 24 }}
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
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

export default CreateUser;
