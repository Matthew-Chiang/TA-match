import Dashboard from "../components/Dashboard";
import AdminFilesUpload from "../components/AdminFilesUpload";
import AllCourseInfo from "../components/AllCourseInfo";
import TogglePriority from "../components/TogglePriority";
import HoursCalculation from "../components/HoursCalculation";
import HistoricalData from "../components/HistoricalData";

import "../App.css";

const ChairPage = () => {
    return (
        <div className="container">
            {/* <h1>Chair Page</h1> */}
            <Dashboard />
            <br></br>
            <AdminFilesUpload />
            <br></br>
            <AllCourseInfo editPrivilege />
            <br />
            <br />
            <TogglePriority />
            <HoursCalculation />
            <br />
            <br />
            <HistoricalData />
        </div>
    );
};

export default ChairPage;
