/* eslint-disable react-hooks/set-state-in-effect */
import { useCurrentApp } from "@/components/context/context";
import { DeleteTwoTone } from "@ant-design/icons";
import { App, Button, Col, Divider, InputNumber, Row } from "antd";
import { useEffect, useState } from "react";
import "styles/order.scss";

interface IProps {
  setCurrentStep: (step: number) => void;
}

const OrderDetail = (props: IProps) => {
  const { setCurrentStep } = props;
  const { carts, setCarts } = useCurrentApp();
  const [totalPrice, setTotalPrice] = useState(0);

  const { message } = App.useApp();

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

  const handleOnChangeInput = (value: number, book: IBookTable) => {
    if (!value || value < 1) return;

    const cartStorage = localStorage.getItem("carts");

    if (cartStorage) {
      const carts = JSON.parse(cartStorage) as ICart[];

      const index = carts.findIndex((c) => c._id === book._id);

      if (index > -1) {
        carts[index].quantity = value;
      }

      localStorage.setItem("carts", JSON.stringify(carts));
      setCarts(carts);
    }
  };
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
  const handleNextStep = () => {
    if(!carts.length){
      message.error("Vui lòng chọn sản phẩm trước khi tiếp tục");
      return;
    }
    setCurrentStep(1);
  }

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="order-container"
        style={{ maxWidth: 1440, margin: "0 auto" }}
      >
        <Row gutter={[20, 20]}>
          <Col md={18} xs={24}>
            {carts?.map((item, index) => {
              const currentBookPrice = item?.detail.price ?? 0;
              return (
                <div className="order-book" key={`index-${index}`}>
                  <div className="book-content">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item?.detail.thumbnail}`}
                    />
                    <div className="title">{item?.detail.mainText}</div>
                    <div className="price">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.detail.price)}
                    </div>
                    <div className="action">
                      <div className="quantity">
                        <InputNumber
                          onChange={(value) =>
                            handleOnChangeInput(value as number, item.detail)
                          }
                          value={item.quantity}
                        />
                      </div>

                      <div className="sum">
                        Tổng:{" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(currentBookPrice * item.quantity)}
                      </div>

                      <DeleteTwoTone
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRemoveBook(item._id)}
                        twoToneColor="#eb2f96"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </Col>
          <Col md={6} xs={24}>
            <div className="order-sum">
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
              {/* <button onClick={() => handleNextStep()}>
                Mua hàng ({carts?.length ?? 0})
              </button> */}
              <Button color="danger" variant="solid"
              onClick={() => handleNextStep()}>
                Mua hang ({carts?.length ?? 0})
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default OrderDetail;
