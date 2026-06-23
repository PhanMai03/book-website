import OrderDetail from "@/components/client/order";
import Payment from "@/components/client/order/payment";
import { Button, Result, Steps } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";

const OrderPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="order-container"
        style={{ maxWidth: 1440, margin: "0 auto" }}
      >
        <div className="order-steps">
          <Steps
            size="small"
            current={currentStep}
            items={[
              {
                title: "Don hang",
              },
              {
                title: "Dat hang",
              },
              {
                title: "Thanh toan",
              },
            ]}
          />
        </div>
        {currentStep === 0 && <OrderDetail setCurrentStep={setCurrentStep} />}
        {currentStep === 1 && <Payment setCurrentStep={setCurrentStep} />}
        {currentStep === 2 && (
          <Result
            status="success"
            title="Dat hang thanh cong"
            subTitle="He thong da ghi nhan thong tin don hang cua ban"
            extra={[
              <Button key="home">
                <Link to={"/"} type="primary">
                  Trang chu
                </Link>
              </Button>,

              <Button key="history">
                <Link to={"/history"} type="primary">
                  Lich su mua hang
                </Link>
              </Button>,
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default OrderPage;
