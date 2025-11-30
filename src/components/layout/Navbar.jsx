import React from "react";
import { useNavigate } from "react-router-dom";
import CardNav from "../ui/CardNav";
import useAuthStore from "../../store/authStore";
import { ROUTES } from "../../config/constants";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // Navigation items for the card navigation - matching hero gradient theme
  const items = [
    {
      label: "Features",
      bgColor: "#1a0d2e",
      textColor: "#fff",
      links: [
        { 
          label: "View All Features", 
          ariaLabel: "View All Features",
          href: "/features",
        },
      ]
    },
    {
      label: "Workflows", 
      bgColor: "#2d1b47",
      textColor: "#fff",
      links: [
        { 
          label: "Analysis Pipeline", 
          ariaLabel: "Analysis Pipeline",
          href: "/workflow",
        }
      ]
    },
    {
      label: "About",
      bgColor: "#4a0582", 
      textColor: "#fff",
      links: [
        { 
          label: "FAQs", 
          ariaLabel: "Frequently Asked Questions",
          href: "/faq",
        },
        { 
          label: "Contact", 
          ariaLabel: "Contact Us",
          href: "/contact",
        }
      ]
    }
  ];

  return (
    <CardNav
      logo="/images/Cypher-ray_horizontal.png"
      logoAlt="Cypher-Ray Logo"
      items={items}
      baseColor="#0a0015"
      menuColor="#fff"
      buttonBgColor="#7808d0"
      buttonTextColor="#fff"
      ease="power3.out"
      onGetStartedClick={() => navigate(ROUTES.LOGIN)}
      onLogoClick={() => navigate(ROUTES.HOME)}
    />
  );
};

export default Navbar;
