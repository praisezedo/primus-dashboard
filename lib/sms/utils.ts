export function normalizePhone(phone:string){

  if(phone.startsWith("0")){
    return "234" + phone.slice(1);
  }

  return phone;

}