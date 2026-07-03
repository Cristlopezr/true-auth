import fs from 'fs';
import path from 'path';
export class HtmlTemplateAdapter {

    public static getHtmlTemplate(templateName: string, replacements: Record<string, string> = {}): string {
        const templatePath = path.join(__dirname, '../../templates', templateName);
        let htmlContent = fs.readFileSync(templatePath, 'utf-8');
        for (const [key, value] of Object.entries(replacements)) {
            htmlContent = htmlContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }
        return htmlContent;
    }
}