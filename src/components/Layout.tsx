import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = function ({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
