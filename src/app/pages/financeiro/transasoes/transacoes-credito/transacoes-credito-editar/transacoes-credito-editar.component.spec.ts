import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransacoesCreditoEditarComponent } from './transacoes-credito-editar.component';

describe('TransacoesCreditoEditarComponent', () => {
  let component: TransacoesCreditoEditarComponent;
  let fixture: ComponentFixture<TransacoesCreditoEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransacoesCreditoEditarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransacoesCreditoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
