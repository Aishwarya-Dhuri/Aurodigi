import { Validators } from "@angular/forms";
import { <%=masterType%> } from "src/app/base/forms/<%=masterTypeUiFileCase%>.form";

export const <%=componentName%>: { [key: string]: any;} = {
    ...<%=masterType%>,
    <%=formFields%>
};