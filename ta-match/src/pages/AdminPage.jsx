import Dashboard from "../components/Dashboard";
import ProfessorQuestionsExport from "../components/ProfessorQuestionsExport";
import AllCourseInfo from "../components/AllCourseInfo";
import HistoricalData from "../components/HistoricalData";

const AdminPage = () => {
    return (
        <div>
            <Dashboard />
            <br></br>
            <h1>Admin Page</h1>
            <ProfessorQuestionsExport />

            <AllCourseInfo editPrivilege />
            <br />
            <br />
            <HistoricalData />
        </div>
    );
};

export default AdminPage;
