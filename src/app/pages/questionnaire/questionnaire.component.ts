import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { countries } from 'src/app/constants';
import { QuestionnaireResponse, QuestionnaireResponseItem } from 'src/app/models/questionnaire-response.model';
import * as questionnaireData from '../../../assets/questionnaire.json';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit {

  questionnaireForm!: FormGroup;

  countries = countries;

  result: QuestionnaireResponse;

  questionnaireData: any = (questionnaireData as any).default;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // Update json
    this.preprocessJsonData(this.questionnaireData.item);
    this.questionnaireForm = this.fb.group({
      haveAllergies: [false],
      general: this.fb.group({
        gender: [null, [Validators.required]],
        dob: [null, [Validators.required]],
        cob: [null, [Validators.required]],
        maritalStatus: [null, [Validators.required]],
      }),
      intoxications: this.fb.group({
        smoke: [false],
        drink: [false],
      }),
    });
  }

  submitForm(): void {
    this.questionnaireForm.get('general').get('gender').markAsDirty();
    this.questionnaireForm.get('general').get('gender').updateValueAndValidity();
    this.questionnaireForm.get('general').get('dob').markAsDirty();
    this.questionnaireForm.get('general').get('dob').updateValueAndValidity();
    this.questionnaireForm.get('general').get('cob').markAsDirty();
    this.questionnaireForm.get('general').get('cob').updateValueAndValidity();
    this.questionnaireForm.get('general').get('maritalStatus').markAsDirty();
    this.questionnaireForm.get('general').get('maritalStatus').updateValueAndValidity();

    if (this.questionnaireForm.valid) {
      this.generateQuestionnaireResponse();
    }
  }

  onSelectCountry(countryCode: string) {
    this.questionnaireForm.patchValue({ cob: countryCode });
  }

  preprocessJsonData(items: any) {
    items.forEach(element => {
      if (element.type === 'group') {
        this.preprocessJsonData(element.item);
      } else {
        switch (element.text) {
          case 'Do you have allergies?':
            element.key = 'haveAllergies';
            break;

          case 'What is your gender?':
            element.key = 'gender';
            break;
        
          case 'What is your date of birth?':
            element.key = 'dob';
            break;

          case 'What is your country of birth?':
            element.key = 'cob';
            break;

          case 'What is your marital status?':
            element.key = 'maritalStatus';
            break;

          case 'Do you smoke?':
            element.key = 'smoke';
            break;
        
          case 'Do you drink alchohol?':
            element.key = 'drink';
            break;

          default:
            break;
        }
      }
    });
  }

  generateQuestionnaireResponse() {
    const item = this.fillItem(this.questionnaireData['item'], []);
    const placeholderValue = 'Test';
    this.result = {
      identifier: this.questionnaireData['id'],
      basedOn: placeholderValue,
      partOf: placeholderValue,
      questionnaire: 'Test',
      status: this.questionnaireData['status'],
      subject: placeholderValue,
      encounter: 'Test',
      authored: this.questionnaireData['date'],
      author: 'Eli',
      source: 'Test App',
      item,
    };

  }

  fillItem(items: any, questionnaireItems: any): QuestionnaireResponseItem[] {
    const tmp = items.reduce((acc, item: any) => {
      if (item.type === 'group') {
        acc = [...acc, this.fillItem(item.item, questionnaireItems)];
      } else {
        acc = [...acc, {
          linkId: item.linkId,
          text: item.text,
          answer: this.findValueFromForm(item.key),
        }];
      }
      return acc;
    }, []);
    return tmp;
  }

  findValueFromForm(key: string): string {
    const flatValues = this.makeFlatary(this.questionnaireForm.value);
    return flatValues[key] || false;
  }

  makeFlatary(obj: any) {
    return Object.assign(
      {}, 
      ...function _flatten(o) { 
        return [].concat(...Object.keys(o)
          .map(k => 
            typeof o[k] === 'object' ?
              _flatten(o[k]) : 
              ({[k]: o[k]})
          )
        );
      }(obj)
    );
  }

  // Getters
  get gender() { return this.questionnaireForm.get('general.gender'); }

  get dob() { return this.questionnaireForm.get('general.dob'); }

  get cob() { return this.questionnaireForm.get('general.cob'); }

  get maritalStatus() { return this.questionnaireForm.get('general.maritalStatus'); }

}
