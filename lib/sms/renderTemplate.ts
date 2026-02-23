import { TemplateData } from "@/components/types/smstemplate";

export function renderSmsTemplate(template: string, data: TemplateData) {
    let message = template;

    Object.entries(data).forEach(([key , value]) => {
        const placeholder = `{{${key}}`;
        message = message.replaceAll(
            placeholder,
            value || ""
        );
    });

    return message;
}