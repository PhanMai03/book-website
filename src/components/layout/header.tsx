import { useState } from "react";
import { FaReact } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { VscSearchFuzzy } from "react-icons/vsc";
import {
  Badge,
  Drawer,
  Avatar,
  Popover,
  Dropdown,
  Space,
  Button,
  Divider,
} from "antd";
import "./header.scss";
import "./../../styles/global.scss";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentApp } from "../context/context";
import { logoutAPI } from "@/services/api";
import { Empty } from "antd";
import ManageAccount from "../client/account";

interface IProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
}

const AppHeader = (props: IProps) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openManageAccount, setOpenManageAccount] = useState<boolean>(false);

  const {
    isAuthenticated,
    user,
    setUser,
    setIsAuthenticated,
    carts,
    setCarts,
  } = useCurrentApp();

  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await logoutAPI();
    if (res.data) {
      setUser(null);
      setCarts([]);
      setIsAuthenticated(false);
      localStorage.removeItem("access_token");
      localStorage.removeItem("carts");
    }
  };

  const items = [
    {
      label: (
        <label
          style={{ cursor: "pointer" }}
          onClick={() => setOpenManageAccount(true)}
        >
          Quản lý tài khoản
        </label>
      ),
      key: "account",
    },
    {
      label: <Link to="/history">Lịch sử mua hàng</Link>,
      key: "history",
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
    },
  ];

  if (user?.role === "ADMIN") {
    items.unshift({
      label: <Link to="/admin">Trang quản trị</Link>,
      key: "admin",
    });
  }

  const urlAvatar = user?.avatar
    ? `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user.avatar}`
    : undefined;

  const contentPopover = () => (
    <div className="pop-cart-body">
      <div className="pop-cart-content">
        {carts?.map((book, index) => (
          <div className="book" key={`book-${index}`}>
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`}
            />
            <div>{book?.detail?.mainText} </div>
            <div className="price">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(book?.detail?.price ?? 0)}
            </div>
          </div>
        ))}
      </div>

      {carts.length > 0 ? (
        <div className="pop-cart-footer">
          <button onClick={() => navigate("/order")}>Xem giỏ hàng</button>
        </div>
      ) : (
        <Empty description="Không có sản phẩm trong giỏ hàng" />
      )}
    </div>
  );

  return (
    <>
      <div className="header-container">
        <header className="page-header">
          <div className="page-header__top">
            <div
              className="page-header__toggle"
              onClick={() => setOpenDrawer(true)}
            >
              ☰
            </div>

            <div className="page-header__logo">
              <span className="logo" onClick={() => navigate("/")}>
                <FaReact className="rotate icon-react" />
                Book Store
                <VscSearchFuzzy className="icon-search" />
              </span>

              <input
                className="input-search"
                type="text"
                placeholder="Bạn tìm gì hôm nay?"
                value={props.searchTerm}
                onChange={(e) => props.setSearchTerm(e.target.value)}
              />
            </div>

          </div>

          <nav className="page-header__bottom">
            <ul id="navigation" className="navigation">
              <li className="navigation__item">
                <Link to="/">Trang chủ</Link>
              </li>
              <li className="navigation__item navigation__item--link">
                <Link to="/about">Giới thiệu</Link>
              </li>
              <li className="navigation__item">
                <Popover
                  className="popover-carts"
                  placement="topRight"
                  rootClassName="popover-carts"
                  title="Sản phẩm mới thêm"
                  content={contentPopover}
                  arrow={true}
                >
                  <Badge count={carts?.length ?? 0} size="small" showZero>
                    {/* <button className="icon-button" aria-label="Giỏ hàng">
                      <FiShoppingCart className="icon-cart" />
                    </button> */}
                    <FiShoppingCart className="icon-cart" />
                  </Badge>
                </Popover>
              </li>
              <li className="navigation__item navigation__item--account">
                {!isAuthenticated ? (
                  <div className="auth-actions">
                    <Button type="primary" onClick={() => navigate("/login")}>
                      Đăng nhập
                    </Button>
                    <Button onClick={() => navigate("/register")}>
                      Đăng ký
                    </Button>
                  </div>
                ) : (
                  <Dropdown menu={{ items }} trigger={["click"]}>
                    <Space className="user-menu">
                      <Avatar src={urlAvatar} size="large">
                        {user?.fullName?.charAt(0).toUpperCase()}
                      </Avatar>
                      <span className="user-name">{user?.fullName}</span>
                    </Space>
                  </Dropdown>
                )}
              </li>
            </ul>
          </nav>
        </header>
      </div>

      <Drawer
        title="Menu chức năng"
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <Link to="/">Trang chủ</Link>
        <Divider />
        <Link to="/about">Giới thiệu</Link>
        <Divider />

        {!isAuthenticated ? (
          <>
            <p onClick={() => navigate("/login")}>Đăng nhập</p>
            <Divider />
            <p onClick={() => navigate("/register")}>Đăng ký</p>
            <Divider />
          </>
        ) : (
          <>
            <p onClick={() => handleLogout()}>Đăng xuất</p>
            <Divider />
          </>
        )}
      </Drawer>
      <ManageAccount
        isModalOpen={openManageAccount}
        setIsModalOpen={setOpenManageAccount}
      />
    </>
  );
};

export default AppHeader;
