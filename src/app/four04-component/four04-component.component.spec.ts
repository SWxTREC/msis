import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Four04ComponentComponent } from './four04-component.component';

describe('Four04ComponentComponent', () => {
  let component: Four04ComponentComponent;
  let fixture: ComponentFixture<Four04ComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Four04ComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Four04ComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
