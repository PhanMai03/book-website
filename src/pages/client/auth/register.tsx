/* eslint-disable @typescript-eslint/no-unused-vars */
import { registerAPI } from "@/services/api";
import type { FormProps } from "antd";
import { App, Button, Divider, Form, Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.scss";

type FieldType = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
};

const RegisterPage = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const { message } = App.useApp();
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);
    const { fullName, email, password, phone } = values;

    try {
      const res = await registerAPI(fullName, email, password, phone);
      if (res && res.data) {
        message.success("Registered successfully!");
        navigate("/login");
      } else {
        message.error(res.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      message.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        
        {/* Cột trái - Banner giới thiệu */}
        <div className="register-left">
          <h1>Create Account</h1>
          <p>
            Join our bookstore community and explore thousands of amazing books.
          </p>
        </div>

        {/* Cột phải - Form đăng ký */}
        <div className="register-right">
          <div className="register-form">
            <h2>Register</h2>

            <Form
              name="register"
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item<FieldType>
                label="Full Name"
                name="fullName"
                rules={[
                  {
                    required: true,
                    message: "Please input your full name!",
                  },
                ]}
              >
                <Input placeholder="Enter your full name" />
              </Form.Item>

              <Form.Item<FieldType>
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                ]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>

              <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters!",
                  },
                ]}
              >
                <Input.Password placeholder="Enter your password" />
              </Form.Item>

              <Form.Item<FieldType>
                label="Phone"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone number!",
                  },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Phone number must contain only digits!",
                  },
                ]}
              >
                <Input placeholder="Enter your phone number" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmit}
                block
                className="btn-register"
              >
                Register
              </Button>

              <Divider>OR</Divider>

              <p className="login-text">
                Already have an account? <a href="/login">Login</a>
              </p>
            </Form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;