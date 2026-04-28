import { Drawer, Descriptions, Badge, Avatar } from "antd";
import dayjs from "dayjs";
import { FORMATE_DATE_VN } from "@/services/helper";

interface IProps {
  openViewDetail: boolean;
  setOpenViewDetail: (v: boolean) => void;
  dataViewDetail: IUserTable | null;
  setDataViewDetail: (v: IUserTable | null) => void;
}
const DetailUser = (props: IProps) => {
  const {
    openViewDetail,
    setOpenViewDetail,
    dataViewDetail,
    setDataViewDetail,
  } = props;

  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  const avatarUrl = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${dataViewDetail?.avatar}`;

  return (
    <>
      <Drawer
        title="Detail User"
        width={"50vw"}
        onClose={onClose}
        open={openViewDetail}
      >
        <Descriptions title="User Info" bordered column={2}>
          <Descriptions.Item label="Id">
            {dataViewDetail?._id}
          </Descriptions.Item>
          <Descriptions.Item label="Full Name">
            {dataViewDetail?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {dataViewDetail?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {dataViewDetail?.phone}
          </Descriptions.Item>

          <Descriptions.Item label="Role" >
            <Badge status="processing" text={dataViewDetail?.role} />
          </Descriptions.Item>

          <Descriptions.Item label="Avatar" >
            <Avatar size={40} src={avatarUrl}></Avatar>
          </Descriptions.Item>

          <Descriptions.Item label="Created At">
            {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE_VN)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {dayjs(dataViewDetail?.updatedAt).format(FORMATE_DATE_VN)}
          </Descriptions.Item>

        </Descriptions>
      </Drawer>
    </>
  );
};

export default DetailUser;
