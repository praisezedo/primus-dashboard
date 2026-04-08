export function renderSmsTemplate(template:string,data:any){

  let message = template;

  for(const [key,value] of Object.entries(data)){

    message = message.replaceAll(
      `{{${key}}}`,
      value?.toString() || ""
    );

  }

  return message;

}