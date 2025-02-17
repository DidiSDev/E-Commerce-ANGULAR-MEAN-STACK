import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoMomentoComponent } from './carrito-momento.component';

describe('CarritoMomentoComponent', () => {
  let component: CarritoMomentoComponent;
  let fixture: ComponentFixture<CarritoMomentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoMomentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarritoMomentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
