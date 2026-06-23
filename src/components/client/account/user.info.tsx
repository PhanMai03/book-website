/* eslint-disable no-empty */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCurrentApp } from "@/components/context/context";
import { updateUserInfoAPI, uploadFileAPI } from "@/services/api";
import {
  App,
  Avatar,
  Button,
  Col,
  Form,
  Input,
  Row,
  Upload,
  type FormProps,
} from "antd";
import { useEffect, useState } from "react";
import type { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import type { UploadChangeParam, UploadFile } from "antd/es/upload";
import { AntDesignOutlined, UploadOutlined } from "@ant-design/icons";

type FieldType = {
  _id: string;
  email: string;
  fullName: string;
  phone: string;
};

const UserInfo = () => {
  const [form] = Form.useForm();
  const { user, setUser } = useCurrentApp();

  const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "");
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();

  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        _id: user.id,
        email: user.email,
        phone: user.phone,
        fullName: user.fullName,
      });
    }
  }, [user]);

  const handleUploadFile = async (options: RcCustomRequestOptions) => {
    const { onSuccess } = options;
    const file = options.file as UploadFile;
    const res = await uploadFileAPI(file, "avatar");

    if (res && res.data) {
      const newAvatar = res.data.fileUploaded;
      setUserAvatar(newAvatar);

      if (onSuccess) onSuccess("ok");
    } else {
      message.error(res.message);
    }
  };

  const propsUpload = {
    maxCount: 1,
    multiple: false,
    showUploadList: false,
    customRequest: handleUploadFile,
    onChange(info: UploadChangeParam) {
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        message.success(`Upload file thanh cong`);
      } else if (info.file.status === "error") {
        message.error(`Upload file that bai`);
      }
    },
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { fullName, phone, _id } = values;
    setIsSubmit(true);
    const res = await updateUserInfoAPI(fullName, phone, userAvatar, _id);

    if (res && res.data) {
      //update react context
      setUser({
        ...user!,
        avatar: userAvatar,
        fullName,
        phone,
      });
      message.success("Cap nhat thong tin user thanh cong");

      //force renew token
      localStorage.removeItem("access_token");
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
        <Col sm={24} md={12}>
          <Row gutter={[30, 30]}>
            <Col span={24}>
              <Avatar
                size={{ xs: 32, sm: 64, md: 80, lg: 128 }}
                icon={<AntDesignOutlined />}
                src={urlAvatar}
                shape="circle"
              />
            </Col>
            <Col span={24}>
              <Upload {...propsUpload}>
                <Button icon={<UploadOutlined />}>Upload Avatar</Button>
              </Upload>
            </Col>
          </Row>
        </Col>

        <Col sm={24} md={12}>
          <Form
            onFinish={onFinish}
            form={form}
            name="user-info"
            autoComplete="off"
          >
            <Form.Item<FieldType>
              hidden
              labelCol={{ span: 24 }}
              label="_id"
              name="_id"
            >
              <Input disabled hidden />
            </Form.Item>

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
              label="Tên hiển thị"
              name="fullName"
              rules={[
                { required: true, message: "Ten hien thị khong duoc bo trong" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              labelCol={{ span: 24 }}
              label="So dien thoai"
              name="phone"
              rules={[
                { required: true, message: "Ten hien thị khong duoc bo trong" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Form.Item>
                <Row justify="end">
                  <Button type="primary" htmlType="submit" loading={isSubmit}>
                    Cập nhật
                  </Button>
                </Row>
              </Form.Item>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};
export default UserInfo;
