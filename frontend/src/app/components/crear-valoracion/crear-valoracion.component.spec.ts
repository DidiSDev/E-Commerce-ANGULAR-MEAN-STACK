import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearValoracionComponent } from './crear-valoracion.component';

describe('CrearValoracionComponent', () => {
  let component: CrearValoracionComponent;
  let fixture: ComponentFixture<CrearValoracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearValoracionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearValoracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
