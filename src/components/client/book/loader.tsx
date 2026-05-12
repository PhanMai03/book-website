import { Col, Row, Skeleton } from "antd";

const BookLoader = () => {
  return (
    <div style={{ background: "#f5f5f5", padding: "20px 0" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          background: "#fff",
          padding: 24,
          borderRadius: 4,
        }}
      >
        <Row gutter={[32, 32]}>
          {/* Left Image */}
          <Col md={10} xs={24}>
            <Skeleton.Input
              active
              block
              style={{
                width: "100%",
                height: 420,
                borderRadius: 4,
              }}
            />

            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 20,
              }}
            >
              <Skeleton.Image active />
              <Skeleton.Image active />
              <Skeleton.Image active />
              <Skeleton.Image active />
            </div>
          </Col>

          {/* Right Content */}
          <Col md={14} xs={24}>
            {/* Author */}
            <Skeleton.Input
              active
              style={{
                width: 200,
                height: 20,
                marginBottom: 20,
              }}
            />

            {/* Title */}
            <Skeleton
              active
              title={{
                width: "90%",
              }}
              paragraph={false}
            />

            <div style={{ marginTop: 25 }}>
              {/* Rating */}
              <Skeleton.Input
                active
                style={{
                  width: 180,
                  height: 20,
                }}
              />
            </div>

            {/* Price */}
            <div
              style={{
                background: "#fafafa",
                padding: 20,
                marginTop: 30,
                borderRadius: 4,
              }}
            >
              <Skeleton.Input
                active
                style={{
                  width: 250,
                  height: 40,
                }}
              />
            </div>

            {/* Delivery */}
            <div style={{ marginTop: 30 }}>
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 40,
              }}
            >
              <Skeleton.Button
                active
                style={{
                  width: 220,
                  height: 48,
                }}
              />

              <Skeleton.Button
                active
                style={{
                  width: 180,
                  height: 48,
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default BookLoader;