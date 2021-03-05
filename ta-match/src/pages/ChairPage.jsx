import Dashboard from "../components/Dashboard";
import AdminFilesUpload from "../components/AdminFilesUpload";
import AllCourseInfo from "../components/AllCourseInfo";

const ChairPage = () => {
    return (
        <div>
            {/* <h1>Chair Page</h1> */}
            <Dashboard />
            <br></br>
            <AdminFilesUpload />
            <br></br>
            <AllCourseInfo editPrivilege />
        </div>
    );
};

export default ChairPage;
