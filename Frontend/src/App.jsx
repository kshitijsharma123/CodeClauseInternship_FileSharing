import Header from "./Components/Header";
import FileUpload from "./Components/FIleUpload.jsx";

function App() {
  return (
    <>
      <Header />
    <div className="flex min-h-screen flex-col justify-center items-center">
      <FileUpload />
    </div>
    </>
  );
}

export default App;
