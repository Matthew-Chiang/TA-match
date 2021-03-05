import Dashboard from "../components/Dashboard";
import AdminFilesUpload from "../components/AdminFilesUpload";
import TogglePriority from "../components/TogglePriority";
import HoursCalculation from "../components/HoursCalculation";

import "../App.css";

const ChairPage = () => {
    return (
        <div className="container">
            {/* <h1>Chair Page</h1> */}
            <Dashboard />
            <br></br>
            <AdminFilesUpload />
            <br/><br/>
            <TogglePriority/>
            <HoursCalculation />
        </div>
    );
};

export default ChairPage;
