/* eslint-disable @typescript-eslint/no-unused-vars */
import { loginAPI, registerAPI } from "@/services/api";
import type { FormProps } from "antd";
import {App, Button, Divider, Form, Input} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type FieldType = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
};

const RegisterPage = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const {message} =  App.useApp();
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
      setIsSubmit(true);
    //lay gia tri
   const { fullName, email, password, phone } = values;


   const res = await registerAPI(fullName, email, password, phone);

    //sucess
    if(res.data){
      message.success("Register successfully");
      navigate("/login");
    }
    else{
      message.error("Register failed");
    }
    setIsSubmit(false);
  };

  return (
    <>
      <Form
        name="register"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}

      >
        <Form.Item<FieldType>
          label="Username"
          name="fullName"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          label="Phone"
          name="phone"
          rules={[
            { required: true, message: "Please input your phone number!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" loading={isSubmit}>
            Submit
          </Button>
        </Form.Item>
        <Divider>OR</Divider>
        <p style={{ textAlign: "center" }}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </Form>
    </>
  );
};
export default RegisterPage;
