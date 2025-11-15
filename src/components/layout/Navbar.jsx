import React from "react";
import { useNavigate } from "react-router-dom";
import CardNav from "../ui/CardNav";
import useAuthStore from "../../store/authStore";
import { ROUTES } from "../../config/constants";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // Navigation items for the card navigation - using exact colors from provided code
  const items = [
    {
      label: "Features",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { 
          label: "Security Analysis", 
          ariaLabel: "Security Analysis Features",
          href: "#features",
          onClick: (e) => {
            e.preventDefault();
            const element = document.getElementById('features');
            element?.scrollIntoView({ behavior: 'smooth' });
          }
        },
        { 
          label: "Vulnerability Detection", 
          ariaLabel: "Vulnerability Detection",
          href: "#vulnerability",
          onClick: (e) => {
            e.preventDefault();
            const element = document.getElementById('vulnerability');
            element?.scrollIntoView({ behavior: 'smooth' });
          }
        }
      ]
    },
    {
      label: "Solutions", 
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { 
          label: "Enterprise", 
          ariaLabel: "Enterprise Solutions",
          href: "#enterprise",
          onClick: (e) => {
            e.preventDefault();
            const element = document.getElementById('enterprise');
            element?.scrollIntoView({ behavior: 'smooth' });
          }
        },
        { 
          label: "Government", 
          ariaLabel: "Government Solutions",
          href: "#government",
          onClick: (e) => {
            e.preventDefault();
            const element = document.getElementById('government');
            element?.scrollIntoView({ behavior: 'smooth' });
          }
        }
      ]
    },
    {
      label: "About",
      bgColor: "#271E37", 
      textColor: "#fff",
      links: [
        { 
          label: "Company", 
          ariaLabel: "About Company",
          href: "#about",
          onClick: (e) => {
            e.preventDefault();
            const element = document.getElementById('about');
            element?.scrollIntoView({ behavior: 'smooth' });
          }
        },
        { 
          label: "Contact", 
          ariaLabel: "Contact Us",
          href: "#contact",
          onClick: (e) => {
            e.preventDefault();
            const element = document.getElementById('contact');
            element?.scrollIntoView({ behavior: 'smooth' });
          }
        }
      ]
    }
  ];

  return (
    <CardNav
      logo="/images/Cypher-ray_horizontal.png"
      logoAlt="Cypher-Ray Logo"
      items={items}
      baseColor="#060010"
      menuColor="#fff"
      buttonBgColor="#7808d0"
      buttonTextColor="#fff"
      ease="power3.out"
      onGetStartedClick={() => navigate(ROUTES.LOGIN)}
    />
  );
};

export default Navbar;
