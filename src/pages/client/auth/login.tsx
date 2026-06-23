/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCurrentApp } from "@/components/context/context";
import { loginAPI } from "@/services/api";
import type { FormProps } from "antd";
import { App, Button, Divider, Form, Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.scss";

type FieldType = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const [isSubmit, setIsSubmit] = useState(false);

  const { message, notification } = App.useApp();
  const navigate = useNavigate();

  const { setIsAuthenticated, setUser, setCarts } = useCurrentApp();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);

    const { username, password } = values;

    const res = await loginAPI(username, password);

    if (res?.data) {
      setIsAuthenticated(true);
      setUser(res.data.user);
      setCarts([]);
      localStorage.removeItem("carts");
      localStorage.setItem("access_token", res.data.access_token);

      message.success("Login successfully");

      navigate("/");
    } else {
      notification.error({
        message: "Login failed",
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        duration: 5,
      });
    }

    setIsSubmit(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <h1>Book Store</h1>

          <p>
            Discover thousands of books and explore your favorite stories from
            around the world.
          </p>
        </div>

        <div className="login-right">
          <div className="login-form">
            <h2>Login</h2>

            <Form
              name="login"
              layout="vertical"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item<FieldType>
                label="Username"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input placeholder="Enter your username" />
              </Form.Item>

              <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password placeholder="Enter your password" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmit}
                block
                className="btn-login"
              >
                Login
              </Button>

              <Divider>OR</Divider>

              <p className="register-text">
                Do you have an account here yet?{" "}
                <a href="/register">Sign up</a>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;