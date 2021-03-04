import Dashboard from "../components/Dashboard";
import ProfessorQuestionsExport from "../components/ProfessorQuestionsExport";
import AllCourseInfo from "../components/AllCourseInfo";
const AdminPage = () => {
    return (
        <div>
            <Dashboard />
            <br></br>
            <h1>Admin Page</h1>
            <ProfessorQuestionsExport />

            <AllCourseInfo />
        </div>
    );
};

export default AdminPage;
