import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiLogOut } from "react-icons/fi";
import styles from "./NavBar.module.css";
import Logo from "@/assets/images/Logo.jpeg";
import { useRouter } from "next/navigation";
import { APP_INFO } from "@/utils/Constants";
import Button from "../Button/Button";

const NavBar = ({ location }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const router = useRouter();

  const handleLogout = () => {
    router.push("/pages/login");
  };

  const navLinks = [
    { name: "Home", href: `/pages/dashboard/${location}` },
    { name: "Add Patient", href: `/pages/add-patient/${location}` },
    {
      name: "Complaint Details",
      href: `/pages/complaint-details/${location}`,
    },
    { name: "Patient Follow-Ups", href: "/pages/patient-follow-ups" },
    { name: "Patient History", href: "/pages/patient-history" },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoAndTitle}>
        <Image
          src={Logo}
          alt="Logo"
          width={45}
          height={45}
          className={styles.logo}
        />
        <div className={styles.title}>{APP_INFO.APP_NAME}</div>
      </div>

      <div className={styles.menuIcons}>
        <button className={styles.hamburger} onClick={toggleMenu}>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
        <button className={styles.logoutIcon} onClick={handleLogout}>
          <FiLogOut size={24} />
        </button>
      </div>

      <ul className={`${styles.navLinks} ${isMenuOpen ? styles.showMenu : ""}`}>
        {navLinks.map((link) => (
          <li key={link.name} className={styles.navItem}>
            <Link href={link.href} className={styles.navLink}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
      <Button
        text="Logout"
        onClick={handleLogout}
        size="medium"
        className={styles.logoutButton}
      />
    </nav>
  );
};

export default NavBar;
