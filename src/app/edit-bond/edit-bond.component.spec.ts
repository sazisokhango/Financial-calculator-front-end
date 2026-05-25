import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EditBondComponent } from './edit-bond.component';

describe('EditBondComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBondComponent, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(EditBondComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
