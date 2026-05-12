/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable react-hooks/set-state-in-effect */
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Rate, Row } from "antd";
import {useEffect, useRef, useState } from "react";
import { BsCartPlus } from "react-icons/bs";
import ImageGallery from "react-image-gallery";
import ModalGallery from "./gallery";
import "react-image-gallery/styles/image-gallery.css";
import "styles/book.scss";
import { useCurrentApp } from "@/components/context/context";

interface IProps {
  currentBook: IBookTable | null;
}

type UserAction = "MINUS" | "PLUS"

const BookDetail = (props: IProps) => {
  const { currentBook } = props;
  const [imageGallery, setImageGallery] = useState<
    {
      original: string;
      thumbnail: string;
      originalClass: string;
      thumbnailClass: string;
    }[]
  >([]);
  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const refGallery = useRef<ImageGallery>(null);
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);

  const {carts, setCarts} = useCurrentApp();

  useEffect(() => {
    if (currentBook) {
      const images: {
        original: string;
        thumbnail: string;
        originalClass: string;
        thumbnailClass: string;
      }[] = [];
      if (currentBook.thumbnail) {
        images.push({
          original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
          originalClass: "original-image",
          thumbnailClass: "thumbnail-image",
        });
      }
      if (currentBook.slider) {
        currentBook.slider?.map((item) => {
          images.push({
            original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
            thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image",
          });
        });
      }
      setImageGallery(images);
    }
  }, [currentBook]);

  const handleOnClickImage = () => {
    setIsOpenModalGallery(true);
    setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
  };

  const handleChangeButton = (type: UserAction) => {
    if(type === 'MINUS'){
      if(currentQuantity - 1 <= 0) return;
      setCurrentQuantity(currentQuantity)
    }
    if(type === 'PLUS' && currentBook){
      if(currentQuantity === +currentBook.quantity) return; //max
      setCurrentQuantity(currentQuantity + 1);
    }
  }

  const handleChangeInput = (value: string) => {
    //+  tu dong convert string to number
    if(!isNaN(+value)){
      if(+value > 0 && currentBook && +value < +currentBook.quantity){
        setCurrentQuantity(+value);
      }
    }
  }

  const handleAddToCart = () => {
    //update localStorage
    const cartStorage = localStorage.getItem("carts");
    if(cartStorage && currentBook){
      //update
      const carts = JSON.parse(cartStorage) as ICart[];

      //check exist
      // eslint-disable-next-line prefer-const
      let isExistIndex = carts.findIndex(c => c._id === currentBook?._id);
      if(isExistIndex > -1){
        carts[isExistIndex].quantity =
        carts[isExistIndex].quantity + currentQuantity;
      } else {
        carts.push({
          quantity: currentQuantity,
          _id: currentBook._id,
          detail: currentBook
        })
      }

      localStorage.setItem("carts", JSON.stringify(carts));

      //sync React Context
      setCarts(carts);

    } else{
      //create
      const data = [{
        _id: currentBook?._id!,
        quantity: currentQuantity,
        detail: currentBook!
      }]
      localStorage.setItem("carts", JSON.stringify(data))

      //sync React Context
      setCarts(data);
    }
  }
  console.log(carts)

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="view-detail-book"
        style={{ maxWidth: 1440, margin: "0 auto" }}
      >
        <div>
          <Row gutter={[20, 20]}>
            <Col md={10} sm={0} xs={0}>
              <ImageGallery
                ref={refGallery}
                items={imageGallery}
                showPlayButton={false} //hiden play button
                showFullscreenButton={false} //hiden fullscreen button
                renderLeftNav={() => <></>} //left arrow === <> </>
                renderRightNav={() => <></>} // right arrow === <> </>
                slideOnThumbnailOver={true} //onHover => auto scroll
                onClick={() => handleOnClickImage()}
              />
            </Col>

            {/* mobile */}
            <Col md={14} sm={24}>
              <Col md={0} sm={24} xs={24}>
                <ImageGallery
                  ref={refGallery}
                  items={imageGallery}
                  showPlayButton={false} //hiden play button
                  showFullscreenButton={false} //hiden fullscreen button
                  renderLeftNav={() => <></>} //left arrow === <> </>
                  renderRightNav={() => <></>} // right arrow === <> </>
                  showThumbnails={false}
                />
              </Col>
              <Col span={24}>
                <div className="author">
                  Tac gia: <a href="#">{currentBook?.author}</a>
                </div>
                <div className="title">{currentBook?.mainText}</div>
                
                <div className="rating">
                  <Rate
                    value={5}
                    disabled
                    style={{ color: "#ffce3d", fontSize: 12 }}
                  />

                  <span className="sold">Da ban {currentBook?.sold ?? 0}</span>
                </div>

                <div className="price">
                  <span className="currency">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(currentBook?.price ?? 0)}
                  </span>
                </div>

                <div className="delivery">
                  <span className="left">Van chuyen</span>
                  <span className="right">Mien phi van chuyen</span>
                </div>

                <div className="quantity">
                  <span className="left">So luong</span>
                  <span className="right">
                    <button onClick={() => handleChangeButton('MINUS')}>
                      <MinusOutlined />
                    </button>
                    <input onChange={(event) => handleChangeInput(event.target.value)} value={currentQuantity}/>
                    <button onClick={() => handleChangeButton('PLUS')}>
                      <PlusOutlined />
                    </button>
                  </span>
                </div>

                <div className="buy">
                  <button className="cart" onClick={() => handleAddToCart()}>
                    <BsCartPlus className="icon-cart" />
                    <span>Them vao gio hang</span>
                  </button>

                  <button className="now">Mua ngay</button>
                </div>
              </Col>
            </Col>
          </Row>
        </div>
      </div>
      <ModalGallery
        isOpen={isOpenModalGallery}
        setIsOpen={setIsOpenModalGallery}
        currentIndex={currentIndex}
        items={imageGallery}
        title={currentBook?.mainText ?? ""}
      />
    </div>
  );
};
export default BookDetail;
