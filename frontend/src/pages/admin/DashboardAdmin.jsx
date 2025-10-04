import React, { useState } from "react";
import NavbarAdmin from "./components/NavbarAdmin";
import SidebarAdmin from "./components/SidebarAdmin";
import FooterAdmin from "./components/FooterAdmin";
import HomeContent from "./content/HomeContent";
import KelolaPropertiContent from "./content/KelolaPropertiContent";
import KelolaUserContent from "./content/KelolaUserContent";
import styles from "./DashboardAdmin.module.css";

const DashboardAdmin = () => {
  const [activePage, setActivePage] = useState("home");

  const renderContent = () => {
    switch (activePage) {
      case "home":
        return <HomeContent />;
      case "properti":
        return <KelolaPropertiContent />;
      case "user":
        return <KelolaUserContent />;
      default:
        return <HomeContent />;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <NavbarAdmin />
      <div className={styles.mainContent}>
        <SidebarAdmin setActivePage={setActivePage} activePage={activePage} />
        <div className={styles.pageContent}>{renderContent()}</div>
      </div>
      <FooterAdmin />
    </div>
  );
};

export default DashboardAdmin;
