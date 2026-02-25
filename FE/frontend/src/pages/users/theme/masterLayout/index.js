import { memo } from "react";
import Header from "../header";
import Footer from "../footer";

const MasterLayout = ({ children, ...prop }) => {
  return (
    <div {...prop}>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default memo(MasterLayout);
