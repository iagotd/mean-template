import { TestBed } from '@angular/core/testing';

import { ControlGuard } from './control.guard';

describe('ControlGuard', () => {
  let guard: ControlGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ControlGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
