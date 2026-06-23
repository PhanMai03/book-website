import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import { useState } from "react";

function Layout() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <div>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Outlet context={[searchTerm, setSearchTerm]} />
    </div>
  );
}

export default Layout;
