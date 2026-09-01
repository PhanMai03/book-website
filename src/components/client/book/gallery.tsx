/* eslint-disable react-hooks/set-state-in-effect */
import { Col, Modal, Row, Image } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery, { type ImageGalleryRef } from "react-image-gallery";
import "styles/book.scss";

interface IProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  currentIndex: number;
  items: {
    original: string;
    thumbnail: string;
    originalClass: string;
    thumbnailClass: string;
  }[];
  title: string;
}

const ModalGallery = (props: IProps) => {
  const { isOpen, setIsOpen, currentIndex, items, title } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  const refGallery = useRef<ImageGalleryRef | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(currentIndex);
    }
  }, [isOpen, currentIndex]);

  return (
    <Modal
      width={"60vw"}
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
      closable={false}
      className="modal-gallery"
    >
      <Row gutter={[20, 20]}>
        <Col span={16}>
          <ImageGallery
            ref={refGallery}
            items={items}
            showPlayButton={false} //hiden play button
            showFullscreenButton={false} //hiden fullscreen button
            startIndex={currentIndex} //start at current index
            showThumbnails={false} //hiden thumbnail
            onSlide={(i) => setActiveIndex(i)}
            slideDuration={0} //duration between slices
          />
        </Col>
        <Col span={8}>
          <div style={{ padding: "5px 0 20px 0" }}>{title}</div>
          <div>
            <Row gutter={[20, 20]}>
              {items?.map((item, i) => {
                return (
                  <Col key={`image-${i}`}>
                    <Image
                      wrapperClassName={"img-normal"}
                      width={100}
                      height={100}
                      src={item.original}
                      preview={false}
                      onClick={() => {
                        refGallery?.current?.slideToIndex(i);
                      }}
                    />
                    <div className={activeIndex === i ? "active" : ""}></div>
                  </Col>
                );
              })}
            </Row>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalGallery;
