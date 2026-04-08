import StudentFee from "@/app/models/StudentFee";

export async function generateFeesSummary(studentId:string){

  const fees = await StudentFee.aggregate([
    {
      $match:{ studentId }
    },
    {
      $lookup:{
        from:"feetypes",
        localField:"feeTypeId",
        foreignField:"_id",
        as:"type"
      }
    },
    {
      $unwind:"$type"
    }
  ]);

  let balance = 0;

  const lines = fees.map(f=>{
    balance += f.balance;
    return `${f.type.name}: ₦${f.amountPaid}/${f.totalAmount}`;
  });

  return `${lines.join("\n")}\nBalance: ₦${balance}`;
}