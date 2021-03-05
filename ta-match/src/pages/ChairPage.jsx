import Dashboard from "../components/Dashboard";
import AdminFilesUpload from "../components/AdminFilesUpload";
import HoursCalculation from "../components/HoursCalculation";

import "../App.css";

const ChairPage = () => {
    return (
        <div className="container">
            {/* <h1>Chair Page</h1> */}
            <Dashboard />
            <br></br>
            <AdminFilesUpload />
            <HoursCalculation />
        </div>
    );
};

export default ChairPage;
