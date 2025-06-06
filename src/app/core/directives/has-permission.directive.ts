import { Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { RbacService } from '../services/rbac.service';

@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit {
  private currentModule: string = '';
  private currentAction: string = '';
  private isHidden = true;

  @Input()
  set hasPermission(value: [string, string]) {
    if (value && value.length === 2) {
      this.currentModule = value[0];
      this.currentAction = value[1];
      this.updateView();
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private rbacService: RbacService
  ) {}

  ngOnInit() {
    this.updateView();
  }

  private updateView() {
    if (this.currentModule && this.currentAction) {
      this.rbacService.hasPermission(this.currentModule, this.currentAction)
        .subscribe(hasPermission => {
          if (hasPermission && this.isHidden) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.isHidden = false;
          } else if (!hasPermission && !this.isHidden) {
            this.viewContainer.clear();
            this.isHidden = true;
          }
        });
    }
  }
}