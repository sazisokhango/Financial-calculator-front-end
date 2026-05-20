import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../services/auth.service';

const mockUser = { id: 1, firstName: 'Saziso', lastName: 'Khango', email: 'saziso@example.com' };

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders firstName, lastName and email inputs', () => {
    const inputs = fixture.nativeElement.querySelectorAll('input');
    expect(inputs.length).toBe(3);
  });

  it('shows inline errors for all fields when submitting an empty form', () => {
    component.onSubmit();
    fixture.detectChanges();
    const errors = fixture.nativeElement.querySelectorAll('p.text-red-500');
    expect(errors.length).toBeGreaterThanOrEqual(3);
  });

  it('makes no API call when the form is invalid', () => {
    component.onSubmit();
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('disables the submit button while submitting', () => {
    authServiceSpy.register.and.returnValue(of(mockUser));
    component.form.setValue({ firstName: 'A', lastName: 'B', email: 'a@b.com' });
    component.submitting.set(true);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeTrue();
  });

  it('shows the API error banner on registration failure', async () => {
    authServiceSpy.register.and.returnValue(throwError(() => new Error('Email already registered')));
    component.form.setValue({ firstName: 'A', lastName: 'B', email: 'a@b.com' });
    component.onSubmit();
    await fixture.whenStable();
    fixture.detectChanges();
    const banner = fixture.nativeElement.querySelector('.bg-red-50');
    expect(banner?.textContent).toContain('Email already registered');
  });

  it('has an "Already registered?" link pointing to /', () => {
    const link = fixture.nativeElement.querySelector('a[ng-reflect-router-link="/"]') ??
                 fixture.nativeElement.querySelector('a[routerLink="/"]') ??
                 Array.from(fixture.nativeElement.querySelectorAll('a')).find((a: any) => a.href?.endsWith('/'));
    expect(link).toBeTruthy();
  });
});
