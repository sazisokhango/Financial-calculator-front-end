import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HomeComponent } from './home.component';
import { UserService } from '../services/user.service';

const mockUsers = [
  { id: 1, firstName: 'Saziso', lastName: 'Khango', email: 'saziso@example.com' },
  { id: 2, firstName: 'John',   lastName: 'Doe',    email: 'john@example.com' }
];

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getAll']);
    userServiceSpy.getAll.and.returnValue(of(mockUsers));

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders a button for each registered user', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(mockUsers.length);
    expect(buttons[0].textContent.trim()).toBe('Saziso Khango');
  });

  it('filters users by partial name (case-insensitive)', () => {
    component.filterControl.setValue('john');
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(1);
    expect(buttons[0].textContent.trim()).toBe('John Doe');
  });

  it('restores full list when filter is cleared', () => {
    component.filterControl.setValue('john');
    fixture.detectChanges();
    component.filterControl.setValue('');
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(mockUsers.length);
  });

  it('shows empty state when no users match the filter', () => {
    component.filterControl.setValue('zzznomatch');
    fixture.detectChanges();
    const empty = fixture.nativeElement.querySelector('p');
    expect(empty?.textContent).toContain('No users registered yet');
  });

  it('shows error banner when API call fails', async () => {
    userServiceSpy.getAll.and.returnValue(throwError(() => new Error('Could not load users')));
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const banner = fixture.nativeElement.querySelector('.bg-red-50');
    expect(banner?.textContent).toContain('Could not load users');
  });
});
