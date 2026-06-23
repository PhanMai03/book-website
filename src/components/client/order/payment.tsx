/* eslint-disable react-hooks/set-state-in-effect */
import { useCurrentApp } from "@/components/context/context";
import { createOrderAPI } from "@/services/api";
import { DeleteTwoTone } from "@ant-design/icons";
import { App, Button, Col, Divider, Form, Input, message, notification, Radio, Row, Space, type FormProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";

type UserMethod = "COD" | "BANKING";

type FieldType = {
  fullName: string;
  phone: string;
  address: string;
  method: UserMethod;
};

interface IProps {
  setCurrentStep: (step: number) => void;
}

const Payment = (props: IProps) => {
  const { carts, setCarts, user } = useCurrentApp();
  const [totalPrice, setTotalPrice] = useState(0);

  const [form] = Form.useForm();

  const [isSubmit, setIsSubmit] = useState(false);
  const {message, notification} = App.useApp();
  const {setCurrentStep} = props;
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        phone: user.phone,
        method: "COD",
      });
    }
  }, [user]);

  useEffect(() => {
    if (carts && carts.length > 0) {
      let sum = 0;
      carts.map((item) => {
        sum += item.detail.price * item.quantity;
      });
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [carts]);

  const handleRemoveBook = (_id: string) => {
    const cartStorage = localStorage.getItem("carts");

    if (cartStorage) {
      const carts = JSON.parse(cartStorage) as ICart[];
      const newCarts = carts.filter((c) => c._id !== _id);
      localStorage.setItem("carts", JSON.stringify(newCarts));
      //sync React Context
      setCarts(newCarts);
    }
  };

  const handlePlaceOrder: FormProps<FieldType>['onFinish'] = async (values) =>{
    const {address, fullName, method, phone } = values;
    const detail = carts.map(item => ({
      _id: item._id,
      quantity: item.quantity,
      bookName: item.detail.mainText
    }))

    setIsSubmit(true);
    const res = await createOrderAPI(
      fullName, address, phone, totalPrice, method, detail
    );
    if(res?.data){
      localStorage.removeItem("carts");
      setCarts([]);
      message.success('Mua hang thanh cong!');
      setCurrentStep(2);
    } else {
      notification.error({
        message: "Co loi xay ra",
        description:
          res.message && Array.isArray(res.message) ? res.message[0] : res.message,
          duration: 5
      })
    }

    setIsSubmit(false);
  };

  return (
    <Row gutter={[20, 20]}>
      <Col md={16} xs={24}>
        {carts?.map((book, index) => {
          const currentBookPrice = book?.detail.price ?? 0;
          return (
            <div className="order-book" key={`index-${index}`}>
              <div className="book-content">
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail.thumbnail}`}
                />
                <div className="title">{book?.detail.mainText}</div>
                <div className="price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(book.detail.price)}
                </div>
                <div className="action">
                  <div className="quantity">So luong: {book.quantity}</div>
                  <div className="sum">
                    Tổng:{" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(currentBookPrice * book.quantity)}
                  </div>

                  <DeleteTwoTone
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRemoveBook(book._id)}
                    twoToneColor="#eb2f96"
                  />
                </div>
              </div>
            </div>
          );
        })}
        <div>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => props.setCurrentStep(0)}
          >
            Quay tro lai
          </span>
        </div>
      </Col>
      <Col md={8} xs={24}>
        <Form
          form={form}
          name="payment-form"
          onFinish={handlePlaceOrder}
          autoComplete="off"
          layout="vertical"
        >
          <div className="order-summary">
            <Form.Item<FieldType> label="Hinh thuc thanh toan" name="method">
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="COD">Thanh toan khi nhan hang (COD)</Radio>
                  <Radio value="BANKING">Thanh toan qua ngan hang</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Form.Item<FieldType>
              label="Ho va ten"
              name="fullName"
              rules={[{ required: true, message: "Vui long nhap ho va ten!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="So dien thoai"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "So dien thoai khong duoc bo trong!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Dia chi nhan hang"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Dia chi nhan hang khong duoc bo trong!",
                },
              ]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <div className="calculate">
              <span>Tam tinh: </span>
              <span>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalPrice || 0)}
              </span>
            </div>
            <Divider style={{ margin: "10px 0" }} />
            <div className="calculate">
              <span>Tong tien: </span>
              <span className="sum-final">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalPrice || 0)}
              </span>
            </div>
            <Divider style={{ margin: "10px 0" }} />
            {/* <button type="submit">Dat hàng ({carts?.length ?? 0})</button> */}
            <Button
              color="danger"
              variant="solid"
              htmlType="submit"
              loading={isSubmit}
            >
              Dat hang ({carts?.length ?? 0})
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
};
export default Payment;
