import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendTokensEtherComponent } from './send-tokens-ether.component';

describe('SendTokensEtherComponent', () => {
  let component: SendTokensEtherComponent;
  let fixture: ComponentFixture<SendTokensEtherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendTokensEtherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendTokensEtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
