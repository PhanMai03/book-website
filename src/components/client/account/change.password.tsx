import { useCurrentApp } from "@/components/context/context";
import { updateUserPasswordAPI } from "@/services/api";
import { App, Button, Col, Form, Input, Row, type FormProps } from "antd";
import { useEffect, useState } from "react";

type FieldType = {
  email: string;
  oldpass: string;
  newpass: string;
};

const ChangePassword = () => {
  const [form] = Form.useForm();
  const { user } = useCurrentApp();

  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();

  useEffect(() => {
    if (user) {
      form.setFieldValue("email", user.email);
    }
  }, [user]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { email, oldpass, newpass } = values;
    setIsSubmit(true);
    const res = await updateUserPasswordAPI(email, oldpass, newpass);
   
    if (res && res.data) {
      message.success("Cap nhat mat khau thanh cong");
      form.setFieldValue("oldpass", "");
      form.setFieldValue("newpass", "");
    } else {
      notification.error({
        message: "Da co loi xay ra",
        description: res.message,
      });
    }

    setIsSubmit(false);
  };

  return (
    <div style={{ minHeight: 400 }}>
      <Row>
        <Col span={1}></Col>
        <Col span={12}>
          <Form
            name="change-password"
            onFinish={onFinish}
            autoComplete="off"
            form={form}
          >
            <Form.Item<FieldType>
              labelCol={{ span: 24 }}
              label="Email"
              name="email"
              rules={[{ required: true, message: "Email khong duoc bo trong" }]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item<FieldType>
              labelCol={{ span: 24 }}
              label="Mat khau hien tai"
              name="oldpass"
              rules={[
                { required: true, message: "Mat khau khong duoc bo trong" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              labelCol={{ span: 24 }}
              label="Mat khau moi"
              name="newpass"
              rules={[
                { required: true, message: "Mat khai moi khong duoc bo trong" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Row justify="end">
                <Button type="primary" htmlType="submit" loading={isSubmit}>
                  Xác nhận
                </Button>
              </Row>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};
export default ChangePassword;
