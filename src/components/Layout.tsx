import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = function ({ children }: { children: React.ReactNode }) {
  return (
    <div className="via-green-150 min-h-screen w-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <Navbar />

      {children}
    </div>
  );
};

export default Layout;
