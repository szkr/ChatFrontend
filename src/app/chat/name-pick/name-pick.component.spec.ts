import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NamePickComponent } from './name-pick.component';

describe('NamePickComponent', () => {
  let component: NamePickComponent;
  let fixture: ComponentFixture<NamePickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NamePickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NamePickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
