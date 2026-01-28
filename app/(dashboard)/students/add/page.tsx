"use client";
import Footer from "@/components/UI/Footer";
import StudentDataForm from "@/components/Forms/StudentDataForm";

export default function AddStudentPage() {
  return (
    <>
      <section className="p-7 flex flex-col gap-7">
        <h1 className="text-3xl font-bold">Add Student</h1>

        <div className="shadow-sm rounded-md flex flex-col gap-3 border border-gray-200">
          <div className="border-b border-gray-200 py-3 text-xl font-bold px-5">
            Student & Parents Details
          </div>

          <StudentDataForm />
        </div>
      </section>

      <Footer />
    </>
  );
}
