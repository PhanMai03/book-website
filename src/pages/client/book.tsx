/* eslint-disable react-hooks/set-state-in-effect */
import BookDetail from "@/components/client/book/detail";
import BookLoader from "@/components/client/book/loader";
import { getBookByIdAPI } from "@/services/api";
import { App } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BookPage = () => {
  // eslint-disable-next-line prefer-const
  let { id } = useParams();
  const { notification } = App.useApp();
  const [currentBook, setCurrentBook] = useState<IBookTable | null>(null);
  const [isLoadingBook, setIsLoadingBook] = useState<boolean>(true);

  useEffect(() => {
    setIsLoadingBook(true);
    if (id) {
      const fetchBookById = async () => {
        const res = await getBookByIdAPI(id);
        if (res && res.data) {
          setCurrentBook(res.data);
        } else {
          notification.error({
            message: "Da co loi xay ra",
            description: res.message,
          });
        }
        setIsLoadingBook(false);
      };
      fetchBookById();
    }
  }, [id]);
  return (
    <div>
      {isLoadingBook ? (
        <BookLoader />
      ) : (
        <BookDetail currentBook={currentBook} />
      )}
    </div>
  );
};
export default BookPage;
