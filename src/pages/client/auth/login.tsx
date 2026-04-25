/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCurrentApp } from "@/components/context/context";
import { loginAPI, registerAPI } from "@/services/api";
import type { FormProps } from "antd";
import {App, Button, Divider, Form, Input} from "antd";
import { use, useState } from "react";
import { useNavigate } from "react-router-dom";

type FieldType = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const {message, notification} =  App.useApp();
  const navigate = useNavigate();
  const {setIsAuthenticated, setUser} = useCurrentApp();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
      setIsSubmit(true);
    //lay gia tri
   const { username,password} = values;
   const res = await loginAPI(username, password);

    //sucess
    if(res?.data){
      setIsAuthenticated(true);
      setUser(res.data.user);
      localStorage.setItem('access_token', res.data.access_token);
      message.success("Login successfully");
      navigate("/");
    }
    else{
      notification.error({
         message: "Login failed",
         description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
         duration: 5,
      })
    }
    setIsSubmit(false);
  };


  return (
    <>
      <Form
        name="login"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}

      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
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

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" loading={isSubmit}>
            Submit
          </Button>
        </Form.Item>
        <Divider>OR</Divider>
        <p style={{ textAlign: "center" }}>
          Do you have an account here yet? <a href="/register">Sign up</a>
        </p>
      </Form>
    </>
  );
};
export default LoginPage;
