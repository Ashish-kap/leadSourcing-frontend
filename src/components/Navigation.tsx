// import { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Menu, X } from "lucide-react";

// const Navigation = () => {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const location = useLocation();
//   const isHomePage = location.pathname === "/";

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };

//     if (isHomePage) {
//       window.addEventListener("scroll", handleScroll);
//       return () => window.removeEventListener("scroll", handleScroll);
//     }
//   }, [isHomePage]);

//   const navLinks = [
//     { name: "Features", href: "#features" },
//     { name: "Pricing", href: "#pricing" },
//     { name: "About", href: "#about" },
//     { name: "Contact", href: "#contact" },
//   ];

//   return (
//     <nav
//       className={`fixed top-0 w-full z-50 transition-all duration-300 ${
//         isScrolled || !isHomePage
//           ? "nav-blur border-b border-border border-b-gray-200"
//           : "bg-transparent border-none"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-2">
//             <div className="w-8 h-8 bg-gradient-to-r from-[#2462f1] to-purple-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-sm">M</span>
//             </div>
//             <span
//               className={`text-xl font-bold  ${
//                 isScrolled || !isHomePage ? "gradient-text" : "text-white"
//               }`}
//             >
//               MapExtractor Pro
//             </span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             {isHomePage ? (
//               navLinks.map((link) => (
//                 <a
//                   key={link.name}
//                   href={link.href}
//                   className={`text-${
//                     isScrolled || !isHomePage ? "black" : "white"
//                   }/80 hover:text-${
//                     isScrolled || !isHomePage ? "white" : "foreground"
//                   } transition-colors font-medium`}
//                 >
//                   {link.name}
//                 </a>
//               ))
//             ) : (
//               <Link
//                 to="/"
//                 className="text-foreground/80 hover:text-foreground transition-colors font-medium"
//               >
//                 Home
//               </Link>
//             )}
//           </div>

//           {/* Desktop Auth Buttons */}
//           <div className="hidden md:flex items-center space-x-4">
//             <Link to="/login">
//               <Button variant="ghost" className={`${isScrolled || !isHomePage ? "text-black" : "text-white"} cursor-pointer`}>Login</Button>
//             </Link>
//             <Link to="/signup">
//               <Button className="bg-[#2462f1] text-white cursor-pointer">Get Started</Button>
//             </Link>
//           </div>

//           {/* Mobile menu button */}
//           <button
//             className="md:hidden"
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           >
//             {isMobileMenuOpen ? (
//               <X className="h-6 w-6" />
//             ) : (
//               <Menu className="h-6 w-6" />
//             )}
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden border-t border-border">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               {isHomePage ? (
//                 navLinks.map((link) => (
//                   <a
//                     key={link.name}
//                     href={link.href}
//                     className="block px-3 py-2 text-foreground/80 hover:text-foreground transition-colors"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     {link.name}
//                   </a>
//                 ))
//               ) : (
//                 <Link
//                   to="/"
//                   className="block px-3 py-2 text-foreground/80 hover:text-foreground transition-colors"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   Home
//                 </Link>
//               )}
//               <div className="pt-4 space-y-2">
//                 <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
//                   <Button variant="ghost" className="w-full">
//                     Login
//                   </Button>
//                 </Link>
//                 <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
//                   <Button className="w-full">Get Started</Button>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navigation;


import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/home";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    if (isHomePage) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isHomePage]);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || !isHomePage
          ? "nav-blur border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold gradient-text">
              MapExtractor Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isHomePage ? (
              navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-foreground/80 hover:text-foreground transition-colors font-medium"
                >
                  {link.name}
                </a>
              ))
            ) : (
              <Link
                to="/"
                className="text-foreground/80 hover:text-foreground transition-colors font-medium"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isHomePage ? (
                navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block px-3 py-2 text-foreground/80 hover:text-foreground transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))
              ) : (
                <Link
                  to="/"
                  className="block px-3 py-2 text-foreground/80 hover:text-foreground transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              )}
              <div className="pt-4 space-y-2">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
