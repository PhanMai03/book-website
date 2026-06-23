import { Modal, Tabs } from "antd";
import UserInfo from "./user.info";
import ChangePassword from "./change.password";

interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
}

const ManageAccount = (props: IProps) => {
  const { isModalOpen, setIsModalOpen } = props;
 
  const items = [
    {
      key: "info",
      label: `Cap nhat thong tin`,
      children: <UserInfo />
    },
    {
     key: 'password',
     label: `Doi mat khau`,
     children: <ChangePassword />
    }
  ];

  return (
    <Modal
      title="Quan ly tai khoan"
      open={isModalOpen}
      footer={null}
      onCancel={() => setIsModalOpen(false)}
      maskClosable={false}
      width={"60vw"}
    >
      <Tabs defaultActiveKey="info" items={items} />
    </Modal>
  );
};
export default ManageAccount;
