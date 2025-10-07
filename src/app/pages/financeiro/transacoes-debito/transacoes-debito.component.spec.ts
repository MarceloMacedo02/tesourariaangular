import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransacoesDebitoComponent } from './transacoes-debito.component';

describe('TransacoesDebitoComponent', () => {
  let component: TransacoesDebitoComponent;
  let fixture: ComponentFixture<TransacoesDebitoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransacoesDebitoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransacoesDebitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});