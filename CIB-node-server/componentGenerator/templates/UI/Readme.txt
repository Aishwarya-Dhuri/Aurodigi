1) Copy "UI" folder content to src/app folder (UI Application)

2) Add following line into "<%=productNameUiFileCase%>.module.ts" import section
import { <%=componentName%>Component } from './<%=componentPath%>/<%=componentNameUiFileCase%>/<%=componentNameUiFileCase%>.component';

3) Add following entry into declarations array of "<%=productNameUiFileCase%>.module.ts"
<%=componentName%>Component

4) Add following entry into "<%=productNameUiFileCase%>-routing.module.ts" import section
import { <%=componentName%>Component } from './<%=componentPath%>/<%=componentNameUiFileCase%>/<%=componentNameUiFileCase%>.component';

5) Add following entry into router array of "<%=productNameUiFileCase%>-routing.module.ts"
{
	path: "<%=routerPath%>/initiate",
	component: <%=componentName%>Component,
}

6) Copy "dummyServer" content to dummyServer folder (Dummy Server Application)
