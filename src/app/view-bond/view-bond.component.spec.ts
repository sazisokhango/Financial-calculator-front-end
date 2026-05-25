import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ViewBondComponent } from './view-bond.component';

describe('ViewBondComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBondComponent, HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewBondComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
