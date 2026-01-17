import BulkUploadForm from "@/components/Forms/BulkUploadForm";
import BulkUploadDirection from "@/components/UI/BulkUploadDirection";
import Footer from "@/components/UI/Footer";

export default function UploadStudentPage() {
     return <>
       <div className="flex flex-col">
        <h1 className="my-3 mx-5 text-3xl font-bold">Bulk Upload Student Data</h1>
         <BulkUploadDirection/>
       </div>
       <BulkUploadForm/>
       <Footer/>
     </>
}