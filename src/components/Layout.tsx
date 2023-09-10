import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = function ({ children }: { children: React.ReactNode }) {
  return (
    <div className="via-green-150 min-h-screen w-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <Navbar />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
    </div>
  );
};

export default Layout;
