import Header from "./Header";

const MainLayout = ({ children, unit, setUnit }) => {
  return (
    <>
      <Header unit={unit} setUnit={setUnit} />
      {children}
    </>
  );
};
export default MainLayout;
