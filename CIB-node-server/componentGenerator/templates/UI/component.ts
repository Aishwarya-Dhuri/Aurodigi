import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MasterService } from 'src/app/base/services/master.service';
import { ViewService } from 'src/app/services/view-service/view-service';
import { <%=componentName%> } from './<%=componentNameUiFileCase%>.form';

@Component({
  selector: 'app-<%=componentNameUiFileCase%>',
  templateUrl: './<%=componentNameUiFileCase%>.component.html',
  styleUrls: ['./<%=componentNameUiFileCase%>.component.scss'],
})
export class <%=componentName%>Component implements OnInit {

  mode!: string;
  form = this.fb.group(<%=componentName%>);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private viewService: ViewService,
    private messageService: MessageService,
    private masterService: MasterService
  ) { }

  ngOnInit(): void {
    this.mode = this.viewService.getMode();
    
    if(this.mode == 'view'){
      this.form.disable();
    }
    
    if(this.mode == 'edit' || this.mode == 'resubmit' || this.mode == 'view'){
      let viewReq = {"dataMap":{"id":this.viewService.getId(), viewPreviousDetail:"N"}};
	  this.viewService.clearAll();
      this.masterService.view(viewReq).subscribe((response) => {
        this.form.patchValue(response);
      });
    }
  }

  onSubmit() {
    if(this.mode == 'edit' || this.mode == 'resubmit') {
      this.masterService.update(this.form.value).subscribe((response) => {
        this.messageService.add({ severity: 'success', summary: '', detail: 'Record Updated Sucessfully'});
        this.goToListing();
      });
    }
    else {
      this.masterService.create(this.form.value).subscribe((response) => {
        this.messageService.add({ severity: 'success', summary: '', detail: 'Record Created Sucessfully'});
        this.goToListing();
      });
    }
  }

  goToListing() {
    this.router.navigateByUrl( this.router.url.replace('initiate', 'listing'));
  }
}
