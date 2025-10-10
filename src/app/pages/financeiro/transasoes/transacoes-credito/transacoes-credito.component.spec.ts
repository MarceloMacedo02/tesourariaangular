import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransacoesCreditoComponent } from './transacoes-credito.component';

describe('TransacoesCreditoComponent', () => {
  let component: TransacoesCreditoComponent;
  let fixture: ComponentFixture<TransacoesCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransacoesCreditoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransacoesCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
