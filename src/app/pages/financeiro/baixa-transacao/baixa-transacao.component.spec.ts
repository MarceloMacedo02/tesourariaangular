import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaixaTransacaoComponent } from './baixa-transacao.component';

describe('BaixaTransacaoComponent', () => {
  let component: BaixaTransacaoComponent;
  let fixture: ComponentFixture<BaixaTransacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaixaTransacaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BaixaTransacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
